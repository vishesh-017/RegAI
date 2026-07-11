import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ActClient from "./ActClient";

export default async function ActPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const orgId = session?.user?.organizationId as string;
  const role = (session?.user as any)?.role || "Admin";

  if (!userId || !orgId) {
    redirect("/sign-in");
  }

  // Fetch the current user to get their department if they are a Manager
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { department: true }
  });
  const userDept = dbUser?.department || "";

  // Query conditions: Managers only see their department tasks
  const whereClause: any = { organizationId: orgId };
  if (role === "Manager" && userDept) {
    whereClause.OR = [
      { department: userDept },
      { obligation: { department: userDept } }
    ];
  }

  const tasks = await prisma.workflowTask.findMany({
    where: whereClause,
    include: {
      obligation: {
        select: { title: true, priority: true, department: true }
      },
      owner: {
        select: { id: true, email: true, role: true }
      }
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch named team members in the same department for assignment options
  const teamMembers = await prisma.user.findMany({
    where: {
      organizationId: orgId,
      role: { in: ["Manager", "Compliance Officer", "Auditor", "Admin"] } // allows assigning to any system users
    },
    select: {
      id: true,
      email: true,
      role: true,
      department: true
    }
  });

  const serializedTasks = tasks.map(t => ({
    id: t.id,
    title: t.comments || t.obligation?.title || "Untitled Task",
    owner: t.owner?.email?.split("@")[0] || "Unassigned",
    ownerId: t.ownerId || "",
    department: t.department || t.obligation?.department || "General",
    priority: t.priority || t.obligation?.priority || "Medium",
    dueDate: t.dueDate ? t.dueDate.toISOString().split("T")[0] : "No deadline",
    status: t.status as "Todo" | "In Progress" | "Done",
    evidenceUrl: t.evidenceUrl || "",
    findings: t.findings || ""
  }));

  const serializedTeam = teamMembers.map(m => ({
    id: m.id,
    email: m.email,
    name: m.email.split("@")[0],
    role: m.role,
    department: m.department || "General"
  }));

  return <ActClient initialTasks={serializedTasks} role={role} teamMembers={serializedTeam} />;
}
