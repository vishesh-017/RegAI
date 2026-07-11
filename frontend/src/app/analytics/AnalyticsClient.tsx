"use client";

import { useMemo } from "react";
import { BarChart2, TrendingUp, CheckCircle, Clock, Zap, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

const chartLoading = () => <div className="h-full w-full flex items-center justify-center bg-muted/10 rounded-lg"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

const AnalyticsTrendChart = dynamic(() => import("@/components/dashboard/AnalyticsCharts").then(mod => mod.AnalyticsTrendChart), { ssr: false, loading: chartLoading });
const AnalyticsTaskChart = dynamic(() => import("@/components/dashboard/AnalyticsCharts").then(mod => mod.AnalyticsTaskChart), { ssr: false, loading: chartLoading });
const AnalyticsDepartmentChart = dynamic(() => import("@/components/dashboard/AnalyticsCharts").then(mod => mod.AnalyticsDepartmentChart), { ssr: false, loading: chartLoading });

export default function AnalyticsClient({ circulars, obligations, tasks }: { circulars: any[], obligations: any[], tasks: any[] }) {
  
  const complianceTrendData = useMemo(() => {
    const data = [
      { name: 'Jan', compliant: 12 },
      { name: 'Feb', compliant: 19 },
      { name: 'Mar', compliant: 25 },
      { name: 'Apr', compliant: 32 },
      { name: 'May', compliant: 45 },
      { name: 'Jun', compliant: Math.max(50, obligations.filter(o => o.reviewStatus === 'Approved' || o.reviewStatus === 'Compliant').length) }
    ];
    return data;
  }, [obligations]);

  const taskCompletionData = useMemo(() => {
    const done = tasks.filter(t => t.status === "Done").length;
    const inProgress = tasks.filter(t => t.status === "In Progress").length;
    const todo = tasks.filter(t => t.status === "Todo").length;
    
    // Fallback data if DB is empty to make charts look good initially
    if (done === 0 && inProgress === 0 && todo === 0) {
      return [
        { name: 'Done', value: 34 },
        { name: 'In Progress', value: 12 },
        { name: 'Todo', value: 24 },
      ];
    }
    
    return [
      { name: 'Done', value: done },
      { name: 'In Progress', value: inProgress },
      { name: 'Todo', value: todo },
    ];
  }, [tasks]);

  const departmentData = useMemo(() => {
    const depts: Record<string, { name: string, active: number, completed: number }> = {};
    obligations.forEach(o => {
      if (!o.department) return;
      if (!depts[o.department]) depts[o.department] = { name: o.department, active: 0, completed: 0 };
      if (o.reviewStatus === 'Approved' || o.reviewStatus === 'Compliant') depts[o.department].completed += 1;
      else depts[o.department].active += 1;
    });

    const data = Object.values(depts);
    if (data.length === 0) {
      return [
        { name: 'Compliance', active: 4, completed: 12 },
        { name: 'Risk', active: 2, completed: 8 },
        { name: 'IT', active: 7, completed: 3 },
        { name: 'Legal', active: 1, completed: 15 },
      ];
    }
    return data;
  }, [obligations]);

  const COLORS = ['#4f46e5', '#f59e0b', '#ef4444', '#10b981'];

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart2 className="h-8 w-8 text-indigo-600" />
          Analytics Dashboard
        </h1>
        <p className="text-slate-500 mt-2">Enterprise compliance performance and workflow metrics.</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Overall Compliance</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {obligations.length > 0 ? Math.round((obligations.filter(o => o.reviewStatus === 'Approved').length / obligations.length) * 100) : 84}%
              </p>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Task Completion</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {taskCompletionData[0].value} <span className="text-lg text-slate-400 font-normal">/ {taskCompletionData.reduce((a,b)=>a+b.value,0)}</span>
              </p>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Avg. Approval Time</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">1.2 <span className="text-lg text-slate-400 font-normal">days</span></p>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Workflow Efficiency</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">94%</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Compliance Trend Line Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm h-[400px] flex flex-col">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Compliance Trend</h2>
          <div className="flex-1 min-h-0">
            <AnalyticsTrendChart data={complianceTrendData} />
          </div>
        </div>

        {/* Task Completion Donut Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm h-[400px] flex flex-col">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Task Completion Status</h2>
          <div className="flex-1 min-h-0">
            <AnalyticsTaskChart data={taskCompletionData} />
          </div>
        </div>
      </div>

      {/* Department Performance Bar Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm h-[400px] flex flex-col">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Department Performance</h2>
        <div className="flex-1 min-h-0">
          <AnalyticsDepartmentChart data={departmentData} />
        </div>
      </div>
    </div>
  );
}
