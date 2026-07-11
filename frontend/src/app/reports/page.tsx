import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ReportsClient from "./ReportsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compliance Reports | BrahmOS",
  description: "Generate executive and departmental compliance reports.",
};

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);
  const orgId = session?.user?.organizationId as string;
  
  if (!orgId) {
    redirect("/sign-in");
  }

  // Fetch comprehensive data for reports
  const circulars = await prisma.circular.findMany({
    where: { organizationId: orgId },
    include: {
      obligations: {
        include: { workflowTasks: true }
      }
    }
  });

  const obligations = await prisma.obligation.findMany({
    where: { organizationId: orgId },
    include: { workflowTasks: true, circular: true }
  });

  const tasks = await prisma.workflowTask.findMany({
    where: { organizationId: orgId },
    include: { 
      obligation: true, 
      owner: {
        select: {
          id: true,
          email: true,
          role: true
        }
      } 
    }
  });

  // Serialize dates
  const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

  return (
    <ReportsClient 
      circulars={serialize(circulars)} 
      obligations={serialize(obligations)} 
      tasks={serialize(tasks)} 
    />
  );
}
