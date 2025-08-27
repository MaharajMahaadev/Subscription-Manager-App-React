export const BILLING_CYCLES = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' }
] as const;

export const SUBSCRIPTION_CATEGORIES = {
  necessary: {
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    label: 'Essential'
  },
  optional: {
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    label: 'Optional'
  }
} as const;

export const DASHBOARD_ROUTES = {
  MY_SUBSCRIPTIONS: 'my-subscriptions',
  SHARED_SUBSCRIPTIONS: 'shared-subscriptions',
  INSIGHTS: 'insights',
  RENEWALS: 'renewals',
  ALL_SUBSCRIPTIONS: 'all-subscriptions',
  GLOBAL_INSIGHTS: 'global-insights',
  ADMIN_PANEL: 'admin-panel'
} as const;

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
} as const;