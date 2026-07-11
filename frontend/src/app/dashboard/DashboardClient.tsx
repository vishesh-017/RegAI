"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck, FileText, AlertTriangle, CheckCircle, Clock, Activity,
  Users, ArrowRight, TrendingUp, TrendingDown, Loader2, Eye, ClipboardList,
  Upload, BarChart2, Lock, Briefcase, Scale, Search, ShieldAlert, Sparkles, CheckSquare, ChevronDown
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";

const chartLoading = () => <div className="h-[250px] w-full flex items-center justify-center bg-muted/10 rounded-lg"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

const ComplianceTrendChart = dynamic(() => import("@/components/dashboard/Charts").then(mod => mod.ComplianceTrendChart), { ssr: false, loading: chartLoading });
const TasksByDepartmentChart = dynamic(() => import("@/components/dashboard/Charts").then(mod => mod.TasksByDepartmentChart), { ssr: false, loading: chartLoading });
const TaskCompletionChart = dynamic(() => import("@/components/dashboard/Charts").then(mod => mod.TaskCompletionChart), { ssr: false, loading: chartLoading });
const TimelineChart = dynamic(() => import("@/components/dashboard/Charts").then(mod => mod.TimelineChart), { ssr: false, loading: chartLoading });

type DashboardData = {
  totalCirculars: number;
  activeCirculars: number;
  totalObligations: number;
  pendingObligations: number;
  approvedObligations: number;
  rejectedObligations: number;
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  doneTasks: number;
  totalUsers: number;
  complianceScore: number;
  recentAuditLogs: any[];
  upcomingDeadlines: any[];
  
  // Scoped manager parameters
  userDepartment: string;
  deptTotalTasks: number;
  deptTodoTasks: number;
  deptInProgressTasks: number;
  deptDoneTasks: number;
  deptUpcomingDeadlines: any[];

  // Compliance metrics
  draftCircularsAwaitingInterpretation: any[];
  totalGaps: number;
  tasksCreatedThisMonth: number;
  overdueObligations: number;

  // Auditor metrics
  evidenceTasksCount: number;
  evidenceWithFileCount: number;
  discrepancyCount: number;
  auditFindingsCount: number;
  auditTrailFullList: any[];
};

