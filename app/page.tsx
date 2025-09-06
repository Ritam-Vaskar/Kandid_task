'use client';

import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && session) {
      router.push('/dashboard');
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="flex items-center justify-center mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded bg-blue-600 text-white font-bold text-xl">
              L
            </div>
            <span className="ml-3 text-3xl font-bold">LinkBird</span>
          </div>
          <h2 className="text-xl text-gray-600">
            LinkedIn Outreach Platform
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Manage your LinkedIn campaigns and leads effectively
          </p>
        </div>
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/register">Create Account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}