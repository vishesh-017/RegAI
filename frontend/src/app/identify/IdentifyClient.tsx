"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GitCompare, ArrowRight, FileText, Sparkles } from "lucide-react"

type Change = {
  id: string
  changeType: string
  changeSummary: string
  affectedDepartments: string
  implementationImpact: string
  estimatedEffort: string
  newObligation: {
    ruleReference: string
    title: string
    description: string
    priority: string
    circularRef: string
  }
  oldObligation: {
    ruleReference: string
    title: string
    description: string
    circularRef: string
  } | null
}

export default function IdentifyClient({ initialChanges, role }: { initialChanges: Change[]; role: string }) {
  const addedChanges = initialChanges.filter(c => c.changeType.toLowerCase() === "added" || c.changeType.toLowerCase() === "add")
  const modifiedChanges = initialChanges.filter(c => c.changeType.toLowerCase() === "modified" || c.changeType.toLowerCase() === "modify")
  const removedChanges = initialChanges.filter(c => c.changeType.toLowerCase() === "removed" || c.changeType.toLowerCase() === "remove")

  const roleBadge: Record<string, { label: string; cls: string }> = {
    "Admin": { label: "ADMIN", cls: "border-indigo-500/30 text-indigo-400 bg-indigo-500/10" },
    "Compliance Officer": { label: "COMPLIANCE", cls: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" },
    "Manager": { label: "MANAGER", cls: "border-blue-500/30 text-blue-400 bg-blue-500/10" },
    "Auditor": { label: "AUDITOR • READ-ONLY", cls: "border-amber-500/30 text-amber-400 bg-amber-500/10" },
  }

  const badge = roleBadge[role] || roleBadge["Admin"]

  return (
    <div className="flex flex-col gap-8 animate-page-in">
      <div className="flex justify-between items-center">
        <div>
          <Badge variant="outline" className={`text-[10px] font-bold mb-2 ${badge.cls}`}>{badge.label}</Badge>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <GitCompare className="h-8 w-8 text-purple-600 dark:text-purple-500" />
            Engine 2: Identify
          </h1>
          <p className="text-muted-foreground mt-2">Regulatory Change Intelligence: Compare circulars and identify impacts.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Added Obligations */}
        <Card className="relative overflow-hidden border border-red-100 dark:border-red-950/50 bg-gradient-to-b from-red-50/40 via-card to-card dark:from-red-950/10 dark:via-card dark:to-card p-6 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-red-600" />
          <CardHeader className="pb-2 p-0 flex flex-col items-center">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Added Obligations</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex flex-col items-center mt-2">
            <div className="text-4xl font-extrabold text-red-600 dark:text-red-500 tracking-tight">{addedChanges.length}</div>
            <p className="text-xs text-red-700/80 dark:text-red-400/80 bg-red-50/50 dark:bg-red-950/20 px-2.5 py-1 rounded-full border border-red-100 dark:border-red-900/30 mt-3 font-medium">
              Requires new workflows
            </p>
          </CardContent>
        </Card>

        {/* Modified Obligations */}
        <Card className="relative overflow-hidden border border-amber-100 dark:border-amber-950/50 bg-gradient-to-b from-amber-50/40 via-card to-card dark:from-amber-950/10 dark:via-card dark:to-card p-6 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600" />
          <CardHeader className="pb-2 p-0 flex flex-col items-center">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Modified Obligations</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex flex-col items-center mt-2">
            <div className="text-4xl font-extrabold text-amber-600 dark:text-amber-500 tracking-tight">{modifiedChanges.length}</div>
            <p className="text-xs text-amber-700/80 dark:text-amber-400/80 bg-amber-50/50 dark:bg-amber-950/20 px-2.5 py-1 rounded-full border border-amber-100 dark:border-amber-900/30 mt-3 font-medium">
              Rules changed
            </p>
          </CardContent>
        </Card>

        {/* Removed Obligations */}
        <Card className="relative overflow-hidden border border-green-100 dark:border-green-950/50 bg-gradient-to-b from-green-50/40 via-card to-card dark:from-green-950/10 dark:via-card dark:to-card p-6 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600" />
          <CardHeader className="pb-2 p-0 flex flex-col items-center">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Removed Obligations</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex flex-col items-center mt-2">
            <div className="text-4xl font-extrabold text-green-600 dark:text-green-500 tracking-tight">{removedChanges.length}</div>
            <p className="text-xs text-green-700/80 dark:text-green-400/80 bg-green-50/50 dark:bg-green-950/20 px-2.5 py-1 rounded-full border border-green-100 dark:border-green-900/30 mt-3 font-medium">
              Relaxed rules
            </p>
          </CardContent>
        </Card>
      </div>

      {initialChanges.length === 0 ? (
        <Card className="border border-border/80 shadow-md">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 bg-muted rounded-full mb-4">
              <GitCompare className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-base font-bold text-foreground">No delta changes identified</h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-1">
              Upload a new circular referencing a parent document to calculate differences automatically.
            </p>
          </div>
        </Card>
      ) : (
        <Card className="border border-border/80 shadow-md overflow-hidden bg-gradient-to-b from-card to-background/30">
          <CardHeader className="border-b bg-slate-50/40 dark:bg-slate-950/20 py-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <GitCompare className="h-5 w-5 text-purple-600 dark:text-purple-500" />
                  Comparison Viewer
                </CardTitle>
                <CardDescription className="mt-1">
                  Deep diff analysis of selected regulatory mandates.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="modified" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
                <TabsTrigger value="modified" className="rounded-md py-2.5 font-medium transition-all">Modified Rules ({modifiedChanges.length})</TabsTrigger>
                <TabsTrigger value="added" className="rounded-md py-2.5 font-medium transition-all">New Rules ({addedChanges.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="modified" className="space-y-6">
                {modifiedChanges.map((change) => (
                  <div key={change.id} className="border border-slate-200/60 dark:border-slate-800/60 rounded-xl overflow-hidden shadow-sm bg-card hover:shadow-md transition-all duration-300">
                    <div className="relative bg-gradient-to-r from-slate-100/80 via-slate-50/50 to-slate-100/80 dark:from-slate-900/60 dark:via-slate-950/30 dark:to-slate-900/60 p-4 border-b flex flex-col sm:flex-row items-center justify-center gap-3">
                      <div className="absolute left-4 hidden sm:flex items-center gap-2 text-muted-foreground">
                        <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Document Rule</span>
                      </div>
                      
                      <div className="flex flex-col items-center gap-0.5 text-center">
                        <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Rule Ref / Circular</span>
                        <h3 className="text-base font-bold tracking-tight text-foreground">
                          {change.newObligation.ruleReference || "Obligation Rule"} ({change.newObligation.circularRef})
                        </h3>
                      </div>
                      
                      <div className="sm:absolute sm:right-4">
                        <Badge className="text-amber-600 border-amber-300 bg-amber-500/10 dark:text-amber-400 dark:border-amber-900/50 dark:bg-amber-950/30 px-3 py-0.5 font-semibold tracking-wide border rounded-md">
                          MODIFIED
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x relative border-b dark:border-slate-800/60">
                      {/* Previous Directive */}
                      <div className="p-6 bg-gradient-to-br from-red-500/[0.03] via-red-500/[0.005] to-transparent dark:from-red-950/15 dark:via-transparent dark:to-transparent flex flex-col min-h-[120px]">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-red-600 dark:text-red-400 mb-3 uppercase tracking-widest">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-sm" />
                          Previous Directive
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {change.oldObligation?.description || "No description available"}
                        </p>
                      </div>
                      
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center z-10">
                        <div className="bg-background border rounded-full p-2 shadow-sm ring-4 ring-slate-50 dark:ring-slate-900/40">
                          <ArrowRight className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                      </div>

                      {/* New Directive */}
                      <div className="p-6 bg-gradient-to-br from-green-500/[0.03] via-green-500/[0.005] to-transparent dark:from-green-950/15 dark:via-transparent dark:to-transparent flex flex-col min-h-[120px]">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-green-600 dark:text-green-400 mb-3 uppercase tracking-widest">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-sm" />
                          New Directive
                        </div>
                        <p className="text-sm leading-relaxed text-foreground font-medium">
                          {change.newObligation.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-r from-purple-500/[0.04] via-indigo-500/[0.02] to-transparent dark:from-purple-950/20 dark:via-indigo-950/5 dark:to-transparent flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div className="flex gap-4 items-start">
                        <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 dark:bg-purple-950/40 dark:border-purple-800/30 shrink-0 text-purple-600 dark:text-purple-400 shadow-inner">
                          <Sparkles className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">AI Impact Insights</h4>
                            <Badge className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/40 hover:bg-purple-100 dark:hover:bg-purple-950 rounded-md">
                              {change.newObligation.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {change.changeSummary}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 md:flex-col md:items-end w-full md:w-auto shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-slate-800/40">
                        <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider hidden md:block">Impacted Areas</div>
                        <div className="flex gap-2 mt-1">
                          {change.affectedDepartments.split(",").map(dept => (
                            <Badge key={dept} variant="outline" className="text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-medium">{dept.trim()}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="added" className="space-y-6">
                {addedChanges.map((change) => (
                  <div key={change.id} className="border border-slate-200/60 dark:border-slate-800/60 rounded-xl overflow-hidden shadow-sm bg-card hover:shadow-md transition-all duration-300">
                    <div className="relative bg-gradient-to-r from-slate-100/80 via-slate-50/50 to-slate-100/80 dark:from-slate-900/60 dark:via-slate-950/30 dark:to-slate-900/60 p-4 border-b flex flex-col sm:flex-row items-center justify-center gap-3">
                      <div className="absolute left-4 hidden sm:flex items-center gap-2 text-muted-foreground">
                        <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Document Rule</span>
                      </div>
                      
                      <div className="flex flex-col items-center gap-0.5 text-center">
                        <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Rule Ref / Circular</span>
                        <h3 className="text-base font-bold tracking-tight text-foreground">
                          {change.newObligation.ruleReference || "New Obligation"} ({change.newObligation.circularRef})
                        </h3>
                      </div>
                      
                      <div className="sm:absolute sm:right-4">
                        <Badge className="text-red-600 border-red-300 bg-red-500/10 dark:text-red-400 dark:border-red-900/50 dark:bg-red-950/30 px-3 py-0.5 font-semibold tracking-wide border rounded-md">
                          ADDED
                        </Badge>
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-green-500/[0.03] via-green-500/[0.005] to-transparent dark:from-green-950/15 dark:via-transparent dark:to-transparent border-b dark:border-slate-800/60">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-green-600 dark:text-green-400 mb-3 uppercase tracking-widest">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-sm" />
                        New Directive
                      </div>
                      <p className="text-sm leading-relaxed text-foreground font-medium">
                        {change.newObligation.description}
                      </p>
                    </div>

                    <div className="p-6 bg-gradient-to-r from-purple-500/[0.04] via-indigo-500/[0.02] to-transparent dark:from-purple-950/20 dark:via-indigo-950/5 dark:to-transparent flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div className="flex gap-4 items-start">
                        <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 dark:bg-purple-950/40 dark:border-purple-800/30 shrink-0 text-purple-600 dark:text-purple-400 shadow-inner">
                          <Sparkles className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">AI Impact Insights</h4>
                            <Badge className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300 border hover:bg-slate-100 dark:hover:bg-slate-900 rounded-md">
                              {change.newObligation.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {change.changeSummary}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 md:flex-col md:items-end w-full md:w-auto shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-slate-800/40">
                        <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider hidden md:block">Impacted Areas</div>
                        <div className="flex gap-2 mt-1">
                          {change.affectedDepartments.split(",").map(dept => (
                            <Badge key={dept} variant="outline" className="text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-medium">{dept.trim()}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
