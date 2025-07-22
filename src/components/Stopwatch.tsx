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
      <Card className="p-8 bg-white/98 backdrop-blur-xl border border-white/30 shadow-xl rounded-3xl h-[612px] flex flex-col justify-center items-center relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 to-slate-50/90 z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border-[15px] border-purple-100/20 z-0"></div>
        
        {/* Timer Display */}
        <div className="text-center mb-12 relative z-10">
          <div className="text-sm uppercase tracking-widest text-slate-400 mb-4 font-medium">
            {!isRunning ? "Ready to start" : isPaused ? "Timer paused" : "Timer running"}
          </div>
          
          <div className="stopwatch-time-display relative">
            <div className="text-7xl font-mono font-bold text-gray-800 tracking-tight">
              {formatTime(time)}
            </div>
            
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"></div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-48 h-6 bg-purple-400/20 blur-xl rounded-full"></div>
          </div>
          
          {isRunning && (
            <div className="mt-8 flex items-center justify-center">
              <div className={`w-2.5 h-2.5 rounded-full ${isPaused ? "bg-amber-500" : "bg-purple-600 animate-pulse"} mr-2`}></div>
              <span className="text-sm text-slate-500 font-medium">
                {isPaused ? "Paused" : "Running"}
              </span>
            </div>
          )}
        </div>

        {/* Timer Controls */}
        <div className="flex justify-center gap-5 relative z-10">
          {!isRunning ? (
            <Button
              onClick={onStart}
              size="lg"
              className="h-14 px-12 text-lg rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold font-system flex items-center"
              disabled={!selectedProject || !selectedSubproject}
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1.5 mr-3">
                <Play className="w-5 h-5 text-white" />
              </div>
              Start
            </Button>
          ) : (
            <>
              {!isPaused ? (
                <Button
                  onClick={onPause}
                  size="lg"
                  className="h-14 px-10 text-lg rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold font-system flex items-center"
                >
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1.5 mr-2">
                    <Pause className="w-5 h-5 text-white" />
                  </div>
                  Pause
                </Button>
              ) : (
                <Button
                  onClick={onResume}
                  size="lg"
                  className="h-14 px-10 text-lg rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold font-system flex items-center"
                >
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1.5 mr-2">
                    <Play className="w-5 h-5 text-white" />
                  </div>
                  Resume
                </Button>
              )}
              
              <Button
                onClick={onStop}
                variant="outline"
                size="lg"
                className="h-14 px-8 text-lg rounded-xl border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 font-semibold font-system transition-all duration-300 flex items-center"
              >
                <div className="bg-slate-100/60 backdrop-blur-sm rounded-lg p-1.5 mr-2">
                  <Square className="w-5 h-5 text-slate-600" />
                </div>
                Stop
              </Button>
            </>
          )}
        </div>

        {/* Selection Status */}
        <div className="absolute bottom-6 left-0 right-0 text-center">
          {selectedProject && selectedSubproject ? (
            <div className="inline-flex items-center bg-slate-100/60 backdrop-blur-sm rounded-full px-4 py-2 border border-slate-200/40 shadow-sm">
              <div className="text-slate-600 font-medium text-sm">
                {selectedProject.name} → <span className="text-purple-600">{selectedSubproject}</span>
              </div>
            </div>
          ) : (
            <div className="text-slate-400 text-sm font-medium">
              Select a project and task to start tracking
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Stopwatch;