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

  // Keep TimeTracker always mounted to preserve timer state
  const renderActiveTab = () => {
    return (
      <>
        {/* TimeTracker is always mounted but hidden when not active */}
        <div style={{ display: activeTab === 'time-tracker' ? 'block' : 'none' }}>
          <TimeTracker onTimeLogged={handleTimeLogged} dailyTimeEntries={timeEntries} />
        </div>
        
        {/* Other tabs are conditionally rendered */}
        {activeTab === 'timesheet' && <Timesheet timeEntries={timeEntries} />}
        {activeTab === 'my-tasks' && <MyTasks />}
        {activeTab === 'holidays' && <Holidays />}
      </>
    );
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
