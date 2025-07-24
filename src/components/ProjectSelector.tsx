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
  }, [selectedProject, selectedSubproject, onProjectSelect, onSubprojectSelect]);

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
    <div className="w-1/2 bg-white/98 backdrop-blur-2xl border border-white/30 shadow-lg rounded-2xl h-[612px] overflow-hidden" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      {/* Apple-Style Header Section */}
      <div className="bg-gradient-to-b from-white/95 to-white/85 backdrop-blur-xl border-b border-white/40 p-6 relative z-50">
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
            }}
          >
            <div className={`px-4 py-3 flex items-center w-full ${isDropdownOpen ? 'pt-8 pb-6' : ''}`}>
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
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
                    // Keep dropdowns visible for a moment to allow clicking
                    setIsSearchFocused(false);
                    setIsDropdownOpen(false);
                    setShowProjectDropdown(false);
                    setShowSubprojectDropdown(false);
                  }, 200);
                }}
                onKeyDown={!selectedProject ? handleProjectKeyDown : handleSubprojectKeyDown}
                autoComplete="off"
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
        {/* Show selection summary when a project is selected */}
        {selectedProject && (
          <div className="bg-gradient-to-br from-purple-50/60 via-white/80 to-blue-50/60 border border-purple-100/30 rounded-2xl shadow-sm p-6 mt-6 mb-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-slate-700 tracking-tight">Selected Project</h3>
              <Badge variant="outline" className="bg-purple-100/60 text-purple-700 border-purple-200/40 px-3 py-1 rounded-full font-medium text-xs">
                {selectedProject.category}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="text-xl font-medium text-slate-800 leading-tight">{selectedProject.name}</div>
              <div className="text-sm text-slate-500 font-normal">
                {selectedProject.subprojects.length} available tasks
              </div>
            </div>
          </div>
        )}

        {selectedSubproject && (
          <div className="bg-gradient-to-br from-emerald-50/60 via-white/80 to-green-50/60 border border-emerald-100/30 rounded-2xl shadow-sm p-6 mt-4 mb-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-slate-700 tracking-tight">Selected Task</h3>
              <Badge variant="outline" className="bg-emerald-100/60 text-emerald-700 border-emerald-200/40 px-3 py-1 rounded-full font-medium text-xs">
                Ready to Start
              </Badge>
            </div>
            <div className="text-xl font-medium text-slate-800 leading-tight">{selectedSubproject}</div>
          </div>
        )}

        {/* Show Frequently Used Projects when no project is selected and activeTab is 'frequent' */}
        {!selectedProject && activeTab === 'frequent' && (
          <div className="flex-1 bg-white/90 rounded-2xl shadow-sm overflow-hidden mb-6">
            <div className="h-full overflow-y-auto p-3">
              {frequentlyUsedProjects.length > 0 ? (
                <div className="space-y-3 p-3">
                  {frequentlyUsedProjects.map((project) => (
                    <div
                      key={project.id}
                      className="group"
                    >
                      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-gray-200 category-card">
                        <button
                          className="w-full px-5 py-4 text-left transition-all duration-200 flex items-center justify-between"
                          onClick={() => {
                            const expandedProjectId = expandedProject === project.id ? null : project.id;
                            setExpandedProject(expandedProjectId);
                          }}
                        >
                          <div className="font-medium text-base text-slate-700 group-hover:text-purple-600 transition-colors duration-200">{project.name}</div>
                          <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${expandedProject === project.id ? 'rotate-90' : ''
                            }`} />
                        </button>

                        {/* Subprojects list - shown when expanded */}
                        <div className={`overflow-hidden transition-all duration-200 ${expandedProject === project.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                          }`}>
                          <div className="bg-slate-50/30 border-t border-slate-100/30 pt-2 pb-1 px-2">
                            {project.subprojects
                              .sort((a, b) => {
                                const aFreq = subprojectFrequency[project.id]?.[a] || 0;
                                const bFreq = subprojectFrequency[project.id]?.[b] || 0;
                                return bFreq - aFreq;
                              })
                              .map((subproject, idx) => (
                                <div key={idx} className="mb-2 mx-2">
                                  <button
                                    className="w-full px-4 py-3 pl-8 text-left bg-white rounded-md hover:bg-purple-50/70 active:bg-purple-100/50 transition-all duration-200 group/subtask flex justify-between items-center shadow-sm hover:shadow subproject-card"
                                    onClick={() => {
                                      onProjectSelect(project);
                                      onSubprojectSelect(subproject);
                                      setProjectSearchQuery(project.name);
                                      setSubprojectSearchQuery(subproject);
                                    }}
                                  >
                                    <div className="text-sm text-slate-600 group-hover/subtask:text-purple-600 font-normal transition-colors duration-200">{subproject}</div>
                                    <div className="text-xs text-slate-400">
                                      {subprojectFrequency[project.id]?.[subproject] || 0} uses
                                    </div>
                                  </button>
                                </div>
                              ))
                            }
                          </div>
                        </div>
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

        {/* Empty QuickStart section */}
        {!selectedProject && activeTab === 'quick' && (
          <div className="flex-1 bg-white/90 rounded-2xl shadow-sm overflow-hidden mb-6">
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-slate-400 py-20">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2 text-slate-600">QuickStart</h3>
                <p className="text-sm text-slate-500">This section is currently empty</p>
              </div>
            </div>
          </div>
        )}

        {/* Show instructions when a project is selected but no subproject */}
        {selectedProject && !selectedSubproject && (
          <div className="flex-1 bg-gradient-to-br from-slate-50/60 via-white/80 to-slate-100/60 border border-slate-200/30 rounded-2xl shadow-sm p-8 backdrop-blur-sm mb-6 flex items-center justify-center">
            <div className="text-center max-w-xs">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <div className="bg-gradient-to-br from-purple-400 to-purple-600 w-8 h-8 rounded-lg flex items-center justify-center shadow">
                  <ChevronRight className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-medium mb-3 text-slate-700 tracking-tight">Select a Task</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Choose a specific task from <span className="font-medium text-purple-600">{selectedProject.name}</span> to begin tracking time
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSelector;