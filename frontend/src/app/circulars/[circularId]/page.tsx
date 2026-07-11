import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CommandCenterClient from "./CommandCenterClient";

export default async function CircularCommandCenterPage({ params }: { params: { circularId: string } }) {
  const session = await getServerSession(authOptions);
  const orgId = session?.user?.organizationId as string;
  
  if (!orgId) {
    redirect("/onboarding");
  }

  const dbOrg = await prisma.organization.findUnique({
    where: { id: orgId }
  });

  if (!dbOrg) {
    redirect("/onboarding");
  }

  const circular = await prisma.circular.findUnique({
    where: { 
      id: params.circularId,
      organizationId: dbOrg.id
    },
    include: {
      obligations: true
    }
  });

  if (!circular) {
    redirect("/circulars");
  }

  // Safe checks to prevent crash if lists are empty
  const obligationIds = circular.obligations.map(o => o.id);
  const auditLogs = obligationIds.length > 0 ? await prisma.auditLog.findMany({
    where: {
      organizationId: dbOrg.id,
      entityType: 'Obligation',
      entityId: { in: obligationIds }
    },
    orderBy: { timestamp: 'desc' },
    include: { performedBy: true }
  }) : [];

  const regulatoryChanges = await prisma.regulatoryChange.findMany({
    where: { newObligation: { circularId: circular.id } },
    include: { newObligation: true, oldObligation: true }
  });

  const workflowTasks = await prisma.workflowTask.findMany({
    where: { obligation: { circularId: circular.id } },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-[1600px] mx-auto animate-in fade-in duration-500 pb-20">
      <CommandCenterClient 
        circular={circular} 
        obligations={circular.obligations} 
        auditLogs={auditLogs}
        regulatoryChanges={regulatoryChanges}
        workflowTasks={workflowTasks}
      />
    </div>
  );
}
