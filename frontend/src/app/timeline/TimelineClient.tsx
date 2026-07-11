"use client";

import { useState } from "react";
import { format, isBefore, isToday, isFuture, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameDay, addDays } from "date-fns";
import { Calendar as CalendarIcon, Clock, AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Critical threshold config constant (Part 3)
const CRITICAL_DAYS_THRESHOLD = 7;

export default function TimelineClient({ obligations, tasks }: { obligations: any[], tasks: any[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const upcomingDeadlines = [
    ...obligations.filter(o => o.deadline && (isFuture(new Date(o.deadline)) || isToday(new Date(o.deadline))) && o.reviewStatus !== "Fulfilled"),
    ...tasks.filter(t => t.dueDate && (isFuture(new Date(t.dueDate)) || isToday(new Date(t.dueDate))) && t.status !== "Done")
  ];

  const missedDeadlines = [
    ...obligations.filter(o => o.deadline && isBefore(new Date(o.deadline), new Date()) && !isToday(new Date(o.deadline)) && o.reviewStatus !== "Fulfilled"),
    ...tasks.filter(t => t.dueDate && isBefore(new Date(t.dueDate), new Date()) && !isToday(new Date(t.dueDate)) && t.status !== "Done")
  ];

  const completedTasks = tasks.filter(t => t.status === "Done");

  const criticalObligations = obligations.filter(o => {
    if (!o.deadline) return false;
    const isPast = isBefore(new Date(o.deadline), new Date()) && !isToday(new Date(o.deadline));
    const isWithinThreshold = isBefore(new Date(o.deadline), addDays(new Date(), CRITICAL_DAYS_THRESHOLD)) && (isFuture(new Date(o.deadline)) || isToday(new Date(o.deadline)));
    return (isPast || isWithinThreshold) && o.reviewStatus !== "Fulfilled";
  });

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
        <div className="bg-slate-950/80 p-6 rounded-xl border border-slate-800 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Upcoming Deadlines</p>
            <p className="text-3xl font-extrabold text-white mt-1">{upcomingDeadlines.length}</p>
          </div>
          <div className="p-3 bg-indigo-500/10 rounded-lg">
            <Clock className="h-6 w-6 text-indigo-400" />
          </div>
        </div>
        <div className="bg-slate-950/80 p-6 rounded-xl border border-slate-800 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Missed Deadlines</p>
            <p className="text-3xl font-extrabold text-rose-500 mt-1">{missedDeadlines.length}</p>
          </div>
          <div className="p-3 bg-rose-500/10 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-rose-400" />
          </div>
        </div>
        <div className="bg-slate-950/80 p-6 rounded-xl border border-slate-800 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Completed Tasks</p>
            <p className="text-3xl font-extrabold text-emerald-500 mt-1">{completedTasks.length}</p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-lg">
            <CheckCircle2 className="h-6 w-6 text-emerald-400" />
          </div>
        </div>
        <div className="bg-slate-950/80 p-6 rounded-xl border border-slate-800 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Critical Obligations</p>
            <p className="text-3xl font-extrabold text-amber-500 mt-1">{criticalObligations.length}</p>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-amber-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Calendar View */}
          <div className="bg-slate-950/40 rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{format(currentDate, "MMMM yyyy")}</h2>
              <div className="flex gap-2">
                <button onClick={prevMonth} className="p-2 rounded-md hover:bg-slate-800 text-slate-400">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button onClick={nextMonth} className="p-2 rounded-md hover:bg-slate-800 text-slate-400">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-7 gap-px mb-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {days.map((day, idx) => {
                  const { dayObligations, dayTasks } = getEventsForDay(day);
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                  return (
                    <div key={idx} className={`min-h-[100px] p-2 rounded-lg border ${isCurrentMonth ? 'border-border bg-slate-950/80' : 'border-transparent bg-slate-950/10'}`}>
                      <p className={`text-xs font-bold mb-1.5 ${isCurrentMonth ? 'text-slate-400' : 'text-slate-700'}`}>
                        {format(day, dateFormat)}
                      </p>
                      <div className="space-y-1">
                        {dayObligations.map(o => (
                          <div key={o.id} className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-red-950/30 text-red-400 truncate border border-red-900/30">
                            {o.title}
                          </div>
                        ))}
                        {dayTasks.map(t => (
                          <div key={t.id} className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-950/30 text-indigo-400 truncate border border-indigo-900/30">
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
          <div className="bg-slate-950/40 rounded-xl border border-border p-6 mb-6">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-1.5"><Clock className="h-4 w-4 text-indigo-400" /> Upcoming Deadlines</h2>
            <div className="space-y-3">
              {upcomingDeadlines.slice(0, 5).map((o, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-border/60 bg-slate-950/60">
                  <div className="flex justify-between items-start mb-1.5">
                    <p className="font-semibold text-slate-200 line-clamp-1">{o.title}</p>
                    <Badge variant="outline" className="border-border text-[10px]">
                      {format(new Date(o.deadline || o.dueDate), "MMM d")}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate">{o.circular?.title || "Operational Task"}</p>
                </div>
              ))}
              {upcomingDeadlines.length === 0 && (
                <p className="text-xs text-slate-500 py-4 text-center">No upcoming deadlines.</p>
              )}
            </div>
          </div>

          <div className="bg-slate-950/40 rounded-xl border border-border p-6">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-1.5"><Scale className="h-4 w-4 text-emerald-400" /> Active Action Items</h2>
            <div className="space-y-3">
              {tasks.filter(t => t.status !== "Done").slice(0, 5).map(t => (
                <div key={t.id} className="p-3 rounded-lg border border-border/60 bg-slate-950/60">
                  <div className="flex justify-between items-start mb-1.5">
                    <p className="font-semibold text-slate-200 line-clamp-1">{t.obligation?.title}</p>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <Badge className="bg-slate-800 text-slate-300 text-[9px] uppercase font-mono">
                      {t.status}
                    </Badge>
                    {t.dueDate && (
                      <span className="text-[10px] text-slate-500 font-mono">
                        Due: {format(new Date(t.dueDate), "MMM d")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {tasks.filter(t => t.status !== "Done").length === 0 && (
                <p className="text-xs text-slate-500 py-4 text-center">No pending action items.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
