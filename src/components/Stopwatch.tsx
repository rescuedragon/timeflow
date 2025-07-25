import React from 'react';
import { Play, Pause, Square } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface StopwatchProps {
  time: number;
  isRunning: boolean;
  isPaused: boolean;
  selectedProject: any;
  selectedSubproject: string;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

const Stopwatch: React.FC<StopwatchProps> = ({
  time,
  isRunning,
  isPaused,
  selectedProject,
  selectedSubproject,
  onStart,
  onPause,
  onResume,
  onStop
}) => {
  const [smoothTime, setSmoothTime] = React.useState(0);

  // Create smooth time progression independent of the main timer
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setSmoothTime(prev => prev + 0.05); // Increment by 50ms
      }, 50);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isPaused]);

  // Sync smooth time with actual time only when timer state changes
  React.useEffect(() => {
    setSmoothTime(time);
  }, [time, isRunning, isPaused]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate angles for the hands using smooth time
  const getSecondAngle = () => {
    const useTime = isRunning && !isPaused ? smoothTime : time;
    return ((useTime % 60) * 6) - 90; // 6 degrees per second
  };
  const getMinuteAngle = () => {
    const useTime = isRunning && !isPaused ? smoothTime : time;
    return (((useTime % 3600) / 60) * 6) - 90; // 6 degrees per minute
  };
  const getHourAngle = () => {
    const useTime = isRunning && !isPaused ? smoothTime : time;
    return ((useTime / 3600) * 30) - 90; // 30 degrees per hour
  };

  // Calculate progress arc for smooth elapsed time visualization
  const getProgressPath = () => {
    const useTime = isRunning && !isPaused ? smoothTime : time;
    const totalSeconds = useTime % 60; // Progress through current minute
    const progress = totalSeconds / 60;
    const angle = progress * 360;
    const radians = (angle * Math.PI) / 180;
    const centerX = 180;
    const centerY = 180;
    const radius = 161; // Positioned to completely overlap minute markers
    
    const x = centerX + radius * Math.cos(radians - Math.PI / 2);
    const y = centerY + radius * Math.sin(radians - Math.PI / 2);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    return `M ${centerX} ${centerY - radius} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x} ${y}`;
  };

  return (
    <div className="w-1/2">
      <Card className="p-6 bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl h-[612px] flex flex-col justify-center items-center relative overflow-hidden">
        {/* Premium Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/98 to-gray-50/95 z-0"></div>
        
        {/* Braun-Style Stopwatch */}
        <div className="relative z-10 mb-6">
          {/* Main Stopwatch Body */}
          <div 
            className="relative w-96 h-96 rounded-3xl bg-white shadow-2xl"
            style={{
              background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)'
            }}
          >
            {/* Top Button (Start/Stop) */}
            <div 
              className="absolute -top-4 left-10 w-16 h-10 rounded-full bg-white shadow-lg"
              style={{
                background: 'linear-gradient(145deg, #ffffff 0%, #f1f5f9 100%)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)'
              }}
            />
            
            {/* Speaker Grille */}
            <div className="absolute top-6 right-8">
              <div className="grid grid-cols-4 gap-1.5">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="w-1.5 h-1.5 rounded-full bg-gray-800"
                  />
                ))}
              </div>
            </div>
            
            {/* Clock Face */}
            <div 
              className="absolute inset-8 rounded-full bg-gray-100 shadow-inner"
              style={{
                background: 'linear-gradient(145deg, #f1f5f9 0%, #e2e8f0 100%)',
                boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.1)'
              }}
            >
              {/* SVG Clock Face */}
              <svg className="w-full h-full" viewBox="0 0 360 360">
                {/* Outer Ring */}
                <circle
                  cx="180"
                  cy="180"
                  r="170"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="2"
                />
                
                {/* Progress Arc - Light Purple with smooth edges that completely covers minute markers */}
                {isRunning && !isPaused && (
                  <path
                    d={getProgressPath()}
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      filter: 'blur(0.5px)',
                      opacity: 0.9
                    }}
                  />
                )}
                {/* Overlay for extra smoothness */}
                {isRunning && !isPaused && (
                  <path
                    d={getProgressPath()}
                    fill="none"
                    stroke="#c084fc"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      opacity: 0.7
                    }}
                  />
                )}
                
                {/* Hour Markers - Symmetrical and integrated with purple ring */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i * 30) - 90;
                  const isMainHour = i % 3 === 0;
                  
                  if (isMainHour) {
                    // Main hour markers (12, 3, 6, 9) - extend through purple ring area symmetrically
                    const outerRadius = 170;
                    const innerRadius = 135;
                    
                    const x1 = 180 + outerRadius * Math.cos((angle * Math.PI) / 180);
                    const y1 = 180 + outerRadius * Math.sin((angle * Math.PI) / 180);
                    const x2 = 180 + innerRadius * Math.cos((angle * Math.PI) / 180);
                    const y2 = 180 + innerRadius * Math.sin((angle * Math.PI) / 180);
                    
                    return (
                      <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#1f2937"
                        strokeWidth="6"
                        strokeLinecap="round"
                      />
                    );
                  } else {
                    // Regular hour markers - contained within purple ring area
                    const outerRadius = 167;
                    const innerRadius = 150;
                    
                    const x1 = 180 + outerRadius * Math.cos((angle * Math.PI) / 180);
                    const y1 = 180 + outerRadius * Math.sin((angle * Math.PI) / 180);
                    const x2 = 180 + innerRadius * Math.cos((angle * Math.PI) / 180);
                    const y2 = 180 + innerRadius * Math.sin((angle * Math.PI) / 180);
                    
                    return (
                      <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#374151"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    );
                  }
                })}
                
                {/* Minute Markers - Completely enclosed within purple ring */}
                {Array.from({ length: 60 }).map((_, i) => {
                  if (i % 5 !== 0) {
                    const angle = (i * 6) - 90;
                    const outerRadius = 167; // Outer edge of purple ring area
                    const innerRadius = 155; // Inner edge of purple ring area
                    
                    const x1 = 180 + outerRadius * Math.cos((angle * Math.PI) / 180);
                    const y1 = 180 + outerRadius * Math.sin((angle * Math.PI) / 180);
                    const x2 = 180 + innerRadius * Math.cos((angle * Math.PI) / 180);
                    const y2 = 180 + innerRadius * Math.sin((angle * Math.PI) / 180);
                    
                    return (
                      <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#6b7280"
                        strokeWidth="1.5"
                      />
                    );
                  }
                  return null;
                })}
                

                
                {/* Date Display - Moved up to fill space */}
                <text x="180" y="240" textAnchor="middle" className="fill-gray-700 text-lg font-medium" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                  {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                </text>
                
                {/* Hour Hand - Thicker and more prominent */}
                <motion.line
                  x1="180"
                  y1="180"
                  x2={180 + 70 * Math.cos((getHourAngle() * Math.PI) / 180)}
                  y2={180 + 70 * Math.sin((getHourAngle() * Math.PI) / 180)}
                  stroke="#1f2937"
                  strokeWidth="8"
                  strokeLinecap="round"
                  animate={{
                    x2: 180 + 70 * Math.cos((getHourAngle() * Math.PI) / 180),
                    y2: 180 + 70 * Math.sin((getHourAngle() * Math.PI) / 180)
                  }}
                  transition={{ duration: 0.5 }}
                />
                
                {/* Minute Hand - Longer and more prominent */}
                <motion.line
                  x1="180"
                  y1="180"
                  x2={180 + 110 * Math.cos((getMinuteAngle() * Math.PI) / 180)}
                  y2={180 + 110 * Math.sin((getMinuteAngle() * Math.PI) / 180)}
                  stroke="#1f2937"
                  strokeWidth="5"
                  strokeLinecap="round"
                  animate={{
                    x2: 180 + 110 * Math.cos((getMinuteAngle() * Math.PI) / 180),
                    y2: 180 + 110 * Math.sin((getMinuteAngle() * Math.PI) / 180)
                  }}
                  transition={{ duration: 0.5 }}
                />
                
                {/* Second Hand - Light Purple with smooth continuous movement */}
                <motion.line
                  x1="180"
                  y1="180"
                  x2={180 + 130 * Math.cos((getSecondAngle() * Math.PI) / 180)}
                  y2={180 + 130 * Math.sin((getSecondAngle() * Math.PI) / 180)}
                  stroke="#a855f7"
                  strokeWidth="3"
                  strokeLinecap="round"
                  animate={{
                    x2: 180 + 130 * Math.cos((getSecondAngle() * Math.PI) / 180),
                    y2: 180 + 130 * Math.sin((getSecondAngle() * Math.PI) / 180)
                  }}
                  transition={{ 
                    duration: isRunning && !isPaused ? 0.05 : 0.5,
                    ease: "linear"
                  }}
                />
                
                {/* Center Dot - Larger and more prominent with light purple */}
                <circle cx="180" cy="180" r="12" fill="#a855f7" />
                <circle cx="180" cy="180" r="6" fill="white" />
              </svg>
            </div>
          </div>
        </div>

        {/* Digital Time Display */}
        <motion.div 
          className="text-center mb-6 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-sm uppercase tracking-widest text-gray-500 mb-2 font-medium">
            {!isRunning ? "READY TO START" : isPaused ? "TIMER PAUSED" : "TIMER RUNNING"}
          </div>
          <div 
            className="text-4xl font-bold text-gray-900 tracking-tight"
            style={{ fontFamily: 'Helvetica, Arial, monospace' }}
          >
            {formatTime(time)}
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div 
          className="flex justify-center gap-4 relative z-10 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {!isRunning ? (
            <motion.button
              onClick={onStart}
              disabled={!selectedProject || !selectedSubproject}
              className="h-12 px-8 text-base rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold flex items-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl"
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
              whileHover={{ scale: selectedProject && selectedSubproject ? 1.02 : 1 }}
              whileTap={{ scale: selectedProject && selectedSubproject ? 0.98 : 1 }}
            >
              <Play className="w-4 h-4" />
              Start Timer
            </motion.button>
          ) : (
            <>
              {!isPaused ? (
                <motion.button
                  onClick={onPause}
                  className="h-12 px-6 text-base rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                  style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Pause className="w-4 h-4" />
                  Pause
                </motion.button>
              ) : (
                <motion.button
                  onClick={onResume}
                  className="h-12 px-6 text-base rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                  style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Play className="w-4 h-4" />
                  Resume
                </motion.button>
              )}
              
              <motion.button
                onClick={onStop}
                className="h-12 px-6 text-base rounded-2xl bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 font-semibold flex items-center gap-2 transition-all duration-200 shadow-sm"
                style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Square className="w-4 h-4" />
                Stop
              </motion.button>
            </>
          )}
        </motion.div>


      </Card>
    </div>
  );
};

export default Stopwatch;