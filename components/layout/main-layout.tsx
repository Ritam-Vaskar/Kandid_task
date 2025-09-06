'use client';

import { Sidebar } from './sidebar';
import { Header } from './header';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/lib/stores/sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className={cn(
          'flex-1 overflow-auto',
          isCollapsed ? 'ml-0' : 'ml-0'
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}