import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar, Edit3, Save, User, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimeLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (logData: TimeLogData) => void;
  projectName: string;
  subprojectName: string;
  startTime: Date;
  endTime: Date;
  totalSeconds: number;
}

interface TimeLogData {
  project: string;
  subproject: string;
  date: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  description: string;
}

const TimeLogModal: React.FC<TimeLogModalProps> = ({
  isOpen,
  onClose,
  onSave,
  projectName,
  subprojectName,
  startTime,
  endTime,
  totalSeconds
}) => {
  const [editableHours, setEditableHours] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [adjustedStartTime, setAdjustedStartTime] = useState<Date>(startTime);
  const [adjustedEndTime, setAdjustedEndTime] = useState<Date>(endTime);

  // Calculate decimal hours from seconds
  const getDecimalHours = (seconds: number) => {
    const minutes = seconds / 60;
    const decimalHours = minutes / 60;
    return parseFloat(decimalHours.toFixed(2));
  };

  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Initialize editable hours when modal opens
  useEffect(() => {
    if (isOpen) {
      setEditableHours(getDecimalHours(totalSeconds));
      setDescription('');
      setIsEditingTime(false);
      setAdjustedStartTime(startTime);
      setAdjustedEndTime(endTime);
    }
  }, [isOpen, totalSeconds, startTime, endTime]);

  // Adjust start time when hours change (keeping end time fixed)
  useEffect(() => {
    if (editableHours > 0) {
      const hoursInMs = editableHours * 60 * 60 * 1000;
      const newStartTime = new Date(endTime.getTime() - hoursInMs);
      setAdjustedStartTime(newStartTime);
    }
  }, [editableHours, endTime]);

  const handleSave = () => {
    const logData: TimeLogData = {
      project: projectName,
      subproject: subprojectName,
      date: formatDate(adjustedStartTime),
      startTime: formatTime(adjustedStartTime),
      endTime: formatTime(adjustedEndTime),
      totalHours: editableHours,
      description: description.trim()
    };
    
    onSave(logData);
    onClose();
  };

  const handleTimeEdit = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setEditableHours(numValue);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-8">
      <div 
        className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full flex flex-col"
        style={{
          maxWidth: '900px',
          height: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          animation: 'modalSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div className="relative px-8 py-6 border-b border-gray-100/50">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100/50 hover:bg-gray-200/50 transition-all duration-200 backdrop-blur-sm"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100/50 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Clock className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 tracking-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                Time Entry
              </h2>
              <p className="text-gray-500 text-sm font-medium mt-0.5">Review and save your session</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-6">
          {/* Row 1 - Project and Task Info */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-600 tracking-wide" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                Project
              </label>
              <div 
                className="p-5 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm"
                style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)' }}
              >
                <div className="font-semibold text-gray-900 text-lg tracking-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                  {projectName}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-600 tracking-wide" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                Task
              </label>
              <div 
                className="p-5 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm"
                style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)' }}
              >
                <div className="font-semibold text-gray-900 text-lg tracking-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                  {subprojectName}
                </div>
              </div>
            </div>
          </div>

          {/* Row 2 - Session Details and Time Charged */}
          <div className="grid grid-cols-3 gap-6 items-stretch">
            {/* Session Details */}
            <div className="col-span-2">
              <div 
                className="h-full p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm flex flex-col"
                style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)' }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-purple-100/50 rounded-xl flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 tracking-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                    Session Details
                  </h3>
                </div>
                
                <div className="grid grid-cols-3 gap-6 flex-1">
                  <div className="flex flex-col justify-center">
                    <div className="text-gray-500 font-medium mb-2 text-sm tracking-wide" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                      Date
                    </div>
                    <div className="text-gray-900 font-semibold text-base tracking-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                      {formatDate(adjustedStartTime)}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="text-gray-500 font-medium mb-2 text-sm tracking-wide" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                      Start Time
                    </div>
                    <div className="text-gray-900 font-semibold text-base tracking-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                      {formatTime(adjustedStartTime)}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="text-gray-500 font-medium mb-2 text-sm tracking-wide" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                      End Time
                    </div>
                    <div className="text-gray-900 font-semibold text-base tracking-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                      {formatTime(adjustedEndTime)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Charged */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 tracking-wide mb-3" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                Time Charged (Hours)
              </label>
              <div className="flex-1">
                {isEditingTime ? (
                  <div className="h-full flex flex-col gap-4">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editableHours}
                      onChange={(e) => handleTimeEdit(e.target.value)}
                      className="flex-1 p-5 text-3xl font-bold text-purple-600 bg-white/80 backdrop-blur-sm border border-purple-300/50 rounded-2xl focus:border-purple-400 focus:outline-none text-center transition-all duration-200 shadow-sm"
                      style={{ 
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", monospace',
                        WebkitTapHighlightColor: 'transparent',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)'
                      }}
                      autoFocus
                    />
                    <button
                      onClick={() => setIsEditingTime(false)}
                      className="py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-2xl transition-all duration-200 shadow-sm"
                      style={{ 
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                        WebkitTapHighlightColor: 'transparent'
                      }}
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <div 
                    className="h-full p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 cursor-pointer hover:border-purple-300/50 transition-all duration-200 text-center shadow-sm group flex flex-col justify-center"
                    onClick={() => setIsEditingTime(true)}
                    style={{ 
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
                      WebkitTapHighlightColor: 'transparent'
                    }}
                  >
                    <div className="text-4xl font-bold text-purple-600 mb-3 tracking-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", monospace' }}>
                      {editableHours.toFixed(2)}
                    </div>
                    <div className="text-gray-500 text-sm font-medium group-hover:text-purple-600 transition-colors duration-200 flex items-center justify-center gap-1" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                      <Edit3 className="w-3 h-3" />
                      Edit
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Row 3 - Description */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-600 tracking-wide" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add notes about what you worked on..."
              className="w-full p-5 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:border-purple-300 focus:outline-none resize-none text-gray-900 h-24 transition-all duration-200 shadow-sm placeholder:text-gray-400"
              style={{ 
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                WebkitTapHighlightColor: 'transparent',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)'
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-100/50 flex justify-end gap-3 backdrop-blur-sm">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-700 font-semibold rounded-2xl hover:bg-gray-100/50 transition-all duration-200"
            style={{ 
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-2xl transition-all duration-200 shadow-sm"
            style={{ 
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            Save Time Log
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default TimeLogModal;