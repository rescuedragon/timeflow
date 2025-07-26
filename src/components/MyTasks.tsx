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

  const activeTasks = tasks.filter(task => task.status === 'active');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-200 shadow-red-100/50';
      case 'medium': return 'bg-gradient-to-r from-amber-50 to-yellow-100 text-amber-700 border-amber-200 shadow-amber-100/50';
      case 'low': return 'bg-gradient-to-r from-emerald-50 to-green-100 text-emerald-700 border-emerald-200 shadow-emerald-100/50';
      default: return 'bg-gradient-to-r from-slate-50 to-slate-100 text-slate-700 border-slate-200 shadow-slate-100/50';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-slate-800">My Tasks</h1>
              {hasNewCompletions && (
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse shadow-lg"></div>
              )}
            </div>
            <p className="text-slate-600">Manage your tasks and track your progress</p>
          </div>
          <Button
            onClick={() => setShowDelegateModal(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold px-6 py-3 rounded-2xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Delegate Task
          </Button>
        </div>

        <div className="space-y-8">
          {/* Active Tasks Section */}
          <Card className="p-8 bg-white/90 backdrop-blur-xl border-0 shadow-2xl rounded-3xl hover:shadow-3xl transition-all duration-500">
            <div className="flex items-center gap-3 mb-6">
              <FolderOpen className="w-6 h-6 text-emerald-600" />
              <h2 className="text-2xl font-bold text-slate-700">
                Active Tasks ({activeTasks.length})
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activeTasks.map((task) => {
                const deadline = formatDateTime(task.deadline);
                const timeLeft = getTimeUntilDeadline(task.deadline);
                const overdue = isOverdue(task.deadline);

                return (
                  <Card key={task.id} className={`task-card p-6 bg-gradient-to-br from-white to-slate-50/50 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 ${overdue ? 'ring-2 ring-red-200 bg-gradient-to-br from-red-50/30 to-white' : ''}`}>
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2">{task.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                            <FolderOpen className="w-4 h-4" />
                            <span className="font-medium">{task.project}</span>
                            {task.subproject && (
                              <>
                                <span className="text-slate-400">•</span>
                                <span>{task.subproject}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <Badge className={`${getPriorityColor(task.priority)} border-2 shadow-sm`}>
                          {getPriorityIcon(task.priority)}
                          <span className="ml-1 capitalize font-medium">{task.priority}</span>
                        </Badge>
                      </div>

                      {/* Description */}
                      {task.description && (
                        <p className="text-slate-600 text-sm leading-relaxed">{task.description}</p>
                      )}

                      {/* Delegation Info */}
                      <div className="space-y-2 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <User className="w-3 h-3" />
                          <span>Delegated by <span className="font-medium text-slate-700">{task.delegatedBy}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          <span>On {formatDateTime(task.delegatedOn).date} at {formatDateTime(task.delegatedOn).time}</span>
                        </div>
                      </div>

                      {/* Deadline */}
                      <div className={`flex items-center justify-between p-3 rounded-xl ${overdue ? 'bg-red-50 border border-red-200' : 'bg-slate-50 border border-slate-200'}`}>
                        <div className="text-sm">
                          <div className={`font-medium ${overdue ? 'text-red-700' : 'text-slate-700'}`}>
                            {deadline.date} at {deadline.time}
                          </div>
                          <div className={`text-xs ${overdue ? 'text-red-600' : 'text-slate-500'}`}>
                            Deadline
                          </div>
                        </div>
                        <Badge variant={overdue ? 'destructive' : 'secondary'} className="text-xs font-medium">
                          {timeLeft}
                        </Badge>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() => markAsComplete(task.id)}
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all duration-300 font-medium rounded-xl"
                        >
                          <CheckSquare className="w-4 h-4 mr-1" />
                          Complete
                        </Button>
                        <Button
                          onClick={() => startTimer(task.project, task.subproject)}
                          size="sm"
                          variant="outline"
                          className="flex-1 bg-white/80 hover:bg-white border-2 shadow-md hover:shadow-lg transition-all duration-300 font-medium rounded-xl"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Start Timer
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {activeTasks.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FolderOpen className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-600 mb-2">No Active Tasks</h3>
                <p className="text-slate-500">All caught up! Delegate new tasks to get started.</p>
              </div>
            )}
          </Card>

          {/* Completed Tasks Section */}
          <Card className="bg-gradient-to-br from-emerald-50/90 to-green-50/90 backdrop-blur-xl border-0 shadow-xl rounded-3xl overflow-hidden">
            <div 
              className="p-8 cursor-pointer hover:bg-white/20 transition-all duration-300"
              onClick={() => setCompletedExpanded(!completedExpanded)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckSquare className="w-6 h-6 text-emerald-600" />
                  <h2 className="text-2xl font-bold text-slate-700">
                    Completed Tasks ({completedTasks.length})
                  </h2>
                  {hasNewCompletions && (
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200 animate-pulse">
                      New
                    </Badge>
                  )}
                </div>
                <Button variant="ghost" size="sm" className="rounded-full p-2">
                  {completedExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-600" />
                  )}
                </Button>
              </div>
            </div>

            <div className={`transition-all duration-500 ease-in-out ${completedExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
              <div className="px-8 pb-8">
                {hasNewCompletions && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-sm text-blue-700">
                      <span className="font-medium">John Smith</span> completed "Setup CI/CD pipeline" • 2 hours ago
                    </p>
                  </div>
                )}
                
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                  {completedTasks.map((task) => {
                    const completedDate = task.completedOn ? formatDateTime(task.completedOn) : null;
                    
                    return (
                      <Card key={task.id} className="p-5 bg-white/60 backdrop-blur-lg border border-emerald-200/50 rounded-2xl">
                        <div className="flex items-start gap-4">
                          <div className="mt-1">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-slate-700 line-through opacity-75 text-lg mb-1">
                                  {task.title}
                                </h4>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                  <FolderOpen className="w-3 h-3" />
                                  <span>{task.project}</span>
                                  {task.subproject && (
                                    <>
                                      <span>•</span>
                                      <span>{task.subproject}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300 ml-3 flex-shrink-0">
                                Completed
                              </Badge>
                            </div>

                            {task.description && (
                              <p className="text-slate-500 mb-3 line-through opacity-75 text-sm leading-relaxed">
                                {task.description}
                              </p>
                            )}

                            {completedDate && (
                              <div className="text-xs text-slate-500">
                                Completed by <span className="font-medium text-slate-700">{task.completedBy}</span> on {completedDate.date} at {completedDate.time}
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Delegate Task Modal */}
        {showDelegateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-slate-800">Delegate Task</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDelegateModal(false)}
                    className="rounded-full p-2"
                  >
                    ×
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Assignee</label>
                    <select className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Select team member...</option>
                      <option>John Smith</option>
                      <option>Sarah Johnson</option>
                      <option>Mike Chen</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Project</label>
                    <select className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Select project...</option>
                      <option>Design System</option>
                      <option>Frontend Development</option>
                      <option>Backend Development</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Subproject</label>
                    <input 
                      type="text" 
                      placeholder="Enter subproject..."
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Task Title</label>
                    <input 
                      type="text" 
                      placeholder="Enter task title..."
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Description (Optional)</label>
                    <textarea 
                      placeholder="Enter task description..."
                      rows={3}
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Deadline</label>
                    <input 
                      type="datetime-local" 
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                    <select className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setShowDelegateModal(false)}
                    className="flex-1 rounded-xl border-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => setShowDelegateModal(false)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl"
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