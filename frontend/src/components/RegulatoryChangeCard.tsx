"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowRight, Activity, CalendarClock, Briefcase, FileText } from "lucide-react";

const RegulatoryChangeCard = React.memo(({ change, newObs, oldObs }: { change: any, newObs?: any, oldObs?: any }) => {
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Added': return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/50';
      case 'Removed': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50';
      default: return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-4">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50 dark:bg-slate-900/20">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={`${getTypeColor(change.changeType)} uppercase tracking-wider text-xs font-bold`}>
            {change.changeType}
          </Badge>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Impact: {change.implementationImpact ? 'High' : 'Medium'}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {change.affectedDepartments.map((dept: string) => (
            <span key={dept} className="flex items-center gap-1 text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 px-2 py-1 rounded">
              <Briefcase className="h-3 w-3" /> {dept}
            </span>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">{change.changeSummary}</h4>
        
        {change.implementationImpact && (
          <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 p-4 rounded-lg mb-6 flex items-start gap-3">
            <Activity className="h-5 w-5 text-indigo-500 mt-0.5 shrink-0" />
            <div>
              <h5 className="text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-1">Implementation Impact</h5>
              <p className="text-sm text-indigo-700 dark:text-indigo-400">{change.implementationImpact}</p>
            </div>
          </div>
        )}

        {/* Diff View */}
        {(oldObs || newObs) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {oldObs && (
              <div className="p-4 rounded-lg border border-red-100 dark:border-red-900/30 bg-red-50/30 dark:bg-red-950/10">
                <h6 className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <FileText className="h-3 w-3" /> Previous Version
                </h6>
                <p className="text-sm text-slate-700 dark:text-slate-300 line-through opacity-70">{oldObs.description}</p>
              </div>
            )}
            
            {newObs && (
              <div className="p-4 rounded-lg border border-green-100 dark:border-green-900/30 bg-green-50/30 dark:bg-green-950/10">
                <h6 className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <FileText className="h-3 w-3" /> New Requirement
                </h6>
                <p className="text-sm text-slate-700 dark:text-slate-300">{newObs.description}</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Footer */}
      {change.estimatedEffort && (
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex items-center gap-2">
          <CalendarClock className="h-4 w-4" />
          Estimated Effort: <span className="font-semibold text-slate-700 dark:text-slate-300">{change.estimatedEffort}</span>
        </div>
      )}
    </div>
  );
});

RegulatoryChangeCard.displayName = "RegulatoryChangeCard";

export default RegulatoryChangeCard;
