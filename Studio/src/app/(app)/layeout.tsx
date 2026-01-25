import { SidebarNav } from '@/components/sidebar-nav';
import { AppProvider } from '@/lib/store';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { TaskForm } from '@/components/task-form';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <Sidebar>
            <SidebarHeader className="p-4">
              <Link href="/all" className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-6 w-6 text-primary"><rect width="256" height="256" fill="none"></rect><path d="M218.4,70.1h0a15.9,15.9,0,0,0-16.7,3.2L128,128,54.3,73.3a15.9,15.9,0,0,0-23.5,20.3L96,152.4,43.2,201.9a15.9,15.9,0,0,0,2.1,23.3,16,16,0,0,0,23.3-2.1L128,164l59.4,59.1a16,16,0,0,0,23.3,2.1,15.9,15.9,0,0,0,2.1-23.3L160,152.4l65.1-58.8A15.9,15.9,0,0,0,218.4,70.1Z"></path></svg>
                <h1 className="text-2xl font-bold text-primary font-headline">TaskFlow</h1>
              </Link>
            </SidebarHeader>
            <SidebarContent>
              <div className="p-4">
                <TaskForm>
                  <Button className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Task
                  </Button>
                </TaskForm>
              </div>
              <SidebarNav />
            </SidebarContent>
            <SidebarFooter className="p-4">
                <ThemeToggle />
            </SidebarFooter>
          </Sidebar>
          <SidebarInset className="flex-1">
            <main className="p-4 lg:p-8 h-full">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AppProvider>
  );
}
