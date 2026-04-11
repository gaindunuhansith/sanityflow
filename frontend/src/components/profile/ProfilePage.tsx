import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetMeQuery, useUpdateMeMutation } from '@/features/auth/authApi';
import { updateUser } from '@/features/auth/authSlice';
import type { RootState, AppDispatch } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const { data: profile, isLoading } = useGetMeQuery(undefined);

  const [updateMe, { isLoading: isSaving }] = useUpdateMeMutation();

  const [form, setForm] = useState({ name: '', email: '', currentPassword: '', newPassword: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  if (isLoading) return <div className="p-6 text-muted-foreground">Loading...</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setSuccess('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    const payload: Record<string, string> = {};
    if (form.name) payload.name = form.name;
    if (form.email) payload.email = form.email;
    if (form.currentPassword || form.newPassword) {
      if (!form.currentPassword || !form.newPassword) {
        setError('Both current and new password are required to change password.');
        return;
      }
      payload.currentPassword = form.currentPassword;
      payload.newPassword = form.newPassword;
    }

    if (Object.keys(payload).length === 0) {
      setError('No changes to save.');
      return;
    }

    try {
      const updated = await updateMe(payload).unwrap();
      dispatch(updateUser({ name: updated.name, email: updated.email }));
      setForm({ name: '', email: '', currentPassword: '', newPassword: '' });
      setSuccess('Profile updated successfully.');
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to update profile.');
    }
  };

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      <Card className="mb-4">
        <CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Current Info</CardTitle></CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p><span className="font-medium">Name:</span> {profile?.name ?? authUser?.name}</p>
          <p><span className="font-medium">Email:</span> {profile?.email ?? authUser?.email}</p>
          <p><span className="font-medium">Role:</span> <span className="capitalize">{profile?.role ?? authUser?.role}</span></p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Update Profile</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">New Name</Label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Leave blank to keep current" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">New Email</Label>
              <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="Leave blank to keep current" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" name="currentPassword" type="password" value={form.currentPassword} onChange={handleChange} placeholder="Required to change password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" name="newPassword" type="password" value={form.newPassword} onChange={handleChange} placeholder="Min 8 characters" />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm text-emerald-600">{success}</p>}

            <Button type="submit" disabled={isSaving} className="w-full">
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
