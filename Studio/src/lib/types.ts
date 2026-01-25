export type Priority = 'low' | 'medium' | 'high' | 'none';

export type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string; // ISO string
  categories: string[];
  order: number;
};

export type Category = {
  id: string;
  name: string;
  color: string;
};
