import React, { useState, useEffect } from 'react';

interface WorldTimeDisplayProps {
  className?: string;
}

const WorldTimeDisplay: React.FC<WorldTimeDisplayProps> = ({ className = '' }) => {
  const [times, setTimes] = useState({
    india: '',
    uk: '',
    usa: ''
  });

  useEffect(() => {
    // Update times initially
    updateTimes();
    
    // Update times every minute
    const interval = setInterval(updateTimes, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const updateTimes = () => {
    setTimes({
      india: getTimeZoneTime('Asia/Kolkata'),
      uk: getTimeZoneTime('Europe/London'),
      usa: getTimeZoneTime('America/New_York')
    });
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

  return (
    <div className={`flex flex-col space-y-12 p-8 rounded-xl bg-purple-600 ${className}`}>
      {/* India */}
      <div className="flex items-center space-x-6">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 shadow-lg flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <rect x="0" y="0" width="36" height="12" fill="#FF9933" />
            <rect x="0" y="12" width="36" height="12" fill="#FFFFFF" />
            <rect x="0" y="24" width="36" height="12" fill="#138808" />
            <circle cx="18" cy="18" r="4" fill="#000080" />
            <circle cx="18" cy="18" r="3.5" fill="#FFFFFF" />
            <circle cx="18" cy="18" r="1" fill="#000080" />
          </svg>
        </div>
        <div className="text-white text-5xl font-bold tracking-wider">{times.india}</div>
      </div>

      {/* UK */}
      <div className="flex items-center space-x-6">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 shadow-lg flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <rect x="0" y="0" width="36" height="36" fill="#00247D" />
            <path d="M0,0 L36,36 M36,0 L0,36" stroke="#FFFFFF" strokeWidth="6" />
            <path d="M18,0 L18,36 M0,18 L36,18" stroke="#FFFFFF" strokeWidth="6" />
            <path d="M18,0 L18,36 M0,18 L36,18" stroke="#CF142B" strokeWidth="2" />
            <path d="M0,0 L36,36 M36,0 L0,36" stroke="#CF142B" strokeWidth="2" />
          </svg>
        </div>
        <div className="text-white text-5xl font-bold tracking-wider">{times.uk}</div>
      </div>

      {/* USA */}
      <div className="flex items-center space-x-6">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 shadow-lg flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <rect x="0" y="0" width="36" height="36" fill="#FFFFFF" />
            <rect x="0" y="0" width="36" height="2.77" fill="#B22234" />
            <rect x="0" y="5.54" width="36" height="2.77" fill="#B22234" />
            <rect x="0" y="11.08" width="36" height="2.77" fill="#B22234" />
            <rect x="0" y="16.62" width="36" height="2.77" fill="#B22234" />
            <rect x="0" y="22.15" width="36" height="2.77" fill="#B22234" />
            <rect x="0" y="27.69" width="36" height="2.77" fill="#B22234" />
            <rect x="0" y="33.23" width="36" height="2.77" fill="#B22234" />
            <rect x="0" y="0" width="14.4" height="19.38" fill="#3C3B6E" />
          </svg>
        </div>
        <div className="text-white text-5xl font-bold tracking-wider">{times.usa}</div>
      </div>
    </div>
  );
};

export default WorldTimeDisplay;