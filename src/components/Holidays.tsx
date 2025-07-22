import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface HolidayEvent {
  id: string;
  date: string;
  title: string;
  type: 'holiday' | 'leave' | 'event';
  description?: string;
}

const Holidays: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events] = useState<HolidayEvent[]>([
    {
      id: '1',
      date: '2025-07-04',
      title: 'Independence Day',
      type: 'holiday',
      description: 'National Holiday'
    },
    {
      id: '2',
      date: '2025-07-15',
      title: 'Personal Leave',
      type: 'leave',
      description: 'Vacation day'
    },
    {
      id: '3',
      date: '2025-07-22',
      title: 'Today',
      type: 'event',
      description: 'Current day'
    },
    {
      id: '4',
      date: '2025-07-25',
      title: 'Team Building',
      type: 'event',
      description: 'Company event'
    }
  ]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getEventsForDate = (day: number | null) => {
    if (!day) return [];
    
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateString);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'next') {
      newDate.setMonth(currentDate.getMonth() + 1);
    } else {
      newDate.setMonth(currentDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const isToday = (day: number | null) => {
    if (!day) return false;
    const today = new Date();
    return today.getFullYear() === currentDate.getFullYear() &&
           today.getMonth() === currentDate.getMonth() &&
           today.getDate() === day;
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'holiday': return 'bg-red-500';
      case 'leave': return 'bg-blue-500';
      case 'event': return 'bg-green-500';
      default: return 'bg-slate-500';
    }
  };

  const getEventTypeBadge = (type: string) => {
    switch (type) {
      case 'holiday': return 'bg-red-100 text-red-700 border-red-200';
      case 'leave': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'event': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="h-full flex flex-col animate-fade-up max-w-5xl mx-auto">
      {/* Header */}
      <Card className="p-6 mb-6 bg-white/80 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold text-slate-700">Calendar</h2>
              <p className="text-sm text-slate-500">Track your holidays & events</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl bg-white/70 hover:bg-white/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>
      </Card>

      {/* Calendar Navigation */}
      <Card className="flex-1 p-6 bg-white/80 backdrop-blur-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-slate-700">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="w-10 h-10 rounded-xl bg-white/70 hover:bg-white/90"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
              className="px-4 rounded-xl bg-white/70 hover:bg-white/90"
            >
              Today
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="w-10 h-10 rounded-xl bg-white/70 hover:bg-white/90"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekdays.map((day) => (
            <div key={day} className="p-3 text-center text-sm font-semibold text-slate-500 bg-slate-100/50 rounded-lg">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const dayEvents = getEventsForDate(day);
            const hasEvents = dayEvents.length > 0;
            
            return (
              <div
                key={index}
                className={`min-h-[80px] p-2 rounded-lg border transition-all duration-200 ${
                  day 
                    ? `bg-white/50 hover:bg-white/70 cursor-pointer ${
                        isToday(day) 
                          ? 'bg-primary/10 border-primary/30 ring-2 ring-primary/20' 
                          : 'border-slate-200/50 hover:border-slate-300/50'
                      }`
                    : 'border-transparent'
                }`}
              >
                {day && (
                  <>
                    <div className={`text-sm font-semibold mb-1 ${
                      isToday(day) ? 'text-primary' : 'text-slate-700'
                    }`}>
                      {day}
                    </div>
                    
                    {hasEvents && (
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={`w-full h-1.5 rounded-full ${getEventTypeColor(event.type)}`}
                            title={event.title}
                          />
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-slate-500 text-center">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-slate-200/50">
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Legend</h4>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-slate-600">Holidays</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-slate-600">Planned Leaves</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-slate-600">Events</span>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mt-6 pt-4 border-t border-slate-200/50">
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Upcoming Events</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {events
              .filter(event => new Date(event.date) >= new Date())
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 3)
              .map((event) => (
                <div key={event.id} className="flex items-center justify-between p-2 bg-slate-50/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${getEventTypeColor(event.type)}`}></div>
                    <div>
                      <div className="text-sm font-medium text-slate-700">{event.title}</div>
                      <div className="text-xs text-slate-500">{event.description}</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Holidays;