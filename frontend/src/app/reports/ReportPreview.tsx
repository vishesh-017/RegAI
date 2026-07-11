"use client";

import { useRef, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { format } from "date-fns";

const ComplianceTrendChart = dynamic(() => import("@/components/dashboard/Charts").then(mod => mod.ComplianceTrendChart), { ssr: false });
const TasksByDepartmentChart = dynamic(() => import("@/components/dashboard/Charts").then(mod => mod.TasksByDepartmentChart), { ssr: false });
const TaskCompletionChart = dynamic(() => import("@/components/dashboard/Charts").then(mod => mod.TaskCompletionChart), { ssr: false });
const TimelineChart = dynamic(() => import("@/components/dashboard/Charts").then(mod => mod.TimelineChart), { ssr: false });

export default function ReportPreview({ reportType, circulars, obligations, tasks }: { reportType: string, circulars: any[], obligations: any[], tasks: any[] }) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const exportPDF = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    
    try {
      // Small timeout to allow charts to render fully if they animate
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const [html2canvasModule, jsPDFModule] = await Promise.all([
        import("html2canvas"),
        import("jspdf")
      ]);
      const html2canvas = html2canvasModule.default;
      const jsPDF = jsPDFModule.default;

      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true, logging: false });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`BrahmOS_${reportType.replace(/\s+/g, '_')}_${format(new Date(), "yyyyMMdd")}.pdf`);
    } catch (err) {
      console.error("Failed to export PDF", err);
    } finally {
      setIsExporting(false);
    }
  };

  const renderRecommendations = () => (
    <div className="mt-8 bg-muted/20 border border-border rounded-lg p-5">
      <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider mb-3">Strategic Recommendations</h3>
      <ul className="space-y-2 text-sm text-foreground/80 list-disc pl-5">
        <li><strong>High Priority:</strong> Expedite review of the new SEBI Master Circular on Algo Trading.</li>
        <li><strong>Resource Allocation:</strong> The Risk Department currently has a bottleneck (45 pending tasks). Consider reassigning reviewers.</li>
        <li><strong>Policy Update:</strong> Update internal AML frameworks to align with recent RBI guidance by end of Q3.</li>
      </ul>
    </div>
  );

  const renderExecutiveSummary = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-background p-4 rounded-lg border border-border">
          <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Total Circulars</p>
          <p className="text-3xl font-extrabold text-foreground mt-1">{circulars.length || 156}</p>
        </div>
        <div className="bg-background p-4 rounded-lg border border-border">
          <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Active Tasks</p>
          <p className="text-3xl font-extrabold text-foreground mt-1">{tasks.filter(t => t.status !== "Done").length || 89}</p>
        </div>
        <div className="bg-destructive/5 p-4 rounded-lg border border-destructive/20">
          <p className="text-xs uppercase tracking-wider font-bold text-destructive">Critical Issues</p>
          <p className="text-3xl font-extrabold text-destructive mt-1">3</p>
        </div>
        <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
          <p className="text-xs uppercase tracking-wider font-bold text-primary">Compliance Rate</p>
          <p className="text-3xl font-extrabold text-primary mt-1">98.2%</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-sm font-extrabold border-b border-border pb-2 mb-4 text-foreground uppercase tracking-wider">Compliance Trend (6 Months)</h3>
          <div className="h-[200px] bg-muted/10 rounded-lg p-2 border border-border">
             <ComplianceTrendChart />
          </div>
        </div>
        <div>
           <h3 className="text-sm font-extrabold border-b border-border pb-2 mb-4 text-foreground uppercase tracking-wider">Upcoming Regulatory Events</h3>
           <div className="h-[200px] bg-muted/10 rounded-lg p-2 border border-border">
             <TimelineChart />
           </div>
        </div>
      </div>

      {renderRecommendations()}
    </div>
  );

  const renderImplementationReport = () => (
    <div className="space-y-8">
      <div className="bg-background p-6 rounded-lg border border-border flex items-center justify-between">
        <div>
          <p className="text-sm font-extrabold text-foreground tracking-tight">Overall Implementation Progress</p>
          <p className="text-xs text-muted-foreground mt-1 font-medium">Tracking completion of identified regulatory tasks</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold text-primary">84%</p>
          <p className="text-xs font-bold text-muted-foreground">Completed</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
           <h3 className="text-sm font-extrabold border-b border-border pb-2 mb-4 text-foreground uppercase tracking-wider">Task Status Distribution</h3>
           <div className="h-[250px] flex justify-center items-center">
             <TaskCompletionChart />
           </div>
        </div>
        <div>
          <h3 className="text-sm font-extrabold border-b border-border pb-2 mb-4 text-foreground uppercase tracking-wider">Recent Blockers</h3>
          <ul className="space-y-3">
             <li className="text-sm p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive font-medium">
               <strong>IT Security Dept:</strong> Awaiting external vendor audit for cyber framework compliance. (Delayed by 4 days)
             </li>
             <li className="text-sm p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-600 font-medium">
               <strong>Legal Dept:</strong> Missing signature on KYC addendum from the Chief Compliance Officer.
             </li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderDepartmentReport = () => (
    <div className="space-y-8">
      <div>
         <h3 className="text-sm font-extrabold border-b border-border pb-2 mb-4 text-foreground uppercase tracking-wider">Active Task Volume by Department</h3>
         <div className="h-[250px] w-full mt-4">
           <TasksByDepartmentChart />
         </div>
      </div>
      
      <div>
        <h3 className="text-sm font-extrabold border-b border-border pb-2 mb-4 text-foreground uppercase tracking-wider">Department Performance Metrics</h3>
        <table className="w-full text-left text-sm text-foreground">
          <thead>
            <tr className="bg-muted/30 text-muted-foreground border-b border-border">
              <th className="p-3 font-bold">Department</th>
              <th className="p-3 font-bold">Active Tasks</th>
              <th className="p-3 font-bold">Overdue</th>
              <th className="p-3 font-bold">Completion Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            <tr><td className="p-3 font-bold">Compliance</td><td className="p-3">62</td><td className="p-3 text-destructive font-bold">2</td><td className="p-3 text-primary font-bold">94%</td></tr>
            <tr><td className="p-3 font-bold">Risk</td><td className="p-3">45</td><td className="p-3 text-destructive font-bold">5</td><td className="p-3 text-primary font-bold">88%</td></tr>
            <tr><td className="p-3 font-bold">Operations</td><td className="p-3">34</td><td className="p-3">0</td><td className="p-3 text-primary font-bold">98%</td></tr>
            <tr><td className="p-3 font-bold">IT Security</td><td className="p-3">28</td><td className="p-3 text-destructive font-bold">1</td><td className="p-3 text-primary font-bold">91%</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderComplianceSummary = () => (
    <div className="space-y-8">
      <div className="flex gap-4">
        <div className="flex-1 bg-background p-5 rounded-lg border border-border">
           <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Obligations Tracked</p>
           <p className="text-3xl font-extrabold text-foreground mt-1">412</p>
        </div>
        <div className="flex-1 bg-background p-5 rounded-lg border border-border">
           <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Regulations Mapped</p>
           <p className="text-3xl font-extrabold text-foreground mt-1">156</p>
        </div>
        <div className="flex-1 bg-amber-500/10 p-5 rounded-lg border border-amber-500/20">
           <p className="text-xs uppercase tracking-wider font-bold text-amber-500">Pending Clarification</p>
           <p className="text-3xl font-extrabold text-amber-500 mt-1">14</p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-extrabold border-b border-border pb-2 mb-4 text-foreground uppercase tracking-wider">Top Priority Circulars</h3>
        <table className="w-full text-left text-sm text-foreground">
          <thead>
            <tr className="bg-muted/30 text-muted-foreground border-b border-border">
              <th className="p-3 font-bold">Reference / Authority</th>
              <th className="p-3 font-bold">Subject</th>
              <th className="p-3 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            <tr>
              <td className="p-3"><span className="font-bold text-foreground block">SEBI/HO/MIRSD/2026/01</span><span className="text-xs text-muted-foreground">SEBI</span></td>
              <td className="p-3 max-w-[250px] truncate">Master Circular on KYC Norms</td>
              <td className="p-3"><span className="px-2 py-1 bg-primary/10 border border-primary/20 text-primary rounded text-xs font-bold">Fully Compliant</span></td>
            </tr>
            <tr>
              <td className="p-3"><span className="font-bold text-foreground block">RBI/2026-27/12</span><span className="text-xs text-muted-foreground">RBI</span></td>
              <td className="p-3 max-w-[250px] truncate">Cyber Security Framework for NBFCs</td>
              <td className="p-3"><span className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded text-xs font-bold">In Progress (82%)</span></td>
            </tr>
            <tr>
              <td className="p-3"><span className="font-bold text-foreground block">NSE/INSP/2026/04</span><span className="text-xs text-muted-foreground">NSE</span></td>
              <td className="p-3 max-w-[250px] truncate">Guidelines for Algorithmic Trading</td>
              <td className="p-3"><span className="px-2 py-1 bg-foreground/10 border border-foreground/20 text-foreground rounded text-xs font-bold">Under Review</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const getReportContent = () => {
    switch(reportType) {
      case "Executive Summary": return renderExecutiveSummary();
      case "Implementation Report": return renderImplementationReport();
      case "Department Report": return renderDepartmentReport();
      case "Compliance Summary": return renderComplianceSummary();
      default: return renderExecutiveSummary();
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden flex flex-col h-full min-h-[600px]">
      {/* Header Toolbar */}
      <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
        <h2 className="text-lg font-bold text-foreground tracking-tight">Preview: {reportType}</h2>
        <button
          onClick={exportPDF}
          disabled={isExporting}
          className="btn-primary flex items-center gap-2 px-4 py-2 text-sm disabled:opacity-50"
        >
          {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {isExporting ? "Exporting..." : "Export to PDF"}
        </button>
      </div>

      {/* Render Area (Will be captured by html2canvas) */}
      {/* Note: We force specific white/black colors here for consistent PDF export */}
      <div className="p-8 bg-muted/10 overflow-auto flex-1 flex justify-center">
        <div 
          ref={reportRef} 
          className="bg-white w-[800px] min-h-[1131px] p-12 shadow-md relative text-black"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {/* Report Header */}
          <div className="border-b-4 border-black pb-6 mb-8 flex justify-between items-end">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-black rounded-xl flex items-center justify-center shadow-inner">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-black tracking-tight">BrahmOS</h1>
                <p className="text-gray-600 font-bold tracking-widest text-[10px] mt-1 uppercase">Enterprise Compliance Division</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-black uppercase tracking-wide">{reportType}</h2>
              <p className="text-sm font-semibold text-gray-500 mt-1">Generated: {format(new Date(), "MMMM d, yyyy")}</p>
            </div>
          </div>

          {/* Dynamic Content */}
          <div className="mb-12 print-content">
            {getReportContent()}
          </div>

          {/* Footer */}
          <div className="absolute bottom-12 left-12 right-12 border-t border-gray-200 pt-4 flex justify-between text-xs text-gray-400">
            <span>Confidential - Internal Use Only</span>
            <span>Generated by BrahmOS Platform</span>
          </div>
        </div>
      </div>
    </div>
  );
}
