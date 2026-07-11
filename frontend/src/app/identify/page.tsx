import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import IdentifyClient from "./IdentifyClient";

export default async function IdentifyPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const orgId = session?.user?.organizationId as string;
  const role = (session?.user as any)?.role || "Admin";

  if (!userId || !orgId) {
    redirect("/sign-in");
  }

  // Fetch real regulatory changes from db
  const changes = await prisma.regulatoryChange.findMany({
    include: {
      newObligation: {
        include: {
          circular: true
        }
      },
      oldObligation: {
        include: {
          circular: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const serializedChanges = changes.map(c => ({
    id: c.id,
    changeType: c.changeType, // Added, Modified, Removed
    changeSummary: c.changeSummary,
    affectedDepartments: c.affectedDepartments || "General",
    implementationImpact: c.implementationImpact || "",
    estimatedEffort: c.estimatedEffort || "Medium",
    newObligation: {
      ruleReference: c.newObligation.ruleReference || "",
      title: c.newObligation.title,
      description: c.newObligation.description,
      priority: c.newObligation.priority,
      circularRef: c.newObligation.circular.referenceNumber
    },
    oldObligation: c.oldObligation ? {
      ruleReference: c.oldObligation.ruleReference || "",
      title: c.oldObligation.title,
      description: c.oldObligation.description,
      circularRef: c.oldObligation.circular.referenceNumber
    } : null
  }));

  return <IdentifyClient initialChanges={serializedChanges} role={role} />;
}
