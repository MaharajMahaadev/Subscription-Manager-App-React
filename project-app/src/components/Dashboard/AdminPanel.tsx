import React, { useState, useEffect } from 'react';
import { UserPlus, Mail, Shield, Users } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { User } from '../../data/types';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabase';
import { GlassCard } from '../UI/GlassCard';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import toast from 'react-hot-toast';

const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['user', 'admin'])
});

type UserFormData = z.infer<typeof userSchema>;

export const AdminPanel: React.FC = () => {
  const { signUp } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: 'user'
    }
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: UserFormData) => {
    setCreating(true);
    try {
      await signUp(data.email, data.password, data.role);
      toast.success('User created successfully!');
      reset();
      fetchUsers();
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Admin Panel
          </h2>
          <p className="text-gray-600">Manage users and system settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create User Form */}
        <GlassCard>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Create New User
          </h3>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="user@example.com"
              icon={Mail}
              error={errors.email?.message}
              required
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              error={errors.password?.message}
              required
              {...register('password')}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                {...register('role')}
                className="w-full px-4 py-2 rounded-xl border border-white/30 backdrop-blur-md bg-white/20 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={creating}
              className="w-full"
              icon={UserPlus}
            >
              {creating ? 'Creating...' : 'Create User'}
            </Button>
          </form>
        </GlassCard>

        {/* Users List */}
        <GlassCard>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            All Users ({users.length})
          </h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {users.map(user => (
              <div
                key={user.id}
                className="bg-white/30 rounded-lg p-4 border border-white/30"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">{user.email}</p>
                    <p className="text-gray-600 text-sm">
                      Created {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`
                    px-3 py-1 rounded-full text-xs font-medium
                    ${user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                    }
                  `}>
                    {user.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};