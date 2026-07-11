"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { updateTaskStatusAction } from "@/app/actions/ai";
import { Clock, Calendar, ShieldAlert, FileCheck, CheckCircle2, Circle, MoreHorizontal, Users } from "lucide-react";

export default function WorkflowKanban({ tasks }: { tasks: any[] }) {
  const [view, setView] = useState<'Kanban' | 'Table'>('Kanban');
  const [localTasks, setLocalTasks] = useState(tasks);

  const columns = ['Todo', 'InProgress', 'Review', 'Done'] as const;

  const handleStatusChange = async (taskId: string, newStatus: any) => {
    // Optimistic UI update
    setLocalTasks(localTasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    await updateTaskStatusAction(taskId, newStatus);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-950/30';
      case 'High': return 'text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-950/30';
      default: return 'text-blue-700 bg-blue-100 dark:text-blue-400 dark:bg-blue-950/30';
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">No tasks generated yet. Make sure obligations are approved before running the planner.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* View Toggle */}
      <div className="flex justify-end mb-6">
        <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg inline-flex">
          <button 
            onClick={() => setView('Kanban')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${view === 'Kanban' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Kanban
          </button>
          <button 
            onClick={() => setView('Table')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${view === 'Table' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}
          >
            List
          </button>
        </div>
      </div>

      {view === 'Kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          {columns.map(col => (
            <div key={col} className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
              <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-4 flex justify-between items-center">
                {col === 'InProgress' ? 'In Progress' : col}
                <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full text-slate-600 dark:text-slate-400">
                  {localTasks.filter(t => t.status === col).length}
                </span>
              </h3>
              
              <div className="space-y-4">
                {localTasks.filter(t => t.status === col).map(task => (
                  <div key={task.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 group">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      {col !== 'Done' && (
                        <select 
                          className="text-xs border-none bg-transparent text-slate-400 hover:text-slate-600 cursor-pointer outline-none opacity-0 group-hover:opacity-100 transition-opacity"
                          value={task.status}
                          onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        >
                          <option value="Todo">Todo</option>
                          <option value="InProgress">In Progress</option>
                          <option value="Review">Review</option>
                          <option value="Done">Done</option>
                        </select>
                      )}
                    </div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">{task.comments}</p>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400 mt-4 border-t border-slate-100 dark:border-slate-700/50 pt-3">
                      <div className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {task.department}</div>
                      {task.dueDate && <div className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {new Date(task.dueDate).toLocaleDateString()}</div>}
                      {task.evidenceRequired && <div className="flex items-center gap-1 text-indigo-500"><FileCheck className="h-3.5 w-3.5" /> Evidence</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Task</th>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium">Priority</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {localTasks.map(task => (
                <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{task.comments}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{task.department}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      className="text-xs bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded px-2 py-1 text-slate-700 dark:text-slate-200"
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    >
                      <option value="Todo">Todo</option>
                      <option value="InProgress">In Progress</option>
                      <option value="Review">Review</option>
                      <option value="Done">Done</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
