'use client';

import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/lib/stores/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession, signOut } from '@/lib/auth-client';
import {
  LayoutDashboard,
  Users,
  Megaphone,
  MessageSquare,
  Linkedin,
  Settings,
  Activity,
  FileText,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navigation = [
  {
    name: 'Overview',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Leads', href: '/leads', icon: Users },
      { name: 'Campaign', href: '/campaigns', icon: Megaphone },
      { name: 'Messages', href: '/messages', icon: MessageSquare, badge: 12 },
      { name: 'LinkedIn Accounts', href: '/linkedin-accounts', icon: Linkedin },
    ],
  },
  {
    name: 'Settings',
    items: [
      { name: 'Setting & Billing', href: '/settings', icon: Settings },
    ],
  },
  {
    name: 'Admin Panel',
    items: [
      { name: 'Activity logs', href: '/activity-logs', icon: Activity },
      { name: 'User logs', href: '/user-logs', icon: FileText },
    ],
  },
];

export function Sidebar() {
  const { isCollapsed, toggleSidebar } = useSidebarStore();
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div
      className={cn(
        'relative flex h-screen flex-col border-r bg-background transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-white font-bold">
              L
            </div>
            <span className="font-semibold text-xl">LinkBird</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* User Profile */}
      {session?.user && (
        <div className="border-b p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start p-2 h-auto',
                  isCollapsed && 'justify-center px-2'
                )}
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session.user.image || ''}
                      alt={session.user.name || ''}
                    />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {session.user.name?.charAt(0) || session.user.email?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">
                        {session.user.name || 'User'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Personal
                      </span>
                    </div>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem disabled>
                <div className="flex flex-col">
                  <span className="font-medium">{session.user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {session.user.email}
                  </span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-auto py-4">
        {navigation.map((section) => (
          <div key={section.name} className="px-4 pb-4">
            {!isCollapsed && (
              <h3 className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {section.name}
              </h3>
            )}
            <nav className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100',
                      isCollapsed && 'justify-center px-2'
                    )}
                  >
                    <item.icon className={cn('h-5 w-5', !isCollapsed && 'mr-3')} />
                    {!isCollapsed && (
                      <>
                        {item.name}
                        {item.badge && (
                          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </div>
  );
}