import { useEffect, useState } from 'react';
import type { SyntheticEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';
import { useLoginMutation } from '@/features/auth/authApi';
import { setCredentials } from '@/features/auth/authSlice';
import { getDefaultDashboardPath, isPathAllowedForRole } from '@/features/auth/redirects';
import type { AppDispatch, RootState } from '@/store';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const authState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      const defaultPath = getDefaultDashboardPath(authState.user.role);
      navigate(defaultPath, { replace: true });
    }
  }, [authState.isAuthenticated, authState.user, navigate]);

  const getErrorMessage = (apiError: FetchBaseQueryError | SerializedError | undefined) => {
    if (!apiError) {
      return '';
    }

    if ('status' in apiError) {
      const data = apiError.data;
      if (data && typeof data === 'object' && 'message' in data) {
        const message = (data as { message?: unknown }).message;
        if (typeof message === 'string' && message.trim().length > 0) {
          return message;
        }
      }
    }

    if ('message' in apiError && typeof apiError.message === 'string') {
      return apiError.message;
    }

    return 'Login failed. Please check your credentials.';
  };

  const handleLogin = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await login({ email, password }).unwrap();
      
      // Update store
      dispatch(
        setCredentials({
          user: response.user,
          token: response.token,
        })
      );

      // Redirect to the originally requested path when available.
      const from = location.state?.from?.pathname as string | undefined;
      const defaultPath = getDefaultDashboardPath(response.user.role);
      const destination =
        from && isPathAllowedForRole(from, response.user.role) ? from : defaultPath;
      navigate(destination, { replace: true });
    } catch (err) {
      console.error('Login failed:', err);
      // We will rely on RTK query error handling or show toast later
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <form onSubmit={handleLogin}>
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold tracking-tight text-center">
              Welcome back
            </CardTitle>
            <CardDescription className="text-center">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {/* <a href="#" className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
                  Forgot password?
                </a> */}
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full"
              />
            </div>
            {error && (
              <div className="p-3 rounded bg-red-50 text-red-700 text-sm">
                {getErrorMessage(error)}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              New here?{' '}
              <Link to="/signup" className="text-emerald-700 hover:text-emerald-800 font-medium">
                Create an account
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
