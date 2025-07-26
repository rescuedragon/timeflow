import React, { useState } from 'react';
import { CheckCircle2, Circle, Clock, Star, Plus, ChevronDown, ChevronUp, Play, User, Calendar, FolderOpen, CheckSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Task {
  id: string;
  title: string;
  description?: string;
  project: string;
  subproject?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed';
  deadline: string;
  delegatedBy: string;
  delegatedOn: string;
  completedBy?: string;
  completedOn?: string;
}

const MyTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Design new component library',
      description: 'Create reusable components for the design system',
      project: 'Design System',
      subproject: 'UI Components',
      priority: 'high',
      status: 'active',
      deadline: '2025-07-25T14:00',
      delegatedBy: 'Sarah Johnson',
      delegatedOn: '2025-07-20T09:30'
    },
    {
      id: '2',
      title: 'Implement authentication flow',
      description: 'Build login, register, and password reset functionality',
      project: 'Frontend Development',
      subproject: 'Auth Module',
      priority: 'high',
      status: 'active',
      deadline: '2025-07-24T16:00',
      delegatedBy: 'Mike Chen',
      delegatedOn: '2025-07-19T11:15'
    },
    {
      id: '3',
      title: 'Write API documentation',
      project: 'Backend Development',
      subproject: 'Documentation',
      priority: 'medium',
      status: 'active',
      deadline: '2025-07-26T12:00',
      delegatedBy: 'Alex Rodriguez',
      delegatedOn: '2025-07-21T08:45'
    },
    {
      id: '4',
      title: 'Setup CI/CD pipeline',
      description: 'Configure automated testing and deployment',
      project: 'DevOps',
      subproject: 'Infrastructure',
      priority: 'low',
      status: 'completed',
      deadline: '2025-07-23T17:00',
      delegatedBy: 'Emma Wilson',
      delegatedOn: '2025-07-18T14:20',
      completedBy: 'John Smith',
      completedOn: '2025-07-22T15:30'
    }
  ]);

  const [completedExpanded, setCompletedExpanded] = useState(false);
  const [showDelegateModal, setShowDelegateModal] = useState(false);
  const [hasNewCompletions, setHasNewCompletions] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  const activeTasks = tasks.filter(task => {
    if (task.status !== 'active') return false;
    if (priorityFilter === 'all') return true;
    return task.priority === priorityFilter;
  });
  const completedTasks = tasks.filter(task => task.status === 'completed');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-gradient-to-r from-purple-50 to-violet-100 text-purple-800 border-purple-200/50 shadow-purple-100/30';
      case 'medium': return 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-indigo-200/50 shadow-indigo-100/30';
      case 'low': return 'bg-gradient-to-r from-slate-50 to-gray-100 text-slate-700 border-slate-200/50 shadow-slate-100/30';
      default: return 'bg-gradient-to-r from-white to-gray-50 text-gray-700 border-gray-200/50 shadow-gray-100/30';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Star className="w-3 h-3 fill-current" />;
      case 'medium': return <Clock className="w-3 h-3" />;
      case 'low': return <Circle className="w-3 h-3" />;
      default: return null;
    }
  };

  const markAsComplete = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          return { 
            ...task, 
            status: 'completed' as const,
            completedBy: 'You',
            completedOn: new Date().toISOString()
          };
        }
        return task;
      })
    );
  };

  const startTimer = (project: string, subproject?: string) => {
    // Visual feedback for timer start
    console.log(`Starting timer for ${project}${subproject ? ` - ${subproject}` : ''}`);
    // TODO: Integrate with TimeTracker component
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  const getTimeUntilDeadline = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffMs = deadlineDate.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMs < 0) return 'Overdue';
    if (diffDays > 0) return `${diffDays}d left`;
    if (diffHours > 0) return `${diffHours}h left`;
    return 'Due soon';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(139,92,246,0.03)_1px,transparent_0)] bg-[length:32px_32px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-8 py-12 relative">
        {/* Header */}
        <div className="mb-12 flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-indigo-900 bg-clip-text text-transparent tracking-tight">
                My Tasks
              </h1>
              {hasNewCompletions && (
                <div className="relative">
                  <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full shadow-lg"></div>
                  <div className="absolute inset-0 w-4 h-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full animate-ping opacity-75"></div>
                </div>
              )}
            </div>
            <p className="text-lg text-gray-700 font-medium">Manage your tasks and track your progress</p>
          </div>
          <Button
            onClick={() => setShowDelegateModal(true)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-500 font-semibold px-8 py-4 rounded-2xl border-0 text-base transform hover:scale-105 active:scale-95"
          >
            <Plus className="w-5 h-5 mr-3" />
            Delegate Task
          </Button>
        </div>

        <div className="space-y-10">
          {/* Active Tasks Section */}
          <div className="bg-white/90 backdrop-blur-2xl border border-purple-200/30 shadow-2xl rounded-3xl overflow-hidden relative">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-purple-50/20 to-indigo-50/10 pointer-events-none"></div>
            
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <FolderOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-purple-900 bg-clip-text text-transparent tracking-tight">
                      Active Tasks
                    </h2>
                    <p className="text-gray-700 font-medium">{activeTasks.length} tasks in progress</p>
                  </div>
                </div>
                
                {/* Priority Filter Dropdown */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-800">Filter by priority:</span>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as 'all' | 'low' | 'medium' | 'high')}
                    className="px-4 py-2 bg-white/95 border border-purple-200/50 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {activeTasks.map((task, index) => {
                  const deadline = formatDateTime(task.deadline);
                  const timeLeft = getTimeUntilDeadline(task.deadline);
                  const overdue = isOverdue(task.deadline);

                  return (
                    <div 
                      key={task.id} 
                      className={`group relative bg-white/95 backdrop-blur-xl border border-purple-200/40 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden ${overdue ? 'ring-2 ring-red-300/60 bg-gradient-to-r from-red-50/40 to-white' : ''}`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Subtle hover gradient */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-50/0 via-indigo-50/0 to-violet-50/0 group-hover:from-purple-50/40 group-hover:via-indigo-50/30 group-hover:to-violet-50/20 transition-all duration-700 pointer-events-none"></div>
                      
                      <div className="relative p-4">
                        <div className="flex items-center gap-6">
                          {/* Left Section - Task Info */}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1 group-hover:text-purple-900 transition-colors duration-300">
                                  {task.title}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <div className="w-5 h-5 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center">
                                    <FolderOpen className="w-3 h-3 text-purple-600" />
                                  </div>
                                  <span className="font-semibold text-gray-800">{task.project}</span>
                                  {task.subproject && (
                                    <>
                                      <span className="text-gray-400 font-medium">•</span>
                                      <span className="text-gray-600 font-medium">{task.subproject}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <Badge className={`${getPriorityColor(task.priority)} border-0 shadow-sm ml-4 px-3 py-1 text-xs font-semibold`}>
                                {getPriorityIcon(task.priority)}
                                <span className="ml-1 capitalize">{task.priority}</span>
                              </Badge>
                            </div>

                            {/* Description - Condensed */}
                            {task.description && (
                              <p className="text-gray-700 text-sm leading-relaxed font-medium bg-purple-50/30 p-2 rounded-lg border border-purple-100/50 line-clamp-2">
                                {task.description}
                              </p>
                            )}

                            {/* Delegation Info - Condensed */}
                            <div className="flex items-center gap-4 text-xs text-gray-600 bg-purple-50/20 p-2 rounded-lg">
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-purple-100 rounded-full flex items-center justify-center">
                                  <User className="w-2 h-2 text-purple-600" />
                                </div>
                                <span>By <span className="font-semibold text-gray-800">{task.delegatedBy}</span></span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-indigo-100 rounded-full flex items-center justify-center">
                                  <Calendar className="w-2 h-2 text-indigo-600" />
                                </div>
                                <span>{formatDateTime(task.delegatedOn).date}</span>
                              </div>
                            </div>
                          </div>

                          {/* Right Section - Deadline & Actions */}
                          <div className="flex flex-col items-end gap-3 min-w-0">
                            {/* Deadline - Compact */}
                            <div className={`flex items-center justify-between p-2 rounded-xl min-w-44 shadow-sm ${overdue ? 'bg-gradient-to-r from-red-50 to-red-100 border border-red-200' : 'bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/50'}`}>
                              <div className="text-xs">
                                <div className={`font-bold text-sm ${overdue ? 'text-red-800' : 'text-gray-800'}`}>
                                  {deadline.date}
                                </div>
                                <div className={`text-xs font-medium ${overdue ? 'text-red-600' : 'text-gray-600'}`}>
                                  {deadline.time}
                                </div>
                              </div>
                              <Badge 
                                variant={overdue ? 'destructive' : 'secondary'} 
                                className={`text-xs font-bold ml-2 px-2 py-0.5 ${overdue ? 'bg-red-600 text-white' : 'bg-purple-200 text-purple-800'}`}
                              >
                                {timeLeft}
                              </Badge>
                            </div>

                            {/* Action Buttons - Compact */}
                            <div className="flex gap-2">
                              <Button
                                onClick={() => markAsComplete(task.id)}
                                size="sm"
                                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300 font-semibold rounded-lg px-4 py-2 text-xs transform hover:scale-105 active:scale-95"
                              >
                                <CheckSquare className="w-3 h-3 mr-1" />
                                Complete
                              </Button>
                              <Button
                                onClick={() => startTimer(task.project, task.subproject)}
                                size="sm"
                                variant="outline"
                                className="bg-white/90 hover:bg-white border border-purple-300/50 hover:border-purple-400 shadow-md hover:shadow-lg transition-all duration-300 font-semibold rounded-lg text-gray-800 px-4 py-2 text-xs transform hover:scale-105 active:scale-95"
                              >
                                <Play className="w-3 h-3 mr-1" />
                                Timer
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {activeTasks.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-200 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <FolderOpen className="w-10 h-10 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-purple-800 bg-clip-text text-transparent mb-2">
                      {priorityFilter === 'all' ? 'No Active Tasks' : `No ${priorityFilter.charAt(0).toUpperCase() + priorityFilter.slice(1)} Priority Tasks`}
                    </h3>
                    <p className="text-gray-600 text-base font-medium">
                      {priorityFilter === 'all' ? 'All caught up! Delegate new tasks to get started.' : `Try selecting a different priority filter or delegate new ${priorityFilter} priority tasks.`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Completed Tasks Section */}
          <div className="bg-gradient-to-br from-purple-50/60 via-indigo-50/40 to-violet-50/60 backdrop-blur-2xl border border-purple-200/40 shadow-2xl rounded-3xl overflow-hidden relative">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-purple-50/20 pointer-events-none"></div>
            
            <div 
              className="relative p-8 cursor-pointer hover:bg-white/30 transition-all duration-500 group"
              onClick={() => setCompletedExpanded(!completedExpanded)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <CheckSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-purple-900 bg-clip-text text-transparent tracking-tight">
                      Completed Tasks
                    </h2>
                    <p className="text-gray-700 font-medium">{completedTasks.length} tasks completed</p>
                  </div>
                  {hasNewCompletions && (
                    <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0 shadow-lg animate-pulse px-4 py-2 text-sm font-semibold">
                      New
                    </Badge>
                  )}
                </div>
                <Button variant="ghost" size="sm" className="rounded-2xl p-3 hover:bg-white/50 transition-all duration-300">
                  {completedExpanded ? (
                    <ChevronUp className="w-6 h-6 text-gray-700" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-700" />
                  )}
                </Button>
              </div>
            </div>

            <div className={`transition-all duration-700 ease-in-out ${completedExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
              <div className="px-8 pb-8">
                {hasNewCompletions && (
                  <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/50 rounded-2xl shadow-sm">
                    <p className="text-sm text-purple-800 font-medium">
                      <span className="font-bold">John Smith</span> completed "Setup CI/CD pipeline" • 2 hours ago
                    </p>
                  </div>
                )}
                
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2 task-scroll">
                  {completedTasks.map((task, index) => {
                    const completedDate = task.completedOn ? formatDateTime(task.completedOn) : null;
                    
                    return (
                      <div 
                        key={task.id} 
                        className="bg-white/90 backdrop-blur-xl border border-purple-200/40 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="mt-1">
                              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-bold text-gray-700 line-through opacity-80 text-lg mb-1">
                                    {task.title}
                                  </h4>
                                  <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <div className="w-4 h-4 bg-purple-100 rounded-lg flex items-center justify-center">
                                      <FolderOpen className="w-2 h-2 text-purple-600" />
                                    </div>
                                    <span className="font-medium">{task.project}</span>
                                    {task.subproject && (
                                      <>
                                        <span className="font-medium">•</span>
                                        <span className="font-medium">{task.subproject}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <Badge className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border-purple-300/50 ml-3 flex-shrink-0 px-3 py-1 text-xs font-semibold shadow-sm">
                                  Completed
                                </Badge>
                              </div>

                              {task.description && (
                                <p className="text-gray-600 mb-2 line-through opacity-75 text-sm leading-relaxed bg-purple-50/30 p-2 rounded-lg">
                                  {task.description}
                                </p>
                              )}

                              {completedDate && (
                                <div className="text-xs text-gray-600 bg-purple-50/20 p-2 rounded-lg">
                                  Completed by <span className="font-bold text-gray-800">{task.completedBy}</span> on {completedDate.date} at {completedDate.time}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delegate Task Modal */}
        {showDelegateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-purple-200/30 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-purple-900 bg-clip-text text-transparent">Delegate Task</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDelegateModal(false)}
                    className="rounded-full p-2 text-gray-600 hover:text-purple-800 text-2xl font-bold"
                  >
                    ×
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-3">Assignee</label>
                      <select className="w-full p-4 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-700 bg-white text-base">
                        <option className="text-gray-500">Select team member...</option>
                        <option className="text-gray-700">John Smith</option>
                        <option className="text-gray-700">Sarah Johnson</option>
                        <option className="text-gray-700">Mike Chen</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-3">Project</label>
                      <select className="w-full p-4 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-700 bg-white text-base">
                        <option className="text-gray-500">Select project...</option>
                        <option className="text-gray-700">Design System</option>
                        <option className="text-gray-700">Frontend Development</option>
                        <option className="text-gray-700">Backend Development</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-3">Subproject</label>
                      <input 
                        type="text" 
                        placeholder="Enter subproject..."
                        className="w-full p-4 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-700 placeholder-gray-400 text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-3">Priority</label>
                      <select className="w-full p-4 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-700 bg-white text-base">
                        <option value="low" className="text-gray-700">Low Priority</option>
                        <option value="medium" className="text-gray-700">Medium Priority</option>
                        <option value="high" className="text-gray-700">High Priority</option>
                      </select>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-3">Task Title</label>
                      <input 
                        type="text" 
                        placeholder="Enter task title..."
                        className="w-full p-4 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-700 placeholder-gray-400 text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-3">Description (Optional)</label>
                      <textarea 
                        placeholder="Enter task description..."
                        rows={4}
                        className="w-full p-4 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none text-gray-700 placeholder-gray-400 text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-3">Deadline</label>
                      <input 
                        type="datetime-local" 
                        className="w-full p-4 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-700 text-base"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-purple-200/50">
                  <Button
                    variant="outline"
                    onClick={() => setShowDelegateModal(false)}
                    className="px-8 py-3 rounded-xl border-2 border-purple-300/50 text-gray-700 hover:bg-purple-50 font-semibold text-base"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => setShowDelegateModal(false)}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 rounded-xl text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Delegate Task
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasks;