"use client";

import React, { createContext, useContext, useReducer, ReactNode, Dispatch, useMemo } from 'react';
import { Task, Category } from './types';
import { addDays, formatISO } from 'date-fns';

interface AppState {
  tasks: Task[];
  categories: Category[];
}

type Action =
  | { type: 'ADD_TASK'; payload: Omit<Task, 'order' | 'completed'> }
  | { type: 'RESTORE_TASK', payload: Task }
  | { type: 'UPDATE_TASK'; payload: Partial<Task> & { id: string } }
  | { type: 'DELETE_TASK'; payload: { id: string } }
  | { type: 'SET_TASKS_ORDER'; payload: Task[] };

const initialCategories: Category[] = [
  { id: 'work', name: 'Work', color: 'bg-chart-1' },
  { id: 'personal', name: 'Personal', color: 'bg-chart-2' },
  { id: 'shopping', name: 'Shopping', color: 'bg-chart-3' },
  { id: 'health', name: 'Health', color: 'bg-chart-4' },
];

const initialTasks: Task[] = [
  { id: '1', title: 'Finalize Q3 report', description: 'Need to review the numbers and write the executive summary.', completed: false, priority: 'high', dueDate: formatISO(new Date()), categories: ['work'], order: 0 },
  { id: '2', title: 'Book dentist appointment', description: '', completed: false, priority: 'medium', dueDate: formatISO(addDays(new Date(), 2)), categories: ['health'], order: 1 },
  { id: '3', title: 'Buy groceries', description: 'Milk, bread, eggs, and cheese.', completed: false, priority: 'low', categories: ['shopping'], order: 2 },
  { id: '4', title: 'Call mom', description: '', completed: true, priority: 'medium', dueDate: formatISO(addDays(new Date(), -1)), categories: ['personal'], order: 3 },
  { id: '5', title: 'Plan weekend trip', description: 'Look for cabins near the lake.', completed: false, priority: 'medium', dueDate: formatISO(addDays(new Date(), 10)), categories: ['personal'], order: 4 },
];

const initialState: AppState = {
  tasks: initialTasks,
  categories: initialCategories,
};

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'ADD_TASK': {
      const maxOrder = state.tasks.reduce((max, task) => Math.max(task.order, max), 0);
      const newTask: Task = {
        ...action.payload,
        completed: false,
        order: maxOrder + 1,
      };
      return {
        ...state,
        tasks: [...state.tasks, newTask],
      };
    }
    case 'RESTORE_TASK': {
      return {
        ...state,
        tasks: [...state.tasks, action.payload]
      }
    }
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, ...action.payload } : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload.id),
      };
    case 'SET_TASKS_ORDER': {
       const newOrderedTasks = action.payload.map((task, index) => ({...task, order: index}));
       const newTasks = state.tasks.map(t => {
         const found = newOrderedTasks.find(ot => ot.id === t.id);
         return found ? found : t;
       })
      return {
        ...state,
        tasks: newTasks,
      };
    }
    default:
      return state;
  }
};

const AppStateContext = createContext<AppState | undefined>(undefined);
const AppDispatchContext = createContext<Dispatch<Action> | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const contextValue = useMemo(() => state, [state.tasks, state.categories]);

  return (
    <AppStateContext.Provider value={contextValue}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within a AppProvider');
  }
  return context;
}

export function useAppDispatch() {
  const context = useContext(AppDispatchContext);
  if (context === undefined) {
    throw new Error('useAppDispatch must be used within a AppProvider');
  }
  return context;
}
