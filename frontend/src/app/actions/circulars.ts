"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { storageProvider } from "@/lib/storage";
import { z } from "zod";

const UploadSchema = z.object({
  title: z.string().min(1, "Title is required"),
  referenceNumber: z.string().min(1, "Reference number is required"),
  issuingAuthority: z.string().min(1, "Issuing authority is required"),
  publicationDate: z.string(),
  effectiveDate: z.string(),
  circularType: z.string(),
});


export async function uploadCircularAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;
  const orgId = session?.user?.organizationId as string;
  
  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  // 1. Extract File
  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file provided");
  }

  // 2. Upload via Storage Abstraction
  const { url, hash } = await storageProvider.uploadFile(file, orgId);

  // 3. Extract Metadata
  const rawData = {
    title: formData.get("title") as string,
    referenceNumber: formData.get("referenceNumber") as string,
    issuingAuthority: formData.get("issuingAuthority") as string,
    publicationDate: formData.get("publicationDate") as string,
    effectiveDate: formData.get("effectiveDate") as string,
    circularType: formData.get("circularType") as string,
  };
  
  const parsed = UploadSchema.parse(rawData);
  
  // Extract arrays and store as strings since we moved to SQLite
  const sectorsJson = formData.get("sectors") as string;
  const tagsJson = formData.get("tags") as string;
  const sectorArr = sectorsJson ? JSON.parse(sectorsJson) : [];
  const tagsArr = tagsJson ? JSON.parse(tagsJson) : [];
  const sector = Array.isArray(sectorArr) ? sectorArr.join(", ") : "";
  const tags = Array.isArray(tagsArr) ? tagsArr.join(", ") : "";

  const summary = formData.get("summary") as string;
  const version = formData.get("version") as string || "1.0";
  const parentCircularId = formData.get("parentCircularId") as string || null;

  // 4. Save to Database
  const dbUser = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!dbUser) {
    throw new Error("Database user mapping not found");
  }

  const dbOrg = await prisma.organization.findUnique({
    where: { id: orgId }
  });

  if (!dbOrg) {
    throw new Error("Database organization mapping not found");
  }

  const circular = await prisma.circular.create({
    data: {
      organizationId: dbOrg.id,
      title: parsed.title,
      referenceNumber: parsed.referenceNumber,
      issuingAuthority: parsed.issuingAuthority,
      publicationDate: new Date(parsed.publicationDate),
      effectiveDate: new Date(parsed.effectiveDate),
      circularType: parsed.circularType,
      sector,
      tags,
      summary,
      status: 'Draft',
      version,
      parentCircularId: parentCircularId || null,
      documentUrl: url,
      hash,
      createdById: dbUser.id
    }
  });

  // Write audit trail log for ingestion (Step 2)
  await prisma.auditLog.create({
    data: {
      organizationId: dbOrg.id,
      entityType: 'Circular',
      entityId: circular.id,
      action: 'INGESTED',
      performedById: dbUser.id,
      reason: `Uploaded reference: ${parsed.referenceNumber}`
    }
  });

  return { success: true, circularId: circular.id };
}
