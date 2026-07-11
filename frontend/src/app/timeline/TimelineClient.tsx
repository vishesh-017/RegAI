"use client";

import { useState } from "react";
import { format, isBefore, isToday, isFuture, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, Clock, AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TimelineClient({ obligations, tasks }: { obligations: any[], tasks: any[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const upcomingDeadlines = obligations.filter(o => o.deadline && (isFuture(new Date(o.deadline)) || isToday(new Date(o.deadline))));
  const missedDeadlines = obligations.filter(o => o.deadline && isBefore(new Date(o.deadline), new Date()) && !isToday(new Date(o.deadline)) && o.reviewStatus !== "Compliant");
  const completedTasks = tasks.filter(t => t.status === "Done");
  const criticalObligations = obligations.filter(o => o.priority === "High");

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const getEventsForDay = (day: Date) => {
    const dayObligations = obligations.filter(o => o.deadline && isSameDay(new Date(o.deadline), day));
    const dayTasks = tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), day));
    return { dayObligations, dayTasks };
  };

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <CalendarIcon className="h-8 w-8 text-indigo-600" />
          Timeline & Deadlines
        </h1>
        <p className="text-slate-500 mt-2">Track upcoming regulatory deadlines and workflow tasks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Upcoming Deadlines</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{upcomingDeadlines.length}</p>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <Clock className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Missed Deadlines</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{missedDeadlines.length}</p>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Completed Tasks</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{completedTasks.length}</p>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Critical Obligations</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{criticalObligations.length}</p>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Calendar View */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{format(currentDate, "MMMM yyyy")}</h2>
              <div className="flex gap-2">
                <button onClick={prevMonth} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button onClick={nextMonth} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-7 gap-px mb-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {days.map((day, idx) => {
                  const { dayObligations, dayTasks } = getEventsForDay(day);
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                  return (
                    <div key={idx} className={`min-h-[100px] p-2 rounded-lg border ${isCurrentMonth ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900' : 'border-transparent bg-slate-50 dark:bg-slate-950/50'}`}>
                      <p className={`text-sm font-medium mb-1 ${isCurrentMonth ? 'text-slate-900 dark:text-slate-200' : 'text-slate-400 dark:text-slate-600'}`}>
                        {format(day, dateFormat)}
                      </p>
                      <div className="space-y-1">
                        {dayObligations.map(o => (
                          <div key={o.id} className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 truncate border border-red-200 dark:border-red-900/50">
                            {o.title}
                          </div>
                        ))}
                        {dayTasks.map(t => (
                          <div key={t.id} className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 truncate border border-indigo-200 dark:border-indigo-900/50">
                            {t.obligation?.title || "Task"}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div>
          {/* Upcoming List */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Upcoming Deadlines</h2>
            <div className="space-y-4">
              {upcomingDeadlines.slice(0, 5).map(o => (
                <div key={o.id} className="p-4 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-slate-900 dark:text-slate-200 line-clamp-1">{o.title}</p>
                    <Badge variant="outline" className="bg-white dark:bg-slate-900 whitespace-nowrap ml-2">
                      {format(new Date(o.deadline), "MMM d")}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{o.circular?.title}</p>
                </div>
              ))}
              {upcomingDeadlines.length === 0 && (
                <p className="text-sm text-slate-500 py-4 text-center">No upcoming deadlines.</p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Action Items</h2>
            <div className="space-y-4">
              {tasks.filter(t => t.status !== "Done").slice(0, 5).map(t => (
                <div key={t.id} className="p-4 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-slate-900 dark:text-slate-200 line-clamp-1">{t.obligation?.title}</p>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <Badge className="bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300">
                      {t.status}
                    </Badge>
                    {t.dueDate && (
                      <span className="text-xs text-slate-500">
                        Due: {format(new Date(t.dueDate), "MMM d")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {tasks.filter(t => t.status !== "Done").length === 0 && (
                <p className="text-sm text-slate-500 py-4 text-center">No pending action items.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
