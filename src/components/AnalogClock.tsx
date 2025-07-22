import React, { useEffect, useState } from 'react';

interface AnalogClockProps {
  timezone: string;
}

const AnalogClock: React.FC<AnalogClockProps> = ({ timezone }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Get time for the specific timezone
  const getTimeInTimezone = () => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    };
    
    const timeString = new Intl.DateTimeFormat('en-US', options).format(time);
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    
    return { hours, minutes, seconds };
  };

  const { hours, minutes, seconds } = getTimeInTimezone();
  
  // Calculate the rotation angles for the clock hands
  const secondsAngle = (seconds / 60) * 360;
  const minutesAngle = ((minutes + seconds / 60) / 60) * 360;
  const hoursAngle = ((hours % 12 + minutes / 60) / 12) * 360;

  return (
    <div className="relative w-full h-full">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Definitions for gradients and filters */}
        <defs>
          {/* Black glossy face gradient */}
          <radialGradient id="glossyBlack" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
            <stop offset="0%" stopColor="#333333" />
            <stop offset="75%" stopColor="#111111" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>
          
          {/* Outer rim gradient - subtle metallic */}
          <linearGradient id="rimGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#444444" />
            <stop offset="50%" stopColor="#222222" />
            <stop offset="100%" stopColor="#444444" />
          </linearGradient>
          
          {/* Glossy reflection gradient */}
          <linearGradient id="glossReflection" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="20%" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          
          {/* Hand glow effect */}
          <filter id="handGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Outer rim */}
        <circle cx="50" cy="50" r="49" fill="url(#rimGradient)" />
        
        {/* Main clock face - glossy black */}
        <circle cx="50" cy="50" r="46" fill="url(#glossyBlack)" />
        
        {/* Glossy reflection overlay */}
        <ellipse cx="35" cy="35" rx="35" ry="25" fill="url(#glossReflection)" opacity="0.7" />
        
        {/* Minimalist hour markers - just at 12, 3, 6, 9 */}
        {[0, 3, 6, 9].map((hour) => {
          const angle = (hour * 30) * (Math.PI / 180);
          const x = 50 + 40 * Math.sin(angle);
          const y = 50 - 40 * Math.cos(angle);
          
          return (
            <circle 
              key={hour} 
              cx={x} 
              cy={y} 
              r={hour === 0 ? 1.5 : 1} 
              fill="#cccccc" 
            />
          );
        })}
        
        {/* Hour hand - silver */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="30"
          stroke="#cccccc"
          strokeWidth="2.5"
          strokeLinecap="round"
          transform={`rotate(${hoursAngle}, 50, 50)`}
          className="transition-transform duration-700 ease-in-out"
        />
        
        {/* Minute hand - silver */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="22"
          stroke="#cccccc"
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${minutesAngle}, 50, 50)`}
          className="transition-transform duration-500 ease-in-out"
        />
        
        {/* Center dot */}
        <circle cx="50" cy="50" r="1.5" fill="#cccccc" />
      </svg>
    </div>
  );
};

export default AnalogClock;