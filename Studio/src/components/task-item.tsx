"use client";

import { Task, Priority } from '@/lib/types';
import { useAppDispatch } from '@/lib/store';
import { Checkbox } from './ui/checkbox';
import { cn } from '@/lib/utils';
import { format, isToday, isPast } from 'date-fns';
import { Badge } from './ui/badge';
import { MoreHorizontal, Pencil } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from '@/hooks/use-toast';
import { TaskForm } from './task-form';
import { Button } from './ui/button';
import { ToastAction } from './ui/toast';

interface TaskItemProps {
  task: Task;
}

const priorityVariantMap: Record<Priority, "destructive" | "secondary" | "outline"> = {
  high: 'destructive',
  medium: 'secondary',
  low: 'outline',
  none: 'outline',
};

export function TaskItem({ task }: TaskItemProps) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleToggleComplete = () => {
    dispatch({
      type: 'UPDATE_TASK',
      payload: { id: task.id, completed: !task.completed },
    });
  };

  const handleDelete = () => {
    dispatch({ type: 'DELETE_TASK', payload: { id: task.id } });
    toast({
      title: "Task deleted",
      description: `"${task.title}" has been moved to trash.`,
      action: (
        <ToastAction altText="Undo" onClick={() => dispatch({type: 'RESTORE_TASK', payload: task})}>
          Undo
        </ToastAction>
      ),
    });
  };

  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const dueDateLabel = dueDate ? (isToday(dueDate) ? 'Today' : format(dueDate, 'MMM d')) : '';

  return (
    <div
      className={cn(
        'group flex items-center gap-4 p-3 pr-2 rounded-lg bg-card hover:bg-secondary/50 transition-all duration-200 cursor-grab',
        task.completed && 'bg-card/50 opacity-60'
      )}
    >
      <Checkbox
        checked={task.completed}
        onCheckedChange={handleToggleComplete}
        className="transition-transform duration-300 ease-in-out group-hover:scale-110"
        aria-label={`Mark task "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
      />
      <div className="flex-1 overflow-hidden">
        <p className={cn('font-medium truncate', task.completed && 'line-through text-muted-foreground')}>
          {task.title}
        </p>
        {task.description && !task.completed && (
          <p className="text-sm text-muted-foreground truncate">{task.description}</p>
        )}
      </div>
      <div className="flex items-center gap-3 ml-auto">
        {task.categories.length > 0 && (
          <Badge variant="outline" className="hidden sm:inline-flex">{task.categories[0]}</Badge>
        )}
        <Badge variant={priorityVariantMap[task.priority]} className="capitalize w-20 justify-center hidden md:flex">{task.priority}</Badge>
        {dueDate && (
          <span className={cn(
            "text-sm hidden md:block w-20 text-center",
            isPast(dueDate) && !isToday(dueDate) && !task.completed ? 'text-destructive font-medium' : 'text-muted-foreground'
          )}>
            {dueDateLabel}
          </span>
        )}
      </div>
      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <TaskForm task={task}>
          <Button variant="ghost" size="icon" className="h-8 w-8">
             <Pencil className="h-4 w-4" />
             <span className="sr-only">Edit Task</span>
          </Button>
        </TaskForm>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleDelete} className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
