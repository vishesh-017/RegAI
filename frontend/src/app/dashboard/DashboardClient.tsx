"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, FileText, AlertTriangle, CheckCircle, Clock, Activity, Users, ArrowRight, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const chartLoading = () => <div className="h-[250px] w-full flex items-center justify-center bg-muted/10 rounded-lg"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

const ComplianceTrendChart = dynamic(() => import("@/components/dashboard/Charts").then(mod => mod.ComplianceTrendChart), { ssr: false, loading: chartLoading });
const TasksByDepartmentChart = dynamic(() => import("@/components/dashboard/Charts").then(mod => mod.TasksByDepartmentChart), { ssr: false, loading: chartLoading });
const TaskCompletionChart = dynamic(() => import("@/components/dashboard/Charts").then(mod => mod.TaskCompletionChart), { ssr: false, loading: chartLoading });
const TimelineChart = dynamic(() => import("@/components/dashboard/Charts").then(mod => mod.TimelineChart), { ssr: false, loading: chartLoading });

const kpis = [
  {
    label: "Compliance Score",
    value: "98.2%",
    delta: "+1.4%",
    deltaDir: "up",
    note: "top quartile",
    icon: ShieldCheck,
    iconCls: "text-foreground",
    valueCls: "text-foreground font-extrabold tracking-tighter",
    iconBg: "bg-muted transition-colors",
  },
  {
    label: "New Reg Changes",
    value: "24",
    delta: "+5",
    deltaDir: "up",
    note: "this month",
    icon: FileText,
    iconCls: "text-foreground",
    valueCls: "text-foreground font-extrabold tracking-tighter",
    iconBg: "bg-muted transition-colors",
  },
  {
    label: "Pending Reviews",
    value: "12",
    delta: "-3",
    deltaDir: "down",
    note: "officer sign-off",
    icon: AlertTriangle,
    iconCls: "text-foreground",
    valueCls: "text-foreground font-extrabold tracking-tighter",
    iconBg: "bg-muted transition-colors",
  },
  {
    label: "Workflow Progress",
    value: "84%",
    delta: "+12%",
    deltaDir: "up",
    note: "completion rate",
    icon: CheckCircle,
    iconCls: "text-foreground",
    valueCls: "text-foreground font-extrabold tracking-tighter",
    iconBg: "bg-muted transition-colors",
  },
  {
    label: "Upcoming Deadlines",
    value: "3",
    delta: "urgent",
    deltaDir: "down",
    note: "within 7 days",
    icon: Clock,
    iconCls: "text-destructive",
    valueCls: "text-foreground font-extrabold tracking-tighter",
    iconBg: "bg-destructive/10 transition-colors",
  },
];

const recentActivity = [
  { icon: CheckCircle, iconCls: "text-foreground", bg: "bg-muted", title: "Obligation Approved", desc: "Compliance Officer verified extraction for SEBI/2026/02", time: "2 hours ago" },
  { icon: Users, iconCls: "text-foreground", bg: "bg-muted", title: "Task Assigned", desc: "KYC documentation review assigned to Risk Department", time: "5 hours ago" },
  { icon: AlertTriangle, iconCls: "text-destructive", bg: "bg-destructive/10", title: "Deadline Approaching", desc: "RBI Reporting Guidelines effective date is in 3 days.", time: "1 day ago" },
  { icon: Activity, iconCls: "text-foreground", bg: "bg-muted", title: "Circular Processed", desc: "SEBI Master Circular 2026 fully extracted (12 obligations).", time: "2 days ago" },
];

export default function DashboardClientView({ role }: { role: string | null }) {
  return (
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto page-enter">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Enterprise Compliance
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Real-time regulatory intelligence, task distribution, and compliance posture.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/reports">
            <button className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2">
              Generate Report <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </div>

      {/* Removed Redundant Answer Cards */}

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="rounded-xl border-border shadow-sm hover:shadow-md bg-card transition-all duration-300 group overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-5 px-5">
              <CardTitle className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground transition-colors">{kpi.label}</CardTitle>
              <div className={`p-1.5 rounded-lg ${kpi.iconBg}`}>
                <kpi.icon className={`h-4 w-4 ${kpi.iconCls}`} />
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className={`text-4xl ${kpi.valueCls} mb-2 transition-transform group-hover:scale-[1.02] origin-left`}>{kpi.value}</div>
              <div className="flex items-center gap-1.5">
                {kpi.deltaDir === 'up' && <TrendingUp className="h-3.5 w-3.5 text-foreground" />}
                {kpi.deltaDir === 'down' && <TrendingDown className="h-3.5 w-3.5 text-destructive" />}
                <span className={`text-xs font-bold ${kpi.deltaDir === 'up' ? 'text-foreground' : kpi.deltaDir === 'down' ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {kpi.delta}
                </span>
                <span className="text-xs font-medium text-muted-foreground">{kpi.note}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="rounded-xl border-border shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold tracking-tight text-foreground">Compliance Trend</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Platform-wide compliance readiness over time.</CardDescription>
          </CardHeader>
          <CardContent><ComplianceTrendChart /></CardContent>
        </Card>

        <Card className="rounded-xl border-border shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold tracking-tight text-foreground">Tasks by Department</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Volume of active obligations per team.</CardDescription>
          </CardHeader>
          <CardContent><TasksByDepartmentChart /></CardContent>
        </Card>

        <Card className="rounded-xl border-border shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold tracking-tight text-foreground">Task Completion</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Distribution of workload status.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center"><TaskCompletionChart /></CardContent>
        </Card>

        <Card className="rounded-xl border-border shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold tracking-tight text-foreground">Regulatory Timeline</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Upcoming deadlines and circular effective dates.</CardDescription>
          </CardHeader>
          <CardContent><TimelineChart /></CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card className="rounded-xl border-border shadow-sm bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-sm font-bold tracking-tight text-foreground">Recent Activity</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Latest actions across your organization.</CardDescription>
          </div>
          <Link href="/audit-logs">
            <button className="text-xs text-muted-foreground hover:text-foreground hover:underline font-medium">View all</button>
          </Link>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="space-y-1">
            {recentActivity.map((act, i) => (
              <div key={i} className="flex items-start gap-3 px-2 py-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className={`${act.bg} p-2 rounded-lg shrink-0`}>
                  <act.icon className={`h-4 w-4 ${act.iconCls}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground">{act.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{act.desc}</p>
                </div>
                <span className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0 mt-0.5">{act.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
