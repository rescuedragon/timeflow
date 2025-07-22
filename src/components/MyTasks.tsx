import React, { useState } from 'react';
import { CheckCircle2, Circle, Clock, Star, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Task {
  id: string;
  title: string;
  description: string;
  project: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate?: string;
  estimatedTime?: string;
}

const MyTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Design new component library',
      description: 'Create reusable components for the design system',
      project: 'Design System',
      priority: 'high',
      status: 'in-progress',
      dueDate: '2025-07-25',
      estimatedTime: '8h'
    },
    {
      id: '2',
      title: 'Implement authentication flow',
      description: 'Build login, register, and password reset functionality',
      project: 'Frontend Development',
      priority: 'high',
      status: 'pending',
      dueDate: '2025-07-24',
      estimatedTime: '6h'
    },
    {
      id: '3',
      title: 'Write API documentation',
      description: 'Document all endpoints with examples',
      project: 'Backend Development',
      priority: 'medium',
      status: 'pending',
      dueDate: '2025-07-26',
      estimatedTime: '4h'
    },
    {
      id: '4',
      title: 'Setup CI/CD pipeline',
      description: 'Configure automated testing and deployment',
      project: 'DevOps',
      priority: 'low',
      status: 'completed',
      estimatedTime: '3h'
    }
  ]);

  const currentTask = tasks.find(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const pendingTasks = tasks.filter(task => task.status === 'pending');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
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

  const toggleTaskStatus = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          if (task.status === 'completed') {
            return { ...task, status: 'pending' };
          } else if (task.status === 'pending') {
            return { ...task, status: 'in-progress' };
          } else {
            return { ...task, status: 'completed' };
          }
        }
        return task;
      })
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">My Tasks</h1>
          <p className="text-slate-600">Manage your tasks and track your progress</p>
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          {/* Left Column - Current Task */}
          <div className="xl:w-1/3 space-y-6">
            {currentTask ? (
              <Card className="current-task-glow p-8 bg-gradient-to-br from-purple-50/90 to-blue-50/90 border-0 shadow-2xl rounded-3xl backdrop-blur-xl hover:shadow-3xl transition-all duration-500">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full animate-pulse shadow-lg"></div>
                    <h3 className="text-xl font-bold text-slate-700">Current Task</h3>
                  </div>
                  <Badge variant="outline" className={`priority-badge ${getPriorityColor(currentTask.priority)} border-2`}>
                    {getPriorityIcon(currentTask.priority)}
                    <span className="ml-1 capitalize">{currentTask.priority}</span>
                  </Badge>
                </div>

                <div className="space-y-5">
                  <h4 className="text-2xl font-bold text-slate-800 leading-tight">{currentTask.title}</h4>
                  <p className="text-slate-600 text-base leading-relaxed">{currentTask.description}</p>

                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <Badge variant="secondary" className="bg-white/80 text-slate-700 font-medium px-3 py-1.5 rounded-full">
                      {currentTask.project}
                    </Badge>
                    {currentTask.estimatedTime && (
                      <div className="flex items-center gap-2 text-slate-500 bg-white/60 px-3 py-1.5 rounded-full">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">{currentTask.estimatedTime}</span>
                      </div>
                    )}
                    {currentTask.dueDate && (
                      <div className={`flex items-center gap-2 font-medium px-3 py-1.5 rounded-full ${isOverdue(currentTask.dueDate)
                          ? 'text-red-600 bg-red-50'
                          : 'text-slate-500 bg-white/60'
                        }`}>
                        <span>Due {formatDate(currentTask.dueDate)}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={() => toggleTaskStatus(currentTask.id)}
                      size="lg"
                      className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold px-6 py-3 rounded-2xl"
                    >
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Mark Complete
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-8 bg-gradient-to-br from-slate-50/90 to-slate-100/90 border-0 shadow-xl rounded-3xl backdrop-blur-xl">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-600 mb-2">No Active Task</h3>
                  <p className="text-slate-500">Start working on a task to see it here</p>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Task Lists */}
          <div className="xl:w-2/3 space-y-8">
            {/* Pending Tasks */}
            <Card className="p-8 bg-white/90 backdrop-blur-xl border-0 shadow-2xl rounded-3xl hover:shadow-3xl transition-all duration-500">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                  <h3 className="text-2xl font-bold text-slate-700">
                    Pending Tasks ({pendingTasks.length})
                  </h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-2xl bg-white/80 hover:bg-white border-2 shadow-md hover:shadow-lg transition-all duration-300 font-medium px-4 py-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {pendingTasks.map((task) => (
                  <Card key={task.id} className={`task-card p-5 bg-white/80 backdrop-blur-lg rounded-2xl ${isOverdue(task.dueDate) ? 'overdue-pulse' : ''}`}>
                    <div className="flex items-start gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleTaskStatus(task.id)}
                        className="status-indicator mt-1 p-0 h-6 w-6 rounded-full hover:bg-blue-50 transition-colors duration-200"
                      >
                        <Circle className="w-5 h-5 text-slate-400 hover:text-blue-500 transition-colors duration-200" />
                      </Button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-slate-800 text-lg leading-tight">{task.title}</h4>
                          <Badge variant="outline" className={`priority-badge ${getPriorityColor(task.priority)} border-2 ml-3 flex-shrink-0`}>
                            {getPriorityIcon(task.priority)}
                            <span className="ml-1 capitalize">{task.priority}</span>
                          </Badge>
                        </div>

                        <p className="text-slate-600 mb-4 leading-relaxed">{task.description}</p>

                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <Badge variant="secondary" className="bg-slate-100/80 text-slate-700 px-3 py-1 rounded-full">
                            {task.project}
                          </Badge>
                          {task.estimatedTime && (
                            <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
                              <Clock className="w-3 h-3" />
                              <span>{task.estimatedTime}</span>
                            </div>
                          )}
                          {task.dueDate && (
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${isOverdue(task.dueDate)
                                ? 'text-red-600 bg-red-50'
                                : 'text-slate-500 bg-slate-50'
                              }`}>
                              <span>Due {formatDate(task.dueDate)}</span>
                              {isOverdue(task.dueDate) && (
                                <Badge variant="destructive" className="ml-1 px-2 py-0 text-xs rounded-full">
                                  Overdue
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <Card className="p-8 bg-gradient-to-br from-green-50/90 to-emerald-50/90 backdrop-blur-xl border-0 shadow-xl rounded-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
                  <h3 className="text-2xl font-bold text-slate-700">
                    Completed Tasks ({completedTasks.length})
                  </h3>
                </div>

                <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                  {completedTasks.map((task) => (
                    <Card key={task.id} className="completed-fade task-card p-5 bg-white/60 backdrop-blur-lg border border-green-200/50 rounded-2xl">
                      <div className="flex items-start gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleTaskStatus(task.id)}
                          className="status-indicator mt-1 p-0 h-6 w-6 rounded-full hover:bg-green-50"
                        >
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </Button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-semibold text-slate-700 line-through opacity-75 text-lg">
                              {task.title}
                            </h4>
                            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 ml-3 flex-shrink-0">
                              Completed
                            </Badge>
                          </div>

                          <p className="text-slate-500 mb-3 line-through opacity-75 leading-relaxed">
                            {task.description}
                          </p>

                          <Badge variant="secondary" className="bg-white/70 text-slate-500 px-3 py-1 rounded-full">
                            {task.project}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTasks;