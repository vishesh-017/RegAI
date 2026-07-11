"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GitCompare, AlertTriangle, ArrowRight, FileText, Sparkles } from "lucide-react"

export default function IdentifyEngine() {
  return (
    <div className="flex flex-col gap-8 animate-page-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <GitCompare className="h-8 w-8 text-purple-600 dark:text-purple-500" />
            Engine 2: Identify
          </h1>
          <p className="text-muted-foreground mt-2">Regulatory Change Intelligence: Compare circulars and identify impacts.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Added Obligations */}
        <Card className="relative overflow-hidden border border-red-100 dark:border-red-950/50 bg-gradient-to-b from-red-50/40 via-card to-card dark:from-red-950/10 dark:via-card dark:to-card p-6 flex flex-col items-center justify-center text-center card-hover shadow-sm">
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-red-600" />
          <CardHeader className="pb-2 p-0 flex flex-col items-center">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Added Obligations</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex flex-col items-center mt-2">
            <div className="text-4xl font-extrabold text-red-600 dark:text-red-500 tracking-tight">3</div>
            <p className="text-xs text-red-700/80 dark:text-red-400/80 bg-red-50/50 dark:bg-red-950/20 px-2.5 py-1 rounded-full border border-red-100 dark:border-red-900/30 mt-3 font-medium">
              Requires new workflows
            </p>
          </CardContent>
        </Card>

        {/* Modified Obligations */}
        <Card className="relative overflow-hidden border border-amber-100 dark:border-amber-950/50 bg-gradient-to-b from-amber-50/40 via-card to-card dark:from-amber-950/10 dark:via-card dark:to-card p-6 flex flex-col items-center justify-center text-center card-hover shadow-sm">
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600" />
          <CardHeader className="pb-2 p-0 flex flex-col items-center">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Modified Obligations</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex flex-col items-center mt-2">
            <div className="text-4xl font-extrabold text-amber-600 dark:text-amber-500 tracking-tight">1</div>
            <p className="text-xs text-amber-700/80 dark:text-amber-400/80 bg-amber-50/50 dark:bg-amber-950/20 px-2.5 py-1 rounded-full border border-amber-100 dark:border-amber-900/30 mt-3 font-medium">
              Deadline changed
            </p>
          </CardContent>
        </Card>

        {/* Removed Obligations */}
        <Card className="relative overflow-hidden border border-green-100 dark:border-green-950/50 bg-gradient-to-b from-green-50/40 via-card to-card dark:from-green-950/10 dark:via-card dark:to-card p-6 flex flex-col items-center justify-center text-center card-hover shadow-sm">
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600" />
          <CardHeader className="pb-2 p-0 flex flex-col items-center">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Removed Obligations</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex flex-col items-center mt-2">
            <div className="text-4xl font-extrabold text-green-600 dark:text-green-500 tracking-tight">0</div>
            <p className="text-xs text-green-700/80 dark:text-green-400/80 bg-green-50/50 dark:bg-green-950/20 px-2.5 py-1 rounded-full border border-green-100 dark:border-green-900/30 mt-3 font-medium">
              No relaxed rules
            </p>
          </CardContent>
        </Card>
      </div>

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
            <div className="flex items-center gap-2 bg-slate-100/80 dark:bg-slate-800/85 px-3 py-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
              <span className="text-xs text-muted-foreground font-medium">Comparing:</span>
              <Badge variant="outline" className="font-semibold bg-white dark:bg-slate-900">SEBI/2025/11</Badge>
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
              <Badge variant="default" className="bg-purple-600 dark:bg-purple-500 font-semibold hover:bg-purple-600">SEBI/2026/02</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="modified" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
              <TabsTrigger value="modified" className="rounded-md py-2.5 font-medium transition-all">Modified Rules (1)</TabsTrigger>
              <TabsTrigger value="added" className="rounded-md py-2.5 font-medium transition-all">New Rules (3)</TabsTrigger>
            </TabsList>
            
            <TabsContent value="modified" className="space-y-6">
              <div className="border border-slate-200/60 dark:border-slate-800/60 rounded-xl overflow-hidden shadow-sm bg-card hover:shadow-md transition-all duration-300">
                {/* Center Content-Centric Rule ID Header */}
                <div className="relative bg-gradient-to-r from-slate-100/80 via-slate-50/50 to-slate-100/80 dark:from-slate-900/60 dark:via-slate-950/30 dark:to-slate-900/60 p-4 border-b flex flex-col sm:flex-row items-center justify-center gap-3">
                  <div className="absolute left-4 hidden sm:flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Document Rule</span>
                  </div>
                  
                  <div className="flex flex-col items-center gap-0.5 text-center">
                    <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Rule ID</span>
                    <h3 className="text-base font-bold tracking-tight text-foreground">
                      SEBI/2025/11
                    </h3>
                  </div>
                  
                  <div className="sm:absolute sm:right-4">
                    <Badge className="text-amber-600 border-amber-300 bg-amber-500/10 dark:text-amber-400 dark:border-amber-900/50 dark:bg-amber-950/30 px-3 py-0.5 font-semibold tracking-wide border rounded-md">
                      MODIFIED
                    </Badge>
                  </div>
                </div>

                {/* Diff Panels */}
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x relative border-b dark:border-slate-800/60">
                  {/* Previous Directive */}
                  <div className="p-6 bg-gradient-to-br from-red-500/[0.03] via-red-500/[0.005] to-transparent dark:from-red-950/15 dark:via-transparent dark:to-transparent flex flex-col min-h-[120px]">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-red-600 dark:text-red-400 mb-3 uppercase tracking-widest">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-sm" />
                      Previous Directive
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Entities must process KYC documents within <span className="bg-red-100/80 dark:bg-red-950/50 line-through px-1.5 py-0.5 rounded text-red-700 dark:text-red-300 font-medium">30 days</span> of receipt.
                    </p>
                  </div>
                  
                  {/* Floating separator arrow */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center z-10">
                    <div className="bg-background border rounded-full p-2 shadow-sm ring-4 ring-slate-50 dark:ring-slate-900/40">
                      <ArrowRight className="h-4 w-4 text-purple-600 dark:text-purple-400 animate-pulse" />
                    </div>
                  </div>

                  {/* New Directive */}
                  <div className="p-6 bg-gradient-to-br from-green-500/[0.03] via-green-500/[0.005] to-transparent dark:from-green-950/15 dark:via-transparent dark:to-transparent flex flex-col min-h-[120px]">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-green-600 dark:text-green-400 mb-3 uppercase tracking-widest">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-sm" />
                      New Directive
                    </div>
                    <p className="text-sm leading-relaxed text-foreground font-medium">
                      Entities must process KYC documents within <span className="bg-green-100/90 dark:bg-green-950/60 text-green-800 dark:text-green-300 px-1.5 py-0.5 rounded border border-green-200 dark:border-green-800/80 font-bold">15 days</span> of receipt.
                    </p>
                  </div>
                </div>

                {/* AI Impact Insights Banner */}
                <div className="p-6 bg-gradient-to-r from-purple-500/[0.04] via-indigo-500/[0.02] to-transparent dark:from-purple-950/20 dark:via-indigo-950/5 dark:to-transparent flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex gap-4 items-start">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 dark:bg-purple-950/40 dark:border-purple-800/30 shrink-0 text-purple-600 dark:text-purple-400 shadow-inner">
                      <Sparkles className="h-5 w-5 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">AI Impact Insights</h4>
                        <Badge className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/40 hover:bg-purple-100 dark:hover:bg-purple-950 rounded-md">
                          High Priority
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        The processing window has been reduced by <span className="text-purple-600 dark:text-purple-400 font-semibold">50% (from 30 days to 15 days)</span>. This change triggers immediate compliance and operational adjustments, requiring automated workflows to accelerate KYC verification queues.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 md:flex-col md:items-end w-full md:w-auto shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-slate-800/40">
                    <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider hidden md:block">Impacted Areas</div>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-medium">Compliance</Badge>
                      <Badge variant="outline" className="text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-medium">Operations</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="added" className="space-y-6">
              {/* Added Rule 1 */}
              <div className="border border-slate-200/60 dark:border-slate-800/60 rounded-xl overflow-hidden shadow-sm bg-card hover:shadow-md transition-all duration-300">
                <div className="relative bg-gradient-to-r from-slate-100/80 via-slate-50/50 to-slate-100/80 dark:from-slate-900/60 dark:via-slate-950/30 dark:to-slate-900/60 p-4 border-b flex flex-col sm:flex-row items-center justify-center gap-3">
                  <div className="absolute left-4 hidden sm:flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Document Rule</span>
                  </div>
                  
                  <div className="flex flex-col items-center gap-0.5 text-center">
                    <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Rule ID</span>
                    <h3 className="text-base font-bold tracking-tight text-foreground">
                      SEBI/2026/02
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
                    Mandatory AI audit trail logs must be retained for <span className="bg-green-100/90 dark:bg-green-950/60 text-green-800 dark:text-green-300 px-1.5 py-0.5 rounded border border-green-200 dark:border-green-800/80 font-bold">5 years</span>.
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
                          Standard Priority
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Establishes long-term data preservation requirements for algorithmic audit logs. Requires deployment of automated, secure archiving storage policies to prevent data loss.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 md:flex-col md:items-end w-full md:w-auto shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-slate-800/40">
                    <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider hidden md:block">Impacted Areas</div>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-medium">IT Infra</Badge>
                      <Badge variant="outline" className="text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-medium">Compliance</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Added Rule 2 */}
              <div className="border border-slate-200/60 dark:border-slate-800/60 rounded-xl overflow-hidden shadow-sm bg-card hover:shadow-md transition-all duration-300">
                <div className="relative bg-gradient-to-r from-slate-100/80 via-slate-50/50 to-slate-100/80 dark:from-slate-900/60 dark:via-slate-950/30 dark:to-slate-900/60 p-4 border-b flex flex-col sm:flex-row items-center justify-center gap-3">
                  <div className="absolute left-4 hidden sm:flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Document Rule</span>
                  </div>
                  
                  <div className="flex flex-col items-center gap-0.5 text-center">
                    <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Rule ID</span>
                    <h3 className="text-base font-bold tracking-tight text-foreground">
                      SEBI/2026/03
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
                    Annual cybersecurity audits must be conducted by <span className="bg-green-100/90 dark:bg-green-950/60 text-green-800 dark:text-green-300 px-1.5 py-0.5 rounded border border-green-200 dark:border-green-800/80 font-bold">CERT-In impaneled</span> auditors.
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
                        <Badge className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/40 hover:bg-purple-100 dark:hover:bg-purple-950 rounded-md">
                          High Priority
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Mandates elevated cybersecurity assessments. Operational risk and IT security teams need to schedule certified audits, formulate checklists, and prepare mitigation artifacts.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 md:flex-col md:items-end w-full md:w-auto shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-slate-800/40">
                    <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider hidden md:block">Impacted Areas</div>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-medium">Security</Badge>
                      <Badge variant="outline" className="text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-medium">Risk Mgmt</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Added Rule 3 */}
              <div className="border border-slate-200/60 dark:border-slate-800/60 rounded-xl overflow-hidden shadow-sm bg-card hover:shadow-md transition-all duration-300">
                <div className="relative bg-gradient-to-r from-slate-100/80 via-slate-50/50 to-slate-100/80 dark:from-slate-900/60 dark:via-slate-950/30 dark:to-slate-900/60 p-4 border-b flex flex-col sm:flex-row items-center justify-center gap-3">
                  <div className="absolute left-4 hidden sm:flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Document Rule</span>
                  </div>
                  
                  <div className="flex flex-col items-center gap-0.5 text-center">
                    <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Rule ID</span>
                    <h3 className="text-base font-bold tracking-tight text-foreground">
                      SEBI/2026/04
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
                    Real-time transaction monitoring is required for all institutional trades exceeding <span className="bg-green-100/90 dark:bg-green-950/60 text-green-800 dark:text-green-300 px-1.5 py-0.5 rounded border border-green-200 dark:border-green-800/80 font-bold">₹10 Crores</span>.
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
                        <Badge className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/40 hover:bg-purple-100 dark:hover:bg-purple-950 rounded-md">
                          High Priority
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Demands implementation of instant threshold alerts. Requires technology teams to establish low-latency event stream pipelines and automated trade desk monitoring tools.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 md:flex-col md:items-end w-full md:w-auto shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-slate-800/40">
                    <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider hidden md:block">Impacted Areas</div>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-medium">Trade Desk</Badge>
                      <Badge variant="outline" className="text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-medium">Technology</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

