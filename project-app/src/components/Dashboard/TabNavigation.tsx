import React from 'react';
import type { DashboardTab } from '../../data/types';

interface TabNavigationProps {
  tabs: DashboardTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ 
  tabs, 
  activeTab, 
  onTabChange 
}) => {
  return (
    <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-2 mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm
              ${activeTab === tab.id
                ? 'bg-white/50 text-blue-700 shadow-md'
                : 'text-gray-600 hover:bg-white/30 hover:text-gray-800'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};