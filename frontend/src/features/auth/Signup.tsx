import { useEffect, useState } from 'react';
import type { SyntheticEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';
import { useRegisterMutation } from '@/features/auth/authApi';
import { setCredentials } from '@/features/auth/authSlice';
import { getDefaultDashboardPath } from '@/features/auth/redirects';
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

export const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const [register, { isLoading, error }] = useRegisterMutation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
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

    return 'Signup failed. Please try again.';
  };

  const handleSignup = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    setLocalError('');

    try {
      const response = await register({ name, email, password }).unwrap();

      dispatch(
        setCredentials({
          user: response.user,
          token: response.token,
        }),
      );

      const destination = getDefaultDashboardPath(response.user.role);
      navigate(destination, { replace: true });
    } catch (requestError) {
      console.error('Signup failed:', requestError);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <form onSubmit={handleSignup}>
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold tracking-tight text-center">
              Create your account
            </CardTitle>
            <CardDescription className="text-center">
              Join SanityFlow and start managing water operations
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Jane Doe"
                required
                minLength={2}
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
              />
            </div>

            {localError && (
              <div className="p-3 rounded bg-red-50 text-red-700 text-sm">{localError}</div>
            )}

            {!localError && error && (
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
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-700 hover:text-emerald-800 font-medium">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