// ─────────────────────────────────────────────────────────────
// ADMIN DASHBOARD — Full platform overview + user management
// ─────────────────────────────────────────────────────────────
function AdminDashboard({ data }: { data: DashboardData }) {
  const kpis = [
    { label: "Compliance Score", value: `${data.complianceScore}%`, icon: ShieldCheck, iconBg: "bg-indigo-500/10", iconCls: "text-indigo-500" },
    { label: "Total Circulars", value: String(data.totalCirculars), icon: FileText, iconBg: "bg-blue-500/10", iconCls: "text-blue-500" },
    { label: "Total Obligations", value: String(data.totalObligations), icon: Scale, iconBg: "bg-purple-500/10", iconCls: "text-purple-500" },
    { label: "Active Tasks", value: String(data.todoTasks + data.inProgressTasks), icon: ClipboardList, iconBg: "bg-amber-500/10", iconCls: "text-amber-500" },
    { label: "Platform Users", value: String(data.totalUsers), icon: Users, iconBg: "bg-emerald-500/10", iconCls: "text-emerald-500" },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto page-enter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[10px] font-bold border-indigo-500/30 text-indigo-400 bg-indigo-500/10">ADMIN</Badge>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Platform Overview</h1>
          <p className="text-muted-foreground mt-1 text-sm">Full system health, user activity, and compliance posture.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/settings">
            <button className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2">
              <Users className="h-4 w-4" /> Manage Users
            </button>
          </Link>
          <Link href="/reports">
            <button className="px-5 py-2.5 text-sm flex items-center gap-2 border border-border rounded-lg hover:bg-muted transition-colors text-slate-200">
              Generate Report <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="rounded-xl border-border shadow-sm hover:shadow-md bg-card transition-all duration-300 group overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-5 px-5">
              <CardTitle className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{kpi.label}</CardTitle>
              <div className={`p-1.5 rounded-lg ${kpi.iconBg}`}>
                <kpi.icon className={`h-4 w-4 ${kpi.iconCls}`} />
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="text-4xl font-extrabold tracking-tighter text-foreground mb-1 transition-transform group-hover:scale-[1.02] origin-left">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="rounded-xl border-border shadow-sm bg-card">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-bold tracking-tight text-foreground">Compliance Trend</CardTitle><CardDescription className="text-xs text-muted-foreground">Platform-wide compliance readiness over time.</CardDescription></CardHeader>
          <CardContent><ComplianceTrendChart /></CardContent>
        </Card>
        <Card className="rounded-xl border-border shadow-sm bg-card">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-bold tracking-tight text-foreground">Tasks by Department</CardTitle><CardDescription className="text-xs text-muted-foreground">Volume of active obligations per team.</CardDescription></CardHeader>
          <CardContent><TasksByDepartmentChart /></CardContent>
        </Card>
        <Card className="rounded-xl border-border shadow-sm bg-card">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-bold tracking-tight text-foreground">Task Completion</CardTitle><CardDescription className="text-xs text-muted-foreground">Distribution of workload status.</CardDescription></CardHeader>
          <CardContent className="flex justify-center"><TaskCompletionChart /></CardContent>
        </Card>
        <Card className="rounded-xl border-border shadow-sm bg-card">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-bold tracking-tight text-foreground">Regulatory Timeline</CardTitle><CardDescription className="text-xs text-muted-foreground">Upcoming deadlines and circular effective dates.</CardDescription></CardHeader>
          <CardContent><TimelineChart /></CardContent>
        </Card>
      </div>

      {/* Recent Audit Logs */}
      <Card className="rounded-xl border-border shadow-sm bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div><CardTitle className="text-sm font-bold tracking-tight text-foreground">Recent Activity</CardTitle><CardDescription className="text-xs text-muted-foreground">Latest actions across your organization.</CardDescription></div>
          <Link href="/audit-logs"><button className="text-xs text-muted-foreground hover:text-foreground hover:underline font-medium">View all</button></Link>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="space-y-1">
            {data.recentAuditLogs.slice(0, 5).map((log: any, i: number) => (
              <div key={i} className="flex items-start gap-3 px-2 py-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="bg-muted p-2 rounded-lg shrink-0"><Activity className="h-4 w-4 text-foreground" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground">{log.action}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{log.entityType} • by {log.performedBy?.email || "System"}</p>
                </div>
                <span className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0 mt-0.5">
                  {new Date(log.timestamp).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                </span>
              </div>
            ))}
            {data.recentAuditLogs.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No activity yet. Upload a circular to get started.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// COMPLIANCE OFFICER DASHBOARD — Approval queue + review metrics
// ────────────────────────────────────────────────────────────────────
function ComplianceOfficerDashboard({ data }: { data: DashboardData }) {
  const kpis = [
    { label: "Obligations Pending Review", value: String(data.pendingObligations), icon: AlertTriangle, iconBg: "bg-amber-500/10", iconCls: "text-amber-500", urgent: data.pendingObligations > 0 },
    { label: "Gaps Identified", value: String(data.totalGaps), icon: ShieldAlert, iconBg: "bg-rose-500/10", iconCls: "text-rose-500" },
    { label: "Tasks Created This Month", value: String(data.tasksCreatedThisMonth), icon: ClipboardList, iconBg: "bg-blue-500/10", iconCls: "text-blue-500" },
    { label: "Overdue Obligations", value: String(data.overdueObligations), icon: Clock, iconBg: "bg-red-500/10", iconCls: "text-red-500" },
    { label: "Compliance Score", value: `${data.complianceScore}%`, icon: ShieldCheck, iconBg: "bg-indigo-500/10", iconCls: "text-indigo-500" },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto page-enter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[10px] font-bold border-emerald-500/30 text-emerald-400 bg-emerald-500/10">COMPLIANCE OFFICER</Badge>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Review & Approve</h1>
          <p className="text-muted-foreground mt-1 text-sm">AI-extracted obligations require your sign-off before becoming operational.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/circulars/upload">
            <button className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2"><Upload className="h-4 w-4" /> Upload Circular</button>
          </Link>
          <Link href="/circulars">
            <button className="px-5 py-2.5 text-sm flex items-center gap-2 border border-border rounded-lg hover:bg-muted transition-colors text-slate-200"><Search className="h-4 w-4" /> Review Queue</button>
          </Link>
        </div>
      </div>

      {/* Approval Alert */}
      {data.pendingObligations > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center gap-4">
          <div className="bg-amber-500/20 p-2.5 rounded-lg"><AlertTriangle className="h-5 w-5 text-amber-500" /></div>
          <div className="flex-1">
            <p className="text-sm font-bold text-foreground">{data.pendingObligations} obligations awaiting your review</p>
            <p className="text-xs text-muted-foreground mt-0.5">AI-extracted items require human approval before workflow generation.</p>
          </div>
          <Link href="/circulars">
            <button className="btn-primary px-4 py-2 text-sm">Review Now <ArrowRight className="h-3.5 w-3.5 inline ml-1" /></button>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className={`rounded-xl border-border shadow-sm hover:shadow-md bg-card transition-all duration-300 group overflow-hidden ${(kpi as any).urgent ? "ring-1 ring-amber-500/30" : ""}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-5 px-5">
              <CardTitle className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{kpi.label}</CardTitle>
              <div className={`p-1.5 rounded-lg ${kpi.iconBg}`}><kpi.icon className={`h-4 w-4 ${kpi.iconCls}`} /></div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="text-4xl font-extrabold tracking-tighter text-foreground mb-1">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Queue: Circulars Awaiting Interpretation Approval */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 rounded-xl border border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2"><Sparkles className="h-4 w-4 text-emerald-400" /> Circulars Awaiting Interpretation Approval</CardTitle>
            <CardDescription className="text-xs text-slate-400">Newly ingested SEBI regulations pending compliance sign-off.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border/60">
              {data.draftCircularsAwaitingInterpretation.map((circ, idx) => (
                <div key={idx} className="py-3 flex justify-between items-center gap-4 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono bg-muted border border-border px-1.5 py-0.5 rounded text-muted-foreground">{circ.referenceNumber}</span>
                    <p className="text-sm font-semibold text-slate-200 mt-1 truncate max-w-lg">{circ.title}</p>
                  </div>
                  <Link href={`/circulars/${circ.id}`}>
                    <button className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">Review <ChevronDown className="h-3 w-3 -rotate-90" /></button>
                  </Link>
                </div>
              ))}
              {data.draftCircularsAwaitingInterpretation.length === 0 && (
                <div className="py-8 text-center text-xs text-muted-foreground">No circulars currently awaiting approval. Everything up-to-date!</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-foreground">Review Action Metrics</CardTitle>
            <CardDescription className="text-xs text-slate-400">Monthly throughput status.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center text-sm border-b border-border/40 pb-2">
              <span className="text-slate-400">Approved Obligations</span>
              <span className="font-bold text-emerald-400">{data.approvedObligations}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-border/40 pb-2">
              <span className="text-slate-400">Rejected Obligations</span>
              <span className="font-bold text-rose-400">{data.rejectedObligations}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Total Extracted Records</span>
              <span className="font-bold text-indigo-400">{data.totalObligations}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="rounded-xl border-border shadow-sm bg-card">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-bold tracking-tight text-foreground">Compliance Trend</CardTitle><CardDescription className="text-xs text-muted-foreground">Review progress over time.</CardDescription></CardHeader>
          <CardContent><ComplianceTrendChart /></CardContent>
        </Card>
        <Card className="rounded-xl border-border shadow-sm bg-card">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-bold tracking-tight text-foreground">Task Completion</CardTitle><CardDescription className="text-xs text-muted-foreground">Workflow status distribution.</CardDescription></CardHeader>
          <CardContent className="flex justify-center"><TaskCompletionChart /></CardContent>
        </Card>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// MANAGER DASHBOARD — Department tasks, team workload
// ────────────────────────────────────────────────────────────
function ManagerDashboard({ data }: { data: DashboardData }) {
  const completionPercent = data.deptTotalTasks > 0 ? Math.round((data.deptDoneTasks / data.deptTotalTasks) * 100) : 0;

  const kpis = [
    { label: "My Team's Tasks", value: String(data.deptTotalTasks), icon: ClipboardList, iconBg: "bg-blue-500/10", iconCls: "text-blue-500" },
    { label: "To Do", value: String(data.deptTodoTasks), icon: Clock, iconBg: "bg-slate-500/10", iconCls: "text-slate-500" },
    { label: "In Progress", value: String(data.deptInProgressTasks), icon: Activity, iconBg: "bg-amber-500/10", iconCls: "text-amber-500" },
    { label: "Done", value: String(data.deptDoneTasks), icon: CheckCircle, iconBg: "bg-emerald-500/10", iconCls: "text-emerald-500" },
    { label: "Completion Rate", value: `${completionPercent}%`, icon: TrendingUp, iconBg: "bg-indigo-500/10", iconCls: "text-indigo-500" },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto page-enter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[10px] font-bold border-blue-500/30 text-blue-400 bg-blue-500/10">MANAGER</Badge>
            <Badge variant="outline" className="text-[10px] font-bold border-slate-700 text-slate-400 bg-slate-800/40 uppercase">{data.userDepartment} Department</Badge>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Task Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">Track your team&apos;s compliance tasks, deadlines, and workload for {data.userDepartment}.</p>
        </div>
        <Link href="/act">
          <button className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2"><Briefcase className="h-4 w-4" /> Open Kanban Board</button>
        </Link>
      </div>

      {/* Progress Bar */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-foreground">Team Task Completion Progress</p>
          <span className="text-2xl font-extrabold text-foreground">{completionPercent}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-emerald-500 h-3 rounded-full transition-all duration-500" style={{ width: `${completionPercent}%` }} />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{data.deptDoneTasks} completed</span>
          <span>{data.deptTodoTasks + data.deptInProgressTasks} remaining</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="rounded-xl border-border shadow-sm hover:shadow-md bg-card transition-all duration-300 group overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-5 px-5">
              <CardTitle className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{kpi.label}</CardTitle>
              <div className={`p-1.5 rounded-lg ${kpi.iconBg}`}><kpi.icon className={`h-4 w-4 ${kpi.iconCls}`} /></div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="text-4xl font-extrabold tracking-tighter text-foreground mb-1">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 rounded-xl border border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2"><CheckSquare className="h-4 w-4 text-blue-400" /> Upcoming Department Deadlines</CardTitle>
            <CardDescription className="text-xs text-slate-400">Obligations belonging to your department due in the next 14 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.deptUpcomingDeadlines.map((deadline, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-900/40 p-3 rounded-lg border border-border/40">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-200 truncate">{deadline.title}</p>
                    <span className="text-[10px] text-slate-400 font-medium">Priority: {deadline.priority}</span>
                  </div>
                  <Badge variant="outline" className="border-rose-500/20 text-rose-400 bg-rose-500/10 text-xs">
                    {new Date(deadline.deadline).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                  </Badge>
                </div>
              ))}
              {data.deptUpcomingDeadlines.length === 0 && (
                <div className="py-8 text-center text-xs text-muted-foreground">No urgent deadlines for {data.userDepartment}. Keep it up!</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-foreground">Task Completion</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Status chart for your department.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <TaskCompletionChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// AUDITOR DASHBOARD — Read-only compliance audit view
// ────────────────────────────────────────────────────────────
function AuditorDashboard({ data }: { data: DashboardData }) {
  const [searchTerm, setSearchTerm] = useState("");

  const coveragePercent = data.evidenceTasksCount > 0
    ? Math.round((data.evidenceWithFileCount / data.evidenceTasksCount) * 100)
    : 0;

  const kpis = [
    { label: "Compliance Score", value: `${data.complianceScore}%`, icon: ShieldCheck, iconBg: "bg-indigo-500/10", iconCls: "text-indigo-500" },
    { label: "Evidence Coverage %", value: `${coveragePercent}%`, icon: CheckCircle, iconBg: "bg-emerald-500/10", iconCls: "text-emerald-500" },
    { label: "Flagged Discrepancies", value: String(data.discrepancyCount), icon: ShieldAlert, iconBg: "bg-rose-500/10", iconCls: "text-rose-500" },
    { label: "Audit Findings Logged", value: String(data.auditFindingsCount), icon: AlertTriangle, iconBg: "bg-amber-500/10", iconCls: "text-amber-500" },
    { label: "Audit Trail Entries", value: String(data.auditTrailFullList.length), icon: Eye, iconBg: "bg-purple-500/10", iconCls: "text-purple-500" },
  ];

  const filteredLogs = data.auditTrailFullList.filter(log =>
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.entityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.performedBy?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto page-enter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[10px] font-bold border-amber-500/30 text-amber-400 bg-amber-500/10">AUDITOR</Badge>
            <Badge variant="outline" className="text-[10px] font-bold border-border text-muted-foreground bg-muted"><Lock className="h-2.5 w-2.5 inline mr-1" />READ-ONLY</Badge>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Compliance Audit</h1>
          <p className="text-muted-foreground mt-1 text-sm">Immutable audit trail, compliance gaps, and historical analysis.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/reports">
            <button className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2"><BarChart2 className="h-4 w-4" /> Generate Audit Report</button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="rounded-xl border-border shadow-sm hover:shadow-md bg-card transition-all duration-300 group overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-5 px-5">
              <CardTitle className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{kpi.label}</CardTitle>
              <div className={`p-1.5 rounded-lg ${kpi.iconBg}`}><kpi.icon className={`h-4 w-4 ${kpi.iconCls}`} /></div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="text-4xl font-extrabold tracking-tighter text-foreground mb-1">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Interactive Searchable Audit Log Table */}
      <Card className="rounded-xl border border-border bg-card">
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2"><Lock className="h-3.5 w-3.5 text-amber-500" /> Searchable Compliance Audit Logs</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Verify exact mappings from Circular → Obligation → Task → Evidence.</CardDescription>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search actions or actors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-900 border border-border rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/60 text-slate-400 font-bold uppercase bg-slate-800/30">
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Entity Type</th>
                  <th className="py-3 px-4">Performed By</th>
                  <th className="py-3 px-4">Description/Reason</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      <Badge variant="outline" className="border-indigo-500/20 text-indigo-400 bg-indigo-500/5 font-mono text-[10px]">{log.action}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{log.entityType}</td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">
                      {log.performedBy?.email || "System"}
                      <span className="block text-[10px] text-muted-foreground capitalize">{log.performedBy?.role || "Auto-job"}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 max-w-sm truncate" title={log.reason || "N/A"}>{log.reason || "N/A"}</td>
                    <td className="py-3.5 px-4 text-right text-slate-400 tabular-nums">
                      {new Date(log.timestamp).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">No logs matching search criteria.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="rounded-xl border-border shadow-sm bg-card">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-bold tracking-tight text-foreground">Compliance Trend</CardTitle><CardDescription className="text-xs text-muted-foreground">Historical compliance posture.</CardDescription></CardHeader>
          <CardContent><ComplianceTrendChart /></CardContent>
        </Card>
        <Card className="rounded-xl border-border shadow-sm bg-card">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-bold tracking-tight text-foreground">Task Completion</CardTitle><CardDescription className="text-xs text-muted-foreground">Obligation fulfillment distribution.</CardDescription></CardHeader>
          <CardContent className="flex justify-center"><TaskCompletionChart /></CardContent>
        </Card>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// MAIN COMPONENT — Routes to the correct dashboard
// ────────────────────────────────────────────────
export default function DashboardClientView({ role, data }: { role: string | null; data: DashboardData }) {
  switch (role) {
    case "Compliance Officer":
      return <ComplianceOfficerDashboard data={data} />;
    case "Manager":
      return <ManagerDashboard data={data} />;
    case "Auditor":
      return <AuditorDashboard data={data} />;
    case "Admin":
    default:
      return <AdminDashboard data={data} />;
  }
}
