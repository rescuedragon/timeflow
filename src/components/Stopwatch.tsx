import React from 'react';
import { Play, Pause, Square } from 'lucide-react';
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
      {/* Premium Futuristic Glassmorphic Container */}
      <div 
        className="p-10 rounded-[3rem] h-[612px] flex flex-col justify-center items-center relative overflow-hidden backdrop-blur-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(248, 250, 252, 0.08) 25%, rgba(168, 85, 247, 0.03) 50%, rgba(147, 51, 234, 0.02) 75%, rgba(126, 34, 206, 0.01) 100%)',
          boxShadow: '0 40px 80px rgba(168, 85, 247, 0.15), 0 20px 40px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(168, 85, 247, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}
      >
        {/* Futuristic Background Gradient */}
        <div 
          className="absolute inset-0 rounded-[3rem]"
          style={{
            background: 'radial-gradient(ellipse at top, rgba(168, 85, 247, 0.08) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(147, 51, 234, 0.06) 0%, transparent 50%), linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(168, 85, 247, 0.04) 100%)'
          }}
        />
        
        {/* Enhanced Animated Glow Orbs */}
        <motion.div 
          className="absolute top-12 right-16 w-48 h-48 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, rgba(147, 51, 234, 0.1) 40%, transparent 70%)',
            filter: 'blur(40px)'
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 10, 0],
            y: [0, -5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-16 left-12 w-36 h-36 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, rgba(99, 102, 241, 0.15) 40%, transparent 70%)',
            filter: 'blur(35px)'
          }}
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -8, 0],
            y: [0, 8, 0]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        />
        
        {/* Additional Ambient Glow */}
        <motion.div 
          className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.05) 0%, transparent 60%)',
            filter: 'blur(60px)'
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        
        {/* Futuristic Premium Stopwatch */}
        <div className="relative z-10 mb-10">
          {/* Main Stopwatch Body - Enhanced Glassmorphic */}
          <div 
            className="relative w-[420px] h-[420px] rounded-[3rem] backdrop-blur-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(248, 250, 252, 0.12) 25%, rgba(168, 85, 247, 0.02) 50%, rgba(255, 255, 255, 0.08) 100%)',
              boxShadow: '0 32px 64px rgba(168, 85, 247, 0.2), 0 16px 32px rgba(0, 0, 0, 0.1), inset 0 2px 0 rgba(255, 255, 255, 0.3), inset 0 -2px 0 rgba(168, 85, 247, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            
            {/* Futuristic Speaker Grille */}
            <div className="absolute top-5 right-6">
              <div className="grid grid-cols-4 gap-1">
                {Array.from({ length: 16 }).map((_, i) => (
                  <motion.div 
                    key={i} 
                    className="w-1 h-1 rounded-full backdrop-blur-sm"
                    style={{
                      background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.6) 0%, rgba(147, 51, 234, 0.8) 100%)',
                      boxShadow: '0 1px 2px rgba(168, 85, 247, 0.4), inset 0 0.5px 0 rgba(255, 255, 255, 0.3), 0 0 4px rgba(168, 85, 247, 0.3)',
                      border: '0.5px solid rgba(255, 255, 255, 0.2)'
                    }}
                    animate={{
                      opacity: [0.6, 1, 0.6],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.1
                    }}
                  />
                ))}
              </div>
            </div>
            
            {/* Clock Face - Futuristic with Enhanced Depth */}
            <div 
              className="absolute inset-8 rounded-full backdrop-blur-lg"
              style={{
                background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.25) 0%, rgba(248, 250, 252, 0.15) 30%, rgba(168, 85, 247, 0.02) 60%, rgba(255, 255, 255, 0.1) 100%)',
                boxShadow: 'inset 0 8px 16px rgba(0, 0, 0, 0.08), inset 0 4px 8px rgba(168, 85, 247, 0.05), 0 4px 12px rgba(255, 255, 255, 0.6), 0 2px 4px rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.25)'
              }}
            >
              {/* SVG Clock Face */}
              <svg className="w-full h-full" viewBox="0 0 360 360">
                {/* Outer Ring - Futuristic */}
                <circle
                  cx="180"
                  cy="180"
                  r="170"
                  fill="none"
                  stroke="rgba(168, 85, 247, 0.2)"
                  strokeWidth="0.5"
                />
                
                {/* Enhanced Neon Progress Arc */}
                {isRunning && !isPaused && (
                  <>
                    {/* Outer neon glow */}
                    <motion.path
                      d={getProgressPath()}
                      fill="none"
                      stroke="url(#neonGlow)"
                      strokeWidth="20"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        filter: 'blur(8px)',
                        opacity: 0.6
                      }}
                      animate={{
                        opacity: [0.4, 0.8, 0.4]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    {/* Main neon arc */}
                    <motion.path
                      d={getProgressPath()}
                      fill="none"
                      stroke="url(#progressGradient)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.6))'
                      }}
                      animate={{
                        filter: [
                          'drop-shadow(0 0 8px rgba(168, 85, 247, 0.6))',
                          'drop-shadow(0 0 12px rgba(168, 85, 247, 0.8))',
                          'drop-shadow(0 0 8px rgba(168, 85, 247, 0.6))'
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    {/* Inner highlight */}
                    <path
                      d={getProgressPath()}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.9)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                )}
                
                {/* Enhanced Gradient Definitions */}
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="25%" stopColor="#a855f7" />
                    <stop offset="50%" stopColor="#c084fc" />
                    <stop offset="75%" stopColor="#d946ef" />
                    <stop offset="100%" stopColor="#e879f9" />
                  </linearGradient>
                  <linearGradient id="neonGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(139, 92, 246, 0.8)" />
                    <stop offset="50%" stopColor="rgba(168, 85, 247, 1)" />
                    <stop offset="100%" stopColor="rgba(232, 121, 249, 0.8)" />
                  </linearGradient>
                  <filter id="handShadow">
                    <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="rgba(0,0,0,0.4)" />
                  </filter>
                  <filter id="neonHandGlow">
                    <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="rgba(168, 85, 247, 0.8)" />
                  </filter>
                </defs>
                
                {/* Enhanced Hour Markers with Differentiation */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i * 30) - 90;
                  const isQuarterHour = i % 3 === 0;
                  
                  if (isQuarterHour) {
                    // Quarter hour markers (12, 3, 6, 9) - Bold and prominent
                    const outerRadius = 170;
                    const innerRadius = 125;
                    
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
                        stroke="rgba(31, 41, 55, 0.9)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        style={{
                          filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))'
                        }}
                      />
                    );
                  } else {
                    // Regular hour markers - Refined
                    const outerRadius = 167;
                    const innerRadius = 145;
                    
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
                        stroke="rgba(55, 65, 81, 0.7)"
                        strokeWidth="3"
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
                

                
                {/* Date Display - Enhanced SF Pro styling */}
                <text 
                  x="180" 
                  y="245" 
                  textAnchor="middle" 
                  className="fill-gray-700 text-sm font-medium" 
                  style={{ 
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", Roboto, sans-serif',
                    letterSpacing: '1px',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                </text>
                
                {/* Hour Hand - Thicker with enhanced shadow */}
                <motion.line
                  x1="180"
                  y1="180"
                  x2={180 + 75 * Math.cos((getHourAngle() * Math.PI) / 180)}
                  y2={180 + 75 * Math.sin((getHourAngle() * Math.PI) / 180)}
                  stroke="rgba(31, 41, 55, 0.9)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  filter="url(#handShadow)"
                  animate={{
                    x2: 180 + 75 * Math.cos((getHourAngle() * Math.PI) / 180),
                    y2: 180 + 75 * Math.sin((getHourAngle() * Math.PI) / 180)
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                
                {/* Minute Hand - Thicker with enhanced shadow */}
                <motion.line
                  x1="180"
                  y1="180"
                  x2={180 + 115 * Math.cos((getMinuteAngle() * Math.PI) / 180)}
                  y2={180 + 115 * Math.sin((getMinuteAngle() * Math.PI) / 180)}
                  stroke="rgba(55, 65, 81, 0.8)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  filter="url(#handShadow)"
                  animate={{
                    x2: 180 + 115 * Math.cos((getMinuteAngle() * Math.PI) / 180),
                    y2: 180 + 115 * Math.sin((getMinuteAngle() * Math.PI) / 180)
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
                
                {/* Second Hand - Enhanced neon glow */}
                <motion.line
                  x1="180"
                  y1="180"
                  x2={180 + 135 * Math.cos((getSecondAngle() * Math.PI) / 180)}
                  y2={180 + 135 * Math.sin((getSecondAngle() * Math.PI) / 180)}
                  stroke="#a855f7"
                  strokeWidth="3"
                  strokeLinecap="round"
                  filter="url(#neonHandGlow)"
                  animate={{
                    x2: 180 + 135 * Math.cos((getSecondAngle() * Math.PI) / 180),
                    y2: 180 + 135 * Math.sin((getSecondAngle() * Math.PI) / 180)
                  }}
                  transition={{ 
                    duration: isRunning && !isPaused ? 0.05 : 0.5,
                    ease: "linear"
                  }}
                />
                
                {/* Center Hub - Enhanced futuristic design */}
                <circle 
                  cx="180" 
                  cy="180" 
                  r="12" 
                  fill="url(#centerGradient)"
                  style={{
                    filter: 'drop-shadow(0 3px 6px rgba(0, 0, 0, 0.3))'
                  }}
                />
                <circle 
                  cx="180" 
                  cy="180" 
                  r="6" 
                  fill="rgba(255, 255, 255, 0.95)"
                />
                <circle 
                  cx="180" 
                  cy="180" 
                  r="3" 
                  fill="rgba(168, 85, 247, 0.8)"
                />
                
                {/* Additional gradient for center */}
                <defs>
                  <radialGradient id="centerGradient">
                    <stop offset="0%" stopColor="rgba(168, 85, 247, 0.9)" />
                    <stop offset="70%" stopColor="rgba(147, 51, 234, 0.8)" />
                    <stop offset="100%" stopColor="rgba(126, 34, 206, 0.7)" />
                  </radialGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        {/* Digital Time Display - Futuristic Typography */}
        <motion.div 
          className="text-center mb-10 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div 
            className="text-6xl font-light text-gray-900 tracking-tight"
            style={{ 
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Satoshi", "Segoe UI", Roboto, sans-serif',
              fontFeatureSettings: '"tnum"',
              textShadow: '0 4px 8px rgba(0, 0, 0, 0.1), 0 0 20px rgba(168, 85, 247, 0.1)',
              background: 'linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
            animate={{
              scale: isRunning && !isPaused ? [1, 1.015, 1] : 1,
              textShadow: isRunning && !isPaused ? [
                '0 4px 8px rgba(0, 0, 0, 0.1), 0 0 20px rgba(168, 85, 247, 0.1)',
                '0 4px 8px rgba(0, 0, 0, 0.1), 0 0 25px rgba(168, 85, 247, 0.2)',
                '0 4px 8px rgba(0, 0, 0, 0.1), 0 0 20px rgba(168, 85, 247, 0.1)'
              ] : '0 4px 8px rgba(0, 0, 0, 0.1), 0 0 20px rgba(168, 85, 247, 0.1)'
            }}
            transition={{
              duration: 2,
              repeat: isRunning && !isPaused ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            {formatTime(time)}
          </motion.div>
        </motion.div>

        {/* Enhanced Controls */}
        <motion.div 
          className="flex justify-center gap-6 relative z-10 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {!isRunning ? (
            <motion.button
              onClick={onStart}
              disabled={!selectedProject || !selectedSubproject}
              className="h-14 px-10 text-base rounded-3xl backdrop-blur-lg font-semibold flex items-center gap-3 transition-all duration-300"
              style={{ 
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", Roboto, sans-serif',
                background: selectedProject && selectedSubproject 
                  ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.9) 0%, rgba(147, 51, 234, 0.9) 100%)'
                  : 'linear-gradient(135deg, rgba(156, 163, 175, 0.8) 0%, rgba(107, 114, 128, 0.8) 100%)',
                boxShadow: selectedProject && selectedSubproject 
                  ? '0 8px 16px rgba(168, 85, 247, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                  : '0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                cursor: selectedProject && selectedSubproject ? 'pointer' : 'not-allowed'
              }}
              whileHover={{ 
                scale: selectedProject && selectedSubproject ? 1.03 : 1,
                boxShadow: selectedProject && selectedSubproject 
                  ? '0 12px 24px rgba(168, 85, 247, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                  : '0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
              whileTap={{ scale: selectedProject && selectedSubproject ? 0.97 : 1 }}
            >
              <Play className="w-5 h-5" />
              Start Timer
            </motion.button>
          ) : (
            <>
              {!isPaused ? (
                <motion.button
                  onClick={onPause}
                  className="h-14 px-8 text-base rounded-3xl backdrop-blur-lg text-white font-semibold flex items-center gap-3 transition-all duration-300"
                  style={{ 
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", Roboto, sans-serif',
                    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.9) 0%, rgba(147, 51, 234, 0.9) 100%)',
                    boxShadow: '0 8px 16px rgba(168, 85, 247, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: '0 12px 24px rgba(168, 85, 247, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Pause className="w-5 h-5" />
                  Pause
                </motion.button>
              ) : (
                <motion.button
                  onClick={onResume}
                  className="h-14 px-8 text-base rounded-3xl backdrop-blur-lg text-white font-semibold flex items-center gap-3 transition-all duration-300"
                  style={{ 
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", Roboto, sans-serif',
                    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.9) 0%, rgba(147, 51, 234, 0.9) 100%)',
                    boxShadow: '0 8px 16px rgba(168, 85, 247, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: '0 12px 24px rgba(168, 85, 247, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Play className="w-5 h-5" />
                  Resume
                </motion.button>
              )}
              
              <motion.button
                onClick={onStop}
                className="h-14 px-8 text-base rounded-3xl backdrop-blur-lg font-semibold flex items-center gap-3 transition-all duration-300"
                style={{ 
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", Roboto, sans-serif',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  color: '#374151'
                }}
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                }}
                whileTap={{ scale: 0.97 }}
              >
                <Square className="w-5 h-5" />
                Stop
              </motion.button>
            </>
          )}
        </motion.div>

      </div>
    </div>
  );
};

export default Stopwatch;