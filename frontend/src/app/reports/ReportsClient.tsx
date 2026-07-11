"use client";

import { useState } from "react";
import { PieChart, FileText, CheckSquare, Building, BookOpen, Download } from "lucide-react";
import ReportPreview from "./ReportPreview";

export default function ReportsClient({ circulars, obligations, tasks }: { circulars: any[], obligations: any[], tasks: any[] }) {
  const [selectedReport, setSelectedReport] = useState<string>("Executive Summary");

  const reportTypes = [
    { name: "Executive Summary", icon: PieChart, desc: "High-level compliance overview for C-suite." },
    { name: "Compliance Summary", icon: FileText, desc: "Detailed breakdown of obligation statuses." },
    { name: "Implementation Report", icon: CheckSquare, desc: "Status of implementation tasks and blockers." },
    { name: "Department Report", icon: Building, desc: "Compliance performance segmented by department." },
    { name: "Task Report", icon: BookOpen, desc: "Granular list of all regulatory tasks and owners." },
  ];

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500 pb-20">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <PieChart className="h-8 w-8 text-primary" />
            Reports & Exports
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">Generate and export professional PDF compliance reports.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Selection */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-lg font-bold text-foreground mb-4 tracking-tight">Report Types</h2>
          {reportTypes.map(rt => (
            <button
              key={rt.name}
              onClick={() => setSelectedReport(rt.name)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedReport === rt.name 
                ? "border-foreground/30 bg-muted/50 shadow-sm" 
                : "border-border bg-card hover:border-foreground/20"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <rt.icon className={`h-5 w-5 ${selectedReport === rt.name ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`font-bold ${selectedReport === rt.name ? "text-foreground" : "text-muted-foreground"}`}>
                  {rt.name}
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">{rt.desc}</p>
            </button>
          ))}
        </div>

        {/* Report Preview */}
        <div className="lg:col-span-3">
          <ReportPreview 
            reportType={selectedReport} 
            circulars={circulars} 
            obligations={obligations} 
            tasks={tasks} 
          />
        </div>
      </div>
    </div>
  );
}
