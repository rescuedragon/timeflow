import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import './project-selector/AppleSearchBar.css';
import './project-selector/no-highlight.css';
import './project-selector/enhanced-styles.css';

interface Project {
  id: string;
  name: string;
  subprojects: string[];
  category: 'Development' | 'Design' | 'Research';
}

interface QuickStartItem {
  id: string;
  projectId: string;
  projectName: string;
  subproject: string;
  category: 'Development' | 'Design' | 'Research';
  frequency: number;
  lastUsed: string;
}

interface ProjectSelectorProps {
  selectedProject: Project | null;
  selectedSubproject: string;
  onProjectSelect: (project: Project) => void;
  onSubprojectSelect: (subproject: string) => void;
  onQuickStart: (quickStartItem: QuickStartItem) => void;
  projects: Project[];
  frequentlyUsedProjects: Project[];
  quickStartCombinations: QuickStartItem[];
  projectFrequency: Record<string, number>;
  subprojectFrequency: Record<string, Record<string, number>>;
  isTimerRunning?: boolean; // New prop to indicate if timer is running
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  selectedProject,
  selectedSubproject,
  onProjectSelect,
  onSubprojectSelect,
  onQuickStart,
  projects,
  frequentlyUsedProjects,
  quickStartCombinations,
  projectFrequency,
  subprojectFrequency,
  isTimerRunning = false // Default to false if not provided
}) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'frequent'>('frequent');
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  // Dropdown states
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showSubprojectDropdown, setShowSubprojectDropdown] = useState(false);
  const [projectDropdownIndex, setProjectDropdownIndex] = useState<number>(-1);
  const [subprojectDropdownIndex, setSubprojectDropdownIndex] = useState<number>(-1);
  const [projectSearchQuery, setProjectSearchQuery] = useState('');
  const [subprojectSearchQuery, setSubprojectSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchIconAnimate, setSearchIconAnimate] = useState(false);

  // QuickStart states
  const [isQuickStartEditMode, setIsQuickStartEditMode] = useState(false);
  const [selectedQuickStartCombinations, setSelectedQuickStartCombinations] = useState<QuickStartItem[]>([]);
  const [tempQuickStartSelections, setTempQuickStartSelections] = useState<QuickStartItem[]>([]);

  // Refs
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Timer for auto-unselect - only if timer is not running
  useEffect(() => {
    let timer: NodeJS.Timeout;

    // Only auto-unselect if a project and subproject are selected but the timer isn't running
    // This is determined by checking if the parent component has passed a non-empty selectedProject and selectedSubproject
    // but the timer hasn't been started within 10 seconds
    if (selectedProject && selectedSubproject) {
      // Only auto-unselect if the timer is not running
      if (!isTimerRunning) {
        console.log('Starting auto-unselect timer because timer is not running');
        timer = setTimeout(() => {
          console.log('Auto-unselecting project and subproject after 10 seconds');
          onProjectSelect(null);
          onSubprojectSelect('');
        }, 10000);
      } else {
        console.log('Not starting auto-unselect timer because timer is running');
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [selectedProject, selectedSubproject, onProjectSelect, onSubprojectSelect, isTimerRunning]);

  // Handle click outside to remove focus
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowProjectDropdown(false);
        setShowSubprojectDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Search icon animation - only when timer is not running
  useEffect(() => {
    if (!isTimerRunning) {
      const animationInterval = setInterval(() => {
        setSearchIconAnimate(true);
        setTimeout(() => setSearchIconAnimate(false), 600); // Animation duration
      }, 10000); // Every 10 seconds

      return () => clearInterval(animationInterval);
    }
  }, [isTimerRunning]);

  // Filter projects based on search query
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(projectSearchQuery.toLowerCase())
  );

  // Get subprojects sorted by frequency when a project is selected
  const filteredSubprojects = selectedProject
    ? selectedProject.subprojects
      .filter(sub => sub.toLowerCase().includes(subprojectSearchQuery.toLowerCase()))
      .sort((a, b) => {
        const aFreq = subprojectFrequency[selectedProject.id]?.[a] || 0;
        const bFreq = subprojectFrequency[selectedProject.id]?.[b] || 0;
        return bFreq - aFreq;
      })
    : [];

  // QuickStart helper functions
  const handleQuickStartEdit = () => {
    setIsQuickStartEditMode(true);
    setTempQuickStartSelections([...selectedQuickStartCombinations]);
  };

  const handleQuickStartSave = () => {
    setSelectedQuickStartCombinations([...tempQuickStartSelections]);
    setIsQuickStartEditMode(false);
  };

  const handleQuickStartCancel = () => {
    setTempQuickStartSelections([...selectedQuickStartCombinations]);
    setIsQuickStartEditMode(false);
  };

  const addQuickStartCombination = (project: Project, subproject: string) => {
    if (tempQuickStartSelections.length >= 12) return;

    const newCombination: QuickStartItem = {
      id: `${project.id}-${subproject}`,
      projectId: project.id,
      projectName: project.name,
      subproject: subproject,
      category: project.category,
      frequency: 0,
      lastUsed: new Date().toISOString()
    };

    setTempQuickStartSelections(prev => [...prev, newCombination]);
  };

  const removeQuickStartCombination = (id: string) => {
    setTempQuickStartSelections(prev => prev.filter(item => item.id !== id));
  };

  const handleQuickStartItemClick = (item: QuickStartItem) => {
    if (isTimerRunning) {
      return; // Don't allow quick start when timer is running
    }
    onQuickStart(item);
  };

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
          if (isTimerRunning) {
            return; // Don't allow project selection when timer is running
          }
          onProjectSelect(project);
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
          if (isTimerRunning) {
            return; // Don't allow subproject selection when timer is running
          }
          onSubprojectSelect(subproject);
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

  // Determine placeholder based on state
  const placeholder = selectedProject
    ? "Select a task..."
    : activeTab === 'frequent'
      ? "Search and select project..."
      : "Search QuickStart templates...";

  return (
    <div className="w-1/2 backdrop-blur-2xl border border-white/30 shadow-lg rounded-2xl h-[612px] overflow-hidden project-selector-container" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      {/* Apple-Style Header Section */}
      <div
        className="border-b border-white/40 p-6 relative z-50"
        style={{
          background: '#faf9fe'
        }}
      >
        <div className="flex items-center gap-5">
          {/* New Apple-Style Search Bar */}
          <div
            ref={searchContainerRef}
            className={`w-full flex items-center bg-white rounded-2xl border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.08)] search-container ${isSearchFocused ? 'focused' : ''} ${isDropdownOpen ? 'dropdown-open' : ''}`}
            style={{
              transition: 'box-shadow 0.2s ease',
              WebkitTapHighlightColor: 'transparent',
              outline: 'none'
            }}
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.focus();
              }
              // Deselect project and subproject when clicking inside search
              if (selectedProject || selectedSubproject) {
                if (isTimerRunning) {
                  return; // Don't allow deselection when timer is running
                }
                onProjectSelect(null);
                onSubprojectSelect('');
                setProjectSearchQuery('');
                setSubprojectSearchQuery('');
              }
            }}
          >
            <div className={`px-4 py-3 flex items-center w-full ${isDropdownOpen ? 'pt-8 pb-6' : ''}`}>
              <Search className={`w-5 h-5 text-gray-400 flex-shrink-0 ${searchIconAnimate ? 'search-icon-animate' : ''}`} />
              {isDropdownOpen && (
                <button
                  className="close-button"
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '32px',
                    height: '32px',
                    background: 'rgba(0, 0, 0, 0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10001
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDropdownOpen(false);
                    setIsSearchFocused(false);
                    if (inputRef.current) {
                      inputRef.current.blur();
                    }
                  }}
                >
                  <span style={{ fontSize: '24px', fontWeight: 300 }}>×</span>
                </button>
              )}
              <input
                ref={inputRef}
                type="text"
                className="flex-1 border-none outline-none text-gray-700 placeholder-gray-400 text-base mx-2 bg-transparent focus:ring-0 focus:ring-offset-0"
                placeholder={placeholder}
                value={selectedProject ? subprojectSearchQuery : projectSearchQuery}
                style={{
                  WebkitTapHighlightColor: 'transparent',
                  outline: 'none',
                  boxShadow: 'none'
                }}
                onChange={(e) => {
                  if (!selectedProject) {
                    setProjectSearchQuery(e.target.value);
                    setShowProjectDropdown(true);
                    setIsDropdownOpen(true);
                    setIsSearchFocused(true);
                    setProjectDropdownIndex(-1);
                  } else {
                    setSubprojectSearchQuery(e.target.value);
                    setShowSubprojectDropdown(true);
                    setIsDropdownOpen(true);
                    setIsSearchFocused(true);
                    setSubprojectDropdownIndex(-1);
                  }
                }}
                onFocus={() => {
                  setIsSearchFocused(true);
                  setIsDropdownOpen(true);
                  // Deselect project and subproject when focusing on search
                  if (selectedProject || selectedSubproject) {
                    onProjectSelect(null);
                    onSubprojectSelect('');
                    setProjectSearchQuery('');
                    setSubprojectSearchQuery('');
                  }
                  // Show project dropdown when focusing
                  setShowProjectDropdown(true);
                  setProjectDropdownIndex(-1);
                }}
                onBlur={() => {
                  setTimeout(() => {
                    // Keep dropdowns visible for a moment to allow clicking
                    setIsSearchFocused(false);
                    setIsDropdownOpen(false);
                    setShowProjectDropdown(false);
                    setShowSubprojectDropdown(false);
                  }, 200);
                }}
                onKeyDown={!selectedProject ? handleProjectKeyDown : handleSubprojectKeyDown}
                autoComplete="off"
                disabled={isTimerRunning}
              />
              <div className="flex items-center ml-3 pl-3 border-l border-gray-200"
                style={{ transition: 'opacity 0.2s ease, visibility 0.2s ease' }}>
                <button
                  className={`px-4 py-2 text-sm font-semibold transition-all duration-200 relative tab-button ${activeTab === 'frequent' ? 'text-purple-600' : 'text-gray-500 hover:text-purple-500'
                    }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('frequent');
                  }}
                >
                  Frequently Used
                  {activeTab === 'frequent' && (
                    <span className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-purple-400 to-purple-600 rounded-t-full tab-indicator" />
                  )}
                </button>
                <button
                  className={`px-4 py-2 text-sm font-semibold transition-all duration-200 relative ml-2 tab-button ${activeTab === 'quick' ? 'text-purple-600' : 'text-gray-500 hover:text-purple-500'
                    }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('quick');
                  }}
                >
                  QuickStart
                  {activeTab === 'quick' && (
                    <span className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-purple-400 to-purple-600 rounded-t-full tab-indicator" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Standard Project Dropdown */}
          {!selectedProject && showProjectDropdown && (
            <div className={`absolute top-full left-6 right-6 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 z-50 unified-dropdown ${isDropdownOpen ? 'dropdown-fullscreen' : ''}`}>
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto py-2">
                {filteredProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-50 dropdown-item ${index === projectDropdownIndex ? 'bg-gray-50 selected' : ''
                      }`}
                    onClick={() => {
                      onProjectSelect(project);
                      setProjectSearchQuery(project.name);
                      setShowProjectDropdown(false);
                      setIsDropdownOpen(false);
                      setIsSearchFocused(false);
                      setProjectDropdownIndex(-1);
                    }}
                  >
                    <div className="text-sm font-medium text-slate-800">{project.name}</div>
                  </div>
                ))}
                {filteredProjects.length === 0 && (
                  <div className="px-4 py-6 text-center">
                    <div className="text-sm text-slate-500">No projects found</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Subproject Dropdown */}
          {selectedProject && !selectedSubproject && showSubprojectDropdown && (
            <div className={`absolute top-full left-6 right-6 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 z-50 unified-dropdown ${isDropdownOpen ? 'dropdown-fullscreen' : ''}`}>
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto py-2">
                {filteredSubprojects.map((subproject, index) => {
                  return (
                    <div
                      key={index}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-50 dropdown-item ${index === subprojectDropdownIndex ? 'bg-gray-50 selected' : ''
                        }`}
                      onClick={() => {
                        onSubprojectSelect(subproject);
                        setSubprojectSearchQuery(subproject);
                        setShowSubprojectDropdown(false);
                        setIsDropdownOpen(false);
                        setIsSearchFocused(false);
                        setSubprojectDropdownIndex(-1);
                      }}
                    >
                      <div className="text-sm font-medium text-slate-800">{subproject}</div>
                    </div>
                  );
                })}
                {filteredSubprojects.length === 0 && (
                  <div className="px-4 py-6 text-center">
                    <div className="text-sm text-slate-500">No tasks found</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Premium Content Section */}
      <div className="h-full flex flex-col">


        {selectedSubproject && (
          <div className="flex-1 bg-white/90 rounded-2xl shadow-sm overflow-hidden mb-6">
            <div className="h-full flex items-center justify-center p-8">
              <div className="text-center max-w-md transform -translate-y-16">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <div className="bg-gradient-to-br from-purple-400 to-purple-600 w-10 h-10 rounded-xl flex items-center justify-center shadow">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-4 mb-6">
                  <p className="text-lg text-slate-600">
                    You have selected <span className="font-semibold text-purple-600">{selectedSubproject}</span>
                  </p>
                  <p className="text-base text-slate-500">
                    from <span className="font-medium text-slate-700">{selectedProject?.name}</span>
                  </p>
                </div>
                {!isTimerRunning && (
                  <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-50 to-white border border-purple-200/40 rounded-full">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-sm font-medium text-purple-700">Ready to Start</span>
                  </div>
                )}
                {!isTimerRunning && (
                  <div className="mt-8 flex items-center justify-center gap-6">
                    <button
                      onClick={() => {
                        onSubprojectSelect('');
                        setSubprojectSearchQuery('');
                      }}
                      className="flex items-center px-4 py-2 text-sm text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                    >
                      <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
                      Back
                    </button>
                    <div className="w-px h-6 bg-slate-200"></div>
                    <button
                      onClick={() => {
                        if (isTimerRunning) {
                          return; // Don't allow deselection when timer is running
                        }
                        onProjectSelect(null);
                        onSubprojectSelect('');
                        setProjectSearchQuery('');
                        setSubprojectSearchQuery('');
                      }}
                      className="flex items-center px-4 py-2 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Show Frequently Used Projects when no project is selected and activeTab is 'frequent' */}
        {!selectedProject && activeTab === 'frequent' && (
          <div className="flex-1 bg-white/90 rounded-2xl shadow-sm overflow-hidden mb-6">
            <div className="h-full overflow-y-auto">
              {frequentlyUsedProjects.length > 0 ? (
                <div className="grid grid-cols-2 grid-rows-3 gap-3 p-3 h-full">
                  {frequentlyUsedProjects.slice(0, 6).map((project) => (
                    <div
                      key={project.id}
                      className="group relative"
                    >
                      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 square-card aspect-square flex flex-col">
                        <button
                          className="w-full h-full p-4 text-center transition-all duration-200 flex flex-col items-center justify-center relative overflow-hidden rounded-xl"
                          onClick={() => {
                            if (isTimerRunning) {
                              return; // Don't allow project selection when timer is running
                            }
                            onProjectSelect(project);
                            setProjectSearchQuery(project.name);
                          }}
                        >
                          {/* Project Name */}
                          <div className="project-name text-center px-4">
                            {project.name}
                          </div>
                        </button>


                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-slate-400 py-20">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                    <Search className="w-6 h-6 text-purple-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-2 text-slate-600">No frequently used projects</h3>
                  <p className="text-sm text-slate-500">Start using projects to see them here</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* QuickStart section */}
        {!selectedProject && activeTab === 'quick' && (
          <div className="flex-1 bg-white/90 rounded-2xl shadow-sm overflow-hidden mb-6 relative">
            {/* Edit button - positioned at bottom right */}
            {!isQuickStartEditMode && (
              <button
                onClick={handleQuickStartEdit}
                title="Edit QuickStart combinations"
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  right: '16px',
                  width: '48px',
                  height: '48px',
                  background: '#7e22ce',
                  border: '2px solid #7e22ce',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 100000,
                  boxShadow: '0 4px 12px rgba(126, 34, 206, 0.3)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#9333ea';
                  e.currentTarget.style.borderColor = '#9333ea';
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(126, 34, 206, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#7e22ce';
                  e.currentTarget.style.borderColor = '#7e22ce';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(126, 34, 206, 0.3)';
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'white' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}

            {isQuickStartEditMode ? (
              // Edit mode - show project and subproject selection
              <div className="h-full overflow-y-auto p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-800">Select QuickStart Combinations</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handleQuickStartCancel}
                      className="px-3 py-1 text-sm text-slate-600 hover:text-slate-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleQuickStartSave}
                      className="px-4 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-slate-600 mb-2">
                    Selected: {tempQuickStartSelections.length}/12
                  </p>
                  {tempQuickStartSelections.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tempQuickStartSelections.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                        >
                          <span>{item.projectName} - {item.subproject}</span>
                          <button
                            onClick={() => removeQuickStartCombination(item.id)}
                            className="text-purple-500 hover:text-purple-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-slate-800 mb-2">{project.name}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {project.subprojects.map((subproject) => {
                          const isSelected = tempQuickStartSelections.some(
                            item => item.projectId === project.id && item.subproject === subproject
                          );
                          return (
                            <button
                              key={subproject}
                              onClick={() => {
                                if (isSelected) {
                                  removeQuickStartCombination(`${project.id}-${subproject}`);
                                } else {
                                  addQuickStartCombination(project, subproject);
                                }
                              }}
                              disabled={!isSelected && tempQuickStartSelections.length >= 12}
                              className={`p-2 text-sm rounded-lg border transition-all ${isSelected
                                ? 'bg-purple-600 text-white border-purple-600'
                                : 'bg-white text-slate-700 border-gray-300 hover:border-purple-300 hover:bg-purple-50'
                                } ${!isSelected && tempQuickStartSelections.length >= 12 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {subproject}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Display mode - show QuickStart buttons
              <div className="h-full overflow-y-auto pb-16">
                {selectedQuickStartCombinations.length > 0 ? (
                  <div className="quickstart-grid">
                    {selectedQuickStartCombinations.map((item) => (
                      <div
                        key={item.id}
                        className="quickstart-grid-item group relative"
                      >
                        <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 square-card">
                          <button
                            className="quickstart-button w-full h-full"
                            onClick={() => handleQuickStartItemClick(item)}
                          >
                            {/* Project Name */}
                            <div className="project-name">
                              {item.projectName}
                            </div>
                            {/* Subproject Name */}
                            <div className="subproject-name">
                              {item.subproject}
                            </div>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-slate-400 py-20">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-slate-600">QuickStart</h3>
                    <p className="text-sm text-slate-500">No QuickStart combinations set</p>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* Show subprojects list when a project is selected but no subproject */}
        {selectedProject && !selectedSubproject && (
          <div className="flex-1 bg-white/90 rounded-2xl shadow-sm overflow-hidden mb-6">
            <div className="h-full overflow-y-auto p-4">
              <div className="mb-4">
                <button
                  onClick={() => {
                    if (isTimerRunning) {
                      return; // Don't allow deselection when timer is running
                    }
                    onProjectSelect(null);
                    setProjectSearchQuery('');
                  }}
                  className="flex items-center text-sm text-purple-600 hover:text-purple-700 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
                  Back to Projects
                </button>
              </div>
              <div className="space-y-2">
                {filteredSubprojects.map((subproject, index) => (
                  <button
                    key={index}
                    className="w-full p-4 text-left bg-white rounded-xl shadow-sm hover:shadow-md hover:bg-purple-50 transition-all duration-200 border border-gray-100 hover:border-purple-200"
                    onClick={() => {
                      if (isTimerRunning) {
                        return; // Don't allow subproject selection when timer is running
                      }
                      onSubprojectSelect(subproject);
                      setSubprojectSearchQuery(subproject);
                    }}
                  >
                    <div className="text-base font-medium text-slate-800">{subproject}</div>
                  </button>
                ))}
                {filteredSubprojects.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-slate-500">No tasks found for this project</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSelector;