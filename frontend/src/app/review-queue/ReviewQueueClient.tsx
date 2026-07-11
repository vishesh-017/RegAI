"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, FileText, CheckCircle, XCircle, AlertTriangle, Play, ChevronDown, Check, Save } from "lucide-react";
import { approveObligationAction, rejectObligationAction, updateObligationAction } from "@/app/actions/ai";
import { toast } from "sonner";
import Link from "next/link";

type Obligation = {
  id: string;
  title: string;
  description: string;
  ruleReference: string;
  department: string;
  priority: string;
  deadline: string | null;
  confidenceScore: number;
  circularId: string;
  circularTitle: string;
  circularRef: string;
};

export default function ReviewQueueClient({
  initialObligations,
  role,
  totalDrafts,
  totalApproved,
}: {
  initialObligations: Obligation[];
  role: string;
  totalDrafts: number;
  totalApproved: number;
}) {
  const [obligations, setObligations] = useState<Obligation[]>(initialObligations);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState("");
  const [editedDept, setEditedDept] = useState("");
  const [commentText, setCommentText] = useState("");
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const isReadOnly = role !== "Compliance Officer" && role !== "Admin";
  const progressText = `${totalApproved} of ${totalApproved + totalDrafts} reviewed`;

  const handleApprove = async (id: string) => {
    if (isReadOnly) return;
    try {
      const target = obligations.find((o) => o.id === id);
      if (target && editingId === id) {
        // Save edits first
        await updateObligationAction(id, {
          description: editedText,
          department: editedDept,
        });
      }
      await approveObligationAction(id, "Human compliance validation");
      setObligations(prev => prev.filter(o => o.id !== id));
      toast.success("Obligation approved and gap checks triggered!");
      setEditingId(null);
    } catch {
      toast.error("Failed to approve obligation");
    }
  };

  const handleReject = async (id: string) => {
    if (isReadOnly || !rejectReason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }
    try {
      await rejectObligationAction(id, rejectReason);
      setObligations(prev => prev.filter(o => o.id !== id));
      toast.success("Obligation rejected");
      setRejectId(null);
      setRejectReason("");
    } catch {
      toast.error("Failed to reject obligation");
    }
  };

  const handleSaveEdits = async (id: string) => {
    if (isReadOnly) return;
    try {
      await updateObligationAction(id, {
        description: editedText,
        department: editedDept,
      });
      setObligations(prev =>
        prev.map(o => (o.id === id ? { ...o, description: editedText, department: editedDept } : o))
      );
      toast.success("Edits saved successfully");
      setEditingId(null);
    } catch {
      toast.error("Failed to save edits");
    }
  };

  const handleApproveHighConfidence = async () => {
    if (isReadOnly) return;
    const highConf = obligations.filter(o => (o.confidenceScore || 0) >= 0.90);
    if (highConf.length === 0) {
      toast.info("No pending obligations with confidence >= 90%");
      return;
    }
    toast.loading(`Processing bulk approval of ${highConf.length} items...`);
    try {
      for (const obs of highConf) {
        await approveObligationAction(obs.id, "Bulk high confidence approval");
      }
      setObligations(prev => prev.filter(o => (o.confidenceScore || 0) < 0.90));
      toast.dismiss();
      toast.success(`Successfully approved ${highConf.length} obligations!`);
    } catch {
      toast.dismiss();
      toast.error("Error encountered during bulk approval processing");
    }
  };

  // Group obligations by circularRef
  const groupedObligations: Record<string, Obligation[]> = {};
  obligations.forEach(o => {
    const key = `${o.circularRef} — ${o.circularTitle}`;
    if (!groupedObligations[key]) {
      groupedObligations[key] = [];
    }
    groupedObligations[key].push(o);
  });

  return (
    <div className="flex flex-col gap-8 page-enter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Eye className="h-5 w-5 text-indigo-400" />
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Review Queue</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            AI-extracted obligations awaiting compliance sign-off. {progressText}
          </p>
        </div>
        {!isReadOnly && obligations.length > 0 && (
          <button
            onClick={handleApproveHighConfidence}
            className="btn-primary px-5 py-2.5 text-xs font-bold flex items-center gap-2"
          >
            <Play className="h-4 w-4" /> Approve all &ge; 90% Confidence
          </button>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {Object.entries(groupedObligations).map(([circularKey, items]) => (
          <div key={circularKey} className="flex flex-col gap-4">
            <h2 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest bg-slate-900/40 p-2 border-l-2 border-indigo-500 rounded-r-lg">
              {circularKey}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {items.map((obs) => {
                const confPct = Math.round((obs.confidenceScore || 0) * 100);
                const isUnderReview = editingId === obs.id;
                const isRejecting = rejectId === obs.id;

                return (
                  <Card key={obs.id} className={`border-border bg-slate-950/80 transition-shadow ${confPct < 70 ? "ring-1 ring-rose-500/20" : ""}`}>
                    <CardHeader className="pb-3 border-b border-border/40 bg-slate-900/10 px-5 pt-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <code className="text-xs font-mono text-indigo-400 bg-indigo-500/5 px-2 py-0.5 border border-indigo-500/20 rounded">
                            {obs.ruleReference}
                          </code>
                          <Badge variant="outline" className="text-[10px] uppercase border-slate-700 text-slate-400">
                            {obs.department}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] border-amber-500/20 text-amber-400 bg-amber-500/10">
                            {obs.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Confidence:</span>
                          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${confPct >= 90 ? "bg-emerald-500/10 text-emerald-400" : confPct >= 75 ? "bg-indigo-500/10 text-indigo-400" : "bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse"}`}>
                            {confPct}% {confPct < 70 && "• Review carefully"}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-5 space-y-4">
                      {isUnderReview ? (
                        <div className="space-y-4">
                          <textarea
                            value={editedText}
                            onChange={(e) => setEditedText(e.target.value)}
                            rows={3}
                            className="w-full text-sm bg-slate-900 border border-border rounded-lg p-3 text-slate-200 focus:outline-none focus:border-indigo-500"
                          />
                          <div className="flex flex-wrap gap-4 items-center">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400">Department:</span>
                              <select
                                value={editedDept}
                                onChange={(e) => setEditedDept(e.target.value)}
                                className="text-xs bg-slate-900 border border-border rounded px-2.5 py-1.5 text-foreground focus:outline-none"
                              >
                                <option value="Compliance">Compliance</option>
                                <option value="Risk Management">Risk Management</option>
                                <option value="IT Security">IT Security</option>
                                <option value="Operations">Operations</option>
                                <option value="Finance">Finance</option>
                              </select>
                            </div>
                            <button
                              onClick={() => handleSaveEdits(obs.id)}
                              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 ml-auto border border-indigo-500/20 px-3 py-1.5 rounded bg-indigo-500/5 hover:bg-indigo-500/10"
                            >
                              <Save className="h-3.5 w-3.5" /> Save Edits
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-200 leading-relaxed">{obs.description}</p>
                      )}

                      <div className="flex flex-wrap justify-between items-center gap-4 border-t border-border/40 pt-4">
                        <Link href={`/circulars/${obs.circularId}`}>
                          <span className="text-[10px] text-indigo-400 hover:underline flex items-center gap-1">
                            <FileText className="h-3 w-3" /> View In Circular Reference
                          </span>
                        </Link>

                        {!isReadOnly && (
                          <div className="flex gap-2">
                            {!isUnderReview && (
                              <button
                                onClick={() => {
                                  setEditingId(obs.id);
                                  setEditedText(obs.description);
                                  setEditedDept(obs.department);
                                }}
                                className="text-xs border border-border px-3 py-1.5 rounded-lg hover:bg-muted text-slate-300"
                              >
                                Edit Fields
                              </button>
                            )}

                            {isRejecting ? (
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  placeholder="Reason..."
                                  value={rejectReason}
                                  onChange={(e) => setRejectReason(e.target.value)}
                                  className="text-xs bg-slate-900 border border-border rounded px-2 py-1 text-slate-200 placeholder:text-slate-700"
                                />
                                <button onClick={() => handleReject(obs.id)} className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold px-2 py-1 rounded">
                                  Confirm
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setRejectId(obs.id)}
                                className="text-xs border border-rose-500/20 text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 px-3 py-1.5 rounded-lg flex items-center gap-1"
                              >
                                <XCircle className="h-3.5 w-3.5" /> Reject
                              </button>
                            )}

                            <button
                              onClick={() => handleApprove(obs.id)}
                              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                            >
                              <Check className="h-3.5 w-3.5" /> Approve
                            </button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
        {obligations.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-base font-bold text-foreground">Review Queue Cleared</h3>
            <p className="text-xs text-muted-foreground mt-1">All extracted circular obligations are processed.</p>
          </div>
        )}
      </div>
    </div>
  );
}
