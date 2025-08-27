import React from 'react';
import { Edit, Trash2, Eye, EyeOff, Calendar } from 'lucide-react';
import type { Subscription } from '../../data/types';
import { GlassCard } from '../UI/GlassCard';
import { Button } from '../UI/Button';
import { formatCurrency, formatDate, getDaysUntilRenewal } from '../../utils/helper';

interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit?: (subscription: Subscription) => void;
  onDelete?: (id: string) => void;
  onToggleVisibility?: (id: string, currentVisibility: string) => void;
  isAdmin?: boolean;
  showUserInfo?: boolean;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onEdit,
  onDelete,
  onToggleVisibility,
  isAdmin = false,
  showUserInfo = false
}) => {
  const daysUntilRenewal = getDaysUntilRenewal(subscription.renewal_date);
  const isUpcoming = daysUntilRenewal <= 7;

  return (
    <GlassCard hover className={`
      ${isUpcoming ? 'ring-2 ring-orange-300 bg-orange-50/20' : ''}
    `}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {subscription.service_name}
          </h3>
          {showUserInfo && subscription.user && (
            <p className="text-sm text-gray-600">
              by {subscription.user.email}
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          {isAdmin && onToggleVisibility && (
            <Button
              onClick={() => onToggleVisibility(subscription.id, subscription.visibility)}
              variant="ghost"
              size="sm"
              icon={subscription.visibility === 'shared' ? Eye : EyeOff} children={undefined}            />
          )}
          {onEdit && (
            <Button
              onClick={() => onEdit(subscription)}
              variant="ghost"
              size="sm"
              icon={Edit} children={undefined}            />
          )}
          {onDelete && (
            <Button
              onClick={() => onDelete(subscription.id)}
              variant="danger"
              size="sm"
              icon={Trash2} children={undefined}            />
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-gray-800">
            {formatCurrency(subscription.cost)}
          </span>
          <span className="px-3 py-1 bg-blue-100/50 text-blue-700 rounded-full text-sm font-medium">
            {subscription.billing_cycle}
          </span>
        </div>

        <div className="flex items-center text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span className="text-sm">
            Renews {formatDate(subscription.renewal_date)}
          </span>
        </div>

        {isUpcoming && (
          <div className="bg-orange-100/50 border border-orange-300/50 rounded-lg p-3">
            <p className="text-orange-700 text-sm font-medium">
              Renewing in {daysUntilRenewal} day{daysUntilRenewal !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {subscription.notes && (
          <p className="text-gray-600 text-sm bg-white/30 rounded-lg p-3">
            {subscription.notes}
          </p>
        )}

        {subscription.visibility === 'shared' && (
          <div className="flex items-center justify-center">
            <span className="px-2 py-1 bg-green-100/50 text-green-700 rounded-full text-xs font-medium">
              Shared with team
            </span>
          </div>
        )}
      </div>
    </GlassCard>
  );
};