import React from 'react';
import { MapPin } from 'lucide-react';
import AnalogClock from './AnalogClock';

interface InfoBarProps {
  isTimerActive: boolean;
  selectedProject?: any;
  selectedSubproject?: string;
  time?: number;
}

const InfoBar: React.FC<InfoBarProps> = ({ 
  isTimerActive, 
  selectedProject, 
  selectedSubproject, 
  time = 0 
}) => {
  const getCurrentDateTime = () => {
    const now = new Date();
    
    // Get weekday
    const weekdayOptions: Intl.DateTimeFormatOptions = {
      weekday: 'long'
    };
    const weekday = now.toLocaleDateString('en-US', weekdayOptions);
    
    // Get date (month, day, year)
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    const date = now.toLocaleDateString('en-US', dateOptions);
    
    return { weekday, date };
  };

  const getTimeZoneTime = (timezone: string) => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour12: true,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate decimal hours from seconds (e.g., 6 minutes = 0.1, 12 minutes = 0.2, 15 minutes = 0.25)
  const getDecimalHours = (seconds: number) => {
    const minutes = seconds / 60;
    const decimalHours = minutes / 60;
    return decimalHours.toFixed(2);
  };

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-8">
        <div className="timezone-card">
          {isTimerActive ? (
            <>
              {/* Currently Tracking Section - Left Side */}
              <div className="flex-1 flex flex-col justify-center px-8 py-6">
                {/* Status Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-4 h-4 rounded-full bg-white animate-pulse"></div>
                  <span className="text-white font-bold text-2xl tracking-wider">CURRENTLY TRACKING</span>
                </div>
                {/* Project Info Section */}
                <div className="flex items-center gap-12">
                  {/* Project Info */}
                  <div className="flex flex-col">
                    <div className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-2">PROJECT</div>
                    <div className="text-white font-bold text-2xl leading-tight">{selectedProject?.name}</div>
                  </div>
                  {/* Subproject Info */}
                  <div className="flex flex-col">
                    <div className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-2">TASK</div>
                    <div className="text-white font-bold text-2xl leading-tight">{selectedSubproject}</div>
                  </div>
                  {/* Timer Hours */}
                  <div className="flex flex-col">
                    <div className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-2">HOURS</div>
                    <div className="text-white font-bold text-3xl font-mono leading-tight">{getDecimalHours(time)}</div>
                  </div>
                </div>
              </div>
              {/* World Times - Right Side */}
              <div className="flex-1 flex items-center justify-center px-8 py-6">
                <div className="flex items-center gap-8">
                  {/* India */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center shadow-lg">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                            <div className="w-1 h-4 bg-white rounded-full transform rotate-45"></div>
                            <div className="w-1 h-6 bg-white rounded-full absolute transform -rotate-45"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-8 h-6 rounded shadow-md overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-b from-orange-500 via-white to-green-600 relative">
                        <div className="absolute inset-0 bg-blue-600 w-1/3 h-full"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="text-white font-bold text-lg font-mono">{getTimeZoneTime('Asia/Kolkata')}</div>
                  </div>
                  {/* Vertical Divider */}
                  <div className="w-px h-20 bg-white/20"></div>
                  {/* UK */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center shadow-lg">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                            <div className="w-1 h-4 bg-white rounded-full transform rotate-45"></div>
                            <div className="w-1 h-6 bg-white rounded-full absolute transform -rotate-45"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-8 h-6 rounded shadow-md overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-b from-blue-600 via-white to-red-600 relative">
                        <div className="absolute inset-0 bg-red-600 w-1/3 h-full"></div>
                        <div className="absolute inset-0 bg-blue-600 w-1/3 h-full left-1/3"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="text-white font-bold text-lg font-mono">{getTimeZoneTime('Europe/London')}</div>
                  </div>
                  {/* Vertical Divider */}
                  <div className="w-px h-20 bg-white/20"></div>
                  {/* USA */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center shadow-lg">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                            <div className="w-1 h-4 bg-white rounded-full transform rotate-45"></div>
                            <div className="w-1 h-6 bg-white rounded-full absolute transform -rotate-45"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-8 h-6 rounded shadow-md overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-b from-red-600 via-white to-blue-600 relative">
                        <div className="absolute inset-0 bg-red-600 w-1/3 h-full"></div>
                        <div className="absolute inset-0 bg-white w-1/3 h-full left-1/3"></div>
                        <div className="absolute inset-0 bg-blue-600 w-1/3 h-full left-2/3"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="text-white font-bold text-lg font-mono">{getTimeZoneTime('America/New_York')}</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Default View - Date Section */}
              <div className="flex items-center justify-between w-full">
                {/* Date Section */}
                <div className="date-display flex-shrink-0 mr-16">
                  <h1 className="date-weekday">{getCurrentDateTime().weekday}</h1>
                  <h2 className="date-full">{getCurrentDateTime().date}</h2>
                </div>
                
                {/* World Clocks - Equal Spacing */}
                <div className="flex justify-between gap-16 flex-1">
                  {/* India Time */}
                  <div className="timezone-section flex-1 flex justify-center">
                    <div className="relative">
                      <div className="w-24 h-24 analog-clock-container">
                        <div className="clock-ring"></div>
                        <AnalogClock timezone="Asia/Kolkata" />
                        <div className="clock-reflection"></div>
                        <div className="clock-highlight"></div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center ml-4">
                      <div className="location-label">
                        <MapPin className="w-2.5 h-2.5" />
                        <span>INDIA</span>
                      </div>
                      <div className="time-display">{getTimeZoneTime('Asia/Kolkata')}</div>
                    </div>
                    <div className="timezone-divider"></div>
                  </div>

                  {/* UK Time */}
                  <div className="timezone-section flex-1 flex justify-center">
                    <div className="relative">
                      <div className="w-24 h-24 analog-clock-container">
                        <div className="clock-ring"></div>
                        <AnalogClock timezone="Europe/London" />
                        <div className="clock-reflection"></div>
                        <div className="clock-highlight"></div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center ml-4">
                      <div className="location-label">
                        <MapPin className="w-2.5 h-2.5" />
                        <span>UK</span>
                      </div>
                      <div className="time-display">{getTimeZoneTime('Europe/London')}</div>
                    </div>
                    <div className="timezone-divider"></div>
                  </div>

                  {/* USA Time */}
                  <div className="timezone-section flex-1 flex justify-center">
                    <div className="relative">
                      <div className="w-24 h-24 analog-clock-container">
                        <div className="clock-ring"></div>
                        <AnalogClock timezone="America/New_York" />
                        <div className="clock-reflection"></div>
                        <div className="clock-highlight"></div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center ml-4">
                      <div className="location-label">
                        <MapPin className="w-2.5 h-2.5" />
                        <span>USA</span>
                      </div>
                      <div className="time-display">{getTimeZoneTime('America/New_York')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoBar; 