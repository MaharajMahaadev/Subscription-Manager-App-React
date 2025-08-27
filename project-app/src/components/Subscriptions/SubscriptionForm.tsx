import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save } from 'lucide-react';
import type { Subscription } from '../../data/types';
import { BILLING_CYCLES } from '../../data/constants';
import { GlassCard } from '../UI/GlassCard';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';

const subscriptionSchema = z.object({
  service_name: z.string().min(1, 'Service name is required'),
  cost: z.number().min(0.01, 'Cost must be greater than 0'),
  billing_cycle: z.enum(['monthly', 'quarterly', 'yearly']),
  renewal_date: z.string().min(1, 'Renewal date is required'),
  notes: z.string().optional(),
  visibility: z.enum(['private', 'shared']),
});

type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

interface SubscriptionFormProps {
  subscription?: Subscription;
  onSubmit: (data: SubscriptionFormData) => void;
  onCancel: () => void;
  isAdmin?: boolean;
}

export const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  subscription,
  onSubmit,
  onCancel,
  isAdmin = false
}) => {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: subscription ? {
      service_name: subscription.service_name,
      cost: subscription.cost,
      billing_cycle: subscription.billing_cycle,
      renewal_date: subscription.renewal_date.split('T')[0], // Format for date input
      notes: subscription.notes || '',
      visibility: subscription.visibility ?? 'private'
    } : {
      service_name: '',
      cost: 0,
      billing_cycle: 'monthly',
      renewal_date: '',
      notes: '',
      visibility: 'private'
    }
  });

  const handleFormSubmit = async (data: SubscriptionFormData) => {
    setLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <GlassCard className="w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {subscription ? 'Edit Subscription' : 'Add Subscription'}
          </h2>
          <Button onClick={onCancel} variant="ghost" size="sm" icon={X} children={undefined} />
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit as any)} className="space-y-4">
          <Input
            label="Service Name"
            placeholder="Netflix, Spotify, etc."
            error={errors.service_name?.message}
            required
            {...register('service_name')}
          />

          <Input
            label="Cost"
            type="number"
            placeholder="9.99"
            error={errors.cost?.message}
            required
            {...register('cost', { valueAsNumber: true })}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Billing Cycle <span className="text-red-500">*</span>
            </label>
            <select
              {...register('billing_cycle')}
              className="w-full px-4 py-2 rounded-xl border border-white/30 backdrop-blur-md bg-white/20 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {BILLING_CYCLES.map(cycle => (
                <option key={cycle.value} value={cycle.value}>
                  {cycle.label}
                </option>
              ))}
            </select>
            {errors.billing_cycle && (
              <p className="text-sm text-red-500">{errors.billing_cycle.message}</p>
            )}
          </div>

          <Input
            label="Renewal Date"
            type="date"
            error={errors.renewal_date?.message}
            required
            {...register('renewal_date')}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              {...register('notes')}
              placeholder="Any additional notes..."
              rows={3}
              className="w-full px-4 py-2 rounded-xl border border-white/30 backdrop-blur-md bg-white/20 placeholder-gray-500 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {isAdmin && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Visibility</label>
              <select
                {...register('visibility')}
                className="w-full px-4 py-2 rounded-xl border border-white/30 backdrop-blur-md bg-white/20 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="private">Private</option>
                <option value="shared">Shared</option>
              </select>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
              icon={Save}
            >
              {loading ? 'Saving...' : (subscription ? 'Update' : 'Add')} Subscription
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              variant="secondary"
            >
              Cancel
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};