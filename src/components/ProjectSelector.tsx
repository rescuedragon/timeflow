import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import './project-selector/AppleSearchBar.css';

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
  subprojectFrequency
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

  // Refs
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Removed auto-unselect timer - project and subproject selection should persist

  // Clear search queries when project/subproject are deselected
  useEffect(() => {
    if (!selectedProject) {
      setProjectSearchQuery('');
      setSubprojectSearchQuery('');
    }
    if (!selectedSubproject) {
      setSubprojectSearchQuery('');
    }
  }, [selectedProject, selectedSubproject]);

  // Handle click outside to remove focus
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
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
            className={`w-full flex items-center bg-white border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.08)] ${isSearchFocused ? 'ring-2 ring-blue-500 border-blue-500' : ''
              } ${(showProjectDropdown || showSubprojectDropdown) ? 'rounded-t-2xl border-b-0' : 'rounded-2xl'}`}
            style={{ transition: 'box-shadow 0.2s ease, border-color 0.2s ease, border-radius 0.2s ease' }}
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.focus();
              }
            }}
          >
            <div className="px-4 py-3 flex items-center w-full">
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                className="flex-1 border-none outline-none text-gray-700 placeholder-gray-400 text-base mx-2 bg-transparent"
                placeholder={placeholder}
                value={selectedProject ? subprojectSearchQuery : projectSearchQuery}
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
                  setIsSearchFocused(true);
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
                    setIsSearchFocused(false);
                  }, 200);
                }}
                onKeyDown={!selectedProject ? handleProjectKeyDown : handleSubprojectKeyDown}
                autoComplete="off"
              />
              <div className={`flex items-center ml-3 pl-3 border-l border-gray-200 ${isSearchFocused ? 'opacity-0 invisible' : 'opacity-100 visible'}`} 
                style={{ transition: 'opacity 0.2s ease, visibility 0.2s ease' }}>
                <button
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${activeTab === 'frequent' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('frequent');
                  }}
                >
                  Frequently Used
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm font-medium ml-2 transition-colors ${activeTab === 'quick' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('quick');
                  }}
                >
                  QuickStart
                </button>
              </div>
            </div>
          </div>

          {/* Standard Project Dropdown */}
          {!selectedProject && showProjectDropdown && (
            <div className="absolute top-full left-0 right-0 bg-white rounded-b-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-200 border-t-0 z-50 animate-dropdown-enter overflow-hidden">
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto py-3">
                {filteredProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className={`px-4 py-3 cursor-pointer transition-all duration-200 ease-out hover:bg-purple-50/80 hover:scale-[1.02] hover:shadow-sm mx-2 rounded-xl ${index === projectDropdownIndex ? 'bg-purple-100/60 shadow-sm scale-[1.02]' : ''
                      } animate-dropdown-item`}
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => {
                      onProjectSelect(project);
                      setProjectSearchQuery(project.name);
                      setShowProjectDropdown(false);
                      setProjectDropdownIndex(-1);
                    }}
                  >
                    <div className="text-sm font-medium text-slate-800 tracking-tight">{project.name}</div>
                  </div>
                ))}
                {filteredProjects.length === 0 && (
                  <div className="px-4 py-8 text-center animate-dropdown-item">
                    <div className="text-sm text-slate-500 font-medium">No projects found</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Subproject Dropdown */}
          {selectedProject && !selectedSubproject && showSubprojectDropdown && (
            <div className="absolute top-full left-0 right-0 bg-white rounded-b-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-200 border-t-0 z-50 animate-dropdown-enter overflow-hidden">
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto py-3">
                {filteredSubprojects.map((subproject, index) => {
                  return (
                    <div
                      key={index}
                      className={`px-4 py-3 cursor-pointer transition-all duration-200 ease-out hover:bg-emerald-50/80 hover:scale-[1.02] hover:shadow-sm mx-2 rounded-xl ${index === subprojectDropdownIndex ? 'bg-emerald-100/60 shadow-sm scale-[1.02]' : ''
                        } animate-dropdown-item`}
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => {
                        onSubprojectSelect(subproject);
                        setSubprojectSearchQuery(subproject);
                        setShowSubprojectDropdown(false);
                        setSubprojectDropdownIndex(-1);
                      }}
                    >
                      <div className="text-sm font-medium text-slate-800 tracking-tight">{subproject}</div>
                    </div>
                  );
                })}
                {filteredSubprojects.length === 0 && (
                  <div className="px-4 py-8 text-center animate-dropdown-item">
                    <div className="text-sm text-slate-500 font-medium">No tasks found</div>
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
            <div className="h-full overflow-y-auto">
              {frequentlyUsedProjects.length > 0 ? (
                <div className="divide-y divide-slate-100/40">
                  {frequentlyUsedProjects.map((project) => (
                    <div
                      key={project.id}
                      className="group"
                    >
                      <button
                        className="w-full px-6 py-5 text-left hover:bg-slate-50/60 active:bg-slate-100/40 transition-all duration-200 flex items-center justify-between"
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
                        <div className="bg-slate-50/30 border-t border-slate-100/30">
                          {project.subprojects
                            .sort((a, b) => {
                              const aFreq = subprojectFrequency[project.id]?.[a] || 0;
                              const bFreq = subprojectFrequency[project.id]?.[b] || 0;
                              return bFreq - aFreq;
                            })
                            .map((subproject, idx) => (
                              <button
                                key={idx}
                                className="w-full px-6 py-4 pl-12 text-left hover:bg-purple-50/40 active:bg-purple-100/30 transition-all duration-200 border-b border-slate-100/20 last:border-b-0 group/subtask flex justify-between items-center"
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
                            ))
                          }
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-slate-400 py-20">
                  <div className="w-12 h-12 bg-slate-100/60 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6 text-slate-400" />
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
                <div className="w-12 h-12 bg-slate-100/60 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
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