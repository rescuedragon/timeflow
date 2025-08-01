import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Sparkles } from 'lucide-react';
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

  const weekdays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Convert Sunday (0) to be last day (6), Monday (1) becomes 0, etc.
    const mondayBasedStartDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < mondayBasedStartDay; i++) {
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
      case 'holiday': return 'bg-gradient-to-r from-red-500 to-red-600';
      case 'leave': return 'bg-gradient-to-r from-blue-500 to-blue-600';
      case 'event': return 'bg-gradient-to-r from-green-500 to-green-600';
      default: return 'bg-gradient-to-r from-slate-500 to-slate-600';
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
    <div className="h-full flex flex-col animate-fade-up max-w-6xl mx-auto p-4">
      {/* Premium Header with Gradient */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 rounded-3xl blur-xl"></div>
        <Card className="relative p-8 bg-white/90 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/30 to-transparent"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl shadow-lg">
                <CalendarIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Holiday Calendar
                </h2>
                <p className="text-slate-500 font-medium mt-1">Track your holidays, leaves & special events</p>
              </div>
            </div>
            
            <Button 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 rounded-2xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Event
            </Button>
          </div>
        </Card>
      </div>

      {/* Main Calendar Container */}
      <Card className="flex-1 bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
        <div className="p-8">
          {/* Calendar Navigation */}
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="w-12 h-12 rounded-2xl bg-slate-100/80 hover:bg-slate-200/80 border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <ChevronLeft className="w-5 h-5 text-slate-700" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 text-slate-700 font-semibold border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Today
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="w-12 h-12 rounded-2xl bg-slate-100/80 hover:bg-slate-200/80 border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <ChevronRight className="w-5 h-5 text-slate-700" />
              </Button>
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-3 mb-6">
            {weekdays.map((day) => (
              <div key={day} className="p-4 text-center text-sm font-bold text-slate-600 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-sm">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-3 mb-8">
            {days.map((day, index) => {
              const dayEvents = getEventsForDate(day);
              const hasEvents = dayEvents.length > 0;
              
              return (
                <div
                  key={index}
                  className={`min-h-[100px] p-3 rounded-2xl transition-all duration-300 ${
                    day 
                      ? `bg-white/80 hover:bg-white border border-slate-200/50 hover:border-slate-300/50 cursor-pointer hover:shadow-lg hover:scale-105 ${
                          isToday(day) 
                            ? 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-300/50 ring-2 ring-purple-200/50 shadow-lg' 
                            : ''
                        }`
                      : 'border-transparent'
                  }`}
                >
                  {day && (
                    <>
                      <div className={`text-lg font-bold mb-2 ${
                        isToday(day) 
                          ? 'text-purple-700' 
                          : 'text-slate-700'
                      }`}>
                        {day}
                      </div>
                      
                      {hasEvents && (
                        <div className="space-y-1.5">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className={`w-full h-2 rounded-full shadow-sm ${getEventTypeColor(event.type)}`}
                              title={event.title}
                            />
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-slate-500 text-center font-medium bg-slate-100 rounded-lg py-1">
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

          {/* Enhanced Legend */}
          <div className="mb-8 p-6 bg-gradient-to-r from-slate-50/80 to-slate-100/80 rounded-2xl border border-slate-200/50">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h4 className="text-lg font-bold text-slate-700">Event Types</h4>
            </div>
            <div className="flex gap-8">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 to-red-600 shadow-md"></div>
                <span className="text-sm font-semibold text-slate-700">National Holidays</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-md"></div>
                <span className="text-sm font-semibold text-slate-700">Personal Leaves</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-500 to-green-600 shadow-md"></div>
                <span className="text-sm font-semibold text-slate-700">Special Events</span>
              </div>
            </div>
          </div>

          {/* Premium Upcoming Events */}
          <div className="p-6 bg-gradient-to-br from-white/80 to-slate-50/80 rounded-2xl border border-slate-200/50">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl">
                <CalendarIcon className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-xl font-bold text-slate-700">Upcoming Events</h4>
            </div>
            <div className="space-y-4 max-h-40 overflow-y-auto">
              {events
                .filter(event => new Date(event.date) >= new Date())
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 3)
                .map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 bg-white/80 rounded-2xl border border-slate-200/30 hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full shadow-sm ${getEventTypeColor(event.type)}`}></div>
                      <div>
                        <div className="text-base font-bold text-slate-800">{event.title}</div>
                        <div className="text-sm text-slate-500 font-medium">{event.description}</div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Holidays;