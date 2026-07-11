import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export async function seedDemoDatabase() {
  try {
    // 1. Ensure users exist
    const adminExists = await prisma.user.findUnique({ where: { email: "admin@demo.com" } });
    let orgId = "";

    if (!adminExists) {
      console.log("Seeding Demo Database (Users)...");
      const org = await prisma.organization.create({
        data: {
          name: "Demo Securities Ltd.",
          organizationType: "Stock Broker"
        }
      });
      orgId = org.id;

      const hash = await bcrypt.hash("demo123", 10);
      const adminHash = await bcrypt.hash("admin123", 10);

      await prisma.user.createMany({
        data: [
          { email: "admin@demo.com", password: adminHash, role: "Admin", organizationId: org.id },
          { email: "compliance@demo.com", password: hash, role: "Compliance Officer", organizationId: org.id },
          { email: "manager@demo.com", password: hash, role: "Manager", organizationId: org.id },
          { email: "auditor@demo.com", password: hash, role: "Auditor", organizationId: org.id }
        ]
      });
    } else {
      const admin = await prisma.user.findUnique({ where: { email: "admin@demo.com" } });
      orgId = admin!.organizationId;
    }

    // 2. Ensure circulars exist
    const count = await prisma.circular.count();
    if (count > 0) return; // Already seeded

    console.log("Seeding Demo Database (Circulars & Obligations)...");

    const admin = await prisma.user.findUnique({ where: { email: "admin@demo.com" } });
    const manager = await prisma.user.findUnique({ where: { email: "manager@demo.com" } });

    // Seed Circular 1
    const c1 = await prisma.circular.create({
      data: {
        organizationId: orgId,
        title: "Master Circular on KYC Norms",
        referenceNumber: "SEBI/HO/MIRSD/2026/01",
        issuingAuthority: "SEBI",
        publicationDate: new Date(),
        effectiveDate: new Date(),
        status: "Processed",
        summary: "Comprehensive guidelines on Know Your Customer requirements for stock brokers.",
        circularType: "Master Circular",
        sector: "Capital Markets",
        tags: "KYC, Onboarding",
        version: "1.0",
        createdById: admin!.id
      }
    });

    const o1 = await prisma.obligation.create({
      data: {
        organizationId: orgId,
        circularId: c1.id,
        title: "Perform CKYC Verification",
        description: "Brokers must verify client details against the Central KYC registry within 3 days of account opening.",
        appliesTo: "Stock Brokers, Depository Participants",
        sourcePage: 1,
        sourceCitation: "Brokers must verify client details against the Central KYC registry within 3 days of account opening.",
        confidenceScore: 0.95,
        reviewStatus: "Compliant",
        approvedById: admin?.id,
        businessImpact: "Medium",
        penaltyDescription: "High Penalty",
        department: "Operations"
      }
    });

    await prisma.workflowTask.create({
      data: {
        organizationId: orgId,
        obligationId: o1.id,
        status: "In Progress",
        department: "Operations",
        ownerId: manager?.id,
        createdById: admin!.id,
        dueDate: new Date(Date.now() + 86400000 * 5)
      }
    });

    // Seed Circular 2
    const c2 = await prisma.circular.create({
      data: {
        organizationId: orgId,
        title: "Cyber Security Framework for NBFCs",
        referenceNumber: "RBI/2026-27/12",
        issuingAuthority: "RBI",
        publicationDate: new Date(Date.now() - 86400000 * 2),
        effectiveDate: new Date(Date.now() + 86400000 * 30),
        status: "Processed",
        summary: "Mandatory cyber resilience framework emphasizing ransomware protection and audit logs.",
        circularType: "Guidelines",
        sector: "NBFC, Banking",
        tags: "Cyber Security, IT",
        version: "1.0",
        createdById: admin!.id
      }
    });

    await prisma.obligation.create({
      data: {
        organizationId: orgId,
        circularId: c2.id,
        title: "Implement Immutable Audit Logs",
        description: "All critical system transactions must be logged in an immutable, tamper-evident data store.",
        appliesTo: "All NBFCs",
        sourcePage: 4,
        sourceCitation: "All critical system transactions must be logged in an immutable, tamper-evident data store.",
        confidenceScore: 0.88,
        reviewStatus: "Pending",
        businessImpact: "High",
        penaltyDescription: "License Suspension",
        department: "IT Security"
      }
    });

    // Seed Circular 3
    await prisma.circular.create({
      data: {
        organizationId: orgId,
        title: "Guidelines for Algorithmic Trading",
        referenceNumber: "NSE/INSP/2026/04",
        issuingAuthority: "NSE",
        publicationDate: new Date(Date.now() - 86400000 * 5),
        effectiveDate: new Date(Date.now() + 86400000 * 15),
        status: "Processing",
        summary: "New risk controls and reporting formats for algorithmic trading facilities.",
        circularType: "Circular",
        sector: "Capital Markets",
        tags: "Algo Trading, Risk Management",
        version: "1.0",
        createdById: admin!.id
      }
    });

    console.log("Demo Seeding Complete!");
  } catch (error) {
    console.error("Seeding failed:", error);
  }
}
