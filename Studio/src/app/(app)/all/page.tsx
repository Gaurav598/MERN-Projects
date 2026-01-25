"use client";
import { TaskList } from '@/components/task-list';
import { useAppState } from '@/lib/store';

export default function AllTasksPage() {
  const { tasks } = useAppState();
  
  return (
    <TaskList tasks={tasks} title="All Tasks"/>
  );
}
