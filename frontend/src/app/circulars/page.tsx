import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, FileText, Upload, ArrowRight, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Circulars Hub | BrahmOS Compliance",
  description: "Manage, search, and process regulatory circulars.",
};

export default async function CircularsPage() {
  const session = await getServerSession(authOptions);
  const orgId = session?.user?.organizationId as string;
  
  if (!orgId) {
    redirect("/onboarding");
  }

  const dbOrg = await prisma.organization.findUnique({
    where: { id: orgId }
  });

  if (!dbOrg) {
    redirect("/onboarding");
  }

  const circulars = await prisma.circular.findMany({
    where: { organizationId: dbOrg.id },
    orderBy: { createdAt: 'desc' }
  });

  const statusConfig: Record<string, { label: string; cls: string }> = {
    Draft:    { label: "Draft",    cls: "border-border text-muted-foreground bg-muted" },
    Active:   { label: "Active",   cls: "border-primary/20 text-primary bg-primary/10" },
    Archived: { label: "Archived", cls: "border-border text-muted-foreground bg-background" },
  };

  return (
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Circulars Hub</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            {circulars.length > 0 ? `${circulars.length} circulars tracked` : "No circulars yet — start by uploading one."}
          </p>
        </div>
        <Link href="/circulars/upload">
          <button className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Circular
          </button>
        </Link>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {circulars.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
            <div className="p-5 bg-muted rounded-2xl mb-6">
              <FileText className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold tracking-tight text-foreground mb-2">No circulars uploaded yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-8">
              Start by uploading your first regulatory document. BrahmOS will automatically extract obligations and generate workflows.
            </p>
            <Link href="/circulars/upload">
              <button className="btn-primary px-6 py-2.5 text-sm flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Upload first circular
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* Table toolbar */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">
                {circulars.length} Documents
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Search className="h-3.5 w-3.5" />
                <span>Use Ctrl+K to search</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground bg-muted/30 border-b border-border">
                  <tr>
                    <th className="px-6 py-3.5 font-bold tracking-wider">Reference</th>
                    <th className="px-6 py-3.5 font-bold tracking-wider">Title</th>
                    <th className="px-6 py-3.5 font-bold tracking-wider">Issuer</th>
                    <th className="px-6 py-3.5 font-bold tracking-wider text-right">Date</th>
                    <th className="px-6 py-3.5 font-bold tracking-wider">Status</th>
                    <th className="px-6 py-3.5 font-bold tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {circulars.map((circular, i) => {
                    const s = statusConfig[circular.status] ?? statusConfig.Archived;
                    return (
                      <tr
                        key={circular.id}
                        className="hover:bg-muted/30 transition-colors group"
                        style={{ animationDelay: `${i * 40}ms` }}
                      >
                        <td className="px-6 py-4">
                          <code className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded-md border border-primary/20">
                            {circular.referenceNumber}
                          </code>
                        </td>
                        <td className="px-6 py-4 text-foreground font-semibold max-w-[280px]">
                          <span className="truncate block">{circular.title}</span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground text-sm">
                          {circular.issuingAuthority}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground text-sm tabular-nums text-right">
                          {new Date(circular.publicationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className={`text-xs font-medium ${s.cls}`}>
                            {s.label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/circulars/${circular.id}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 hover:underline transition-all"
                          >
                            Open <ArrowRight className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
