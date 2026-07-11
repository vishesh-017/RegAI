"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { approveObligationAction, rejectObligationAction, updateObligationAction, addObligationCommentAction } from "@/app/actions/ai";
import { 
  ShieldCheck, AlertTriangle, CheckCircle, Clock, FileText, 
  Settings, Users, ChevronDown, MessageSquare, Plus, Edit3, X, BrainCircuit,
  Briefcase, AlertOctagon, ArrowRightCircle, Activity, Send, Check
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const ObligationCard = React.memo(({ obs, logs, onSelect }: { obs: any, logs: any[], onSelect?: () => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: obs.title,
    description: obs.description,
    department: obs.department,
    deadline: obs.deadline ? new Date(obs.deadline).toISOString().split('T')[0] : '',
    penaltyDescription: obs.penaltyDescription || ''
  });
  
  const [commentText, setCommentText] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  
  const handleApprove = async () => await approveObligationAction(obs.id);
  const handleReject = async () => await rejectObligationAction(obs.id);
  
  const handleSaveEdit = async () => {
    await updateObligationAction(obs.id, {
      title: editForm.title,
      description: editForm.description,
      department: editForm.department,
      deadline: editForm.deadline ? new Date(editForm.deadline) : null,
      penaltyDescription: editForm.penaltyDescription
    });
    setIsEditing(false);
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    await addObligationCommentAction(obs.id, commentText);
    setCommentText("");
  };

  const confPct = Math.round((obs.confidenceScore || 0) * 100);
  let confStatus = "Low";
  let confColor = "bg-destructive";
  let confTextColor = "text-destructive";
  let confBg = "bg-destructive/10";
  let confBorder = "border-destructive/20";

  if (confPct >= 90) {
    confStatus = "Very High";
    confColor = "bg-primary";
    confTextColor = "text-primary";
    confBg = "bg-primary/10";
    confBorder = "border-primary/20";
  } else if (confPct >= 75) {
    confStatus = "High";
    confColor = "bg-primary/80";
    confTextColor = "text-primary";
    confBg = "bg-primary/5";
    confBorder = "border-primary/20";
  } else if (confPct >= 50) {
    confStatus = "Medium";
    confColor = "bg-amber-500";
    confTextColor = "text-amber-500";
    confBg = "bg-amber-500/10";
    confBorder = "border-amber-500/20";
  }

  return (
    <div 
      className="bg-card rounded-xl border border-border shadow-sm overflow-hidden flex flex-col transition-all hover:border-foreground/20 cursor-pointer hover:shadow-md group"
      onClick={() => onSelect && onSelect()}
    >
      {/* Card Header */}
      <div className="px-6 py-4 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/20">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded">
            {obs.ruleReference}
          </span>
          <Badge variant="outline" className={
            obs.priority === 'Critical' ? 'border-destructive/20 text-destructive bg-destructive/10' :
            obs.priority === 'High' ? 'border-amber-500/20 text-amber-500 bg-amber-500/10' :
            'border-primary/20 text-primary bg-primary/10'
          }>
            {obs.priority} Priority
          </Badge>
          {obs.reviewStatus === 'Approved' && (
            <Badge variant="outline" className="border-primary/20 text-primary bg-primary/10 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" /> Approved
            </Badge>
          )}
          {obs.reviewStatus === 'Rejected' && (
            <Badge variant="outline" className="border-destructive/20 text-destructive bg-destructive/10 flex items-center gap-1">
              <X className="h-3 w-3" /> Rejected
            </Badge>
          )}
          {obs.reviewStatus === 'Edited' && (
            <Badge variant="outline" className="border-border text-foreground bg-muted flex items-center gap-1">
              <Edit3 className="h-3 w-3" /> Edited
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative group flex items-center cursor-help">
            <div className={`flex items-center gap-2 px-3 py-1.5 ${confBg} border ${confBorder} rounded-full text-xs font-bold`}>
              <ShieldCheck className={`h-3.5 w-3.5 ${confTextColor}`} />
              <span className={confTextColor}>{confStatus}</span>
              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden ml-1 border border-border/50">
                <div className={`h-full ${confColor} rounded-full transition-all duration-500`} style={{ width: `${confPct}%` }}></div>
              </div>
              <span className="text-foreground ml-1">{confPct}%</span>
            </div>
            
            {/* Hover Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-foreground text-background text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
              <div className="font-bold mb-1">Confidence Analysis</div>
              <div className="text-background/80">
                Calculated based on rule extraction precision, linguistic clarity, and source context. 
                <div className="mt-2 text-background/60">{obs.reasoning ? `Context: ${obs.reasoning}` : ""}</div>
              </div>
              <div className="absolute -bottom-1 right-8 w-2 h-2 bg-foreground rotate-45"></div>
            </div>
          </div>
          
          {obs.humanApprovalRequired && (
            <span className="text-xs font-bold text-foreground flex items-center gap-1 bg-muted px-2 py-1 rounded-full border border-border">
              <Users className="h-3 w-3" /> Review Required
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6" onClick={(e) => e.stopPropagation()}>
        {isEditing ? (
          <div className="space-y-4 mb-6">
            <input 
              value={editForm.title} 
              onChange={e => setEditForm({...editForm, title: e.target.value})}
              className="input-field text-lg font-bold"
            />
            <textarea 
              value={editForm.description}
              onChange={e => setEditForm({...editForm, description: e.target.value})}
              rows={3}
              className="input-field resize-none"
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">Department</label>
                <input 
                  value={editForm.department}
                  onChange={e => setEditForm({...editForm, department: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">Deadline</label>
                <input 
                  type="date"
                  value={editForm.deadline}
                  onChange={e => setEditForm({...editForm, deadline: e.target.value})}
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground mb-1 block">Penalty Description</label>
              <input 
                value={editForm.penaltyDescription}
                onChange={e => setEditForm({...editForm, penaltyDescription: e.target.value})}
                className="input-field"
              />
            </div>
          </div>
        ) : (
          <>
            <h4 className="text-lg font-extrabold tracking-tight text-foreground mb-2">{obs.title}</h4>
            <p className="text-sm text-foreground/80 mb-6 leading-relaxed">
              {obs.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Applicability</h5>
                <div className="flex flex-wrap gap-2">
                  {obs.appliesTo?.split(',').map((target: string) => (
                    <span key={target.trim()} className="text-xs font-bold bg-muted text-muted-foreground px-2 py-1 rounded">
                      {target.trim()}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Department</h5>
                <span className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Settings className="h-4 w-4 text-muted-foreground" /> {obs.department}
                </span>
              </div>
              {obs.deadline && (
                <div>
                  <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Deadline</h5>
                  <span className="text-sm font-bold text-foreground">
                    {new Date(obs.deadline).toLocaleDateString()} <span className="text-muted-foreground font-normal">({obs.deadlineType})</span>
                  </span>
                </div>
              )}
              {obs.penaltyDescription && (
                <div>
                  <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Penalty / Risk</h5>
                  <span className="text-sm font-bold text-destructive">
                    {obs.penaltyDescription}
                  </span>
                </div>
              )}
            </div>
          </>
        )}

        {/* Why This Matters Panel */}
        {!isEditing && (
          <div className="bg-muted/30 border border-border rounded-xl p-5 mb-6 shadow-sm">
            <h4 className="text-sm font-extrabold text-foreground mb-4 flex items-center gap-2 tracking-tight">
              <AlertOctagon className="h-4 w-4 text-foreground" />
              Why This Matters
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              <div>
                <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                  Business & Operational Impact
                </h5>
                <p className="text-sm font-bold text-foreground">
                  {obs.businessImpact || "Significant updates required to internal compliance workflows and reporting systems to meet new regulatory standards."}
                </p>
              </div>
              
              <div>
                <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                  Affected Department
                </h5>
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-foreground bg-background border border-border px-2.5 py-1 rounded-md">
                  {obs.department || "Organization-Wide"}
                </span>
              </div>

              <div>
                <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                  Compliance Consequence
                </h5>
                <p className="text-sm font-bold text-destructive">
                  {obs.penaltyDescription || "Potential regulatory penalties, license suspension, or reputational damage for non-compliance."}
                </p>
              </div>

              <div>
                <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <ArrowRightCircle className="h-3.5 w-3.5 text-primary" />
                  Recommended Next Action
                </h5>
                <p className="text-sm font-bold text-foreground">
                  {obs.recommendedAction || "Conduct a gap analysis and update standard operating procedures."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AI Reasoning Block */}
        {!isEditing && (
          <div className="bg-muted p-4 rounded-lg border border-border mb-4">
            <div className="flex items-start gap-3">
              <BrainCircuit className="h-5 w-5 text-foreground shrink-0 mt-0.5" />
              <div>
                <h5 className="text-sm font-bold text-foreground mb-1">AI Reasoning</h5>
                <p className="text-sm text-muted-foreground mb-2">{obs.reasoning}</p>
                <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                  <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> Page {obs.sourcePage}</span>
                  <span>Paragraph {obs.sourceParagraph}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Audit History & Comments Panel */}
        {showHistory && (
          <div className="mt-6 pt-6 border-t border-border">
            <h5 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2 tracking-tight">
              <Clock className="h-4 w-4 text-muted-foreground" /> Audit History & Comments
            </h5>
            
            <div className="space-y-4 mb-4 max-h-64 overflow-y-auto pr-2">
              {logs.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No history available.</p>
              ) : (
                logs.map(log => (
                  <div key={log.id} className="flex gap-3 text-sm">
                    <div className="mt-0.5">
                      {log.action === 'COMMENT' ? <MessageSquare className="h-4 w-4 text-primary" /> :
                       log.action === 'APPROVED' ? <CheckCircle className="h-4 w-4 text-primary" /> :
                       log.action === 'REJECTED' ? <X className="h-4 w-4 text-destructive" /> :
                       log.action === 'EDITED' ? <Edit3 className="h-4 w-4 text-foreground" /> :
                       <Activity className="h-4 w-4 text-muted-foreground" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">{log.action}</span>
                        <span className="text-xs text-muted-foreground font-medium">{formatDistanceToNow(new Date(log.timestamp), {addSuffix: true})}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">by {log.performedBy?.email || 'System'}</p>
                      {log.reason && <p className="text-foreground bg-muted p-2 rounded mt-1 border border-border text-xs">{log.reason}</p>}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Add a comment..." 
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                className="input-field flex-1"
              />
              <button 
                onClick={handleAddComment}
                className="p-2.5 bg-foreground text-background rounded-md hover:bg-foreground/90 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="px-6 py-4 bg-muted/20 border-t border-border flex justify-between items-center" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <MessageSquare className="h-3.5 w-3.5" /> {logs.filter(l => l.action === 'COMMENT').length} Comments
        </button>

        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(false)}
                className="btn-secondary px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEdit}
                className="btn-primary px-4 py-2 text-sm"
              >
                Save Changes
              </button>
            </>
          ) : (
            <>
              {obs.reviewStatus !== 'Approved' && (
                <button 
                  onClick={handleReject}
                  className="px-4 py-2 text-sm font-bold text-destructive bg-destructive/10 border border-destructive/20 rounded-lg hover:bg-destructive/20 transition-colors flex items-center gap-2"
                >
                  <X className="h-4 w-4" /> Reject
                </button>
              )}
              <button 
                onClick={() => setIsEditing(true)}
                className="btn-secondary px-4 py-2 text-sm flex items-center gap-2"
              >
                <Edit3 className="h-4 w-4" /> Edit
              </button>
              {obs.reviewStatus !== 'Approved' && (
                <button 
                  onClick={handleApprove}
                  className="btn-primary px-4 py-2 text-sm flex items-center gap-2 shadow-sm"
                >
                  <Check className="h-4 w-4" /> Approve
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
});

ObligationCard.displayName = "ObligationCard";

export default ObligationCard;
