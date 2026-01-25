"use client";

import { useState, useMemo, useEffect } from 'react';
import type { Task } from '@/lib/types';
import { TaskItem } from './task-item';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useAppDispatch } from '@/lib/store';
import { List } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  title?: string;
}

export function TaskList({ tasks: initialTasks, title }: TaskListProps) {
  const dispatch = useAppDispatch();
  const [tasks, setTasks] = useState(initialTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('order');

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const filteredAndSortedTasks = useMemo(() => {
    let result = tasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2, none: 3 };
      result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (sortBy === 'dueDate') {
      result.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    } else if (sortBy === 'order') {
      result.sort((a,b) => a.order - b.order)
    }

    return result;
  }, [tasks, searchTerm, sortBy]);
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    const draggedTaskId = e.dataTransfer.getData("taskId");
    const currentTasks = filteredAndSortedTasks;

    const draggedTask = currentTasks.find(t => t.id === draggedTaskId);
    if (!draggedTask) return;

    const newOrderedTasks = currentTasks.filter(t => t.id !== draggedTaskId);
    newOrderedTasks.splice(dropIndex, 0, draggedTask);

    setTasks(newOrderedTasks);
    dispatch({ type: 'SET_TASKS_ORDER', payload: newOrderedTasks });
  };


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        {title && <h1 className="text-2xl font-bold font-headline">{title}</h1>}
        <div className="flex flex-1 justify-end gap-4">
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="order">Custom Order</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="dueDate">Due Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredAndSortedTasks.length > 0 ? (
        <div className="space-y-2">
          {filteredAndSortedTasks.map((task, index) => (
             <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
               <TaskItem task={task} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-lg flex flex-col items-center justify-center">
          <List className="h-12 w-12 text-muted-foreground/50"/>
          <p className="mt-4 text-lg font-medium text-muted-foreground">No tasks found.</p>
          <p className="text-sm text-muted-foreground/80">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
