"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAIProvider } from "@/lib/ai";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/lib/notifications";

function mapErrorToResponse(error: any) {
  let type = "UNKNOWN_ERROR";
  let message = "An unexpected error occurred during AI processing.";

  const errStr = String(error).toLowerCase();
  
  if (errStr.includes("parse") || errStr.includes("pdf")) {
    type = "PDF_PARSING_FAILURE";
    message = "Failed to parse the PDF document. Ensure the file is not corrupted or password protected.";
  } else if (errStr.includes("empty") || errStr.includes("no text")) {
    type = "EMPTY_DOCUMENT";
    message = "The document appears to be empty or contains no readable text.";
  } else if (errStr.includes("format") || errStr.includes("unsupported")) {
    type = "UNSUPPORTED_FORMAT";
    message = "The provided document format is not supported by the AI engine.";
  } else if (errStr.includes("extract")) {
    type = "EXTRACTION_FAILURE";
    message = "The AI engine failed to extract meaningful obligations from the text.";
  } else if (errStr.includes("json") || errStr.includes("malformed")) {
    type = "MALFORMED_RESPONSE";
    message = "The AI returned an invalid or malformed response that could not be processed.";
  } else if (errStr.includes("prisma") || errStr.includes("database") || errStr.includes("unique")) {
    type = "DATABASE_ERROR";
    message = "Failed to save the extracted data to the database.";
  } else if (error instanceof Error && error.message) {
    message = error.message; // Safe generic message
  }

  return { success: false as const, error: { type, message } };
}

export async function processCircularAIAction(circularId: string) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string | undefined;
  const orgId = session?.user?.organizationId as string | undefined;
  
  if (!orgId || !userId) {
    throw new Error("Unauthorized");
  }

  const circular = await prisma.circular.findUnique({
    where: { id: circularId }
  });

  const dbOrg = await prisma.organization.findUnique({where: {id: orgId}});

  if (!circular || circular.organizationId !== dbOrg?.id) {
    return { success: false, error: { type: "UNAUTHORIZED", message: "Circular not found or unauthorized" } };
  }

  try {
    await prisma.circular.update({
      where: { id: circularId },
      data: { status: 'Active' } 
    });

    const aiProvider = getAIProvider();
    const { obligations } = await aiProvider.processCircular(circular.documentUrl || "", circular);

  const dbUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!dbUser) throw new Error("User not found");

  for (const obs of obligations) {
    const createdObs = await prisma.obligation.create({
      data: {
        organizationId: circular.organizationId,
        circularId: circular.id,
        ruleReference: obs.ruleReference,
        title: obs.title,
        description: obs.description,
        department: obs.department,
        priority: obs.priority,
        deadline: obs.deadline,
        deadlineType: obs.deadlineType,
        appliesTo: obs.appliesTo?.join(", ") || "",
        penaltyDescription: obs.penaltyDescription,
        penaltySeverity: obs.penaltySeverity,
        businessImpact: obs.businessImpact,
        recommendedAction: obs.recommendedAction,
        confidenceScore: obs.confidenceScore,
        sourcePage: obs.sourcePage,
        sourceParagraph: obs.sourceParagraph,
        reasoning: obs.reasoning,
        humanApprovalRequired: obs.humanApprovalRequired,
        reviewStatus: obs.reviewStatus,
      }
    });

    await prisma.auditLog.create({
      data: {
        organizationId: circular.organizationId,
        entityType: 'Obligation',
        entityId: createdObs.id,
        action: 'EXTRACTED',
        performedById: dbUser.id,
        reason: 'AI Extraction Engine',
      }
    });
  }

  await createNotification(
    circular.organizationId,
    dbUser.id,
    'New Circular Processed',
    'AI Extraction Complete',
    `The AI engine has successfully extracted obligations from circular ${circular.referenceNumber}. Please review them in the Action Center.`
  );

    revalidatePath(`/circulars/${circularId}`);
    return { success: true };
  } catch (error) {
    const errorRes = mapErrorToResponse(error);
    try {
      await prisma.auditLog.create({
        data: {
          organizationId: circular.organizationId,
          entityType: 'Circular',
          entityId: circular.id,
          action: 'AI_EXTRACTION_FAILED',
          performedById: userId,
          reason: `Error: ${errorRes.error.type} - ${errorRes.error.message}`,
        }
      });
    } catch (e) {
      console.error("Failed to log audit event:", e);
    }
    return errorRes;
  }
}

export async function approveObligationAction(obligationId: string, comment?: string) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;
  const dbUser = await prisma.user.findUnique({ where: { id: userId } });
  
  const obs = await prisma.obligation.update({
    where: { id: obligationId },
    data: { 
      reviewStatus: 'Approved',
      approvedById: dbUser?.id,
      approvedAt: new Date()
    }
  });

  await prisma.auditLog.create({
    data: {
      organizationId: obs.organizationId,
      entityType: 'Obligation',
      entityId: obs.id,
      action: 'APPROVED',
      performedById: dbUser!.id,
      reason: comment || null,
    }
  });

  revalidatePath(`/circulars`);
}

export async function rejectObligationAction(obligationId: string, comment?: string) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;
  const dbUser = await prisma.user.findUnique({ where: { id: userId } });

  const obs = await prisma.obligation.update({
    where: { id: obligationId },
    data: { reviewStatus: 'Rejected' }
  });

  await prisma.auditLog.create({
    data: {
      organizationId: obs.organizationId,
      entityType: 'Obligation',
      entityId: obs.id,
      action: 'REJECTED',
      performedById: dbUser!.id,
      reason: comment || null,
    }
  });

  revalidatePath(`/circulars`);
}

