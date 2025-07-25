import React from 'react';
import { Play, Square, Clock, Calendar, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PausedTimer {
  id: string;
  project: any;
  subproject: string;
  startTime: Date;
  pausedTime: Date;
  totalSeconds: number;
}

interface PausedTimersProps {
  pausedTimers: PausedTimer[];
  isTimerRunning: boolean;
  onResume: (timerId: string) => void;
  onStop: (timerId: string) => void;
  onDiscard: (timerId: string) => void;
  onTimeLogSave: (logData: any) => void;
}

const PausedTimers: React.FC<PausedTimersProps> = ({
  pausedTimers,
  isTimerRunning,
  onResume,
  onStop,
  onDiscard,
  onTimeLogSave
}) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatHours = (seconds: number) => {
    const hours = seconds / 3600;
    return hours.toFixed(2);
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  if (pausedTimers.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full mt-6"
      >
        <div className="max-w-7xl mx-auto px-8">
          {/* Paused Section Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full animate-ping opacity-75"></div>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 tracking-tight" style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", Roboto, sans-serif'
              }}>
                Paused Timers
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-200 via-gray-300 to-transparent"></div>
              <div className="text-sm text-gray-500 font-medium">
                {pausedTimers.length} timer{pausedTimers.length !== 1 ? 's' : ''} paused
              </div>
            </div>
          </motion.div>

          {/* Paused Timer Cards */}
          <div className="space-y-4">
            {pausedTimers.map((timer, index) => (
              <motion.div
                key={timer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative"
              >
                {/* Main Card Container */}
                <div 
                  className="relative overflow-hidden rounded-3xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08), 0 6px 20px rgba(0, 0, 0, 0.06), 0 3px 10px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                  }}
                >
                  {/* Premium Background Pattern */}
                  <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-400/3 via-transparent to-purple-600/2"></div>
                    <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-purple-200/10 to-transparent rounded-full blur-xl"></div>
                    <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-purple-300/10 to-transparent rounded-full blur-xl"></div>
                  </div>

                  <div className="relative p-4">
                    {/* Header Row */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="relative">
                            <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full animate-pulse"></div>
                            <div className="absolute inset-0 w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full animate-ping opacity-75"></div>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 tracking-tight" style={{
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", Roboto, sans-serif'
                          }}>
                            {timer.project?.name || 'Unknown Project'}
                          </h3>
                        </div>
                        <p className="text-gray-600 font-medium text-sm ml-5">
                          {timer.subproject}
                        </p>
                      </div>
                      
                      {/* Time Display */}
                      <div className="text-right">
                        <div className="text-xl font-light text-gray-900 tracking-tight mb-1" style={{
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", Roboto, sans-serif'
                        }}>
                          {formatTime(timer.totalSeconds)}
                        </div>
                        <div className="text-xs text-gray-500 font-medium bg-gray-50 px-2 py-0.5 rounded-full">
                          {formatHours(timer.totalSeconds)} hours
                        </div>
                      </div>
                    </div>

                    {/* Time Details Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 bg-gradient-to-br from-purple-50/50 to-purple-100/30 rounded-xl border border-purple-200/20">
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center shadow-sm">
                            <Calendar className="w-3 h-3 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Started</p>
                            <p className="text-sm font-semibold text-gray-900" style={{
                              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", Roboto, sans-serif'
                            }}>{formatDateTime(timer.startTime)}</p>
                            <p className="text-xs text-gray-500 font-medium">{formatDate(timer.startTime)}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 bg-gradient-to-br from-purple-50/50 to-purple-100/30 rounded-xl border border-purple-200/20">
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center shadow-sm">
                            <Clock className="w-3 h-3 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Paused</p>
                            <p className="text-sm font-semibold text-gray-900" style={{
                              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", Roboto, sans-serif'
                            }}>{formatDateTime(timer.pausedTime)}</p>
                            <p className="text-xs text-gray-500 font-medium">{formatDate(timer.pausedTime)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <motion.button
                        onClick={() => onResume(timer.id)}
                        disabled={isTimerRunning}
                        className={`flex-1 h-10 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                          isTimerRunning 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl'
                        }`}
                        style={{
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", Roboto, sans-serif'
                        }}
                        whileHover={!isTimerRunning ? { scale: 1.02 } : {}}
                        whileTap={!isTimerRunning ? { scale: 0.98 } : {}}
                      >
                        <Play className="w-4 h-4" />
                        Resume
                      </motion.button>
                      
                      <motion.button
                        onClick={() => onStop(timer.id)}
                        className="flex-1 h-10 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300"
                        style={{
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", Roboto, sans-serif',
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
                          border: '1px solid rgba(0, 0, 0, 0.08)',
                          color: '#374151',
                          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                        }}
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Square className="w-4 h-4" />
                        Stop & Log
                      </motion.button>

                      <motion.button
                        onClick={() => onDiscard(timer.id)}
                        className="h-10 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300"
                        style={{
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", Roboto, sans-serif',
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
                          border: '1px solid rgba(0, 0, 0, 0.08)',
                          color: '#6b7280',
                          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                        }}
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Discard
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PausedTimers;
