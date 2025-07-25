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

interface IndexProps {
  onLogout?: () => void;
}

const Index: React.FC<IndexProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('time-tracker');
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);

  const handleTimeLogged = (entry: TimeEntry) => {
    setTimeEntries(prev => [...prev, entry]);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'time-tracker':
        return <TimeTracker onTimeLogged={handleTimeLogged} dailyTimeEntries={timeEntries} />;
      case 'timesheet':
        return <Timesheet timeEntries={timeEntries} />;
      case 'my-tasks':
        return <MyTasks />;
      case 'holidays':
        return <Holidays />;
      default:
        return <TimeTracker onTimeLogged={handleTimeLogged} dailyTimeEntries={timeEntries} />;
    }
  };

  return (
    <div className="min-h-screen w-full index-page-background">
      <TopNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onLogout={onLogout}
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
