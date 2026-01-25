"use client";

import { TaskList } from '@/components/task-list';
import { useAppState } from '@/lib/store';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

export default function CategoryPage() {
  const { slug } = useParams();
  const { tasks, categories } = useAppState();

  const category = useMemo(() => categories.find(c => c.id === slug), [categories, slug]);
  
  const categoryTasks = useMemo(() => {
    return tasks.filter(task => task.categories.includes(category?.name || ''));
  }, [tasks, category]);

  const title = category ? `Category: ${category.name}` : 'Category Not Found';

  return (
    <TaskList tasks={categoryTasks} title={title}/>
  );
}
