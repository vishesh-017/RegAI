import { AIProvider, ExtractedObligation, RegulatoryChangeOutput, TaskOutput } from "./provider";

export class MockAIProvider implements AIProvider {
  async processCircular(documentUrl: string, circularMetadata: any): Promise<{ obligations: ExtractedObligation[] }> {
    // Simulate AI extraction delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Realistic Mock SEBI Obligations
    const obligations: ExtractedObligation[] = [
      {
        ruleReference: "SEBI/HO/MIRSD/01/2026/04",
        title: "Mandatory Audit Trail for AI Decisions",
        description: "All market intermediaries utilizing AI for KYC and risk profiling must maintain an immutable audit trail of the model's decision-making process, including versioning and dataset lineage.",
        department: "Compliance & IT",
        priority: "Critical",
        deadline: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        deadlineType: "Strict",
        appliesTo: ["Stock Broker", "Depository"],
        penaltyDescription: "Suspension of AI-driven onboarding and potential fines up to ₹1 Crore.",
        penaltySeverity: "High",
        businessImpact: "Significant architectural changes required for logging infrastructure.",
        recommendedAction: "Implement structured logging capturing model inputs/outputs and hash them to immutable storage.",
        confidenceScore: 0.96,
        sourceCitation: "Page 3, Annexure B",
        sourcePage: 3,
        sourceParagraph: 2,
        reasoning: "The text explicitly mandates 'immutable audit trails' for 'AI decisions' affecting 'KYC and risk profiling' with clear penalties outlined in Annexure B.",
        humanApprovalRequired: true,
        reviewStatus: "Pending"
      },
      {
        ruleReference: "SEBI/HO/MIRSD/01/2026/08",
        title: "Monthly Reporting on AI Overrides",
        description: "Intermediaries must submit a monthly MIS report detailing all instances where a human compliance officer overrode an AI-generated risk flag.",
        department: "Risk Management",
        priority: "High",
        appliesTo: ["Stock Broker", "Asset Management Company"],
        deadline: null,
        deadlineType: null,
        penaltyDescription: "Warning letter followed by daily penalties for delayed submission.",
        penaltySeverity: "Medium",
        businessImpact: null,
        recommendedAction: null,
        confidenceScore: 0.88,
        sourceCitation: "Page 5, Paragraph 1",
        sourcePage: 5,
        sourceParagraph: 1,
        reasoning: "Paragraph states 'monthly MIS reports are mandatory for overridden flags'.",
        humanApprovalRequired: true,
        reviewStatus: "Pending"
      }
    ];

    return { obligations };
  }

  async compareCirculars(newObligations: any[], oldObligations: any[]): Promise<{ changes: RegulatoryChangeOutput[] }> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate detecting a modified and added rule
    // We will map these mock changes to the first 2 obligations passed in, if they exist
    
    const changes: RegulatoryChangeOutput[] = [];
    
    if (newObligations.length > 0) {
      changes.push({
        oldObligationId: oldObligations.length > 0 ? oldObligations[0].id : null,
        newObligationId: newObligations[0].id,
        changeType: "Modified",
        changeSummary: "Data retention period extended from 3 to 5 years for AI logs.",
        affectedDepartments: ["IT", "Compliance"],
        implementationImpact: "Increased storage costs; requires updating retention policies in AWS.",
        estimatedEffort: "2 Weeks"
      });
    }
    
    if (newObligations.length > 1) {
      changes.push({
        oldObligationId: null, // Purely added
        newObligationId: newObligations[1].id,
        changeType: "Added",
        changeSummary: "Introduction of human-override reporting MIS.",
        affectedDepartments: ["Risk Management"],
        implementationImpact: "New operational workflow required for compliance officers to document override reasoning.",
        estimatedEffort: "1 Week"
      });
    }

    return { changes };
  }

  async generateTasks(approvedObligations: any[]): Promise<{ tasks: TaskOutput[] }> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const tasks: TaskOutput[] = [];
    
    approvedObligations.forEach((obs, index) => {
      // Generate some dynamic tasks based on the obligation
      if (index === 0) {
        tasks.push({
          obligationId: obs.id,
          title: "Upgrade Logging Infrastructure",
          department: "IT",
          priority: "Critical",
          dueDate: new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000),
          evidenceRequired: true
        });
        tasks.push({
          obligationId: obs.id,
          title: "Update Data Retention Policy",
          department: "Compliance",
          priority: "High",
          dueDate: null,
          evidenceRequired: true
        });
      } else {
        tasks.push({
          obligationId: obs.id,
          title: "Design Override MIS Format",
          department: "Risk Management",
          priority: "Medium",
          dueDate: null,
          evidenceRequired: false
        });
      }
    });

    return { tasks };
  }
}
