import type { UserRole } from './authSlice';

export const getDefaultDashboardPath = (role: UserRole): string => {
  if (role === 'member') {
    return '/member/dashboard';
  }

  if (role === 'driver') {
    return '/dashboard/distributions';
  }

  return '/dashboard';
};

export const isPathAllowedForRole = (path: string, role: UserRole): boolean => {
  if (role === 'member') {
    return path.startsWith('/member/dashboard');
  }

  if (role === 'driver') {
    return (
      path === '/dashboard' ||
      path.startsWith('/dashboard/distributions') ||
      path.startsWith('/dashboard/profile')
    );
  }

  return path.startsWith('/dashboard') && !path.startsWith('/member/dashboard');
};
