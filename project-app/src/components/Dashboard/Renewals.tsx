import React, { useState, useEffect } from 'react';
import { Calendar, Bell, AlertTriangle } from 'lucide-react';
import type { Subscription } from '../../data/types';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabase';
import { SubscriptionCard } from '../Subscriptions/SubscriptionCard';
import { GlassCard } from '../UI/GlassCard';
import { getUpcomingRenewals, getDaysUntilRenewal, formatDate } from '../../utils/helper';
import toast from 'react-hot-toast';

export const Renewals: React.FC = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, [user]);

  const fetchSubscriptions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('renewal_date', { ascending: true });

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch renewals');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingRenewals = getUpcomingRenewals(subscriptions);
  const thisMonth = subscriptions.filter(sub => {
    const renewalDate = new Date(sub.renewal_date);
    const now = new Date();
    return renewalDate.getMonth() === now.getMonth() && 
           renewalDate.getFullYear() === now.getFullYear();
  });

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
            <Calendar className="w-6 h-6" />
            Renewal Calendar
          </h2>
          <p className="text-gray-600">Track upcoming subscription renewals</p>
        </div>
      </div>

      {/* Alerts Section */}
      {upcomingRenewals.length > 0 && (
        <GlassCard className="mb-8 bg-orange-50/30 border-orange-300/50">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-orange-700">
              Upcoming Renewals ({upcomingRenewals.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingRenewals.map(subscription => (
              <div
                key={subscription.id}
                className="bg-white/30 rounded-lg p-4 border border-orange-300/30"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-800">{subscription.service_name}</span>
                  <span className="text-orange-600 font-semibold">
                    {getDaysUntilRenewal(subscription.renewal_date)} days
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  Renews on {formatDate(subscription.renewal_date)}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* This Month's Renewals */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          This Month ({thisMonth.length})
        </h3>
        {thisMonth.length === 0 ? (
          <GlassCard>
            <p className="text-gray-600 text-center py-8">
              No renewals scheduled for this month
            </p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {thisMonth.map(subscription => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
              />
            ))}
          </div>
        )}
      </div>

      {/* All Renewals Calendar View */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          All Renewals
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.map(subscription => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
            />
          ))}
        </div>
      </div>
    </div>
  );
};