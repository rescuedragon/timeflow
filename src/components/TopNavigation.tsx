import React from 'react';
import { Timer, FileText, CheckSquare, Calendar, LogOut } from 'lucide-react';

interface TopNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout?: () => void;
}

const TopNavigation: React.FC<TopNavigationProps> = ({ activeTab, onTabChange, onLogout }) => {
  const tabs = [
    {
      id: 'time-tracker',
      label: 'Time Tracker',
      icon: Timer,
    },
    {
      id: 'timesheet',
      label: 'Timesheet',
      icon: FileText,
    },
    {
      id: 'my-tasks',
      label: 'My Tasks',
      icon: CheckSquare,
    },
    {
      id: 'holidays',
      label: 'Holidays',
      icon: Calendar,
    },
  ];

  return (
    <div className="w-full bg-transparent py-8">
      <div className="max-w-7xl mx-auto px-8">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-2 shadow-xl border border-white/20">
          <div className="flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-3 px-6 py-4 text-base font-semibold transition-all duration-300 rounded-2xl flex-1 justify-center relative overflow-hidden ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg transform scale-[1.02]' 
                      : 'text-slate-600 hover:bg-white/60 hover:text-slate-800 hover:shadow-md'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-all duration-300 ${
                    isActive ? 'text-white' : 'text-slate-500'
                  }`} />
                  <span className={`font-semibold transition-all duration-300 ${
                    isActive ? 'text-white' : 'text-slate-600'
                  }`}>
                    {tab.label}
                  </span>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-purple-700/20 rounded-2xl animate-pulse" />
                  )}
                </button>
              );
            })}
            

          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;