export async function updateObligationAction(obligationId: string, data: any, comment?: string) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;
  const dbUser = await prisma.user.findUnique({ where: { id: userId } });

  const oldObs = await prisma.obligation.findUnique({ where: { id: obligationId } });
  
  const obs = await prisma.obligation.update({
    where: { id: obligationId },
    data: {
      ...data,
      reviewStatus: 'Edited'
    }
  });

  await prisma.auditLog.create({
    data: {
      organizationId: obs.organizationId,
      entityType: 'Obligation',
      entityId: obs.id,
      action: 'EDITED',
      performedById: dbUser!.id,
      oldValue: JSON.stringify(oldObs),
      newValue: JSON.stringify(obs),
      reason: comment || null,
    }
  });

  revalidatePath(`/circulars`);
}

export async function addObligationCommentAction(obligationId: string, comment: string) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;
  const dbUser = await prisma.user.findUnique({ where: { id: userId } });

  const obs = await prisma.obligation.findUnique({ where: { id: obligationId } });

  await prisma.auditLog.create({
    data: {
      organizationId: obs!.organizationId,
      entityType: 'Obligation',
      entityId: obs!.id,
      action: 'COMMENT',
      performedById: dbUser!.id,
      reason: comment,
    }
  });

  revalidatePath(`/circulars`);
}

export async function runChangeIntelligenceAction(circularId: string) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;
  const dbUser = await prisma.user.findUnique({ where: { id: userId } });
  
  const circular = await prisma.circular.findUnique({
    where: { id: circularId },
    include: { obligations: true, parentCircular: { include: { obligations: true } } }
  });

  if (!circular) return { success: false, error: { type: "NOT_FOUND", message: "Circular not found" } };

  try {
    const aiProvider = getAIProvider();
    
    const oldObligations = circular.parentCircular?.obligations || [];
    
    const { changes } = await aiProvider.compareCirculars(circular.obligations, oldObligations);

  for (const c of changes) {
    await prisma.regulatoryChange.create({
      data: {
        changeType: c.changeType,
        changeSummary: c.changeSummary,
        affectedDepartments: c.affectedDepartments?.join(", ") || "",
        implementationImpact: c.implementationImpact,
        estimatedEffort: c.estimatedEffort,
        newObligationId: c.newObligationId,
        oldObligationId: c.oldObligationId,
      }
    });
  }

    revalidatePath(`/circulars/${circularId}`);
    return { success: true };
  } catch (error) {
    const errorRes = mapErrorToResponse(error);
    try {
      await prisma.auditLog.create({
        data: {
          organizationId: circular.organizationId,
          entityType: 'Circular',
          entityId: circular.id,
          action: 'AI_INTELLIGENCE_FAILED',
          performedById: userId,
          reason: `Error: ${errorRes.error.type} - ${errorRes.error.message}`,
        }
      });
    } catch (e) {}
    return errorRes;
  }
}

export async function runWorkflowPlannerAction(circularId: string) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;
  const orgId = session?.user?.organizationId as string;
  const dbUser = await prisma.user.findUnique({ where: { id: userId } });
  const dbOrg = await prisma.organization.findUnique({ where: { id: orgId } });

  const circular = await prisma.circular.findUnique({
    where: { id: circularId },
    include: { obligations: { where: { reviewStatus: 'Approved' } } }
  });

  if (!circular) return { success: false, error: { type: "NOT_FOUND", message: "Circular not found" } };

  try {
    const aiProvider = getAIProvider();
    
    const { tasks } = await aiProvider.generateTasks(circular.obligations);

  for (const t of tasks) {
    await prisma.workflowTask.create({
      data: {
        organizationId: dbOrg!.id,
        obligationId: t.obligationId,
        department: t.department,
        priority: t.priority,
        dueDate: t.dueDate,
        evidenceRequired: t.evidenceRequired,
        createdById: dbUser!.id,
        comments: t.title 
      }
    });
  }

  await createNotification(
    dbOrg!.id,
    dbUser!.id,
    'Task Assigned',
    'Workflow Plan Generated',
    `The AI engine has generated ${tasks.length} tasks for circular ${circular.referenceNumber}.`
  );

    revalidatePath(`/circulars/${circularId}`);
    return { success: true };
  } catch (error) {
    const errorRes = mapErrorToResponse(error);
    try {
      await prisma.auditLog.create({
        data: {
          organizationId: dbOrg!.id,
          entityType: 'Circular',
          entityId: circular.id,
          action: 'AI_PLANNER_FAILED',
          performedById: userId,
          reason: `Error: ${errorRes.error.type} - ${errorRes.error.message}`,
        }
      });
    } catch (e) {}
    return errorRes;
  }
}

export async function updateTaskStatusAction(taskId: string, status: string) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;
  const orgId = session?.user?.organizationId as string;
  if (!userId || !orgId) throw new Error("Unauthorized");

  const task = await prisma.workflowTask.findUnique({ where: { id: taskId } });
  if (!task || task.organizationId !== orgId) throw new Error("Unauthorized or not found");

  await prisma.workflowTask.update({
    where: { id: taskId },
    data: { status }
  });
  revalidatePath(`/circulars`);
}
