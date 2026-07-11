export interface ExtractedObligation {
  ruleReference: string | null;
  title: string;
  description: string;
  appliesTo: string[];
  department: string | null;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  deadline: Date | null;
  deadlineType: string | null;
  penaltyDescription: string | null;
  penaltySeverity: string | null;
  businessImpact: string | null;
  recommendedAction: string | null;
  
  confidenceScore: number;
  reasoning: string;
  sourceCitation: string | null;
  sourcePage: number | null;
  sourceParagraph: number | null;
  humanApprovalRequired: boolean;
  reviewStatus: 'Pending' | 'Approved' | 'Rejected' | 'Edited';
}

export interface RegulatoryChangeOutput {
  oldObligationId: string | null;
  newObligationId: string;
  changeType: 'Added' | 'Modified' | 'Removed' | 'ApplicabilityChanged' | 'DeadlineChanged' | 'PenaltyChanged';
  changeSummary: string;
  affectedDepartments: string[];
  implementationImpact: string | null;
  estimatedEffort: string | null;
}

export interface TaskOutput {
  obligationId: string;
  department: string | null;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  title: string;
  dueDate: Date | null;
  evidenceRequired: boolean;
}

export interface AIProvider {
  /**
   * Engine 1: Understand
   * Parses a raw document and extracts structured obligations.
   */
  processCircular(documentUrl: string, metadata: any): Promise<{ obligations: ExtractedObligation[] }>;

  /**
   * Engine 2: Identify
   * Compares obligations of a new circular against a previous circular.
   */
  compareCirculars(newObligations: any[], oldObligations: any[]): Promise<{ changes: RegulatoryChangeOutput[] }>;

  /**
   * Engine 3: Act
   * Generates implementation tasks for approved obligations.
   */
  generateTasks(approvedObligations: any[]): Promise<{ tasks: TaskOutput[] }>;
}
