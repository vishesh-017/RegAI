import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TimelineClient from "./TimelineClient";

export default async function TimelinePage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const orgId = session?.user?.organizationId as string;
  const role = (session?.user as any)?.role || "Admin";

  if (!userId || !orgId) {
    redirect("/sign-in");
  }

  // Fetch current user details to get department
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { department: true }
  });
  const userDept = dbUser?.department || "";

  // Scoped queries: Managers only see events related to their department
  const oblWhere: any = {
    organizationId: orgId,
    deadline: { not: null }
  };

  const taskWhere: any = {
    organizationId: orgId,
    dueDate: { not: null }
  };

  if (role === "Manager" && userDept) {
    oblWhere.department = userDept;
    taskWhere.OR = [
      { department: userDept },
      { obligation: { department: userDept } }
    ];
  }

  // Fetch Obligations with deadlines
  const obligations = await prisma.obligation.findMany({
    where: oblWhere,
    include: {
      circular: {
        select: { title: true, referenceNumber: true }
      }
    },
    orderBy: { deadline: 'asc' }
  });

  // Fetch WorkflowTasks with due dates
  const tasks = await prisma.workflowTask.findMany({
    where: taskWhere,
    include: {
      obligation: {
        select: { title: true, priority: true }
      },
      owner: {
        select: { email: true }
      }
    },
    orderBy: { dueDate: 'asc' }
  });

  // Serialize dates to pass to client
  const serializedObligations = obligations.map(o => ({
    ...o,
    deadline: o.deadline ? o.deadline.toISOString() : null,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
    approvedAt: o.approvedAt ? o.approvedAt.toISOString() : null,
    extractionTimestamp: o.extractionTimestamp ? o.extractionTimestamp.toISOString() : null
  }));

  const serializedTasks = tasks.map(t => ({
    ...t,
    dueDate: t.dueDate ? t.dueDate.toISOString() : null,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString()
  }));

  return <TimelineClient obligations={serializedObligations} tasks={serializedTasks} />;
}
