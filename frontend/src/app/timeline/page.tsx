import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TimelineClient from "./TimelineClient";


export default async function TimelinePage() {
  const session = await getServerSession(authOptions);
  const orgId = session?.user?.organizationId as string;
  
  if (!orgId) {
    redirect("/sign-in");
  }

  // Fetch Obligations with deadlines
  const obligations = await prisma.obligation.findMany({
    where: { 
      organizationId: orgId,
      deadline: { not: null }
    },
    include: {
      circular: {
        select: { title: true, referenceNumber: true }
      }
    },
    orderBy: { deadline: 'asc' }
  });

  // Fetch WorkflowTasks with due dates
  const tasks = await prisma.workflowTask.findMany({
    where: {
      organizationId: orgId,
      dueDate: { not: null }
    },
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
