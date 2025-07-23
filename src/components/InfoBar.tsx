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
        <div className="timezone-card relative premium-infobar" style={{ backgroundColor: '#7e22ce' }}>
          {isTimerActive ? (
            <>
              {/* Pulsing white dot in extreme top left with enhanced animation */}
              <div className="absolute top-[22px] left-4 w-2 h-2 rounded-full bg-white animate-premium-pulse"></div>
              
              {/* Project Info Section - Left Side (80% width) */}
              <div className="flex-[0.8] flex items-center justify-evenly px-8 py-6">
                {/* Project Info */}
                <div className="flex flex-col animate-fade-in animate-fade-in-1">
                  <div className="text-white/70 text-xs font-normal uppercase tracking-[0.1em] mb-2" 
                       style={{ fontFamily: "'Inter', 'Poppins', sans-serif" }}>
                    PROJECT
                  </div>
                  <div className="text-white font-bold text-2xl leading-tight" 
                       style={{ fontFamily: "'Inter', 'Poppins', sans-serif", letterSpacing: "-0.02em" }}>
                    {selectedProject?.name}
                  </div>
                </div>
                
                {/* Subproject Info */}
                <div className="flex flex-col animate-fade-in animate-fade-in-2">
                  <div className="text-white/70 text-xs font-normal uppercase tracking-[0.1em] mb-2" 
                       style={{ fontFamily: "'Inter', 'Poppins', sans-serif" }}>
                    TASK
                  </div>
                  <div className="text-white font-bold text-2xl leading-tight" 
                       style={{ fontFamily: "'Inter', 'Poppins', sans-serif", letterSpacing: "-0.02em" }}>
                    {selectedSubproject}
                  </div>
                </div>
                
                {/* Timer Hours */}
                <div className="flex flex-col animate-fade-in animate-fade-in-3">
                  <div className="text-white/70 text-xs font-normal uppercase tracking-[0.1em] mb-2" 
                       style={{ fontFamily: "'Inter', 'Poppins', sans-serif" }}>
                    HOURS
                  </div>
                  <div className="text-white font-bold text-3xl leading-tight hours-value" 
                       style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {getDecimalHours(time)}
                  </div>
                </div>
              </div>
              
              {/* World Times - Right Side (20% width) */}
              <div className="flex-[0.2] flex flex-col justify-evenly py-4 px-6 border-l border-white/20">
                {/* First time zone (India) */}
                <div className="flex items-center justify-end animate-fade-in animate-fade-in-1">
                  <div className="text-white font-medium text-2xl mr-3" 
                       style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {getTimeZoneTime('Asia/Kolkata')}
                  </div>
                  <div className="w-6 h-6 flex items-center justify-center">
                    <span role="img" aria-label="India" className="text-xl">🇮🇳</span>
                  </div>
                </div>
                
                {/* Second time zone (UK) */}
                <div className="flex items-center justify-end animate-fade-in animate-fade-in-2">
                  <div className="text-white font-medium text-2xl mr-3" 
                       style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {getTimeZoneTime('Europe/London')}
                  </div>
                  <div className="w-6 h-6 flex items-center justify-center">
                    <span role="img" aria-label="UK" className="text-xl">🇬🇧</span>
                  </div>
                </div>
                
                {/* Third time zone (USA) */}
                <div className="flex items-center justify-end animate-fade-in animate-fade-in-3">
                  <div className="text-white font-medium text-2xl mr-3" 
                       style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {getTimeZoneTime('America/New_York')}
                  </div>
                  <div className="w-6 h-6 flex items-center justify-center">
                    <span role="img" aria-label="USA" className="text-xl">🇺🇸</span>
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