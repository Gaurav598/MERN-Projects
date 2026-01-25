"use client";
import { TaskList } from '@/components/task-list';
import { useAppState } from '@/lib/store';
import { isFuture } from 'date-fns';

export default function UpcomingPage() {
  const { tasks } = useAppState();
  const upcomingTasks = tasks.filter(task => !task.completed && task.dueDate && isFuture(new Date(task.dueDate)));

  return (
    <TaskList tasks={upcomingTasks} title="Upcoming"/>
  );
}
