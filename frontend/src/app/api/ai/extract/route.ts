import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAIProvider } from "@/lib/ai";
import { createNotification } from "@/lib/notifications";

const encoder = new TextEncoder();

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id as string | undefined;
    const orgId = session?.user?.organizationId as string | undefined;
    
    if (!orgId || !userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { circularId } = await req.json();

    const circular = await prisma.circular.findUnique({
      where: { id: circularId }
    });
    
    const dbOrg = await prisma.organization.findUnique({where: {id: orgId}});

    if (!circular || circular.organizationId !== dbOrg?.id) {
      return NextResponse.json({ error: "Circular not found or unauthorized" }, { status: 404 });
    }

    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.circular.update({
      where: { id: circularId },
      data: { status: 'Active' } 
    });

    const aiProvider = getAIProvider();

    // Create a ReadableStream
    const stream = new ReadableStream({
      async start(controller) {
        const sendStage = async (message: string, delayMs = 1500) => {
          controller.enqueue(encoder.encode(JSON.stringify({ type: 'STAGE_UPDATE', message }) + '\n'));
          await new Promise(r => setTimeout(r, delayMs));
        };

        try {
          // Simulate initial processing stages
          await sendStage("Parsing PDF Document...");
          await sendStage("Analyzing Source Material...");
          
          // Get the mock data from the provider
          const { obligations } = await aiProvider.processCircular(circular.documentUrl || "", circular);

          await sendStage("Extracting Obligations...");

          // Stream obligations one by one
          for (const obs of obligations) {
            // Save to DB first
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

            // Enqueue the saved obligation to the client
            controller.enqueue(encoder.encode(JSON.stringify({ type: 'OBLIGATION_EXTRACTED', payload: createdObs }) + '\n'));
            
            // Artificial delay to simulate streaming generation
            await new Promise(r => setTimeout(r, 1200));
          }

          await sendStage("Detecting Deadlines...");
          await sendStage("Building Workflow...");

          await createNotification(
            circular.organizationId,
            dbUser.id,
            'New Circular Processed',
            'AI Extraction Complete',
            `The AI engine has successfully extracted obligations from circular ${circular.referenceNumber}. Please review them in the Action Center.`
          );

          controller.enqueue(encoder.encode(JSON.stringify({ type: 'COMPLETE' }) + '\n'));
          controller.close();

        } catch (error: any) {
          console.error("Stream error:", error);
          controller.enqueue(encoder.encode(JSON.stringify({ type: 'ERROR', message: error.message || "An error occurred during extraction" }) + '\n'));
          controller.close();
        }
      }
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
