import React from 'react';
import { Play, Pause, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-1/2">
      <Card className="p-8 bg-white backdrop-blur-xl border-0 shadow-xl rounded-3xl h-[612px] flex flex-col justify-center items-center relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 opacity-80"></div>
        
        {/* Subtle Circle Decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border-[15px] border-purple-100/30"></div>
        
        {/* Timer Display Container */}
        <div className="text-center mb-12 relative z-10">
          {/* Timer Label */}
          <div className="text-sm uppercase tracking-widest text-slate-400 mb-2 font-medium">
            {!isRunning ? "Ready to start" : isPaused ? "Timer paused" : "Timer running"}
          </div>
          
          {/* Time Display */}
          <div className="stopwatch-time-display relative">
            <div className="text-8xl font-mono font-bold text-gray-800 tracking-wider">
              {formatTime(time)}
            </div>
            
            {/* Purple Accent Line */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-purple-600 rounded-full"></div>
            
            {/* Subtle Glow Effect */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-48 h-6 bg-purple-400/20 blur-xl rounded-full"></div>
          </div>
          
          {/* Status Indicator - Only visible when running */}
          {isRunning && (
            <div className="mt-6 flex items-center justify-center">
              <div className={`w-2 h-2 rounded-full ${isPaused ? "bg-amber-500" : "bg-purple-600 animate-pulse"} mr-2`}></div>
              <span className="text-sm text-slate-500 font-medium">
                {isPaused ? "Paused" : "Running"}
              </span>
            </div>
          )}
        </div>

        {/* Timer Controls */}
        <div className="flex justify-center gap-4 relative z-10">
          {!isRunning ? (
            <Button
              onClick={onStart}
              size="lg"
              className="h-14 px-12 text-lg rounded-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold font-system"
              disabled={!selectedProject || !selectedSubproject}
            >
              <Play className="w-6 h-6 mr-3" />
              Start
            </Button>
          ) : (
            <>
              {!isPaused ? (
                <Button
                  onClick={onPause}
                  size="lg"
                  className="h-14 px-10 text-lg rounded-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold font-system"
                >
                  <Pause className="w-6 h-6 mr-2" />
                  Pause
                </Button>
              ) : (
                <Button
                  onClick={onResume}
                  size="lg"
                  className="h-14 px-10 text-lg rounded-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold font-system"
                >
                  <Play className="w-6 h-6 mr-2" />
                  Resume
                </Button>
              )}
              
              <Button
                onClick={onStop}
                variant="outline"
                size="lg"
                className="h-14 px-8 text-lg rounded-full border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 font-semibold font-system transition-all duration-300"
              >
                <Square className="w-6 h-6 mr-2" />
                Stop
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Stopwatch; 