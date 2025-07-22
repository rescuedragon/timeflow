import React, { useState } from 'react';
import { Search, Clock, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

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

  return (
    <div className="w-1/2 bg-white/98 backdrop-blur-2xl border border-white/30 shadow-lg rounded-2xl h-[612px] overflow-hidden">
      {/* Apple-Style Header Section */}
      <div className="bg-gradient-to-b from-white/95 to-white/85 backdrop-blur-xl border-b border-white/40 p-6">
        <div className="flex items-center gap-5">
          {/* Search Bar - Left Side */}
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-purple-500 transition-colors duration-200" />
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
              className={`pl-11 pr-11 h-11 bg-white/90 border border-slate-200/60 rounded-2xl text-sm font-normal font-system transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg focus:border-purple-300/60 ${
                (showProjectDropdown || showSubprojectDropdown) ? 'ring-1 ring-purple-200/40 border-purple-300/60' : ''
              } ${selectedSubproject ? 'text-purple-600 bg-purple-50/60 border-purple-200/60' : ''}`}
              readOnly={!!selectedSubproject}
            />
            
            {/* Clear/Reset Button */}
            {(selectedProject || selectedSubproject) && (
              <button
                onClick={() => {
                  if (selectedSubproject) {
                    onSubprojectSelect('');
                    setSubprojectSearchQuery('');
                  } else {
                    onProjectSelect(null);
                    setProjectSearchQuery('');
                  }
                  setShowProjectDropdown(false);
                  setShowSubprojectDropdown(false);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100/60 rounded-md transition-all duration-200"
              >
                ✕
              </button>
            )}
          </div>
          
          {/* Tab Buttons - Right Side */}
          <div className="flex bg-slate-100/60 rounded-2xl p-1">
            <button
              onClick={() => setActiveTab('frequent')}
              className={`px-5 py-2.5 text-center font-medium text-sm transition-all duration-200 rounded-xl ${
                activeTab === 'frequent'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'
              }`}
            >
              Frequently Used
            </button>
            <button
              onClick={() => setActiveTab('quick')}
              className={`px-5 py-2.5 text-center font-medium text-sm transition-all duration-200 rounded-xl ${
                activeTab === 'quick'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'
              }`}
            >
              Quick Start
            </button>
          </div>
        </div>
          
        {/* Standard Project Dropdown */}
        {!selectedProject && (
          <div className={`dropdown ${showProjectDropdown ? 'show' : ''}`}>
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className={`dropdown-item ${index === projectDropdownIndex ? 'highlighted' : ''}`}
                onClick={() => {
                  onProjectSelect(project);
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
            {filteredProjects.length === 0 && (
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
                    onSubprojectSelect(subproject);
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

      {/* Premium Content Section */}
      <div className="h-full flex flex-col">
        {/* Show selection summary when a project is selected */}
        {selectedProject && (
          <div className="bg-gradient-to-br from-purple-50/60 via-white/80 to-blue-50/60 border border-purple-100/30 rounded-2xl shadow-sm p-6 mx-6 mt-6 mb-6 backdrop-blur-sm">
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
          <div className="bg-gradient-to-br from-emerald-50/60 via-white/80 to-green-50/60 border border-emerald-100/30 rounded-2xl shadow-sm p-6 mx-6 mt-4 mb-6 backdrop-blur-sm">
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
          <div className="flex-1 bg-white/90 rounded-2xl shadow-sm overflow-hidden mx-6 mb-6">
            <div className="h-full overflow-y-auto">
              {frequentlyUsedProjects.length > 0 ? (
                <div className="divide-y divide-slate-100/40">
                  {frequentlyUsedProjects.map((project) => (
                    <div 
                      key={project.id}
                      className="group"
                    >
                      <button
                        className="w-full px-6 py-5 text-left hover:bg-slate-50/60 active:bg-slate-100/40 transition-all duration-200"
                        onClick={() => {
                          // Toggle expansion of this project to show subprojects
                          const expandedProjectId = expandedProject === project.id ? null : project.id;
                          setExpandedProject(expandedProjectId);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-base text-slate-700 group-hover:text-purple-600 transition-colors duration-200">{project.name}</div>
                          <div className="text-slate-300 group-hover:text-purple-400 transition-colors duration-200">
                            <ChevronRight className={`w-4 h-4 transform transition-transform duration-200 ${expandedProject === project.id ? 'rotate-90' : ''}`} />
                          </div>
                        </div>
                      </button>
                      
                      {/* Subprojects list - shown when expanded */}
                      <div className={`overflow-hidden transition-all duration-200 ${expandedProject === project.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
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
                                className="w-full px-6 py-4 pl-12 text-left hover:bg-purple-50/40 active:bg-purple-100/30 transition-all duration-200 border-b border-slate-100/20 last:border-b-0 group/subtask"
                                onClick={() => {
                                  onProjectSelect(project);
                                  onSubprojectSelect(subproject);
                                  setProjectSearchQuery(project.name);
                                  setSubprojectSearchQuery(subproject);
                                }}
                              >
                                <div className="text-sm text-slate-600 group-hover/subtask:text-purple-600 font-normal transition-colors duration-200">{subproject}</div>
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

        {/* Show Quick Start Combinations when no project is selected and activeTab is 'quick' */}
        {!selectedProject && activeTab === 'quick' && (
          <div className="flex-1 bg-white/90 rounded-2xl shadow-sm overflow-hidden mx-6 mb-6">
            <div className="h-full overflow-y-auto">
              {quickStartCombinations.length > 0 ? (
                <div className="divide-y divide-slate-100/40">
                  {quickStartCombinations.map((item) => (
                    <div 
                      key={item.id}
                      className="group"
                    >
                      <button
                        className="w-full px-6 py-5 text-left hover:bg-slate-50/60 active:bg-slate-100/40 transition-all duration-200"
                        onClick={() => onQuickStart(item)}
                      >
                        <div className="space-y-2">
                          <div className="font-medium text-base text-slate-700 group-hover:text-purple-600 transition-colors duration-200">{item.projectName}</div>
                          <div className="text-sm text-purple-500 font-normal">{item.subproject}</div>
                          <div className="flex justify-end">
                            <div className="text-xs text-slate-400 bg-slate-100/50 px-2 py-1 rounded-full">{item.lastUsed}</div>
                          </div>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-slate-400 py-20">
                  <div className="w-12 h-12 bg-slate-100/60 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-6 h-6 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2 text-slate-600">No quick start combinations</h3>
                  <p className="text-sm text-slate-500">Start tracking time to see combinations here</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Show instructions when a project is selected but no subproject */}
        {selectedProject && !selectedSubproject && (
          <div className="flex-1 bg-gradient-to-br from-slate-50/60 via-white/80 to-slate-100/60 border border-slate-200/30 rounded-2xl shadow-sm p-8 backdrop-blur-sm mx-6 mb-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100/60 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium mb-3 text-slate-700 tracking-tight">Select a Task</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Choose a specific task from <span className="font-medium text-purple-600">{selectedProject.name}</span> to begin tracking time</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSelector; 