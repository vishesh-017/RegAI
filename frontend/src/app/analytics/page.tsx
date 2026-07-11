import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AnalyticsClient from "./AnalyticsClient";


export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  const orgId = session?.user?.organizationId as string;
  
  if (!orgId) {
    redirect("/sign-in");
  }

  // Fetch all organizational data for the analytics engine
  const circulars = await prisma.circular.findMany({
    where: { organizationId: orgId },
    select: { createdAt: true, updatedAt: true, status: true }
  });

  const obligations = await prisma.obligation.findMany({
    where: { organizationId: orgId },
    select: { reviewStatus: true, department: true, createdAt: true, approvedAt: true }
  });

  const tasks = await prisma.workflowTask.findMany({
    where: { organizationId: orgId },
    select: { status: true, department: true, createdAt: true }
  });

  // Serialize dates
  const serialize = (arr: any[]) => arr.map(item => {
    const serialized: any = { ...item };
    if (serialized.createdAt) serialized.createdAt = serialized.createdAt.toISOString();
    if (serialized.updatedAt) serialized.updatedAt = serialized.updatedAt.toISOString();
    if (serialized.approvedAt) serialized.approvedAt = serialized.approvedAt.toISOString();
    return serialized;
  });

  return (
    <AnalyticsClient 
      circulars={serialize(circulars)} 
      obligations={serialize(obligations)} 
      tasks={serialize(tasks)} 
    />
  );
}
