import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import type { Subscription } from '../../data/types';
import { supabase } from '../../utils/supabase';
import { SubscriptionCard } from '../Subscriptions/SubscriptionCard';
import toast from 'react-hot-toast';

export const SharedSubscriptions: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSharedSubscriptions();
  }, []);

  const fetchSharedSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          user:profiles(email)
        `)
        .eq('visibility', 'shared')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch shared subscriptions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.service_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <Users className="w-6 h-6" />
            Shared Subscriptions
          </h2>
          <p className="text-gray-600">View subscriptions shared by your team</p>
        </div>
      </div>

      <div className="mb-6">
        <input
          placeholder="Search shared subscriptions..."
          value={searchTerm}
          onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {filteredSubscriptions.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            {searchTerm ? 'No shared subscriptions found matching your search.' : 'No shared subscriptions available.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubscriptions.map((subscription) => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              showUserInfo
            />
          ))}
        </div>
      )}
    </div>
  );
};