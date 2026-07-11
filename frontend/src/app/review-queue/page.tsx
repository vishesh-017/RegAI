import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ReviewQueueClient from "./ReviewQueueClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Review Queue | BrahmOS Compliance",
  description: "Verify and approve AI-extracted obligations.",
};

export default async function ReviewQueuePage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const orgId = session?.user?.organizationId as string;
  const role = (session?.user as any)?.role || "Admin";

  if (!userId || !orgId) {
    redirect("/sign-in");
  }

  // Fetch all pending obligations grouped by source circular
  const obligations = await prisma.obligation.findMany({
    where: {
      organizationId: orgId,
      reviewStatus: "Pending",
    },
    include: {
      circular: {
        select: {
          id: true,
          title: true,
          referenceNumber: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const serializedObligations = obligations.map((o) => ({
    id: o.id,
    title: o.title,
    description: o.description,
    ruleReference: o.ruleReference || "",
    department: o.department || "Compliance",
    priority: o.priority,
    deadline: o.deadline ? o.deadline.toISOString().split("T")[0] : null,
    confidenceScore: o.confidenceScore || 0,
    circularId: o.circular.id,
    circularTitle: o.circular.title,
    circularRef: o.circular.referenceNumber,
  }));

  // Fetch total reviewed vs pending reviewed count
  const [totalDraftsCount, totalApprovedCount] = await Promise.all([
    prisma.obligation.count({
      where: { organizationId: orgId, reviewStatus: "Pending" }
    }),
    prisma.obligation.count({
      where: { organizationId: orgId, reviewStatus: { not: "Pending" } }
    })
  ]);

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500 pb-20">
      <ReviewQueueClient
        initialObligations={serializedObligations}
        role={role}
        totalDrafts={totalDraftsCount}
        totalApproved={totalApprovedCount}
      />
    </div>
  );
}
