"use client";
import { TaskList } from '@/components/task-list';
import { useAppState } from '@/lib/store';
import { isToday } from 'date-fns';

export default function TodayPage() {
  const { tasks } = useAppState();
  const todayTasks = tasks.filter(task => !task.completed && task.dueDate && isToday(new Date(task.dueDate)));

  return (
    <TaskList tasks={todayTasks} title="Today" />
  );
}
