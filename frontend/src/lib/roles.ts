// Centralized Role-Based Access Control Configuration
// Defines permissions, allowed routes, and sidebar visibility for each role

export type UserRole = "Admin" | "Compliance Officer" | "Manager" | "Auditor";

export const ROLE_CONFIG: Record<UserRole, {
  label: string;
  description: string;
  allowedRoutes: string[];
  sidebarItems: string[];
  canApproveObligations: boolean;
  canRejectObligations: boolean;
  canUploadCirculars: boolean;
  canProcessAI: boolean;
  canManageTasks: boolean;
  canManageUsers: boolean;
  canViewAuditLogs: boolean;
  canGenerateReports: boolean;
  canEditSettings: boolean;
  isReadOnly: boolean;
}> = {
  Admin: {
    label: "Admin",
    description: "Full platform access and user management",
    allowedRoutes: ["*"], // all routes allowed
    sidebarItems: [
      "Dashboard", "Analytics", "Timeline",
      "Circulars", "Understand", "Identify",
      "Review Queue", "Act", "Reports", "Audit Logs", "Notifications",
    ],
    canApproveObligations: true,
    canRejectObligations: true,
    canUploadCirculars: true,
    canProcessAI: true,
    canManageTasks: true,
    canManageUsers: true,
    canViewAuditLogs: true,
    canGenerateReports: true,
    canEditSettings: true,
    isReadOnly: false,
  },
  "Compliance Officer": {
    label: "Compliance Officer",
    description: "Review, approve, and manage regulatory obligations",
    allowedRoutes: [
      "/dashboard", "/analytics", "/timeline",
      "/circulars", "/circulars/upload", "/circulars/[id]",
      "/review-queue", "/identify", "/act", "/notifications", "/reports",
      "/profile",
    ],
    sidebarItems: [
      "Dashboard", "Analytics", "Timeline",
      "Circulars", "Understand", "Identify",
      "Review Queue", "Act", "Reports", "Notifications",
    ],
    canApproveObligations: true,
    canRejectObligations: true,
    canUploadCirculars: true,
    canProcessAI: true,
    canManageTasks: true,
    canManageUsers: false,
    canViewAuditLogs: true,
    canGenerateReports: true,
    canEditSettings: false,
    isReadOnly: false,
  },
  Manager: {
    label: "Manager",
    description: "Manage departmental tasks and team workflows",
    allowedRoutes: [
      "/dashboard", "/analytics", "/timeline",
      "/circulars", "/circulars/[id]",
      "/act", "/notifications",
      "/profile",
    ],
    sidebarItems: [
      "Dashboard", "Analytics", "Timeline",
      "Circulars",
      "Act", "Notifications",
    ],
    canApproveObligations: false,
    canRejectObligations: false,
    canUploadCirculars: false,
    canProcessAI: false,
    canManageTasks: true,
    canManageUsers: false,
    canViewAuditLogs: false,
    canGenerateReports: true,
    canEditSettings: false,
    isReadOnly: false,
  },
  Auditor: {
    label: "Auditor",
    description: "Read-only access to compliance data, audit trails, and reports",
    allowedRoutes: [
      "/dashboard", "/analytics", "/timeline",
      "/circulars", "/circulars/[id]",
      "/review-queue", "/audit-logs", "/reports", "/notifications",
      "/profile",
    ],
    sidebarItems: [
      "Dashboard", "Analytics", "Timeline",
      "Circulars",
      "Reports", "Audit Logs", "Notifications",
    ],
    canApproveObligations: false,
    canRejectObligations: false,
    canUploadCirculars: false,
    canProcessAI: false,
    canManageTasks: false,
    canManageUsers: false,
    canViewAuditLogs: true,
    canGenerateReports: true,
    canEditSettings: false,
    isReadOnly: true,
  },
};

export function getRoleConfig(role: string | null | undefined) {
  const r = (role || "Admin") as UserRole;
  return ROLE_CONFIG[r] || ROLE_CONFIG["Admin"];
}

export function hasPermission(role: string | null | undefined, permission: keyof typeof ROLE_CONFIG.Admin): boolean {
  const config = getRoleConfig(role);
  const value = config[permission];
  return typeof value === "boolean" ? value : false;
}

export function canAccessRoute(role: string | null | undefined, pathname: string): boolean {
  const config = getRoleConfig(role);
  if (config.allowedRoutes.includes("*")) return true;
  
  // Check exact match or prefix match for dynamic routes
  return config.allowedRoutes.some(route => {
    if (route.includes("[")) {
      // Dynamic route — match prefix
      const prefix = route.split("[")[0];
      return pathname.startsWith(prefix);
    }
    return pathname === route || pathname.startsWith(route + "/");
  });
}
