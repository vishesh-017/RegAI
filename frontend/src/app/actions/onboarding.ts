"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";


export async function createOrganizationAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;
  
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const role = formData.get("role") as string;

  if (!name || !type || !role) {
    throw new Error("Missing required fields");
  }

  try {
    // 1. Create Organization locally in SQLite
    const organization = await prisma.organization.create({
      data: {
        name,
        organizationType: type
      }
    });

    // 2. Update the user with the new organization and role
    await prisma.user.update({
      where: { id: userId },
      data: {
        organizationId: organization.id,
        role: role
      }
    });

  } catch (error) {
    console.error("Error creating organization:", error);
    throw new Error("Failed to create organization.");
  }

  redirect("/dashboard");
}
