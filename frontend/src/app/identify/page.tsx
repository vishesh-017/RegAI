"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GitCompare, AlertTriangle, ArrowRight, FileText } from "lucide-react"

export default function IdentifyEngine() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <GitCompare className="h-8 w-8 text-purple-600" />
            Engine 2: Identify
          </h1>
          <p className="text-muted-foreground mt-2">Regulatory Change Intelligence: Compare circulars and identify impacts.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-t-4 border-t-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Added Obligations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">3</div>
            <p className="text-xs text-muted-foreground mt-1">Requires new workflows</p>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-t-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Modified Obligations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">1</div>
            <p className="text-xs text-muted-foreground mt-1">Deadline changed</p>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-t-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Removed Obligations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">0</div>
            <p className="text-xs text-muted-foreground mt-1">No relaxed rules</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comparison Viewer</CardTitle>
          <CardDescription>
            Comparing: <Badge variant="outline" className="mr-2">SEBI/2025/11</Badge> vs <Badge variant="default" className="bg-purple-600">SEBI/2026/02</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="modified" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="modified">Modified Rules (1)</TabsTrigger>
              <TabsTrigger value="added">New Rules (3)</TabsTrigger>
            </TabsList>
            <TabsContent value="modified" className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-900 p-3 border-b flex items-center justify-between">
                  <span className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Rule ID: SEBI/2025/11
                  </span>
                  <Badge variant="outline" className="text-amber-600 border-amber-600 bg-amber-50 dark:bg-amber-950">MODIFIED</Badge>
                </div>
                <div className="grid grid-cols-2 divide-x">
                  <div className="p-4 bg-red-50/50 dark:bg-red-950/20">
                    <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Previous</div>
                    <p className="text-sm">Entities must process KYC documents within <span className="bg-red-200 dark:bg-red-900 line-through px-1 rounded text-red-900 dark:text-red-200">30 days</span> of receipt.</p>
                  </div>
                  <div className="p-4 bg-green-50/50 dark:bg-green-950/20">
                    <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">New</div>
                    <p className="text-sm">Entities must process KYC documents within <span className="bg-green-200 dark:bg-green-900 font-bold px-1 rounded text-green-900 dark:text-green-200">15 days</span> of receipt.</p>
                  </div>
                </div>
                <div className="p-4 border-t bg-amber-50 dark:bg-amber-950/30 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-500">AI Impact Summary</h4>
                    <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">Deadline has been halved. High impact on Compliance and Operations departments. Requires faster processing workflows.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="added">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-900 p-3 border-b flex items-center justify-between">
                  <span className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Rule ID: SEBI/2026/02
                  </span>
                  <Badge variant="outline" className="text-red-600 border-red-600 bg-red-50 dark:bg-red-950">ADDED</Badge>
                </div>
                <div className="p-4 bg-green-50/50 dark:bg-green-950/20">
                  <p className="text-sm">Mandatory AI audit trail logs must be retained for <span className="bg-green-200 dark:bg-green-900 font-bold px-1 rounded text-green-900 dark:text-green-200">5 years</span>.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
