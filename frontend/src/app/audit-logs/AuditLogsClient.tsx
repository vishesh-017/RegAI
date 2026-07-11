"use client";

import React, { useState, useMemo, useRef } from "react";
import { format } from "date-fns";
import { ShieldCheck, Search, Filter, Download, ChevronDown, ChevronUp, LayoutList, GitCommit, Bot, User, CheckCircle2, Edit3, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "use-debounce";
import { useVirtualizer } from "@tanstack/react-virtual";

export default function AuditLogsClient({ initialLogs }: { initialLogs: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("All");
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "timeline">("timeline");

  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  const actions = useMemo(() => ["All", ...Array.from(new Set(initialLogs.map(log => log.action)))], [initialLogs]);

  const filteredLogs = useMemo(() => initialLogs.filter(log => {
    const matchesSearch = 
      log.entityId.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      (log.reason && log.reason.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) ||
      (log.performedBy && log.performedBy.email && log.performedBy.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
    
    const matchesAction = actionFilter === "All" || log.action === actionFilter;

    return matchesSearch && matchesAction;
  }), [initialLogs, debouncedSearchTerm, actionFilter]);

  const parentRef = useRef<HTMLDivElement>(null);
  
  const rowVirtualizer = useVirtualizer({
    count: filteredLogs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 70,
    overscan: 5,
  });

  const exportCSV = () => {
    const headers = ["Timestamp", "Action", "Actor Email", "Actor Role", "Entity Type", "Entity ID", "Reason", "Old Value", "New Value"];
    const csvContent = [
      headers.join(","),
      ...filteredLogs.map(log => [
        `"${format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}"`,
        `"${log.action}"`,
        `"${log.performedBy?.email || 'System'}"`,
        `"${log.performedBy?.role || 'System'}"`,
        `"${log.entityType}"`,
        `"${log.entityId}"`,
        `"${(log.reason || '').replace(/"/g, '""')}"`,
        `"${(log.oldValue || '').replace(/"/g, '""')}"`,
        `"${(log.newValue || '').replace(/"/g, '""')}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `BrahmOS_Audit_Logs_${format(new Date(), "yyyyMMdd")}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'APPROVED': return 'bg-primary/10 text-primary border-primary/20 border';
      case 'REJECTED': return 'bg-destructive/10 text-destructive border-destructive/20 border';
      case 'EDITED': return 'bg-foreground/10 text-foreground border-foreground/20 border';
      case 'COMMENT': return 'bg-muted text-muted-foreground border-border border';
      case 'EXTRACTED': return 'bg-primary/10 text-primary border-primary/20 border';
      case 'WORKFLOW_GENERATED': return 'bg-foreground/10 text-foreground border-foreground/20 border';
      case 'TASK_COMPLETED': return 'bg-primary/10 text-primary border-primary/20 border';
      case 'REPORT_EXPORTED': return 'bg-muted text-muted-foreground border-border border';
      default: return 'bg-muted text-muted-foreground border-border border';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'APPROVED': return <CheckCircle2 className="h-4 w-4" />;
      case 'EDITED': return <Edit3 className="h-4 w-4" />;
      case 'EXTRACTED': return <Bot className="h-4 w-4" />;
      case 'WORKFLOW_GENERATED': return <Settings className="h-4 w-4" />;
      default: return <GitCommit className="h-4 w-4" />;
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500 pb-20">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
            Audit Logs
          </h1>
          <p className="text-muted-foreground mt-2">Immutable history of all human and system modifications.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-muted rounded-lg p-1 border border-border">
            <button
              onClick={() => setViewMode("timeline")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-colors ${viewMode === 'timeline' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <GitCommit className="h-4 w-4" /> Timeline
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-colors ${viewMode === 'table' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <LayoutList className="h-4 w-4" /> Table
            </button>
          </div>
          <button
            onClick={exportCSV}
            className="btn-primary flex items-center gap-2 px-4 py-2 text-sm font-bold"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-border bg-muted/30 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by actor, entity ID, or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-9"
            />
          </div>
          <div className="flex items-center gap-2 min-w-[200px]">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="input-field cursor-pointer"
            >
              {actions.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Content View */}
        {viewMode === 'table' ? (
          <div ref={parentRef} className="overflow-auto h-[600px] relative">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-muted/30 text-muted-foreground sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 font-bold tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 font-bold tracking-wider">Actor</th>
                  <th className="px-6 py-3 font-bold tracking-wider">Action</th>
                  <th className="px-6 py-3 font-bold tracking-wider">Entity Type</th>
                  <th className="px-6 py-3 font-bold tracking-wider">Reason / Details</th>
                  <th className="px-6 py-3 font-bold tracking-wider text-right">Changes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-foreground" style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No audit logs match your filters.
                    </td>
                  </tr>
                ) : (
                  rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const log = filteredLogs[virtualRow.index];
                    return (
                      <React.Fragment key={log.id}>
                        <tr 
                          className="hover:bg-muted/30 transition-colors group absolute w-full flex items-center"
                          style={{
                            height: `${virtualRow.size}px`,
                            transform: `translateY(${virtualRow.start}px)`
                          }}
                        >
                          <td className="px-6 py-4 w-1/6">
                            <span className="block font-bold">{format(new Date(log.timestamp), 'MMM d, yyyy')}</span>
                            <span className="text-xs text-muted-foreground">{format(new Date(log.timestamp), 'h:mm:ss a')}</span>
                          </td>
                          <td className="px-6 py-4 w-1/6">
                            <span className="block font-bold">{log.performedBy?.email || 'System'}</span>
                            <span className="text-xs text-muted-foreground">{log.performedBy?.role || 'Automation'}</span>
                          </td>
                          <td className="px-6 py-4 w-1/6">
                            <Badge variant="outline" className={`border-transparent ${getActionBadgeColor(log.action)}`}>
                              {log.action}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 w-1/6">
                            <span className="block font-bold">{log.entityType}</span>
                            <span className="text-xs font-mono text-muted-foreground">{log.entityId.substring(0,8)}...</span>
                          </td>
                          <td className="px-6 py-4 w-1/6">
                            <span className="truncate max-w-[200px] block" title={log.reason || ""}>
                              {log.reason || "-"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right w-1/6 flex justify-end">
                            {(log.oldValue || log.newValue) && (
                              <button 
                                onClick={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)}
                                className="text-primary hover:text-primary/80 text-xs font-bold inline-flex items-center gap-1"
                              >
                                {expandedLogId === log.id ? 'Hide Diff' : 'View Diff'}
                                {expandedLogId === log.id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                              </button>
                            )}
                          </td>
                        </tr>
                        {/* Note: In a virtualized list, expandable rows can be tricky. We might want to just show a modal for the diff instead of expanding the row. For now we will keep it simple. */}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 bg-muted/10">
            {filteredLogs.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No audit events match your filters.</p>
            ) : (
              <div className="relative border-l border-border ml-4 md:ml-8 space-y-8 pb-4">
                {filteredLogs.map(log => (
                  <div key={log.id} className="relative pl-8 md:pl-10">
                    <div className={`absolute -left-[17px] top-1.5 h-8 w-8 rounded-full flex items-center justify-center ${getActionBadgeColor(log.action)}`}>
                      {getActionIcon(log.action)}
                    </div>
                    
                    <div className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row justify-between md:items-start mb-3 gap-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-extrabold tracking-tight text-foreground uppercase text-sm">{log.action.replace(/_/g, ' ')}</span>
                          <Badge variant="outline" className="text-xs bg-muted border-border">
                            {log.entityType} <span className="text-muted-foreground ml-1 font-mono">#{log.entityId.substring(0,6)}</span>
                          </Badge>
                        </div>
                        <div className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded border border-border">
                          {format(new Date(log.timestamp), 'MMM d, yyyy • h:mm a')}
                        </div>
                      </div>
                      
                      <p className="text-foreground/80 text-sm leading-relaxed mb-4">
                        {log.reason || "System action processed automatically."}
                      </p>

                      <div className="flex items-center gap-3 text-xs bg-muted/50 p-2 rounded-lg border border-border/50 inline-flex">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                          {log.performedBy?.email ? log.performedBy.email.charAt(0).toUpperCase() : <Bot className="h-3 w-3" />}
                        </div>
                        <div>
                          <span className="font-bold text-foreground block">{log.performedBy?.email || 'BrahmOS Engine'}</span>
                          <span className="text-muted-foreground">{log.performedBy?.role || 'Automation Agent'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
