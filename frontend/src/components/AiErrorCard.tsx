"use client";

import { AlertOctagon, RefreshCw, FileWarning, Database, ServerCrash } from "lucide-react";

interface AiError {
  type: string;
  message: string;
}

interface AiErrorCardProps {
  error: AiError;
  onRetry: () => void;
  isRetrying: boolean;
  title?: string;
}

export default function AiErrorCard({ error, onRetry, isRetrying, title = "Processing Failed" }: AiErrorCardProps) {
  
  // Determine icon and color accents based on error type
  let Icon = AlertOctagon;
  let colorClass = "text-red-600 dark:text-red-400";
  let bgClass = "bg-red-50 dark:bg-red-900/10";
  let borderClass = "border-red-200 dark:border-red-900/30";
  let buttonClass = "bg-red-600 hover:bg-red-700 text-white";

  if (error.type === "PDF_PARSING_FAILURE" || error.type === "EMPTY_DOCUMENT" || error.type === "UNSUPPORTED_FORMAT") {
    Icon = FileWarning;
    colorClass = "text-amber-600 dark:text-amber-400";
    bgClass = "bg-amber-50 dark:bg-amber-900/10";
    borderClass = "border-amber-200 dark:border-amber-900/30";
    buttonClass = "bg-amber-600 hover:bg-amber-700 text-white";
  } else if (error.type === "DATABASE_ERROR") {
    Icon = Database;
  } else if (error.type === "MALFORMED_RESPONSE") {
    Icon = ServerCrash;
  }

  return (
    <div className={`rounded-xl border ${borderClass} ${bgClass} p-8 text-center shadow-sm max-w-xl mx-auto`}>
      <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner bg-white dark:bg-slate-900 border ${borderClass}`}>
        <Icon className={`h-8 w-8 ${colorClass}`} />
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      
      <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 mb-6 text-left shadow-sm">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
          <span>Error Details</span>
          <span className={`text-xs px-2 py-0.5 rounded font-mono uppercase ${bgClass} ${colorClass}`}>{error.type.replace(/_/g, ' ')}</span>
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {error.message}
        </p>
      </div>

      <button 
        onClick={onRetry}
        disabled={isRetrying}
        className={`px-6 py-3 rounded-xl font-medium shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center gap-2 ${buttonClass}`}
      >
        <RefreshCw className={`h-5 w-5 ${isRetrying ? 'animate-spin' : ''}`} />
        {isRetrying ? "Retrying..." : "Retry Process"}
      </button>
    </div>
  );
}
