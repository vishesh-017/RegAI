import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AuditLogsClient from "./AuditLogsClient";


export default async function AuditLogsPage() {
  const session = await getServerSession(authOptions);
  const orgId = session?.user?.organizationId as string;
  
  if (!orgId) {
    redirect("/sign-in");
  }

  const logs = await prisma.auditLog.findMany({
    where: { organizationId: orgId },
    include: {
      performedBy: {
        select: { email: true, role: true }
      }
    },
    orderBy: { timestamp: 'desc' }
  });

  const serializedLogs = logs.map(log => ({
    ...log,
    timestamp: log.timestamp.toISOString()
  }));

  return <AuditLogsClient initialLogs={serializedLogs} />;
}
