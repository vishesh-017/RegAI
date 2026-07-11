import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";


// --- Helpers -----------------------------------------------------------------

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function daysFromNow(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

function randomFloat(min: number, max: number, dp = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(dp));
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// --- Main Seed ---------------------------------------------------------------

async function main() {
  console.log("🌱 Seeding BrahmOS demo database...\n");

  // Wipe existing data (order matters for FK constraints)
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.report.deleteMany();
  await prisma.workflowTask.deleteMany();
  await prisma.regulatoryChange.deleteMany();
  await prisma.obligation.deleteMany();
  await prisma.circular.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  // -------------------------------------------------------------------------
  // 1. Organization
  // -------------------------------------------------------------------------
  const org = await prisma.organization.create({
    data: {
      name: "Demo Securities Ltd.",
      organizationType: "Stock Broker",
    },
  });
  console.log(`✅ Organization created: ${org.name}`);

  // -------------------------------------------------------------------------
  // 2. Users
  // -------------------------------------------------------------------------
  const adminHash = await bcrypt.hash("admin123", 10);
  const demoHash = await bcrypt.hash("demo123", 10);

  const [admin, compliance, manager, auditor] = await Promise.all([
    prisma.user.create({ data: { email: "admin@demo.com", password: adminHash, role: "Admin", organizationId: org.id, createdAt: daysAgo(90) } }),
    prisma.user.create({ data: { email: "compliance@demo.com", password: demoHash, role: "Compliance Officer", organizationId: org.id, createdAt: daysAgo(88) } }),
    prisma.user.create({ data: { email: "manager@demo.com", password: demoHash, role: "Manager", organizationId: org.id, createdAt: daysAgo(85) } }),
    prisma.user.create({ data: { email: "auditor@demo.com", password: demoHash, role: "Auditor", organizationId: org.id, createdAt: daysAgo(80) } }),
  ]);
  console.log(`✅ 4 users created`);

  // -------------------------------------------------------------------------
  // 3. Circulars
  // -------------------------------------------------------------------------
  const circularData = [
    {
      title: "SEBI Cybersecurity and Cyber Resilience Framework for Stock Brokers",
      referenceNumber: "SEBI/HO/MIRSD/MIRSD-PoD-1/P/CIR/2024/001",
      issuingAuthority: "SEBI",
      publicationDate: daysAgo(75),
      effectiveDate: daysAgo(30),
      circularType: "Compliance",
      sector: "Securities Market,Stock Brokers,Clearing Members",
      tags: "Cybersecurity,IT Governance,ISMS,Incident Response",
      summary: "Comprehensive cybersecurity and cyber resilience framework mandating stock brokers to implement ISO 27001-aligned information security management systems, conduct mandatory vulnerability assessments, and report cyber incidents to SEBI within stipulated timeframes.",
      status: "Active",
    },
    {
      title: "Master Circular for Stock Brokers — KYC and Account Opening Procedures (Amendment)",
      referenceNumber: "SEBI/HO/MIRSD/MIRSD1/P/CIR/2024/002",
      issuingAuthority: "SEBI",
      publicationDate: daysAgo(60),
      effectiveDate: daysAgo(15),
      circularType: "Amendment",
      sector: "Securities Market,Stock Brokers,Depositories",
      tags: "KYC,AML,Account Opening,Client Onboarding",
      summary: "Amendment to existing KYC norms mandating re-verification of existing clients, tightening of beneficial ownership disclosure requirements, and reduction of KYC processing timelines from 30 to 15 working days.",
      status: "Active",
    },
    {
      title: "SEBI Circular on Anti-Money Laundering and Combating Financing of Terrorism (AML/CFT)",
      referenceNumber: "SEBI/HO/MIRSD/DoP/P/CIR/2024/003",
      issuingAuthority: "SEBI",
      publicationDate: daysAgo(50),
      effectiveDate: daysAgo(5),
      circularType: "Regulatory",
      sector: "Securities Market,Stock Brokers,Portfolio Managers",
      tags: "AML,CFT,FATF,STR,Sanctions Screening",
      summary: "Enhanced AML/CFT obligations for registered intermediaries including mandatory real-time sanctions screening, enhanced due diligence for politically exposed persons, and stricter suspicious transaction reporting timelines aligned with FATF recommendations.",
      status: "Active",
    },
    {
      title: "Investor Protection and Grievance Redressal Mechanism — Enhanced Framework",
      referenceNumber: "SEBI/HO/OIAE/OIAE_IAD-3/P/CIR/2024/004",
      issuingAuthority: "SEBI",
      publicationDate: daysAgo(40),
      effectiveDate: daysFromNow(10),
      circularType: "Framework",
      sector: "Securities Market,Stock Brokers,Mutual Funds,Investment Advisers",
      tags: "Investor Protection,Grievance,SCORES,Dispute Resolution",
      summary: "Revised investor protection framework mandating registration with SEBI SCORES 2.0 platform, appointment of dedicated Investor Grievance Handling Officers, and binding resolution of grievances within 21 calendar days.",
      status: "Draft",
    },
    {
      title: "Risk Management Framework for Stock Brokers — Margin and Exposure Norms",
      referenceNumber: "SEBI/HO/CDMRD/DRMNP/P/CIR/2024/005",
      issuingAuthority: "SEBI",
      publicationDate: daysAgo(25),
      effectiveDate: daysFromNow(30),
      circularType: "Risk Management",
      sector: "Securities Market,Stock Brokers,Clearing Corporations",
      tags: "Risk Management,Margin,VaR,Exposure Limits,Peak Margin",
      summary: "Updated risk management norms for stock brokers including revised VaR-based margin calculation methodologies, enhanced peak margin reporting requirements, and mandatory daily stress testing of portfolio concentrations.",
      status: "Draft",
    },
  ];

  const circulars = await Promise.all(
    circularData.map((c) =>
      prisma.circular.create({
        data: { ...c, organizationId: org.id, createdById: admin.id, version: "1.0" },
      })
    )
  );
  console.log(`✅ ${circulars.length} circulars created`);

  // -------------------------------------------------------------------------
  // 4. Obligations (15–20 per circular → ~85 total)
  // -------------------------------------------------------------------------

  // Helper: create obligation
  async function createObligation(data: {
    circularId: string;
    ruleReference: string;
    title: string;
    description: string;
    appliesTo: string;
    department: string;
    priority: string;
    deadline: Date | null;
    deadlineType: string;
    penaltyDescription: string;
    penaltySeverity: string;
    businessImpact: string;
    recommendedAction: string;
    confidenceScore: number;
    sourcePage: number;
    sourceParagraph: number;
    reviewStatus: string;
    approvedById?: string;
    approvedAt?: Date;
    daysAgoCreated: number;
  }) {
    return prisma.obligation.create({
      data: {
        organizationId: org.id,
        circularId: data.circularId,
        ruleReference: data.ruleReference,
        title: data.title,
        description: data.description,
        appliesTo: data.appliesTo,
        department: data.department,
        priority: data.priority,
        deadline: data.deadline,
        deadlineType: data.deadlineType,
        penaltyDescription: data.penaltyDescription,
        penaltySeverity: data.penaltySeverity,
        businessImpact: data.businessImpact,
        recommendedAction: data.recommendedAction,
        confidenceScore: data.confidenceScore,
        reasoning: `Extracted from SEBI circular with ${data.confidenceScore}% confidence based on regulatory text analysis.`,
        sourcePage: data.sourcePage,
        sourceParagraph: data.sourceParagraph,
        humanApprovalRequired: true,
        aiModelVersion: "MockAI-v2.1",
        extractionTimestamp: daysAgo(data.daysAgoCreated),
        reviewStatus: data.reviewStatus,
        approvedById: data.approvedById,
        approvedAt: data.approvedAt,
        createdAt: daysAgo(data.daysAgoCreated),
      },
    });
  }

  // --- Circular 1: Cybersecurity Framework ---
  const c1 = circulars[0].id;
  const cyberObligations = await Promise.all([
    createObligation({ circularId: c1, ruleReference: "CYB/2024/001/S3.1", title: "Information Security Management System (ISMS) Implementation", description: "All stock brokers shall implement an ISMS compliant with ISO/IEC 27001:2022 standard. The ISMS must cover all business processes involving client data, trading systems, and back-office operations. A certified ISMS must be established within 6 months of the circular's effective date.", appliesTo: "Stock Brokers,Clearing Members", department: "IT Security", priority: "Critical", deadline: daysFromNow(45), deadlineType: "Implementation", penaltyDescription: "Monetary penalty up to ₹1 Crore per violation plus suspension of trading operations", penaltySeverity: "Critical", businessImpact: "Requires complete IT infrastructure audit and potential system overhaul", recommendedAction: "Engage ISO 27001 certified consultant; conduct gap assessment; develop implementation roadmap", confidenceScore: 96.8, sourcePage: 3, sourceParagraph: 1, reviewStatus: "Approved", approvedById: compliance.id, approvedAt: daysAgo(60), daysAgoCreated: 70 }),
    createObligation({ circularId: c1, ruleReference: "CYB/2024/001/S3.2", title: "Mandatory Vulnerability Assessment and Penetration Testing (VAPT)", description: "Stock brokers must conduct comprehensive VAPT of all internet-facing systems and critical internal infrastructure at least twice annually. VAPT must be conducted by CERT-In empanelled organizations. Reports must be submitted to SEBI within 30 days of completion.", appliesTo: "Stock Brokers", department: "IT Security", priority: "High", deadline: daysFromNow(90), deadlineType: "Recurring", penaltyDescription: "Penalty up to ₹25 Lakh per missed assessment cycle", penaltySeverity: "High", businessImpact: "Requires empanelled vendor engagement and potential system downtime during testing", recommendedAction: "Identify CERT-In empanelled VAPT vendors; schedule bi-annual assessment calendar", confidenceScore: 94.2, sourcePage: 4, sourceParagraph: 3, reviewStatus: "Approved", approvedById: compliance.id, approvedAt: daysAgo(58), daysAgoCreated: 68 }),
    createObligation({ circularId: c1, ruleReference: "CYB/2024/001/S4.1", title: "Cyber Incident Reporting to SEBI within 6 Hours", description: "Any cyber security incident that disrupts trading operations, compromises client data, or affects market integrity must be reported to SEBI within 6 hours of detection. A detailed incident report must follow within 72 hours, and a root cause analysis within 14 days.", appliesTo: "Stock Brokers,Clearing Members,Depositories", department: "IT Security,Operations", priority: "Critical", deadline: daysAgo(30), deadlineType: "Ongoing", penaltyDescription: "Penalty up to ₹50 Lakh for delayed/non-reporting; criminal liability for wilful concealment", penaltySeverity: "Critical", businessImpact: "Requires 24x7 monitoring capability and dedicated incident response team", recommendedAction: "Establish SOC with 24x7 coverage; create incident response playbook; pre-draft SEBI reporting templates", confidenceScore: 98.1, sourcePage: 5, sourceParagraph: 2, reviewStatus: "Approved", approvedById: compliance.id, approvedAt: daysAgo(55), daysAgoCreated: 65 }),
    createObligation({ circularId: c1, ruleReference: "CYB/2024/001/S5.1", title: "Multi-Factor Authentication for All Critical Systems", description: "MFA must be enforced for all administrative access, remote access, and access to systems containing client data or trading information. Legacy systems unable to support MFA must be replaced or isolated within the compliance timeline.", appliesTo: "Stock Brokers", department: "IT Security", priority: "High", deadline: daysAgo(15), deadlineType: "Implementation", penaltyDescription: "Penalty up to ₹10 Lakh per system found without MFA during audit", penaltySeverity: "High", businessImpact: "Requires identity management platform upgrade across all systems", recommendedAction: "Deploy enterprise IAM solution; enumerate all critical systems; enforce MFA policy via GPO", confidenceScore: 97.3, sourcePage: 6, sourceParagraph: 1, reviewStatus: "Approved", approvedById: compliance.id, approvedAt: daysAgo(50), daysAgoCreated: 62 }),
    createObligation({ circularId: c1, ruleReference: "CYB/2024/001/S6.1", title: "Cybersecurity Awareness Training — Mandatory Annual Programme", description: "All employees with access to trading systems or client data must complete mandatory cybersecurity awareness training annually. Training content must include phishing simulation, data handling, and incident reporting procedures. Completion records must be maintained for 3 years.", appliesTo: "Stock Brokers", department: "HR,IT Security", priority: "Medium", deadline: daysFromNow(120), deadlineType: "Annual", penaltyDescription: "Penalty up to ₹5 Lakh for inadequate training programmes", penaltySeverity: "Medium", businessImpact: "Requires LMS deployment and content development investment", recommendedAction: "Procure cybersecurity training platform; develop SEBI-specific training modules; launch mandatory campaign", confidenceScore: 91.5, sourcePage: 8, sourceParagraph: 4, reviewStatus: "Approved", approvedById: compliance.id, approvedAt: daysAgo(45), daysAgoCreated: 58 }),
    createObligation({ circularId: c1, ruleReference: "CYB/2024/001/S7.1", title: "Data Classification and Encryption Policy", description: "Stock brokers must implement a formal data classification policy categorizing data into Public, Internal, Confidential, and Restricted tiers. All Confidential and Restricted data must be encrypted at rest (AES-256) and in transit (TLS 1.3).", appliesTo: "Stock Brokers,Technology Vendors", department: "IT Security,Compliance", priority: "High", deadline: daysFromNow(60), deadlineType: "Implementation", penaltyDescription: "Penalty up to ₹25 Lakh for data breach attributable to inadequate encryption", penaltySeverity: "High", businessImpact: "Database infrastructure changes and potential performance impact", recommendedAction: "Conduct data inventory audit; implement encryption at database and file system levels", confidenceScore: 93.7, sourcePage: 10, sourceParagraph: 2, reviewStatus: "Approved", approvedById: compliance.id, approvedAt: daysAgo(42), daysAgoCreated: 55 }),
    createObligation({ circularId: c1, ruleReference: "CYB/2024/001/S8.1", title: "Third-Party Vendor Cybersecurity Assessment", description: "All third-party vendors with access to stock broker systems or client data must undergo annual cybersecurity assessment. Vendors failing assessment must be remediated within 90 days or contracts terminated. Board must be informed of material vendor risks.", appliesTo: "Stock Brokers", department: "IT Security,Legal,Operations", priority: "Medium", deadline: daysFromNow(150), deadlineType: "Annual", penaltyDescription: "Penalty up to ₹10 Lakh per non-compliant vendor relationship", penaltySeverity: "Medium", businessImpact: "Significant vendor management overhead and potential contract renegotiation", recommendedAction: "Develop vendor security questionnaire; conduct risk-tiered assessments; update vendor contracts with security clauses", confidenceScore: 88.4, sourcePage: 12, sourceParagraph: 1, reviewStatus: "Pending", daysAgoCreated: 50 }),
    createObligation({ circularId: c1, ruleReference: "CYB/2024/001/S9.1", title: "Business Continuity and Disaster Recovery Plan", description: "Stock brokers must maintain and test a comprehensive Business Continuity Plan (BCP) and Disaster Recovery Plan (DRP) covering cybersecurity scenarios. BCP/DRP must be tested at least annually with results reported to the Board and SEBI.", appliesTo: "Stock Brokers,Clearing Members", department: "IT Security,Operations,Risk Management", priority: "High", deadline: daysFromNow(60), deadlineType: "Annual", penaltyDescription: "Suspension of registration for failure to maintain operational resilience", penaltySeverity: "Critical", businessImpact: "Requires DR site setup and annual full-scale simulation", recommendedAction: "Review existing BCP/DRP; include cyber scenarios; schedule tabletop exercise with Board participation", confidenceScore: 95.6, sourcePage: 14, sourceParagraph: 3, reviewStatus: "Pending", daysAgoCreated: 48 }),
    createObligation({ circularId: c1, ruleReference: "CYB/2024/001/S10.1", title: "Designated Chief Information Security Officer (CISO) Appointment", description: "Stock brokers with net worth above ₹50 Crore must appoint a qualified CISO at senior management level. CISO must report directly to the CEO/MD and present quarterly cybersecurity reports to the Board. Appointment must be intimated to SEBI within 30 days.", appliesTo: "Stock Brokers", department: "Leadership,HR", priority: "High", deadline: daysAgo(20), deadlineType: "One-time", penaltyDescription: "Penalty up to ₹25 Lakh for non-appointment; Board members personally liable", penaltySeverity: "High", businessImpact: "Senior leadership recruitment and compensation budget impact", recommendedAction: "Initiate CISO search through executive headhunter; prepare JD per SEBI guidelines; intimate SEBI post-appointment", confidenceScore: 97.1, sourcePage: 16, sourceParagraph: 1, reviewStatus: "Approved", approvedById: compliance.id, approvedAt: daysAgo(38), daysAgoCreated: 45 }),
    createObligation({ circularId: c1, ruleReference: "CYB/2024/001/S11.1", title: "Privileged Access Management (PAM) Controls", description: "All privileged accounts (database admins, system admins, network engineers) must be managed through a dedicated PAM solution. Session recording for privileged access is mandatory. Access reviews must be conducted quarterly.", appliesTo: "Stock Brokers", department: "IT Security", priority: "Medium", deadline: daysFromNow(90), deadlineType: "Implementation", penaltyDescription: "Penalty up to ₹15 Lakh for improper privileged access controls leading to breach", penaltySeverity: "High", businessImpact: "PAM software investment and privileged account enumeration exercise", recommendedAction: "Evaluate PAM solutions (CyberArk, BeyondTrust); deploy in phased manner starting with domain admins", confidenceScore: 90.3, sourcePage: 18, sourceParagraph: 2, reviewStatus: "Pending", daysAgoCreated: 43 }),
    createObligation({ circularId: c1, ruleReference: "CYB/2024/001/S12.1", title: "Cybersecurity Audit by CERT-In Empanelled Auditor", description: "An annual cybersecurity audit must be conducted by a CERT-In empanelled information security auditing organisation. Audit report must be submitted to SEBI within 60 days of fiscal year end. Material findings must be remediated within 90 days.", appliesTo: "Stock Brokers,Clearing Members", department: "IT Security,Compliance", priority: "High", deadline: daysFromNow(180), deadlineType: "Annual", penaltyDescription: "Penalty up to ₹25 Lakh for audit non-compliance; trading suspension for repeat offenders", penaltySeverity: "High", businessImpact: "Annual audit engagement cost and internal resource allocation", recommendedAction: "Identify CERT-In empanelled auditor; pre-audit internal assessment; establish audit committee oversight", confidenceScore: 96.2, sourcePage: 20, sourceParagraph: 1, reviewStatus: "Pending", daysAgoCreated: 40 }),
    createObligation({ circularId: c1, ruleReference: "CYB/2024/001/S13.1", title: "Network Segmentation and Perimeter Security", description: "Critical trading infrastructure must be isolated in a dedicated network segment with strict access controls. Internet-facing systems must be in a separate DMZ. All network traffic must be monitored by an IDS/IPS system.", appliesTo: "Stock Brokers", department: "IT Security", priority: "High", deadline: daysFromNow(75), deadlineType: "Implementation", penaltyDescription: "Penalty up to ₹20 Lakh for inadequate network security controls", penaltySeverity: "High", businessImpact: "Network infrastructure redesign and potential trading system downtime", recommendedAction: "Commission network architecture review; implement VLAN segmentation; deploy next-generation firewall", confidenceScore: 92.8, sourcePage: 22, sourceParagraph: 3, reviewStatus: "Pending", daysAgoCreated: 38 }),
    createObligation({ circularId: c1, ruleReference: "CYB/2024/001/S14.1", title: "Cyber Insurance Policy Mandate", description: "Stock brokers must maintain adequate cyber insurance covering data breach, ransomware, business interruption, and regulatory investigation costs. Minimum coverage of ₹5 Crore. Policy must be renewed annually and copy submitted to exchanges.", appliesTo: "Stock Brokers", department: "Legal,Finance", priority: "Medium", deadline: daysFromNow(120), deadlineType: "Annual", penaltyDescription: "Exchange may suspend trading membership for non-maintenance of cyber insurance", penaltySeverity: "High", businessImpact: "Annual premium cost of ₹15-50 Lakh depending on AUM", recommendedAction: "Approach insurers with cyber coverage; evaluate policy terms against SEBI requirements; update annual D&O renewal", confidenceScore: 85.6, sourcePage: 24, sourceParagraph: 2, reviewStatus: "Pending", daysAgoCreated: 35 }),
    createObligation({ circularId: c1, ruleReference: "CYB/2024/001/S15.1", title: "Security Patch Management Policy — Critical Patches within 72 Hours", description: "A formal patch management policy must be established. Critical and high severity patches (CVSS 7.0+) must be applied within 72 hours of vendor release. Exceptions require documented risk acceptance by CISO. Patch compliance rates must be reported monthly.", appliesTo: "Stock Brokers", department: "IT Security", priority: "High", deadline: daysAgo(10), deadlineType: "Ongoing", penaltyDescription: "Penalty up to ₹10 Lakh for breaches attributable to unpatched known vulnerabilities", penaltySeverity: "High", businessImpact: "Requires change management process acceleration for security patches", recommendedAction: "Implement automated patch management system; create emergency change process for critical patches; monthly CISO review", confidenceScore: 94.7, sourcePage: 26, sourceParagraph: 1, reviewStatus: "Approved", approvedById: compliance.id, approvedAt: daysAgo(28), daysAgoCreated: 32 }),
  ]);

  // --- Circular 2: KYC Amendment ---
  const c2 = circulars[1].id;
  const kycObligations = await Promise.all([
    createObligation({ circularId: c2, ruleReference: "KYC/2024/002/S2.1", title: "KYC Document Processing Timeline — 15 Working Days", description: "KYC verification and account opening process must be completed within 15 working days of receipt of complete documentation. Clients must be informed of status at Day 7 and Day 12. Delays beyond 15 days require escalation to Compliance Head with documented reason.", appliesTo: "Stock Brokers,Depositories", department: "Operations,Compliance", priority: "High", deadline: daysAgo(15), deadlineType: "Ongoing", penaltyDescription: "Penalty of ₹1,000 per client per day of delay beyond 15 days; up to ₹25 Lakh aggregate per quarter", penaltySeverity: "High", businessImpact: "Requires KYC process reengineering and automation investment", recommendedAction: "Audit current KYC turnaround time; implement workflow management system; set automated Day 7 and Day 12 alerts", confidenceScore: 97.4, sourcePage: 3, sourceParagraph: 1, reviewStatus: "Approved", approvedById: compliance.id, approvedAt: daysAgo(45), daysAgoCreated: 55 }),
    createObligation({ circularId: c2, ruleReference: "KYC/2024/002/S2.2", title: "Periodic KYC Re-verification — High Risk Clients (Annual)", description: "Clients categorised as High Risk under the risk-based approach must undergo complete KYC re-verification annually. Mid-year update checks are required for all clients in this category. Risk categorisation criteria must be documented and Board-approved.", appliesTo: "Stock Brokers", department: "Compliance,Operations", priority: "Critical", deadline: daysFromNow(45), deadlineType: "Annual", penaltyDescription: "Penalty up to ₹50 Lakh and potential de-registration for systemic KYC re-verification failures", penaltySeverity: "Critical", businessImpact: "Significant client outreach effort and potential account freezing", recommendedAction: "Extract all High Risk clients; initiate re-KYC campaign; track completion through CRM; escalate non-respondents at 30 days", confidenceScore: 95.8, sourcePage: 4, sourceParagraph: 2, reviewStatus: "Approved", approvedById: compliance.id, approvedAt: daysAgo(42), daysAgoCreated: 52 }),
    createObligation({ circularId: c2, ruleReference: "KYC/2024/002/S3.1", title: "Beneficial Ownership Declaration for Legal Entities", description: "For all non-individual clients (corporates, trusts, partnerships), beneficial owners holding 10% or more economic interest must be identified and verified. Layered ownership structures must be traced to natural person level. Declaration must be updated within 30 days of any change.", appliesTo: "Stock Brokers,Portfolio Managers", department: "Compliance,Legal", priority: "High", deadline: daysAgo(5), deadlineType: "Ongoing", penaltyDescription: "Penalty up to ₹25 Lakh per corporate account with undisclosed beneficial ownership", penaltySeverity: "High", businessImpact: "Requires legal entity ownership verification for all existing corporate clients", recommendedAction: "Obtain UBO declarations from all legal entity clients; cross-reference MCA registry; flag inconsistencies", confidenceScore: 93.2, sourcePage: 5, sourceParagraph: 3, reviewStatus: "Approved", approvedById: compliance.id, approvedAt: daysAgo(38), daysAgoCreated: 48 }),
    createObligation({ circularId: c2, ruleReference: "KYC/2024/002/S4.1", title: "In-Person Verification for New Demat Account Opening", description: "IPV is mandatory for all new demat account openings. Video-based KYC (V-KYC) is an accepted alternative, subject to guidelines. V-KYC must use liveness detection technology and the session must be recorded and retained for 5 years.", appliesTo: "Stock Brokers,Depository Participants", department: "Operations,Technology", priority: "Medium", deadline: daysAgo(15), deadlineType: "Ongoing", penaltyDescription: "Account to be frozen and penalty of ₹5 Lakh per non-compliant account opening", penaltySeverity: "Medium", businessImpact: "V-KYC technology investment and process redesign for online account opening", recommendedAction: "Integrate SEBI-compliant V-KYC vendor; update onboarding journey; ensure 5-year recording retention", confidenceScore: 91.6, sourcePage: 7, sourceParagraph: 1, reviewStatus: "Approved", approvedById: compliance.id, approvedAt: daysAgo(35), daysAgoCreated: 45 }),
    createObligation({ circularId: c2, ruleReference: "KYC/2024/002/S5.1", title: "Linking of PAN with Aadhaar — Mandatory Verification", description: "PAN-Aadhaar linking status must be verified for all new and existing clients. Accounts of clients with unlinked PAN-Aadhaar must be suspended from trading until linkage is completed. Broker must notify such clients and provide 30-day cure period.", appliesTo: "Stock Brokers", department: "Compliance,Operations", priority: "High", deadline: daysAgo(20), deadlineType: "One-time", penaltyDescription: "Penalty up to ₹10 Lakh for allowing trading by clients with unlinked PAN-Aadhaar", penaltySeverity: "High", businessImpact: "Mass client communication exercise and potential account suspension", recommendedAction: "Run PAN-Aadhaar verification API against entire client database; identify non-compliant accounts; initiate notification", confidenceScore: 96.1, sourcePage: 9, sourceParagraph: 2, reviewStatus: "Approved", approvedById: compliance.id, approvedAt: daysAgo(32), daysAgoCreated: 42 }),
    createObligation({ circularId: c2, ruleReference: "KYC/2024/002/S6.1", title: "FATCA/CRS Self-Certification for Foreign Nationals and NRIs", description: "FATCA/CRS self-certification must be obtained from all foreign nationals and NRIs. Existing accounts without certification must be approached for updating. Accounts of non-responsive clients must be reported to CBDT after 90-day cure period.", appliesTo: "Stock Brokers,Custodians", department: "Compliance,Operations", priority: "Medium", deadline: daysFromNow(60), deadlineType: "Ongoing", penaltyDescription: "Penalty up to ₹10 Lakh per unreported account under FATCA obligations", penaltySeverity: "Medium", businessImpact: "Identification and outreach to all foreign national and NRI clients", recommendedAction: "Extract NRI/foreign client list; send self-certification forms; track responses; report to CBDT per timelines", confidenceScore: 89.4, sourcePage: 11, sourceParagraph: 1, reviewStatus: "Pending", daysAgoCreated: 40 }),
    createObligation({ circularId: c2, ruleReference: "KYC/2024/002/S7.1", title: "KYC Records Retention — 5 Years Post Account Closure", description: "All KYC documents, correspondence, and account opening records must be retained for a minimum of 5 years after account closure. Records must be in retrievable digital format. Physical records may be digitised but originals must be retained for 2 years.", appliesTo: "Stock Brokers", department: "Operations,Legal", priority: "Medium", deadline: daysFromNow(90), deadlineType: "Ongoing", penaltyDescription: "Penalty up to ₹10 Lakh for failure to produce KYC records during regulatory inspection", penaltySeverity: "Medium", businessImpact: "Document management system investment and archival policy review", recommendedAction: "Audit current retention practices; implement document management system; establish disposal schedule", confidenceScore: 92.5, sourcePage: 13, sourceParagraph: 3, reviewStatus: "Pending", daysAgoCreated: 38 }),
    createObligation({ circularId: c2, ruleReference: "KYC/2024/002/S8.1", title: "Centralised KYC Registry (CKYCRR) Upload within 10 Days", description: "KYC records of all new clients must be uploaded to the Central KYC Registry within 10 working days of account opening. Modifications to KYC data must be updated in CKYCRR within 7 working days. Bulk historical upload to be completed within 90 days.", appliesTo: "Stock Brokers", department: "Operations,Technology", priority: "High", deadline: daysAgo(5), deadlineType: "Ongoing", penaltyDescription: "Penalty up to ₹5 Lakh per quarter for systemic non-upload to CKYCRR", penaltySeverity: "Medium", businessImpact: "CKYCRR API integration and bulk historical data migration project", recommendedAction: "Integrate broker system with CKYCRR API; reconcile existing records; set automated daily upload job", confidenceScore: 94.3, sourcePage: 15, sourceParagraph: 2, reviewStatus: "Approved", approvedById: compliance.id, approvedAt: daysAgo(28), daysAgoCreated: 35 }),
    createObligation({ circularId: c2, ruleReference: "KYC/2024/002/S9.1", title: "Politically Exposed Persons (PEP) Enhanced Due Diligence", description: "PEPs and their family members and close associates must be subjected to Enhanced Due Diligence (EDD). Senior management approval is required for opening PEP accounts. PEP accounts must be reviewed semi-annually with transactions monitored monthly.", appliesTo: "Stock Brokers,Portfolio Managers", department: "Compliance", priority: "High", deadline: daysAgo(10), deadlineType: "Ongoing", penaltyDescription: "Penalty up to ₹25 Lakh per PEP account with inadequate EDD", penaltySeverity: "High", businessImpact: "Requires PEP screening database integration and enhanced monitoring workflow", recommendedAction: "Integrate PEP screening database; identify existing PEP clients; establish EDD workflow with MD approval gate", confidenceScore: 95.7, sourcePage: 17, sourceParagraph: 1, reviewStatus: "Approved", approvedById: compliance.id, approvedAt: daysAgo(25), daysAgoCreated: 32 }),
    createObligation({ circularId: c2, ruleReference: "KYC/2024/002/S10.1", title: "Risk-Based Customer Due Diligence (CDD) Framework", description: "A formal risk-based CDD framework must be documented, Board-approved, and implemented. Framework must categorise clients into Low, Medium, High, and Very High risk tiers. Due diligence intensity must correspond to risk tier. Framework must be reviewed annually.", appliesTo: "Stock Brokers", department: "Compliance,Risk Management", priority: "Critical", deadline: daysFromNow(30), deadlineType: "One-time", penaltyDescription: "Regulatory action including show cause notice for absence of risk-based CDD framework", penaltySeverity: "Critical", businessImpact: "Significant policy and process development exercise requiring Board involvement", recommendedAction: "Draft CDD framework based on SEBI PMLA master circular; conduct Board approval process; implement risk scoring", confidenceScore: 96.9, sourcePage: 19, sourceParagraph: 2, reviewStatus: "Pending", daysAgoCreated: 28 }),
    createObligation({ circularId: c2, ruleReference: "KYC/2024/002/S11.1", title: "Client Consent for Digital KYC Storage", description: "Explicit written or electronic consent must be obtained from clients for digital storage and processing of KYC documents. Consent must specify data usage, retention period, and sharing with regulatory authorities. Existing clients must provide consent within 180 days.", appliesTo: "Stock Brokers", department: "Legal,Operations", priority: "Medium", deadline: daysFromNow(90), deadlineType: "One-time", penaltyDescription: "Penalty under DPDP Act 2023 up to ₹50 Crore for consent violations", penaltySeverity: "High", businessImpact: "Mass client communication and consent management system implementation", recommendedAction: "Draft SEBI and DPDP compliant consent forms; implement consent management platform; run client outreach", confidenceScore: 87.3, sourcePage: 21, sourceParagraph: 3, reviewStatus: "Pending", daysAgoCreated: 25 }),
  ]);

  // --- Circular 3: AML/CFT ---
  const c3 = circulars[2].id;
  const amlObligations = await Promise.all([
    createObligation({ circularId: c3, ruleReference: "AML/2024/003/S2.1", title: "Suspicious Transaction Reporting (STR) — 7-Day Timeline", description: "Suspicious transaction reports must be filed with the Financial Intelligence Unit-India (FIU-IND) within 7 working days of forming suspicion. Internal STR decisions must be documented. False positives exceeding 80% of filings will attract regulatory scrutiny.", appliesTo: "Stock Brokers,Portfolio Managers", department: "Compliance", priority: "Critical", deadline: daysAgo(5), deadlineType: "Ongoing", penaltyDescription: "Penalty up to ₹5 Lakh per unreported suspicious transaction; criminal prosecution under PMLA 2002", penaltySeverity: "Critical", businessImpact: "STR process automation and transaction monitoring system enhancement", recommendedAction: "Upgrade transaction monitoring system; calibrate AML alert rules; train compliance officers on STR decision-making", confidenceScore: 98.3, sourcePage: 4, sourceParagraph: 1, reviewStatus: "Approved", approvedById: compliance.id, approvedAt: daysAgo(35), daysAgoCreated: 45 }),
    createObligation({ circularId: c3, ruleReference: "AML/2024/003/S3.1", title: "Real-Time Sanctions Screening Against UNSC and OFAC Lists", description: "All clients must be screened against UNSC consolidated list, OFAC SDN list, and MHA designated terrorist lists in real-time at onboarding and daily thereafter. Any match requires immediate account freeze and reporting to FIU-IND within 24 hours.", appliesTo: "Stock Brokers,Clearing Members", department: "Compliance,Technology", priority: "Critical", deadline: daysAgo(5), deadlineType: "Ongoing", penaltyDescription: "Criminal prosecution under PMLA and UAPA for facilitating transactions of sanctioned entities", penaltySeverity: "Critical", businessImpact: "Real-time sanctions screening API integration and alert management workflow", recommendedAction: "Integrate sanctions screening API (Dow Jones, Refinitiv WorldCheck); daily batch screening of existing clients; alert workflow", confidenceScore: 97.6, sourcePage: 6, sourceParagraph: 2, reviewStatus: "Approved", approvedById: compliance.id, approvedAt: daysAgo(32), daysAgoCreated: 42 }),
    createObligation({ circularId: c3, ruleReference: "AML/2024/003/S4.1", title: "Designated Principal Officer (DPO) Appointment Under PMLA", description: "A Designated Principal Officer responsible for PMLA compliance must be appointed at senior management level. DPO must be a qualified legal or compliance professional. DPO details must be registered with FIU-IND. DPO must attend mandatory FIU-IND training.", appliesTo: "Stock Brokers", department: "Compliance,Leadership", priority: "High", deadline: daysAgo(5), deadlineType: "One-time", penaltyDescription: "Penalty up to ₹25 Lakh for non-appointment; show cause notice to Board", penaltySeverity: "High", businessImpact: "Senior compliance hire or reassignment of existing senior officer", recommendedAction: "Designate existing Compliance Head or appoint dedicated DPO; complete FIU-IND registration; attend training", confidenceScore: 96.4, sourcePage: 8, sourceParagraph: 1, reviewStatus: "Approved", approvedById: compliance.id, approvedAt: daysAgo(28), daysAgoCreated: 38 }),
    createObligation({ circularId: c3, ruleReference: "AML/2024/003/S5.1", title: "Cash Transaction Reporting (CTR) to FIU-IND", description: "All cash transactions above ₹10 Lakh (single or aggregated in a month) must be reported to FIU-IND by the 15th of the following month. Reports must be filed in prescribed XML format through FINnet portal. Technical access to FINnet must be maintained.", appliesTo: "Stock Brokers", department: "Compliance,Operations", priority: "High", deadline: daysFromNow(15), deadlineType: "Monthly", penaltyDescription: "Penalty up to ₹10 Lakh per missed CTR filing; potential prosecution for wilful non-reporting", penaltySeverity: "High", businessImpact: "CTR generation automation from core banking/back-office system", recommendedAction: "Configure automated CTR generation from back-office; test FINnet XML submission; set monthly calendar reminder", confidenceScore: 95.1, sourcePage: 10, sourceParagraph: 3, reviewStatus: "Approved", approvedById: compliance.id, approvedAt: daysAgo(25), daysAgoCreated: 35 }),
    createObligation({ circularId: c3, ruleReference: "AML/2024/003/S6.1", title: "Transaction Monitoring System — Mandatory Rule-Based Alerts", description: "A transaction monitoring system (TMS) must be deployed with minimum alert rules covering structuring, unusual volume spikes, dormant account activity, and cross-border transactions. Alert thresholds must be calibrated annually. False positive rate must be maintained below 85%.", appliesTo: "Stock Brokers,Portfolio Managers", department: "Technology,Compliance", priority: "High", deadline: daysFromNow(60), deadlineType: "Ongoing", penaltyDescription: "Penalty up to ₹50 Lakh for inadequate TMS; regulatory directive to suspend client onboarding", penaltySeverity: "High", businessImpact: "TMS software procurement and integration with trading and back-office systems", recommendedAction: "Evaluate TMS vendors; implement core alert rules; calibrate thresholds; establish alert investigation workflow", confidenceScore: 93.8, sourcePage: 12, sourceParagraph: 2, reviewStatus: "Approved", approvedById: compliance.id, approvedAt: daysAgo(22), daysAgoCreated: 32 }),
    createObligation({ circularId: c3, ruleReference: "AML/2024/003/S7.1", title: "PMLA Record Maintenance — 5 Years Minimum", description: "All AML/KYC records, transaction records, and investigation reports must be maintained for a minimum of 5 years. Records must be indexed and retrievable within 48 hours of regulatory request. Electronic records must be encrypted and access-controlled.", appliesTo: "Stock Brokers", department: "Operations,Legal", priority: "Medium", deadline: daysFromNow(90), deadlineType: "Ongoing", penaltyDescription: "Penalty up to ₹10 Lakh for failure to produce records within stipulated timeframe", penaltySeverity: "Medium", businessImpact: "Long-term archival infrastructure investment", recommendedAction: "Implement secure document archival system; establish retrieval SLA; test retrieval capability quarterly", confidenceScore: 91.2, sourcePage: 14, sourceParagraph: 1, reviewStatus: "Pending", daysAgoCreated: 30 }),
    createObligation({ circularId: c3, ruleReference: "AML/2024/003/S8.1", title: "Non-Resident Indian (NRI) Enhanced Monitoring — FEMA Compliance", description: "Transactions of NRI clients must be monitored for FEMA compliance in addition to PMLA. Repatriation transactions must be verified for source of funds. Transactions appearing to circumvent FEMA limits must be escalated to Compliance Head for STR evaluation.", appliesTo: "Stock Brokers", department: "Compliance,Operations", priority: "Medium", deadline: daysFromNow(45), deadlineType: "Ongoing", penaltyDescription: "Penalty under FEMA up to 3 times the amount involved in contravention", penaltySeverity: "High", businessImpact: "NRI client segmentation and enhanced monitoring workflow setup", recommendedAction: "Tag all NRI accounts in TMS; create FEMA-specific alert rules; establish escalation workflow to Compliance Head", confidenceScore: 88.9, sourcePage: 16, sourceParagraph: 3, reviewStatus: "Pending", daysAgoCreated: 28 }),
    createObligation({ circularId: c3, ruleReference: "AML/2024/003/S9.1", title: "Board-Level AML/CFT Policy Approval and Annual Review", description: "A comprehensive AML/CFT policy must be approved by the Board of Directors. Policy must be reviewed and re-approved annually or upon significant regulatory change. Policy must be communicated to all relevant staff and acknowledged in writing.", appliesTo: "Stock Brokers", department: "Compliance,Leadership", priority: "High", deadline: daysFromNow(30), deadlineType: "Annual", penaltyDescription: "Show cause notice to Board members for absence of AML policy; potential cancellation of registration", penaltySeverity: "Critical", businessImpact: "Board engagement and policy development exercise", recommendedAction: "Draft updated AML/CFT policy; schedule Board meeting for approval; circulate to all staff; collect acknowledgements", confidenceScore: 96.7, sourcePage: 18, sourceParagraph: 2, reviewStatus: "Pending", daysAgoCreated: 25 }),
  ]);

  // --- Circular 4: Investor Protection ---
  const c4 = circulars[3].id;
  const investorObligations = await Promise.all([
    createObligation({ circularId: c4, ruleReference: "INV/2024/004/S2.1", title: "SEBI SCORES 2.0 Registration — Mandatory by Effective Date", description: "All stock brokers must register on the SEBI Complaints Redressal System (SCORES 2.0) before the effective date. Registration must include nomination of a SCORES Compliance Officer at Senior VP level or above. Login credentials must be shared with SEBI within 7 days of registration.", appliesTo: "Stock Brokers,Investment Advisers", department: "Compliance,Operations", priority: "High", deadline: daysFromNow(10), deadlineType: "One-time", penaltyDescription: "Suspension of registration for failure to register on SCORES 2.0 by deadline", penaltySeverity: "Critical", businessImpact: "Technology registration and compliance officer designation", recommendedAction: "Complete SCORES 2.0 portal registration; nominate SCORES Compliance Officer; test grievance receipt workflow", confidenceScore: 97.5, sourcePage: 3, sourceParagraph: 1, reviewStatus: "Pending", daysAgoCreated: 35 }),
    createObligation({ circularId: c4, ruleReference: "INV/2024/004/S3.1", title: "Investor Grievance Resolution — 21 Calendar Days Binding", description: "All investor complaints received through SCORES must be resolved within 21 calendar days. ATR (Action Taken Report) must be filed on SCORES upon resolution. Unresolved complaints escalate to SEBI for conciliation. Stock broker must accept SEBI conciliation decision as binding.", appliesTo: "Stock Brokers,Clearing Members", department: "Operations,Compliance,Legal", priority: "Critical", deadline: daysFromNow(10), deadlineType: "Ongoing", penaltyDescription: "Penalty up to ₹25 Lakh per unresolved complaint; public disclosure on SEBI website", penaltySeverity: "Critical", businessImpact: "Dedicated investor relations team and grievance tracking system required", recommendedAction: "Assign dedicated SCORES monitoring team; set Day 7 and Day 14 internal escalation alerts; establish 21-day resolution SLA", confidenceScore: 96.3, sourcePage: 5, sourceParagraph: 2, reviewStatus: "Pending", daysAgoCreated: 33 }),
    createObligation({ circularId: c4, ruleReference: "INV/2024/004/S4.1", title: "Mandatory Investor Charter Publication on Website", description: "An investor charter detailing investor rights, obligations of the stock broker, available grievance mechanisms, and contact information of the Grievance Redressal Officer must be prominently displayed on the broker's website and mobile app.", appliesTo: "Stock Brokers,Investment Advisers", department: "Compliance,Technology", priority: "Medium", deadline: daysFromNow(10), deadlineType: "One-time", penaltyDescription: "Penalty up to ₹5 Lakh for absence or inadequate investor charter display", penaltySeverity: "Medium", businessImpact: "Website content update and legal review", recommendedAction: "Draft investor charter per SEBI template; legal review; publish on website; update mobile app help section", confidenceScore: 92.7, sourcePage: 7, sourceParagraph: 1, reviewStatus: "Pending", daysAgoCreated: 30 }),
    createObligation({ circularId: c4, ruleReference: "INV/2024/004/S5.1", title: "Investor Risk Profiling for Derivative Segment Clients", description: "Risk profiling is mandatory for all clients seeking to trade in derivative segments. Risk profile must be re-assessed annually. Clients with Conservative risk profile must be prohibited from trading in high-risk derivative instruments regardless of explicit consent.", appliesTo: "Stock Brokers", department: "Compliance,Operations", priority: "High", deadline: daysFromNow(10), deadlineType: "Ongoing", penaltyDescription: "Penalty up to ₹10 Lakh per client for allowing inappropriate derivatives trading", penaltySeverity: "High", businessImpact: "Risk profiling tool integration and system-level trading restriction implementation", recommendedAction: "Implement risk profiling questionnaire in onboarding; configure system blocks for mismatched risk profiles; annual refresh", confidenceScore: 93.8, sourcePage: 9, sourceParagraph: 3, reviewStatus: "Pending", daysAgoCreated: 28 }),
    createObligation({ circularId: c4, ruleReference: "INV/2024/004/S6.1", title: "Automatic Closure of Inactive Client Accounts — 24 Months", description: "Trading accounts with no activity for 24 consecutive months must be classified as dormant and all positions squared off within 30 days after client notification. Clients may reactivate accounts by completing fresh KYC. Records must be maintained for 5 years post-closure.", appliesTo: "Stock Brokers", department: "Operations,Compliance", priority: "Medium", deadline: daysFromNow(30), deadlineType: "Ongoing", penaltyDescription: "Penalty up to ₹5 Lakh for improperly maintaining dormant accounts with open positions", penaltySeverity: "Medium", businessImpact: "System enhancement for dormant account identification and automated notification", recommendedAction: "Build dormant account identification module; client notification workflow; implement automated position squaring with client consent", confidenceScore: 89.1, sourcePage: 11, sourceParagraph: 2, reviewStatus: "Pending", daysAgoCreated: 25 }),
    createObligation({ circularId: c4, ruleReference: "INV/2024/004/S7.1", title: "Annual Investor Education Contribution to SEBI Investor Protection Fund", description: "Stock brokers must contribute 0.01% of average daily trading turnover to the SEBI Investor Protection and Education Fund (IPEF) annually. Contribution must be paid by April 30 each year. Contribution statement must be submitted to SEBI along with auditor certificate.", appliesTo: "Stock Brokers", department: "Finance,Compliance", priority: "Medium", deadline: daysFromNow(45), deadlineType: "Annual", penaltyDescription: "Penalty up to ₹10 Lakh for non-contribution; interest at 18% per annum on outstanding amount", penaltySeverity: "Medium", businessImpact: "Annual financial outflow calculation and payment process", recommendedAction: "Calculate IPEF contribution based on turnover; process payment to SEBI; obtain auditor certificate; file with SEBI", confidenceScore: 87.6, sourcePage: 13, sourceParagraph: 1, reviewStatus: "Pending", daysAgoCreated: 22 }),
  ]);

  // --- Circular 5: Risk Management ---
  const c5 = circulars[4].id;
  const riskObligations = await Promise.all([
    createObligation({ circularId: c5, ruleReference: "RISK/2024/005/S2.1", title: "Peak Margin Reporting — 4 Times Daily to Exchanges", description: "Stock brokers must collect and report peak margin of all clients to exchanges 4 times during market hours (at 11:00 AM, 12:30 PM, 2:00 PM, and End of Day). Peak margin shortfall will result in penalty on the client. Systematic shortfall reporting by broker is mandatory.", appliesTo: "Stock Brokers,Clearing Members", department: "Risk Management,Technology", priority: "Critical", deadline: daysFromNow(30), deadlineType: "Ongoing", penaltyDescription: "Penalty of 0.5% to 5% of shortfall amount per day of shortfall; client may be debarred from trading", penaltySeverity: "Critical", businessImpact: "Real-time margin monitoring system upgrade and exchange API integration", recommendedAction: "Upgrade risk management system for 4x daily margin snapshots; exchange API integration; automated shortfall alerts", confidenceScore: 97.8, sourcePage: 4, sourceParagraph: 1, reviewStatus: "Pending", daysAgoCreated: 20 }),
    createObligation({ circularId: c5, ruleReference: "RISK/2024/005/S3.1", title: "VaR-Based Margin Calculation with Stress Testing Component", description: "Margin calculations must use SEBI-prescribed VaR methodology with a mandatory 3-sigma extreme loss margin component. Daily stress tests must be run on concentrated positions exceeding 5% of free float. Results must be reported to Risk Committee monthly.", appliesTo: "Stock Brokers,Clearing Corporations", department: "Risk Management", priority: "High", deadline: daysFromNow(45), deadlineType: "Ongoing", penaltyDescription: "Penalty up to ₹25 Lakh for systemic margin under-collection", penaltySeverity: "High", businessImpact: "Risk model recalibration and quantitative risk team capability enhancement", recommendedAction: "Update risk model to SEBI-prescribed VaR; implement concentration limit monitoring; automate monthly risk committee reporting", confidenceScore: 94.6, sourcePage: 6, sourceParagraph: 2, reviewStatus: "Pending", daysAgoCreated: 18 }),
    createObligation({ circularId: c5, ruleReference: "RISK/2024/005/S4.1", title: "Algorithmic Trading Risk Management Controls", description: "Stock brokers offering algorithmic trading must implement mandatory circuit breakers and automatic order throttling. Algo order to trade ratio (OTR) must not exceed 20:1. All algorithms must be registered with exchanges before deployment. Kill switch mechanism is mandatory.", appliesTo: "Stock Brokers", department: "Technology,Risk Management,Compliance", priority: "High", deadline: daysFromNow(60), deadlineType: "Implementation", penaltyDescription: "Immediate suspension of algorithmic trading facility and penalty up to ₹50 Lakh", penaltySeverity: "High", businessImpact: "Algo trading platform audit and circuit breaker implementation", recommendedAction: "Audit all deployed algorithms; implement OTR monitoring; register all algos with NSE/BSE; deploy kill switch with Risk Head authority", confidenceScore: 95.2, sourcePage: 8, sourceParagraph: 3, reviewStatus: "Pending", daysAgoCreated: 15 }),
    createObligation({ circularId: c5, ruleReference: "RISK/2024/005/S5.1", title: "Exposure Limit Framework — Board Approved", description: "A Board-approved exposure limit framework must be established covering client-level, sector-level, and instrument-level exposure limits. Any breach of exposure limit must trigger automatic system alert and require Compliance Officer approval to proceed. Limits must be reviewed quarterly.", appliesTo: "Stock Brokers", department: "Risk Management,Leadership", priority: "High", deadline: daysFromNow(45), deadlineType: "Quarterly", penaltyDescription: "Penalty up to ₹25 Lakh for systemic exposure limit breaches", penaltySeverity: "High", businessImpact: "Risk framework policy development and system-level limit enforcement implementation", recommendedAction: "Draft exposure limit framework; present to Board for approval; configure system-level limits with alert thresholds; quarterly review process", confidenceScore: 93.1, sourcePage: 10, sourceParagraph: 1, reviewStatus: "Pending", daysAgoCreated: 12 }),
    createObligation({ circularId: c5, ruleReference: "RISK/2024/005/S6.1", title: "Mandatory Risk Disclosure Document for Derivative Clients", description: "All clients trading in derivative segments must receive and sign a comprehensive risk disclosure document in vernacular language option. Document must include specific examples of potential losses, margin call scenarios, and liquidation procedures. Signed copy must be retained for 5 years.", appliesTo: "Stock Brokers", department: "Legal,Operations,Compliance", priority: "Medium", deadline: daysFromNow(45), deadlineType: "Ongoing", penaltyDescription: "Penalty up to ₹5 Lakh per client for trading derivatives without risk disclosure", penaltySeverity: "Medium", businessImpact: "Risk disclosure document redesign and multilingual translation", recommendedAction: "Redesign risk disclosure per SEBI format; translate to Hindi and 8 regional languages; update onboarding process for derivative clients", confidenceScore: 90.4, sourcePage: 12, sourceParagraph: 2, reviewStatus: "Pending", daysAgoCreated: 10 }),
    createObligation({ circularId: c5, ruleReference: "RISK/2024/005/S7.1", title: "Net Worth Maintenance and Monthly Reporting to Exchange", description: "Stock brokers must maintain minimum net worth as prescribed by exchanges at all times. Net worth computation must follow SEBI-prescribed methodology. Monthly net worth certificate signed by CA must be submitted to exchanges by 7th of following month.", appliesTo: "Stock Brokers", department: "Finance,Compliance", priority: "High", deadline: daysFromNow(37), deadlineType: "Monthly", penaltyDescription: "Suspension of membership for net worth falling below prescribed minimum", penaltySeverity: "Critical", businessImpact: "Monthly financial reporting process and CA engagement", recommendedAction: "Set up automated net worth computation; engage CA for monthly certification; configure exchange portal submission workflow", confidenceScore: 96.5, sourcePage: 14, sourceParagraph: 1, reviewStatus: "Pending", daysAgoCreated: 8 }),
    createObligation({ circularId: c5, ruleReference: "RISK/2024/005/S8.1", title: "Client Fund Segregation — Exclusive Bank Account Mandate", description: "Client funds must be maintained in accounts exclusive to client purpose, strictly segregated from broker's own funds. Broker must not co-mingle client funds. Daily reconciliation of client funds is mandatory. Any shortfall must be reported to exchanges within 24 hours.", appliesTo: "Stock Brokers,Clearing Members", department: "Finance,Operations,Risk Management", priority: "Critical", deadline: daysFromNow(30), deadlineType: "Ongoing", penaltyDescription: "Criminal charges under relevant sections of SEBI Act for client fund misappropriation; cancellation of registration", penaltySeverity: "Critical", businessImpact: "Bank account structure review and daily reconciliation automation", recommendedAction: "Audit current bank account structure; create exclusive client fund accounts; implement daily automated reconciliation; exchange reporting", confidenceScore: 98.7, sourcePage: 16, sourceParagraph: 3, reviewStatus: "Pending", daysAgoCreated: 6 }),
  ]);

  const allObligations = [
    ...cyberObligations, ...kycObligations, ...amlObligations, 
    ...investorObligations, ...riskObligations,
  ];
  console.log(`✅ ${allObligations.length} obligations created`);

  // -------------------------------------------------------------------------
  // 5. Workflow Tasks (40 total)
  // -------------------------------------------------------------------------
  const approvedObligations = allObligations.filter((o) => o.reviewStatus === "Approved");
  const pendingObligations = allObligations.filter((o) => o.reviewStatus === "Pending");

  const taskStatuses = ["Todo", "In Progress", "Done", "In Review"];
  const departments = ["IT Security", "Compliance", "Risk Management", "Operations", "Legal", "Finance", "HR"];
  const taskComments = [
    "Assigned after Board review. Working with external consultant.",
    "Internal assessment completed. Vendor evaluation in progress.",
    "Implementation underway. Expected completion within schedule.",
    "Draft policy prepared. Awaiting legal review.",
    "Completed initial gap analysis. Remediation plan submitted to CISO.",
    "Vendor shortlisted. Contract under negotiation.",
    "Training material prepared. Sessions scheduled for next month.",
    "System configuration complete. UAT in progress.",
    "Submitted to exchange for review. Awaiting acknowledgement.",
    "Escalated to MD for approval. Pending Board meeting.",
  ];

  const users = [compliance, manager, auditor, admin];
  const allTasks = [];
  
  // Create 40 tasks across obligations
  const taskObligations = [
    ...approvedObligations.slice(0, 10),
    ...pendingObligations.slice(0, 30),
  ].slice(0, 40);

  for (let i = 0; i < 40; i++) {
    const obl = taskObligations[i % taskObligations.length];
    const status = taskStatuses[Math.floor(i / 10)]; // 10 tasks each status
    const daysOffset = Math.floor(Math.random() * 60) + 5;
    const task = await prisma.workflowTask.create({
      data: {
        organizationId: org.id,
        obligationId: obl.id,
        ownerId: pick(users).id,
        department: pick(departments),
        status,
        priority: pick(["High", "Medium", "Low", "Critical"]),
        dueDate: status === "Done" ? daysAgo(Math.floor(Math.random() * 20)) : daysFromNow(daysOffset),
        evidenceRequired: i % 3 === 0,
        completionPercentage: status === "Done" ? 100 : status === "In Progress" ? Math.floor(Math.random() * 70) + 20 : status === "In Review" ? 90 : Math.floor(Math.random() * 20),
        comments: pick(taskComments),
        createdById: admin.id,
        approvedById: status === "Done" ? compliance.id : undefined,
        createdAt: daysAgo(Math.floor(Math.random() * 60) + 10),
      },
    });
    allTasks.push(task);
  }
  console.log(`✅ 40 workflow tasks created`);

  // -------------------------------------------------------------------------
  // 6. Audit Logs (20)
  // -------------------------------------------------------------------------
  const auditActions = [
    { action: "OBLIGATION_APPROVED", entity: "Obligation", reason: "Reviewed extraction — all fields verified against source document" },
    { action: "OBLIGATION_REJECTED", entity: "Obligation", reason: "Confidence score below threshold; description inaccurate" },
    { action: "OBLIGATION_EDITED", entity: "Obligation", reason: "Corrected deadline date as per circular effective date" },
    { action: "TASK_CREATED", entity: "WorkflowTask", reason: "Created following obligation approval workflow" },
    { action: "TASK_STATUS_UPDATED", entity: "WorkflowTask", reason: "Status moved to In Progress — assigned team commenced work" },
    { action: "TASK_COMPLETED", entity: "WorkflowTask", reason: "Evidence uploaded and reviewed by Compliance Officer" },
    { action: "CIRCULAR_UPLOADED", entity: "Circular", reason: "New SEBI circular received and uploaded for processing" },
    { action: "AI_EXTRACTION_STARTED", entity: "Circular", reason: "AI extraction initiated for new circular" },
    { action: "AI_EXTRACTION_COMPLETED", entity: "Circular", reason: "AI successfully extracted 15 obligations from circular" },
    { action: "USER_ROLE_CHANGED", entity: "User", reason: "Manager promoted to Compliance Officer role" },
    { action: "REPORT_GENERATED", entity: "Report", reason: "Quarterly compliance summary report generated" },
    { action: "OBLIGATION_DEADLINE_UPDATED", entity: "Obligation", reason: "Deadline extended per SEBI corrigendum" },
    { action: "TASK_REASSIGNED", entity: "WorkflowTask", reason: "Original owner on leave; reassigned to alternate officer" },
    { action: "NOTIFICATION_SENT", entity: "Notification", reason: "Automated deadline reminder dispatched" },
    { action: "SETTINGS_UPDATED", entity: "Organization", reason: "Updated organization notification preferences" },
    { action: "BULK_KYC_UPLOAD", entity: "Circular", reason: "Bulk KYC re-verification campaign initiated for 2,847 clients" },
    { action: "VAPT_REPORT_SUBMITTED", entity: "Obligation", reason: "CERT-In VAPT report submitted to SEBI via portal" },
    { action: "CISO_APPOINTED", entity: "User", reason: "CISO appointed and intimation filed with SEBI within 30 days" },
    { action: "BOARD_POLICY_APPROVED", entity: "Obligation", reason: "AML/CFT policy approved by Board in meeting — Minutes attached" },
    { action: "SCORES_REGISTRATION", entity: "Obligation", reason: "Registered on SEBI SCORES 2.0 — Reg ID DSL/2024/SCR/0892 obtained" },
  ];

  const allEntities = [...allObligations.slice(0, 15), ...allTasks.slice(0, 5)];
  for (let i = 0; i < 20; i++) {
    const a = auditActions[i];
    await prisma.auditLog.create({
      data: {
        organizationId: org.id,
        entityType: a.entity,
        entityId: allEntities[i % allEntities.length].id,
        action: a.action,
        oldValue: a.action.includes("UPDATED") || a.action.includes("CHANGED") 
          ? JSON.stringify({ status: "Pending", value: "previous_value" }) 
          : null,
        newValue: JSON.stringify({ status: "Approved", value: "new_value", actor: pick(users).email }),
        performedById: pick(users).id,
        reason: a.reason,
        timestamp: daysAgo(Math.floor(Math.random() * 85) + 1),
      },
    });
  }
  console.log(`✅ 20 audit log entries created`);

  // -------------------------------------------------------------------------
  // 7. Notifications (10)
  // -------------------------------------------------------------------------
  const notificationData = [
    { type: "Upcoming Deadline", title: "⚠️ CISO Appointment Deadline in 5 Days", message: "SEBI Circular CYB/2024/001 mandates CISO appointment by the effective date. Please ensure appointment letter is prepared and SEBI intimation is filed." },
    { type: "Pending Review", title: "🔍 3 New AI Extractions Await Your Review", message: "AI engine has extracted obligations from SEBI/HO/MIRSD/2024/005. Please review and approve/reject within 48 hours to keep workflow on schedule." },
    { type: "Completed Task", title: "✅ KYC Re-verification Campaign Complete", message: "The mandatory KYC re-verification for 2,847 High Risk clients has been completed. 98.3% compliance achieved. Residual cases escalated." },
    { type: "Task Assigned", title: "📋 New Task: FATCA Self-Certification Drive", message: "You have been assigned the FATCA/CRS self-certification collection task for NRI clients. Deadline: 60 days. Please review the obligation details and commence outreach." },
    { type: "Upcoming Deadline", title: "🚨 SCORES 2.0 Registration Due in 10 Days", message: "SEBI Investor Protection Circular mandates SCORES 2.0 registration before effective date. Registration must include SCORES Compliance Officer nomination." },
    { type: "Pending Review", title: "🔍 AML Policy Requires Board Approval", message: "Updated AML/CFT policy has been drafted and is awaiting Board approval at next scheduled meeting. Please ensure agenda item is included." },
    { type: "Task Assigned", title: "📋 Peak Margin System Configuration Assigned", message: "You have been assigned the task to configure real-time peak margin reporting system to exchange 4 times daily. Technical implementation required by month-end." },
    { type: "Upcoming Deadline", title: "⚠️ Monthly CTR Filing Due in 15 Days", message: "Cash Transaction Report for the current month must be filed with FIU-IND by 15th via FINnet portal. Ensure all CTRs above ₹10 Lakh are captured." },
    { type: "Completed Task", title: "✅ VAPT Report Submitted to SEBI", message: "Bi-annual Vulnerability Assessment and Penetration Testing has been completed by CERT-In empanelled vendor. Report submitted to SEBI. Next cycle in 6 months." },
    { type: "Pending Review", title: "🔍 5 Obligations Pending Priority Review", message: "Risk Management circular obligations require priority review. All are rated Critical and have deadlines within 30 days. Compliance Officer action required." },
  ];

  const recipientMap = [compliance, compliance, manager, auditor, compliance, compliance, manager, auditor, compliance, compliance];
  for (let i = 0; i < 10; i++) {
    await prisma.notification.create({
      data: {
        organizationId: org.id,
        recipientId: recipientMap[i].id,
        type: notificationData[i].type,
        title: notificationData[i].title,
        message: notificationData[i].message,
        readStatus: i > 5, // Last 4 are read
        createdAt: daysAgo(Math.floor(Math.random() * 25) + 1),
      },
    });
  }
  console.log(`✅ 10 notifications created`);

  // -------------------------------------------------------------------------
  // 8. Reports (5)
  // -------------------------------------------------------------------------
  const reportTypes = [
    "Compliance Summary",
    "Executive Summary",
    "Department Report",
    "Task Report",
    "Implementation Report",
  ];
  const reportGenerators = [compliance, admin, manager, compliance, auditor];
  for (let i = 0; i < 5; i++) {
    await prisma.report.create({
      data: {
        organizationId: org.id,
        reportType: reportTypes[i],
        generatedById: reportGenerators[i].id,
        reportUrl: `/reports/demo-${reportTypes[i].toLowerCase().replace(/ /g, "-")}.pdf`,
        generatedAt: daysAgo(Math.floor(Math.random() * 60) + 5),
      },
    });
  }
  console.log(`✅ 5 reports created`);

  // -------------------------------------------------------------------------
  // 9. Summary
  // -------------------------------------------------------------------------
  console.log(`
╔══════════════════════════════════════════════════════╗
║              BrahmOS Seed Complete! 🎉               ║
╠══════════════════════════════════════════════════════╣
║  Organization : Demo Securities Ltd. (Stock Broker)  ║
║  Users        : 4 (Admin, Compliance, Manager, Auditor) ║
║  Circulars    : ${circulars.length} SEBI Circulars               ║
║  Obligations  : ${allObligations.length} (across 5 domains)           ║
║  Tasks        : 40 Workflow Tasks                    ║
║  Audit Logs   : 20 Immutable Entries                 ║
║  Notifications: 10                                   ║
║  Reports      : 5                                    ║
╠══════════════════════════════════════════════════════╣
║  Run: npm run dev → Login with admin@demo.com        ║
╚══════════════════════════════════════════════════════╝
  `);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
