import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import DashboardClientView from "./DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard | BrahmOS Compliance",
  description: "Enterprise compliance overview, KPIs, and recent activity.",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const orgId = session?.user?.organizationId;
  const role = (session?.user as any)?.role || "Admin";
  
  if (!userId) {
    redirect("/sign-in");
  }

  // If the user has no active organization, force them to onboarding
  if (!orgId) {
    redirect("/onboarding");
  }

  return <DashboardClientView role={role} />;
}

