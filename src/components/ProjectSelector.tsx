import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Search, Pin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { arrayMove } from '@dnd-kit/sortable';
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

interface PinnedSubproject {
  id: string;
  name: string;
  projectId: string;
  projectName: string;
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

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

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
  const [pinnedSubprojects, setPinnedSubprojects] = useState<PinnedSubproject[]>([]);

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

  // DND-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  // Refs
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle pinning/unpinning subprojects
  const handlePinToggle = (subprojectName: string, projectId: string, projectName: string) => {
    const id = `${projectId}-${subprojectName}`;
    setPinnedSubprojects(prev => {
      // Filter out any undefined items first
      const cleanPrev = prev.filter(item => item && item.id);
      
      if (cleanPrev.some(item => item.id === id)) {
        return cleanPrev.filter(item => item.id !== id);
      } else {
        return [...cleanPrev, { id, name: subprojectName, projectId: projectId, projectName: projectName }];
      }
    });
  };

  // Handle drag end for reordering pinned subprojects
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setPinnedSubprojects((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

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
      .filter(sub => sub.toLowerCase().includes(subprojectSearchQuery.toLowerCase()) &&
        !pinnedSubprojects.some(pinned => pinned && pinned.name === sub && pinned.projectId === selectedProject.id))
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
  const placeholder = "";

  return (
    <div className="w-1/2 backdrop-blur-2xl border border-white/30 shadow-lg rounded-2xl h-[612px] overflow-hidden project-selector-container" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      {/* Apple-Style Header Section */}
      <div
        className="border-b border-white/40 p-6 relative z-50"
        style={{
          background: '#faf9fe'
        }}
      >
        <div className="flex items-center justify-between w-full">
          {/* Reduced Width Search Bar */}
          <div
            ref={searchContainerRef}
            className={`flex-1 max-w-md flex items-center bg-white rounded-2xl border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.08)] search-container ${isSearchFocused ? 'focused' : ''} ${isDropdownOpen ? 'dropdown-open' : ''}`}
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
              <Search className={`w-5 h-5 flex-shrink-0 ${searchIconAnimate ? 'search-icon-animate' : ''}`} style={{ color: '#7e22ce' }} />
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
            </div>
          </div>

          {/* Tab Navigation with Equal Spacing */}
          <div className={`flex items-center gap-3 ml-4 transition-opacity duration-300 tabs-container ${isDropdownOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <button
              className={`px-5 py-2 text-sm font-semibold transition-all duration-200 relative tab-button ${activeTab === 'frequent' ? 'text-purple-600' : 'text-gray-500 hover:text-purple-500'
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
              className={`px-5 py-2 text-sm font-semibold transition-all duration-200 relative tab-button ${activeTab === 'quick' ? 'text-purple-600' : 'text-gray-500 hover:text-purple-500'
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
            <button
              className="edit-btn"
              onClick={(e) => {
                e.stopPropagation();
                // Add edit functionality here
                console.log('Edit button clicked');
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Standard Project Dropdown */}
          {!selectedProject && showProjectDropdown && (
            <div className={`absolute top-full left-6 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 z-50 unified-dropdown ${isDropdownOpen ? 'dropdown-fullscreen' : ''}`} style={{ width: 'calc(100% - 3rem)', maxWidth: '400px' }}>
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
            <div className={`absolute top-full left-6 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 z-50 unified-dropdown ${isDropdownOpen ? 'dropdown-fullscreen' : ''}`} style={{ width: 'calc(100% - 3rem)', maxWidth: '400px' }}>
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

              {/* Pinned Subprojects Section */}
              {pinnedSubprojects.filter(item => item && item.id).length > 0 && (
                <div className="mb-6 bg-gradient-to-r from-purple-50/80 to-indigo-50/60 rounded-xl border border-purple-200/40 shadow-sm">
                  <div className="flex items-center gap-2 p-4 pb-2">
                    <Pin className="w-4 h-4 text-purple-600 fill-current" />
                    <h4 className="text-sm font-bold text-purple-800 uppercase tracking-wide">Pinned</h4>
                  </div>
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={pinnedSubprojects.filter(item => item).map(item => item.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-3 subproject-list-container px-4 pb-4">
                        {pinnedSubprojects.filter(item => item).map((item) => (
                          <SortableItem key={item.id} id={item.id}>
                            <div className="w-full bg-white/90 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg hover:bg-white transition-all duration-300 border border-purple-200/50 group flex pinned-subproject-button" style={{ borderBottom: 'none !important', position: 'relative' }}>
                              {/* Main clickable area - 90% width */}
                              <button
                                className="flex-1 p-4 text-left"
                                style={{ 
                                  border: 'none', 
                                  borderBottom: 'none !important',
                                  position: 'relative'
                                }}
                                onMouseEnter={(e) => {
                                  const target = e.currentTarget;
                                  target.style.setProperty('border-bottom', 'none', 'important');
                                  target.style.setProperty('box-shadow', 'none', 'important');
                                }}
                                onMouseLeave={(e) => {
                                  const target = e.currentTarget;
                                  target.style.setProperty('border-bottom', 'none', 'important');
                                }}
                                onMouseDown={(e) => {
                                  if (isTimerRunning) {
                                    return; // Don't allow subproject selection when timer is running
                                  }
                                  e.preventDefault();
                                  e.stopPropagation();
                                  onProjectSelect(projects.find(p => p.id === item.projectId) || null);
                                  onSubprojectSelect(item.name);
                                  setSubprojectSearchQuery(item.name);
                                }}
                                onTouchStart={(e) => {
                                  if (isTimerRunning) {
                                    return; // Don't allow subproject selection when timer is running
                                  }
                                  e.preventDefault();
                                  e.stopPropagation();
                                  onProjectSelect(projects.find(p => p.id === item.projectId) || null);
                                  onSubprojectSelect(item.name);
                                  setSubprojectSearchQuery(item.name);
                                }}
                                style={{ pointerEvents: 'auto' }}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                  <div className="text-base font-medium text-slate-800 group-hover:text-purple-800 transition-colors">{item.name}</div>
                                </div>
                              </button>
                              
                              {/* Right side with pin button and drag handle */}
                              <div className="flex items-center pr-3">
                                <button
                                  onMouseDown={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    handlePinToggle(item.name, item.projectId, item.projectName);
                                  }}
                                  onTouchStart={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    handlePinToggle(item.name, item.projectId, item.projectName);
                                  }}
                                  className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded-lg transition-all duration-200"
                                  title="Unpin this item"
                                  style={{ pointerEvents: 'auto' }}
                                >
                                  <Pin className="w-5 h-5 fill-current" />
                                </button>
                                
                                {/* Drag handle area */}
                                <div 
                                  className="w-6 h-full flex items-center justify-center cursor-move opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-1"
                                  title="Drag to reorder"
                                >
                                  <div className="flex flex-col gap-0.5">
                                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </SortableItem>
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              )}

              <div className="space-y-3 subproject-list-container">
                {filteredSubprojects.map((subproject, index) => {
                  const isPinned = pinnedSubprojects.some(item => item && item.name === subproject && item.projectId === selectedProject?.id);
                  return (
                    <button
                      key={index}
                      className="w-full p-4 text-left bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-300 border border-gray-200/60 subproject-item group"
                      style={{ borderBottom: 'none' }}
                      onClick={() => {
                        if (isTimerRunning) {
                          return; // Don't allow subproject selection when timer is running
                        }
                        onSubprojectSelect(subproject);
                        setSubprojectSearchQuery(subproject);
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-gray-400 rounded-full group-hover:bg-purple-400 transition-colors"></div>
                          <div className="text-base font-medium text-slate-800 group-hover:text-purple-800 transition-colors">{subproject}</div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (selectedProject) {
                              handlePinToggle(subproject, selectedProject.id, selectedProject.name);
                            }
                          }}
                          className={`ml-3 p-2 rounded-lg transition-all duration-200 ${isPinned ? 'text-purple-600 hover:text-purple-800 hover:bg-purple-100' : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'}`}
                          title={isPinned ? 'Unpin this item' : 'Pin this item'}
                        >
                          <Pin className={`w-5 h-5 ${isPinned ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </button>
                  );
                })}
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