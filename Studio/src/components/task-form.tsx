"use client";

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Task, Priority } from '@/lib/types';
import { useAppDispatch } from '@/lib/store';
import { suggestTaskCategories } from '@/ai/flows/suggest-task-categories';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { CalendarIcon, Loader2, Tag, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Badge } from './ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Pencil } from 'lucide-react';

interface TaskFormProps {
  task?: Task;
  children: React.ReactNode;
}

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['none', 'low', 'medium', 'high']),
  dueDate: z.date().optional(),
  categories: z.array(z.string()).optional(),
});

export function TaskForm({ task, children }: TaskFormProps) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);
  const [isSuggesting, startSuggestionTransition] = useTransition();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      priority: task?.priority || 'none',
      dueDate: task?.dueDate ? new Date(task.dueDate) : undefined,
      categories: task?.categories || [],
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const taskData = {
      id: task?.id || crypto.randomUUID(),
      ...values,
      dueDate: values.dueDate ? values.dueDate.toISOString() : undefined,
      categories: values.categories || [],
    };
    
    dispatch({
      type: task ? 'UPDATE_TASK' : 'ADD_TASK',
      payload: taskData as Omit<Task, 'completed' | 'order'>,
    });
    
    toast({
      title: task ? 'Task updated' : 'Task added',
      description: `"${values.title}" has been saved.`,
    });
    setOpen(false);
    form.reset({ title: '', description: '', priority: 'none', dueDate: undefined, categories: [] });
  };

  const handleDescriptionChange = (description: string) => {
    form.setValue('description', description);
    if (description.length > 10) {
      startSuggestionTransition(async () => {
        const result = await suggestTaskCategories({ taskDescription: description });
        const currentCategories = form.getValues('categories') || [];
        setSuggestedCategories(result.categories.filter(c => !currentCategories.includes(c)));
      });
    }
  };

  const addCategory = (category: string) => {
    const currentCategories = form.getValues('categories') || [];
    if (!currentCategories.includes(category)) {
      form.setValue('categories', [...currentCategories, category], { shouldValidate: true });
      setSuggestedCategories(suggestedCategories.filter(c => c !== category));
    }
  };
  
  return (
    <Sheet open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if(isOpen && task) {
        form.reset({
          title: task.title,
          description: task.description,
          priority: task.priority,
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          categories: task.categories,
        });
      } else if (!isOpen) {
        form.reset({ title: '', description: '', priority: 'none', dueDate: undefined, categories: [] });
      }
    }}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="sm:max-w-xl w-full">
        <SheetHeader>
          <SheetTitle>{task ? 'Edit Task' : 'Add New Task'}</SheetTitle>
          <SheetDescription>
            Fill in the details for your task below. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 h-full flex flex-col">
            <div className="space-y-4 flex-1 overflow-y-auto pr-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Buy groceries" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add more details..."
                        value={field.value}
                        onChange={(e) => handleDescriptionChange(e.target.value)}
                      />
                    </FormControl>
                    <div className="flex items-center flex-wrap gap-2 pt-2 min-h-[2rem]">
                      {isSuggesting && <Loader2 className="animate-spin h-4 w-4" />}
                      {!isSuggesting && suggestedCategories.length > 0 && suggestedCategories.map(cat => (
                        <Button key={cat} type="button" variant="outline" size="sm" onClick={() => addCategory(cat)}>
                          <Tag className="h-3 w-3 mr-1" /> {cat}
                        </Button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categories</FormLabel>
                    <FormControl>
                      <div className="flex flex-wrap gap-2 min-h-[2rem]">
                        {field.value?.map(cat => (
                          <Badge key={cat} variant="secondary">
                            {cat}
                            <button
                              type="button"
                              className="ml-2 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                              onClick={() => form.setValue('categories', field.value?.filter(c => c !== cat))}
                            >
                              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </SheetClose>
              <Button type="submit">Save changes</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
