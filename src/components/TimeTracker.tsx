import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, Square, Search, MapPin } from 'lucide-react';
import AnalogClock from './AnalogClock';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Project {
  id: string;
  name: string;
  subprojects: string[];
  category: 'Development' | 'Design' | 'Research';
}

interface TimeTrackerProps {
  onTimeLogged: (entry: any) => void;
}

const TimeTracker: React.FC<TimeTrackerProps> = ({ onTimeLogged }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedSubproject, setSelectedSubproject] = useState<string>('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'quick' | 'frequent'>('frequent');
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  
  // Dropdown states
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showSubprojectDropdown, setShowSubprojectDropdown] = useState(false);
  const [projectDropdownIndex, setProjectDropdownIndex] = useState<number>(-1);
  const [subprojectDropdownIndex, setSubprojectDropdownIndex] = useState<number>(-1);
  const [projectSearchQuery, setProjectSearchQuery] = useState('');
  const [subprojectSearchQuery, setSubprojectSearchQuery] = useState('');

  // Frequency tracking (simulate with static data for now)
  const [projectFrequency] = useState<Record<string, number>>({
    '1': 25, '3': 20, '7': 18, '2': 15, '5': 12, '9': 10, '4': 8, '6': 5
  });
  
  // Subproject frequency tracking (simulate with static data)
  const [subprojectFrequency] = useState<Record<string, Record<string, number>>>({
    '1': { 'Frontend Development': 42, 'Backend Development': 35, 'API Integration': 28, 'Database Design': 22, 'Performance Optimization': 18, 'Security Implementation': 15, 'Code Review': 12, 'Documentation': 10, 'Testing & Debugging': 8, 'Deployment': 7, 'Maintenance': 6, 'Feature Development': 5, 'Bug Fixes': 4, 'Architecture Planning': 3, 'Code Refactoring': 2 },
    '2': { 'Frontend Development': 30, 'Backend Development': 25, 'API Integration': 20, 'Testing & Debugging': 18, 'Feature Development': 15, 'Bug Fixes': 12, 'Deployment': 10, 'Documentation': 8, 'Code Review': 7, 'Security Implementation': 6, 'Performance Optimization': 5, 'Database Design': 4, 'Maintenance': 3, 'Architecture Planning': 2, 'Code Refactoring': 1 },
    '3': { 'User Interface Design': 38, 'User Experience Research': 32, 'Wireframing': 28, 'Prototyping': 25, 'Visual Design': 22, 'Brand Identity': 18, 'Icon Design': 15, 'Illustration': 12, 'Design System': 10, 'Usability Testing': 8, 'Interaction Design': 7, 'Responsive Design': 6, 'Accessibility Design': 5, 'Design Review': 4, 'Style Guide Creation': 3 },
    '4': { 'Analysis & Reporting': 20, 'Data Collection': 18, 'Market Research': 15, 'Trend Analysis': 12, 'User Research': 10, 'Competitive Analysis': 8, 'Survey Design': 7, 'Interview Conduct': 6, 'Feasibility Study': 5, 'Requirements Gathering': 4, 'Stakeholder Analysis': 3, 'Risk Assessment': 2, 'Technology Research': 1, 'Best Practices Study': 1, 'Innovation Research': 1 },
    '5': { 'Data Collection': 15, 'Analysis & Reporting': 12, 'Technology Research': 10, 'Market Research': 8, 'User Research': 7, 'Competitive Analysis': 6, 'Trend Analysis': 5, 'Survey Design': 4, 'Interview Conduct': 3, 'Feasibility Study': 2, 'Requirements Gathering': 1, 'Stakeholder Analysis': 1, 'Risk Assessment': 1, 'Best Practices Study': 1, 'Innovation Research': 1 },
    '6': { 'Architecture Planning': 10, 'Deployment': 8, 'Security Implementation': 7, 'Performance Optimization': 6, 'Maintenance': 5, 'Documentation': 4, 'Code Review': 3, 'Testing & Debugging': 2, 'Feature Development': 1, 'Bug Fixes': 1, 'API Integration': 1, 'Backend Development': 1, 'Frontend Development': 1, 'Database Design': 1, 'Code Refactoring': 1 },
    '7': { 'Deployment': 25, 'Architecture Planning': 20, 'Security Implementation': 18, 'Performance Optimization': 15, 'Documentation': 12, 'Testing & Debugging': 10, 'Code Review': 8, 'Maintenance': 7, 'Feature Development': 6, 'Bug Fixes': 5, 'API Integration': 4, 'Backend Development': 3, 'Frontend Development': 2, 'Database Design': 1, 'Code Refactoring': 1 },
    '9': { 'Requirements Gathering': 15, 'Stakeholder Analysis': 12, 'Risk Assessment': 10, 'Feasibility Study': 8, 'Market Research': 7, 'User Research': 6, 'Competitive Analysis': 5, 'Data Collection': 4, 'Survey Design': 3, 'Interview Conduct': 2, 'Analysis & Reporting': 1, 'Trend Analysis': 1, 'Technology Research': 1, 'Best Practices Study': 1, 'Innovation Research': 1 }
  });

  // Quick start combinations (project + subproject pairs)
  interface QuickStartItem {
    id: string;
    projectId: string;
    projectName: string;
    subproject: string;
    category: 'Development' | 'Design' | 'Research';
    frequency: number;
    lastUsed: string;
  }

  const [quickStartItems] = useState<QuickStartItem[]>([
    { id: '1', projectId: '1', projectName: 'Web Development', subproject: 'Frontend Development', category: 'Development', frequency: 45, lastUsed: '2 hours ago' },
    { id: '2', projectId: '3', projectName: 'UI/UX Design', subproject: 'User Interface Design', category: 'Design', frequency: 38, lastUsed: '4 hours ago' },
    { id: '3', projectId: '7', projectName: 'DevOps & Automation', subproject: 'Deployment', category: 'Development', frequency: 32, lastUsed: '1 day ago' },
    { id: '4', projectId: '2', projectName: 'Mobile App Development', subproject: 'Frontend Development', category: 'Development', frequency: 28, lastUsed: '1 day ago' },
    { id: '5', projectId: '5', projectName: 'Machine Learning', subproject: 'Data Collection', category: 'Research', frequency: 25, lastUsed: '2 days ago' },
    { id: '6', projectId: '9', projectName: 'Product Management', subproject: 'Requirements Gathering', category: 'Research', frequency: 22, lastUsed: '3 days ago' },
    { id: '7', projectId: '4', projectName: 'Data Analytics', subproject: 'Analysis & Reporting', category: 'Research', frequency: 18, lastUsed: '3 days ago' },
    { id: '8', projectId: '6', projectName: 'Cloud Infrastructure', subproject: 'Architecture Planning', category: 'Development', frequency: 15, lastUsed: '1 week ago' }
  ]);

  // Generate comprehensive project data
  const generateProjects = (): Project[] => {
    const projectNames = [
      'Web Development', 'Mobile App Development', 'UI/UX Design', 'Data Analytics',
      'Machine Learning', 'Cloud Infrastructure', 'DevOps & Automation', 'Quality Assurance',
      'Product Management', 'Digital Marketing', 'Content Creation', 'Research & Development',
      'Customer Support', 'Sales & Business', 'Financial Planning'
    ];

    const developmentSubprojects = [
      'Frontend Development', 'Backend Development', 'API Integration', 'Database Design',
      'Performance Optimization', 'Security Implementation', 'Code Review', 'Documentation',
      'Testing & Debugging', 'Deployment', 'Maintenance', 'Feature Development',
      'Bug Fixes', 'Architecture Planning', 'Code Refactoring'
    ];

    const designSubprojects = [
      'User Interface Design', 'User Experience Research', 'Wireframing', 'Prototyping',
      'Visual Design', 'Brand Identity', 'Icon Design', 'Illustration',
      'Design System', 'Usability Testing', 'Interaction Design', 'Responsive Design',
      'Accessibility Design', 'Design Review', 'Style Guide Creation'
    ];

    const researchSubprojects = [
      'Market Research', 'User Research', 'Competitive Analysis', 'Data Collection',
      'Survey Design', 'Interview Conduct', 'Analysis & Reporting', 'Trend Analysis',
      'Feasibility Study', 'Requirements Gathering', 'Stakeholder Analysis', 'Risk Assessment',
      'Technology Research', 'Best Practices Study', 'Innovation Research'
    ];

    const getSubprojectsForCategory = (category: 'Development' | 'Design' | 'Research') => {
      switch (category) {
        case 'Development': return developmentSubprojects;
        case 'Design': return designSubprojects;
        case 'Research': return researchSubprojects;
        default: return developmentSubprojects;
      }
    };

    const getCategoryForProject = (index: number): 'Development' | 'Design' | 'Research' => {
      if (index < 5) return 'Development';
      if (index < 10) return 'Design';
      return 'Research';
    };

    return projectNames.map((name, index) => ({
      id: (index + 1).toString(),
      name,
      subprojects: getSubprojectsForCategory(getCategoryForProject(index)),
      category: getCategoryForProject(index)
    }));
  };

  const projects: Project[] = generateProjects();

  // Get frequently used projects sorted by frequency (for display in the UI, not in dropdown)
  // Limit to top 6 most used projects
  const frequentlyUsedProjects = projects
    .filter(project => projectFrequency[project.id])
    .sort((a, b) => (projectFrequency[b.id] || 0) - (projectFrequency[a.id] || 0))
    .slice(0, 6);

  // Get quick start items sorted by frequency (for display in the UI, not in dropdown)
  const quickStartCombinations = quickStartItems
    .sort((a, b) => b.frequency - a.frequency);
    
  // For the dropdown, we'll use all projects
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(projectSearchQuery.toLowerCase())
  );

  // Get subprojects sorted by frequency when a project is selected
  const filteredSubprojects = selectedProject 
    ? selectedProject.subprojects
        .filter(sub => sub.toLowerCase().includes(subprojectSearchQuery.toLowerCase()))
        .sort((a, b) => {
          // Sort by frequency if available, otherwise keep original order
          const aFreq = subprojectFrequency[selectedProject.id]?.[a] || 0;
          const bFreq = subprojectFrequency[selectedProject.id]?.[b] || 0;
          return bFreq - aFreq;
        })
    : [];

  // Keyboard navigation handlers
  const handleProjectKeyDown = (e: React.KeyboardEvent) => {
    if (!showProjectDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setProjectDropdownIndex(prev => {
          const newIndex = prev < 0 ? 0 : prev + 1;
          return newIndex < filteredProjects.length ? newIndex : prev;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setProjectDropdownIndex(prev => {
          const newIndex = prev <= 0 ? 0 : prev - 1;
          return newIndex;
        });
        break;
      case 'Enter':
      case 'Tab':
        e.preventDefault();
        if (projectDropdownIndex >= 0 && filteredProjects[projectDropdownIndex]) {
          const project = filteredProjects[projectDropdownIndex];
          setSelectedProject(project);
          setProjectSearchQuery(project.name);
          setShowProjectDropdown(false);
          setProjectDropdownIndex(-1);
        }
        break;
      case 'Escape':
        setShowProjectDropdown(false);
        setProjectDropdownIndex(-1);
        break;
    }
  };

  const handleSubprojectKeyDown = (e: React.KeyboardEvent) => {
    if (!showSubprojectDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSubprojectDropdownIndex(prev => {
          const newIndex = prev < 0 ? 0 : prev + 1;
          return newIndex < filteredSubprojects.length ? newIndex : prev;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSubprojectDropdownIndex(prev => {
          const newIndex = prev <= 0 ? 0 : prev - 1;
          return newIndex;
        });
        break;
      case 'Enter':
      case 'Tab':
        e.preventDefault();
        if (subprojectDropdownIndex >= 0 && filteredSubprojects[subprojectDropdownIndex]) {
          const subproject = filteredSubprojects[subprojectDropdownIndex];
          setSelectedSubproject(subproject);
          setSubprojectSearchQuery(subproject);
          setShowSubprojectDropdown(false);
          setSubprojectDropdownIndex(-1);
        }
        break;
      case 'Escape':
        setShowSubprojectDropdown(false);
        setSubprojectDropdownIndex(-1);
        break;
    }
  };

  // Handle quick start selection and auto-start timer
  const handleQuickStart = (quickStartItem: QuickStartItem) => {
    const project = projects.find(p => p.id === quickStartItem.projectId);
    if (project) {
      setSelectedProject(project);
      setSelectedSubproject(quickStartItem.subproject);
      setProjectSearchQuery(project.name);
      setSubprojectSearchQuery(quickStartItem.subproject);
      setShowProjectDropdown(false);
      setShowSubprojectDropdown(false);
      
      // Auto-start timer
      if (!isRunning) {
        setIsRunning(true);
        setIsPaused(false);
        setStartTime(new Date());
      }
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (!selectedProject || !selectedSubproject) {
      alert('Please select a project and subproject first');
      return;
    }
    if (isRunning) {
      alert('A timer is already running. Please stop the current timer first.');
      return;
    }
    setIsRunning(true);
    setIsPaused(false);
    setStartTime(new Date());
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleStop = () => {
    if (!startTime) return;
    
    const endTime = new Date();
    const entry = {
      id: Date.now().toString(),
      date: startTime.toDateString(),
      startTime: startTime.toTimeString().slice(0, 8),
      endTime: endTime.toTimeString().slice(0, 8),
      totalTime: formatTime(time),
      project: selectedProject?.name,
      subproject: selectedSubproject,
      description: ''
    };

    onTimeLogged(entry);
    
    // Reset timer
    setIsRunning(false);
    setIsPaused(false);
    setTime(0);
    setStartTime(null);
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header with Date and World Clocks - Full Width */}
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-8">
          <div className="timezone-card">
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
          </div>
        </div>
      </div>

      {/* Main Content - Same Width as Header */}
      <div className="w-full mt-8">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-8">
            {/* Left Panel - Project Selection */}
            <div className="flex-1 bg-white/80 backdrop-blur-xl border-0 shadow-xl rounded-3xl min-h-[612px] overflow-hidden">
                {/* Integrated Top Bar with Search and Tabs */}
                <div>
                  {/* Search Bar */}
                  <div className="bg-slate-50/80 p-4 border-b border-slate-100">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        placeholder={
                          !selectedProject 
                            ? "Search and select project..." 
                            : selectedSubproject 
                              ? `${selectedProject.name} → ${selectedSubproject}` 
                              : `Search ${selectedProject.name} tasks...`
                        }
                        value={!selectedProject ? projectSearchQuery : subprojectSearchQuery}
                        onChange={(e) => {
                          if (!selectedProject) {
                            setProjectSearchQuery(e.target.value);
                            setShowProjectDropdown(true);
                            setProjectDropdownIndex(-1);
                          } else {
                            setSubprojectSearchQuery(e.target.value);
                            setShowSubprojectDropdown(true);
                            setSubprojectDropdownIndex(-1);
                          }
                        }}
                        onFocus={() => {
                          if (!selectedProject) {
                            setShowProjectDropdown(true);
                            setProjectDropdownIndex(-1);
                          } else {
                            setShowSubprojectDropdown(true);
                            setSubprojectDropdownIndex(-1);
                          }
                        }}
                        onBlur={() => {
                          setTimeout(() => {
                            setShowProjectDropdown(false);
                            setShowSubprojectDropdown(false);
                          }, 150);
                        }}
                        onKeyDown={!selectedProject ? handleProjectKeyDown : handleSubprojectKeyDown}
                        className={`pl-12 pr-12 h-12 bg-white border border-slate-200/50 rounded-xl text-base font-medium font-system transition-all duration-200 ${
                          (showProjectDropdown || showSubprojectDropdown) ? 'search-input-focused' : ''
                        } ${selectedSubproject ? 'text-purple-600 bg-purple-50/50' : ''}`}
                        readOnly={!!selectedSubproject}
                      />
                      
                      {/* Clear/Reset Button */}
                      {(selectedProject || selectedSubproject) && (
                        <button
                          onClick={() => {
                            if (selectedSubproject) {
                              setSelectedSubproject('');
                              setSubprojectSearchQuery('');
                            } else {
                              setSelectedProject(null);
                              setProjectSearchQuery('');
                            }
                            setShowProjectDropdown(false);
                            setShowSubprojectDropdown(false);
                          }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Tab Navigation */}
                  <div className="flex w-full">
                    <button
                      onClick={() => setActiveTab('frequent')}
                      className={`flex-1 py-4 text-center font-medium transition-all duration-300 ${
                        activeTab === 'frequent'
                          ? 'bg-white text-purple-600 border-b-2 border-purple-600'
                          : 'bg-slate-50/80 text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Frequently Used
                    </button>
                    <button
                      onClick={() => setActiveTab('quick')}
                      className={`flex-1 py-4 text-center font-medium transition-all duration-300 ${
                        activeTab === 'quick'
                          ? 'bg-white text-purple-600 border-b-2 border-purple-600'
                          : 'bg-slate-50/80 text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Quick Start
                    </button>
                  </div>
                    
                  {/* Standard Project Dropdown */}
                  {!selectedProject && (
                    <div className={`dropdown ${showProjectDropdown ? 'show' : ''}`}>
                      {projects.filter(project => 
                        project.name.toLowerCase().includes(projectSearchQuery.toLowerCase())
                      ).map((project, index) => (
                        <div
                          key={project.id}
                          className={`dropdown-item ${index === projectDropdownIndex ? 'highlighted' : ''}`}
                          onClick={() => {
                            setSelectedProject(project);
                            setProjectSearchQuery(project.name);
                            setShowProjectDropdown(false);
                            setProjectDropdownIndex(-1);
                            // Auto-focus on subproject search
                            setTimeout(() => {
                              setSubprojectSearchQuery('');
                              setShowSubprojectDropdown(true);
                            }, 100);
                          }}
                        >
                          <div className="project-item-content">
                            <div className="project-name">{project.name}</div>
                          </div>
                          <div className="project-count">{project.subprojects.length} tasks</div>
                        </div>
                      ))}
                      {projects.filter(project => 
                        project.name.toLowerCase().includes(projectSearchQuery.toLowerCase())
                      ).length === 0 && (
                        <div className="dropdown-item">
                          <div className="project-item-content">
                            <div className="project-name text-slate-500">No projects found</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Subproject Dropdown */}
                  {selectedProject && !selectedSubproject && (
                    <div className={`subproject-dropdown ${showSubprojectDropdown ? 'show' : ''}`}>
                      {filteredSubprojects.map((subproject, index) => {
                        // Get frequency count for this subproject
                        const frequency = subprojectFrequency[selectedProject.id]?.[subproject] || 0;
                        
                        return (
                          <div
                            key={index}
                            className={`dropdown-item ${index === subprojectDropdownIndex ? 'highlighted' : ''}`}
                            onClick={() => {
                              setSelectedSubproject(subproject);
                              setSubprojectSearchQuery(subproject);
                              setShowSubprojectDropdown(false);
                              setSubprojectDropdownIndex(-1);
                            }}
                          >
                            <div className="project-item-content">
                              <div className="project-name text-sm">{subproject}</div>
                            </div>
                            {frequency > 0 && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                                  {frequency} uses
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {filteredSubprojects.length === 0 && (
                        <div className="dropdown-item">
                          <div className="project-item-content">
                            <div className="project-name text-slate-500 text-sm">No tasks found</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Selection Summary or Frequently Used/Quick Start Sections */}
                <div className="tab-container">
                  {/* Show selection summary when a project is selected */}
                  {selectedProject && (
                    <div className="p-6 bg-gradient-to-r from-purple-50/80 to-blue-50/80 border-0 rounded-2xl shadow-lg mx-6 mt-6 mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-700 font-display">Selected Project</h3>
                        <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">
                          {selectedProject.category}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xl font-semibold text-slate-800">{selectedProject.name}</div>
                        <div className="text-sm text-slate-600">
                          {selectedProject.subprojects.length} available tasks
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedSubproject && (
                    <div className="p-6 bg-gradient-to-r from-green-50/80 to-emerald-50/80 border-0 rounded-2xl shadow-lg mx-6 mt-4 mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-700 font-display">Selected Task</h3>
                        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                          Ready to Start
                        </Badge>
                      </div>
                      <div className="text-lg font-semibold text-slate-800">{selectedSubproject}</div>
                    </div>
                  )}

                  {/* Show Frequently Used Projects when no project is selected and activeTab is 'frequent' */}
                  {!selectedProject && activeTab === 'frequent' && (
                    <div className="tab-panel active bg-white overflow-hidden">
                      <div className="h-[450px] overflow-y-auto">
                        {frequentlyUsedProjects.length > 0 ? (
                          <div className="project-list">
                            {frequentlyUsedProjects.map((project) => (
                              <div 
                                key={project.id}
                                className="project-item"
                              >
                                <button
                                  className="w-full p-6 text-left hover:bg-slate-50 transition-all duration-200 border-b border-slate-100"
                                  onClick={() => {
                                    // Toggle expansion of this project to show subprojects
                                    const expandedProjectId = expandedProject === project.id ? null : project.id;
                                    setExpandedProject(expandedProjectId);
                                  }}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="font-medium text-lg text-slate-800">{project.name}</div>
                                  </div>
                                </button>
                                
                                {/* Subprojects list - shown when expanded */}
                                <div className={`subprojects-container ${expandedProject === project.id ? 'project-expanded' : 'project-collapsed'}`}>
                                  {project.subprojects
                                    .sort((a, b) => {
                                      const aFreq = subprojectFrequency[project.id]?.[a] || 0;
                                      const bFreq = subprojectFrequency[project.id]?.[b] || 0;
                                      return bFreq - aFreq;
                                    })
                                    .map((subproject, idx) => (
                                      <button
                                        key={idx}
                                        className="w-full p-4 pl-10 text-left hover:bg-purple-50/30 transition-all duration-200 border-b border-slate-100 last:border-b-0"
                                        onClick={() => {
                                          setSelectedProject(project);
                                          setSelectedSubproject(subproject);
                                          setProjectSearchQuery(project.name);
                                          setSubprojectSearchQuery(subproject);
                                        }}
                                      >
                                        <div className="text-sm text-purple-600">{subproject}</div>
                                      </button>
                                    ))
                                  }
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-slate-500 py-8">
                            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-semibold mb-2">No frequently used projects</h3>
                            <p className="text-sm">Start using projects to see them here</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Show Quick Start Combinations when no project is selected and activeTab is 'quick' */}
                  {!selectedProject && activeTab === 'quick' && (
                    <div className="tab-panel active bg-white overflow-hidden">
                      <div className="h-[450px] overflow-y-auto">
                        {quickStartCombinations.length > 0 ? (
                          <div className="project-list">
                            {quickStartCombinations.map((item) => (
                              <div 
                                key={item.id}
                                className="project-item"
                              >
                                <button
                                  className="w-full p-6 text-left hover:bg-slate-50 transition-all duration-200 border-b border-slate-100"
                                  onClick={() => handleQuickStart(item)}
                                >
                                  <div className="font-medium text-lg text-slate-800">{item.projectName}</div>
                                  <div className="text-sm text-purple-600 font-medium mt-1">{item.subproject}</div>
                                  <div className="flex justify-end mt-2">
                                    <div className="text-xs text-slate-500">{item.lastUsed}</div>
                                  </div>
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-slate-500 py-8">
                            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-semibold mb-2">No quick start combinations</h3>
                            <p className="text-sm">Start tracking time to see combinations here</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Show instructions when a project is selected but no subproject */}
                  {selectedProject && !selectedSubproject && (
                    <div className="p-8 bg-slate-50/50 border-0 rounded-2xl mx-6 mt-4 mb-4">
                      <div className="text-center text-slate-500">
                        <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">Select a Task</h3>
                        <p className="text-sm">Choose a specific task from {selectedProject.name} to begin tracking time</p>
                      </div>
                    </div>
                  )}
                </div>
            </div>

            {/* Right Panel - Timer */}
            <div className="flex-1">
              <Card className="p-8 bg-white backdrop-blur-xl border-0 shadow-xl rounded-3xl min-h-[612px] flex flex-col justify-center items-center relative overflow-hidden">
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
                      onClick={handleStart}
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
                          onClick={handlePause}
                          size="lg"
                          className="h-14 px-10 text-lg rounded-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold font-system"
                        >
                          <Pause className="w-6 h-6 mr-2" />
                          Pause
                        </Button>
                      ) : (
                        <Button
                          onClick={handleResume}
                          size="lg"
                          className="h-14 px-10 text-lg rounded-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold font-system"
                        >
                          <Play className="w-6 h-6 mr-2" />
                          Resume
                        </Button>
                      )}
                      
                      <Button
                        onClick={handleStop}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTracker;