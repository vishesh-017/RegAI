import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SettingsClient from "./SettingsClient";


export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;
  const orgId = session?.user?.organizationId as string;
  
  if (!userId || !orgId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  const organization = await prisma.organization.findUnique({
    where: { id: orgId },
  });

  const allUsers = await prisma.user.findMany({
    where: { organizationId: orgId },
    select: { id: true, email: true, role: true, createdAt: true }
  });

  const serializedUsers = allUsers.map(u => ({
    ...u,
    createdAt: u.createdAt.toISOString()
  }));

  return (
    <SettingsClient 
      user={user} 
      organization={organization} 
      users={serializedUsers} 
    />
  );
}
