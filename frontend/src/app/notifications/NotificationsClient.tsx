"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCircle2, AlertTriangle, FileText, Briefcase, Check, BellOff, Inbox } from "lucide-react";

type NotificationType = 'Pending Review' | 'Upcoming Deadline' | 'Completed Task' | 'Task Assigned' | 'New Circular';

const typeConfig: Record<string, { icon: React.ReactNode; bgCls: string }> = {
  'Pending Review':    { icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,  bgCls: "bg-amber-50 dark:bg-amber-950/30" },
  'Upcoming Deadline': { icon: <AlertTriangle className="h-4 w-4 text-red-500" />,    bgCls: "bg-red-50 dark:bg-red-950/30" },
  'Completed Task':    { icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />, bgCls: "bg-emerald-50 dark:bg-emerald-950/30" },
  'Task Assigned':     { icon: <Briefcase className="h-4 w-4 text-indigo-500" />,     bgCls: "bg-indigo-50 dark:bg-indigo-950/30" },
  'New Circular':      { icon: <FileText className="h-4 w-4 text-blue-500" />,        bgCls: "bg-blue-50 dark:bg-blue-950/30" },
};

export default function NotificationsClient({ initialNotifications }: { initialNotifications: any[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, readStatus: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, readStatus: true })));
  };

  const unreadCount = notifications.filter(n => !n.readStatus).length;
  const displayed = filter === 'unread' ? notifications.filter(n => !n.readStatus) : notifications;

  return (
    <div className="max-w-3xl mx-auto page-enter pb-20">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="relative inline-flex">
              <Bell className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border-2 border-white dark:border-slate-950">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Notifications
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter tabs */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${filter === 'all' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${filter === 'unread' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
            >
              Unread
              {unreadCount > 0 && <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px]">{unreadCount}</span>}
            </button>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors px-3 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded-lg"
            >
              <Check className="h-3.5 w-3.5" />
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Notification List */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="p-5 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-5">
              {filter === 'unread' ? (
                <BellOff className="h-9 w-9 text-slate-400" />
              ) : (
                <Inbox className="h-9 w-9 text-slate-400" />
              )}
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-200 mb-1">
              {filter === 'unread' ? 'All caught up!' : 'No notifications'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {filter === 'unread' ? 'No unread notifications at the moment.' : 'Notifications will appear here as events occur.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {displayed.map((n, i) => {
              const cfg = typeConfig[n.type] ?? typeConfig['New Circular'];
              return (
                <div
                  key={n.id}
                  className={`flex gap-4 px-6 py-4 transition-colors duration-150 ${
                    !n.readStatus
                      ? 'bg-indigo-50/40 dark:bg-indigo-900/10 hover:bg-indigo-50/60 dark:hover:bg-indigo-900/20'
                      : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/30'
                  }`}
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  {/* Icon */}
                  <div className={`shrink-0 mt-0.5 h-9 w-9 rounded-full ${cfg.bgCls} flex items-center justify-center`}>
                    {cfg.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className={`text-sm font-semibold leading-tight ${!n.readStatus ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                        {n.title}
                      </p>
                      <div className="flex items-center gap-2 shrink-0">
                        {!n.readStatus && (
                          <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                        )}
                        <span className="text-[11px] text-slate-400 whitespace-nowrap">
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-2">
                      {n.message}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        {n.type}
                      </span>
                      {!n.readStatus && (
                        <button
                          onClick={() => markAsRead(n.id)}
                          className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
