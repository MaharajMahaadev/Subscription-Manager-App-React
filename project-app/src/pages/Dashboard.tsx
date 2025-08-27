import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { DashboardTab } from '../data/types';
import { DASHBOARD_ROUTES, USER_ROLES } from '../data/constants';
import { TabNavigation } from '../components/Dashboard/TabNavigation';
import { MySubscriptions } from '../components/Dashboard/MySubscriptions';
import { SharedSubscriptions } from '../components/Dashboard/SharedSubscriptions';
import { Insights } from '../components/Dashboard/Insights';
import { Renewals } from '../components/Dashboard/Renewals';
import { AllSubscriptions } from '../components/Dashboard/AllSubscriptions';
import { AdminPanel } from '../components/Dashboard/AdminPanel';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab['id']>(DASHBOARD_ROUTES.MY_SUBSCRIPTIONS);

  if (!user) return null;

  const userTabs: DashboardTab[] = [
    {
      id: DASHBOARD_ROUTES.MY_SUBSCRIPTIONS,
      label: 'My Subscriptions',
      component: MySubscriptions
    },
    {
      id: DASHBOARD_ROUTES.SHARED_SUBSCRIPTIONS,
      label: 'Shared',
      component: SharedSubscriptions
    },
    {
      id: DASHBOARD_ROUTES.INSIGHTS,
      label: 'Insights',
      component: () => <Insights />
    },
    {
      id: DASHBOARD_ROUTES.RENEWALS,
      label: 'Renewals',
      component: Renewals
    }
  ];

  const adminTabs: DashboardTab[] = [
    {
      id: DASHBOARD_ROUTES.ALL_SUBSCRIPTIONS,
      label: 'All Subscriptions',
      component: AllSubscriptions
    },
    {
      id: DASHBOARD_ROUTES.GLOBAL_INSIGHTS,
      label: 'Global Insights',
      component: () => <Insights isGlobal />
    },
    {
      id: DASHBOARD_ROUTES.ADMIN_PANEL,
      label: 'Admin Panel',
      component: AdminPanel
    }
  ];

  const tabs = user.role === USER_ROLES.ADMIN ? [...userTabs, ...adminTabs] : userTabs;
  const currentTab = tabs.find(tab => tab.id === activeTab);
  const ActiveComponent = currentTab?.component || MySubscriptions;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {user.role === USER_ROLES.ADMIN ? 'Admin Dashboard' : 'Dashboard'}
          </h1>
          <p className="text-gray-600">
            Welcome back, {user.email}
          </p>
        </div>

        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tabId: string) => setActiveTab(tabId)}
        />

        <div className="transition-all duration-300">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
};