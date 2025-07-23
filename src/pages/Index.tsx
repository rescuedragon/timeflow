import React, { useState } from 'react';
import TimeTracker from '@/components/TimeTracker';
import Timesheet from '@/components/Timesheet';
import MyTasks from '@/components/MyTasks';
import Holidays from '@/components/Holidays';
import TopNavigation from '@/components/TopNavigation';
import WorldTimeDisplay from '@/components/WorldTimeDisplay';

interface TimeEntry {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  totalTime: string;
  project: string;
  subproject: string;
  description: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('time-tracker');
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);

  const handleTimeLogged = (entry: TimeEntry) => {
    setTimeEntries(prev => [...prev, entry]);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'time-tracker':
        return <TimeTracker onTimeLogged={handleTimeLogged} />;
      case 'timesheet':
        return <Timesheet timeEntries={timeEntries} />;
      case 'my-tasks':
        return <MyTasks />;
      case 'holidays':
        return <Holidays />;
      default:
        return <TimeTracker onTimeLogged={handleTimeLogged} />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      <TopNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      
      <div className="w-full min-h-[calc(100vh-120px)] pb-8">
        <div className="tab-content animate-fade-up">
          {renderActiveTab()}
        </div>
      </div>
    </div>
  );
};

export default Index;
