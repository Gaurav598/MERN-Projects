"use client";

import { useAppState } from '@/lib/store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Calendar, CheckCircle2, ListTodo, Folder, CalendarClock
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const mainNav = [
  { href: '/all', label: 'All Tasks', icon: ListTodo },
  { href: '/today', label: 'Today', icon: Calendar },
  { href: '/upcoming', label: 'Upcoming', icon: CalendarClock },
  { href: '/completed', label: 'Completed', icon: CheckCircle2 },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { categories } = useAppState();

  return (
    <nav className="flex flex-col p-4 space-y-1">
      {mainNav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/80 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            (pathname === item.href || (item.href === '/all' && pathname === '/')) && 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold'
          )}
        >
          <item.icon className="h-4 w-4" />
          <span>{item.label}</span>
        </Link>
      ))}
      
      <div className="pt-4">
        <Accordion type="single" collapsible defaultValue="categories" className="w-full">
          <AccordionItem value="categories" className="border-none">
            <AccordionTrigger className="text-sidebar-foreground/80 hover:text-sidebar-accent-foreground hover:no-underline rounded-lg px-3 py-2 text-sm font-normal [&[data-state=open]]:bg-sidebar-accent [&[data-state=open]]:text-sidebar-accent-foreground">
              <div className="flex items-center gap-3">
                <Folder className="h-4 w-4" />
                Categories
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-4 pt-1">
              <div className="flex flex-col space-y-1">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.id}`}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/70 transition-all hover:text-sidebar-accent-foreground text-sm',
                    pathname === `/category/${category.id}` && 'text-sidebar-accent-foreground font-semibold'
                  )}
                >
                  <span className={cn('h-2 w-2 rounded-full', category.color)} />
                  {category.name}
                </Link>
              ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </nav>
  );
}
