import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import NotificationsClient from "./NotificationsClient";


export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;
  const orgId = session?.user?.organizationId as string;
  
  if (!userId || !orgId) {
    redirect("/sign-in");
  }

  const notifications = await prisma.notification.findMany({
    where: { 
      organizationId: orgId,
      recipientId: userId
    },
    orderBy: { createdAt: 'desc' }
  });

  const serializedNotifications = notifications.map(n => ({
    ...n,
    createdAt: n.createdAt.toISOString()
  }));

  return <NotificationsClient initialNotifications={serializedNotifications} />;
}
