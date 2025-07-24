import React, { useState, useEffect } from 'react';
import InfoBar from './InfoBar';
import ProjectSelector from './ProjectSelector';
import Stopwatch from './Stopwatch';

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
    
  // Show timer active state in InfoBar only when timer is actually running
  const isTimerActive = isRunning && selectedProject && selectedSubproject;
  
  // Debug effect to log when isTimerActive changes
  useEffect(() => {
    console.log('isTimerActive changed:', { 
      isTimerActive, 
      isRunning, 
      isPaused, 
      hasProject: !!selectedProject, 
      hasSubproject: !!selectedSubproject,
      time: time
    });
  }, [isTimerActive, isRunning, isPaused, selectedProject, selectedSubproject, time]);

  // Handle visibility change to prevent timer from being affected by tab switching
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isRunning && !isPaused && startTime) {
        // Recalculate time when tab becomes visible again
        const now = Date.now();
        const elapsed = Math.floor((now - startTime.getTime()) / 1000);
        console.log('Tab became visible, updating time:', elapsed);
        setTime(elapsed);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isRunning, isPaused, startTime]);

  // Handle quick start selection and auto-start timer
  const handleQuickStart = (quickStartItem: QuickStartItem) => {
    const project = projects.find(p => p.id === quickStartItem.projectId);
    if (project) {
      setSelectedProject(project);
      setSelectedSubproject(quickStartItem.subproject);
      
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
    if (isRunning && !isPaused && startTime) {
      console.log('Starting timer interval');
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime.getTime()) / 1000);
        console.log('Timer tick:', elapsed, 'seconds');
        setTime(elapsed);
      }, 1000);
    } else {
      console.log('Timer stopped or paused:', { isRunning, isPaused, hasStartTime: !!startTime });
    }
    return () => {
      if (interval) {
        console.log('Clearing timer interval');
        clearInterval(interval);
      }
    };
  }, [isRunning, isPaused, startTime]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    console.log('handleStart called');
    if (!selectedProject || !selectedSubproject) {
      alert('Please select a project and subproject first');
      return;
    }
    if (isRunning) {
      alert('A timer is already running. Please stop the current timer first.');
      return;
    }
    console.log('Starting timer');
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
    
    // Reset timer and deselect project and subproject
    setIsRunning(false);
    setIsPaused(false);
    setTime(0);
    setStartTime(null);
    setSelectedProject(null);
    setSelectedSubproject('');
    
    // Log state for debugging
    console.log('Timer stopped, new state:', { 
      isRunning: false, 
      isPaused: false, 
      time: 0,
      selectedProject: null,
      selectedSubproject: ''
    });
  };

  return (
    <div className="min-h-screen time-tracker-background">
      {/* InfoBar Component */}
      <InfoBar 
        isTimerActive={isTimerActive}
        selectedProject={selectedProject}
        selectedSubproject={selectedSubproject}
        time={time}
      />

      {/* Main Content - Same Width as Header */}
      <div className="w-full mt-8">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-8">
            {/* ProjectSelector Component */}
            <ProjectSelector
              selectedProject={selectedProject}
              selectedSubproject={selectedSubproject}
              onProjectSelect={setSelectedProject}
              onSubprojectSelect={setSelectedSubproject}
              onQuickStart={handleQuickStart}
              projects={projects}
              frequentlyUsedProjects={frequentlyUsedProjects}
              quickStartCombinations={quickStartCombinations}
              projectFrequency={projectFrequency}
              subprojectFrequency={subprojectFrequency}
            />

            {/* Stopwatch Component */}
            <Stopwatch
              time={time}
              isRunning={isRunning}
              isPaused={isPaused}
              selectedProject={selectedProject}
              selectedSubproject={selectedSubproject}
              onStart={handleStart}
              onPause={handlePause}
              onResume={handleResume}
              onStop={handleStop}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTracker;