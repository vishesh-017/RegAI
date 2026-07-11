import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import DashboardClientView from "./DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard | BrahmOS Compliance",
  description: "Enterprise compliance overview, KPIs, and recent activity.",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const orgId = session?.user?.organizationId;
  const role = (session?.user as any)?.role || "Admin";
  
  if (!userId) {
    redirect("/sign-in");
  }

  if (!orgId) {
    redirect("/onboarding");
  }

  // Fetch the current user to get their department
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { department: true }
  });
  const userDept = dbUser?.department || "Operations";

  // Fetch real data from database for dashboard KPIs
  const [
    totalCirculars,
    activeCirculars,
    totalObligations,
    pendingObligations,
    approvedObligations,
    rejectedObligations,
    totalTasks,
    todoTasks,
    inProgressTasks,
    doneTasks,
    recentAuditLogs,
    totalUsers,
    upcomingDeadlines,
    
    // Additional metrics for differentiated dashboards
    draftCircularsAwaitingInterpretation,
    totalGaps,
    tasksCreatedThisMonth,
    overdueObligations,
    evidenceTasksCount,
    evidenceWithFileCount,
    discrepancyCount,
    auditFindingsCount,
    auditTrailFullList
  ] = await Promise.all([
    prisma.circular.count({ where: { organizationId: orgId } }),
    prisma.circular.count({ where: { organizationId: orgId, status: "Active" } }),
    prisma.obligation.count({ where: { organizationId: orgId } }),
    prisma.obligation.count({ where: { organizationId: orgId, reviewStatus: "Pending" } }),
    prisma.obligation.count({ where: { organizationId: orgId, reviewStatus: "Approved" } }),
    prisma.obligation.count({ where: { organizationId: orgId, reviewStatus: "Rejected" } }),
    prisma.workflowTask.count({ where: { organizationId: orgId } }),
    prisma.workflowTask.count({ where: { organizationId: orgId, status: "Todo" } }),
    prisma.workflowTask.count({ where: { organizationId: orgId, status: "In Progress" } }),
    prisma.workflowTask.count({ where: { organizationId: orgId, status: "Done" } }),
    prisma.auditLog.findMany({
      where: { organizationId: orgId },
      include: { performedBy: { select: { email: true, role: true } } },
      orderBy: { timestamp: "desc" },
      take: 8,
    }),
    prisma.user.count({ where: { organizationId: orgId } }),
    prisma.obligation.findMany({
      where: {
        organizationId: orgId,
        deadline: { gte: new Date(), lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      },
      select: { id: true, title: true, deadline: true, priority: true, department: true },
    }),
    
    // Compliance: Circulars awaiting interpretation (status is draft)
    prisma.circular.findMany({
      where: { organizationId: orgId, status: "Draft" },
      select: { id: true, title: true, referenceNumber: true, createdAt: true }
    }),
    // Identify gaps: reviewStatus is Approved/Gap but no task, or custom state
    prisma.obligation.count({
      where: { organizationId: orgId, reviewStatus: "Gap" }
    }),
    // Tasks created this month
    prisma.workflowTask.count({
      where: {
        organizationId: orgId,
        createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
      }
    }),
    // Overdue Obligations (deadline passed and task not done)
    prisma.obligation.count({
      where: {
        organizationId: orgId,
        deadline: { lt: new Date() },
        reviewStatus: { not: "Fulfilled" }
      }
    }),
    // Auditor: Evidence Coverage % (tasks with evidence required)
    prisma.workflowTask.count({
      where: { organizationId: orgId, evidenceRequired: true }
    }),
    // Auditor: Tasks that actually uploaded evidenceUrl
    prisma.workflowTask.count({
      where: {
        organizationId: orgId,
        evidenceRequired: true,
        evidenceUrl: { not: null }
      }
    }),
    // Auditor: Flagged Discrepancies (rejected obligations or tasks flagged)
    prisma.obligation.count({
      where: { organizationId: orgId, reviewStatus: "Rejected" }
    }),
    // Auditor: Audit Findings Logged
    prisma.workflowTask.count({
      where: {
        organizationId: orgId,
        findings: { not: null }
      }
    }),
    // Auditor: Searchable audit logs list with actor email/role
    prisma.auditLog.findMany({
      where: { organizationId: orgId },
      include: {
        performedBy: { select: { email: true, role: true } }
      },
      orderBy: { timestamp: "desc" },
      take: 20
    })
  ]);

  // Scoped queries for Manager Dashboard (department-based filtering)
  const [
    deptTotalTasks,
    deptTodoTasks,
    deptInProgressTasks,
    deptDoneTasks,
    deptUpcomingDeadlines
  ] = await Promise.all([
    prisma.workflowTask.count({
      where: {
        organizationId: orgId,
        OR: [
          { department: userDept },
          { obligation: { department: userDept } }
        ]
      }
    }),
    prisma.workflowTask.count({
      where: {
        organizationId: orgId,
        status: "Todo",
        OR: [
          { department: userDept },
          { obligation: { department: userDept } }
        ]
      }
    }),
    prisma.workflowTask.count({
      where: {
        organizationId: orgId,
        status: "In Progress",
        OR: [
          { department: userDept },
          { obligation: { department: userDept } }
        ]
      }
    }),
    prisma.workflowTask.count({
      where: {
        organizationId: orgId,
        status: "Done",
        OR: [
          { department: userDept },
          { obligation: { department: userDept } }
        ]
      }
    }),
    prisma.obligation.findMany({
      where: {
        organizationId: orgId,
        department: userDept,
        deadline: { gte: new Date(), lte: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) }
      },
      select: { id: true, title: true, deadline: true, priority: true }
    })
  ]);

  const complianceScore = totalObligations > 0
    ? Math.round(((approvedObligations + doneTasks) / (totalObligations + totalTasks || 1)) * 100)
    : 0;

  const dashboardData = {
    totalCirculars,
    activeCirculars,
    totalObligations,
    pendingObligations,
    approvedObligations,
    rejectedObligations,
    totalTasks,
    todoTasks,
    inProgressTasks,
    doneTasks,
    totalUsers,
    complianceScore,
    userDepartment: userDept,
    
    // Scoped metrics for Manager
    deptTotalTasks,
    deptTodoTasks,
    deptInProgressTasks,
    deptDoneTasks,
    deptUpcomingDeadlines: deptUpcomingDeadlines.map(d => ({
      ...d,
      deadline: d.deadline?.toISOString() || null
    })),
    
    // Compliance Metrics
    draftCircularsAwaitingInterpretation,
    totalGaps,
    tasksCreatedThisMonth,
    overdueObligations,
    
    // Auditor Metrics
    evidenceTasksCount,
    evidenceWithFileCount,
    discrepancyCount,
    auditFindingsCount,
    auditTrailFullList: auditTrailFullList.map(log => ({
      ...log,
      timestamp: log.timestamp.toISOString()
    })),

    recentAuditLogs: recentAuditLogs.map(log => ({
      ...log,
      timestamp: log.timestamp.toISOString(),
    })),
    upcomingDeadlines: upcomingDeadlines.map(d => ({
      ...d,
      deadline: d.deadline?.toISOString() || null,
    })),
  };

  return <DashboardClientView role={role} data={dashboardData} />;
}
