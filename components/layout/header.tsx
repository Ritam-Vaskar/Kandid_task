'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Menu, Search, Bell } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useSidebarStore } from '@/lib/stores/sidebar';
import { usePathname } from 'next/navigation';

const breadcrumbMap: Record<string, { title: string; parent?: string }> = {
  '/dashboard': { title: 'Dashboard' },
  '/leads': { title: 'Leads' },
  '/campaigns': { title: 'Campaigns' },
  '/campaigns/[id]': { title: 'Campaign Details', parent: 'Campaigns' },
  '/messages': { title: 'Messages' },
  '/linkedin-accounts': { title: 'LinkedIn Accounts' },
  '/settings': { title: 'Settings' },
  '/activity-logs': { title: 'Activity Logs' },
  '/user-logs': { title: 'User Logs' },
};

export function Header() {
  const { isCollapsed, toggleSidebar } = useSidebarStore();
  const pathname = usePathname();
  
  const getBreadcrumbs = () => {
    const current = breadcrumbMap[pathname];
    if (!current) return [];
    
    const breadcrumbs = [];
    if (current.parent) {
      breadcrumbs.push({ title: current.parent, href: `/${current.parent.toLowerCase().replace(' ', '-')}` });
    }
    breadcrumbs.push({ title: current.title, href: pathname });
    
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center space-x-4">
        {isCollapsed && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => (
              <BreadcrumbItem key={breadcrumb.href}>
                {index === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                ) : (
                  <>
                    <BreadcrumbLink href={breadcrumb.href}>
                      {breadcrumb.title}
                    </BreadcrumbLink>
                    <BreadcrumbSeparator />
                  </>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-10 w-64"
          />
        </div>
        
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}