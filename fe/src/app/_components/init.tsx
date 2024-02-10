'use client';

import { configureAxios } from '@/axios';
import { getToken } from '@/redux/utils/token';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const protectedRoutes = ['/'];
const authRoutes = ['/login'];

export default function Init() {
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    configureAxios();

    const isAuthenticated = getToken();
    const isAccessingProtectedRoute = protectedRoutes.includes(path);
    const isAccessingAuthdRoute = authRoutes.includes(path);

    if (isAccessingAuthdRoute && isAuthenticated) {
      return router.push('/');
    }

    if (!isAuthenticated && isAccessingProtectedRoute) {
      return router.push('login');
    }
  }, [path, router]);

  return null;
}
