import React from 'react';
import { Timer, FileText, CheckSquare, Calendar } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
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
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto">
        <nav className="glass rounded-t-3xl p-2 m-4 mb-0">
          <div className="flex justify-around">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-300 relative ${
                    isActive 
                      ? 'text-primary' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-primary/10 rounded-2xl animate-scale-in" />
                  )}
                  
                  <div className="relative">
                    <Icon className={`w-6 h-6 transition-all duration-300 ${
                      isActive ? 'scale-110' : 'scale-100'
                    }`} />
                    {isActive && (
                      <div className="absolute -inset-2 bg-primary/20 rounded-full animate-pulse-glow opacity-50" />
                    )}
                  </div>
                  
                  <span className={`text-xs font-medium transition-all duration-300 ${
                    isActive ? 'text-primary font-semibold' : 'text-slate-500'
                  }`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default BottomNavigation;