"use client";
import { TaskList } from '@/components/task-list';
import { useAppState } from '@/lib/store';

export default function CompletedPage() {
  const { tasks } = useAppState();
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <TaskList tasks={completedTasks} title="Completed"/>
  );
}
