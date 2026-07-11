"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { processCircularAIAction, approveObligationAction, rejectObligationAction, runChangeIntelligenceAction, runWorkflowPlannerAction } from "@/app/actions/ai";
import { BrainCircuit, CheckCircle, FileText, AlertTriangle, ShieldCheck, Activity, Users, Settings, Filter, ChevronDown, Check, X, Edit3, Loader2, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ObligationCard from "@/components/ObligationCard";
import RegulatoryChangeCard from "@/components/RegulatoryChangeCard";
import dynamic from 'next/dynamic';

const WorkflowKanban = dynamic(() => import("@/components/WorkflowKanban"), {
  loading: () => <div className="w-full h-[500px] bg-muted/10 animate-pulse rounded-xl border border-border flex flex-col items-center justify-center text-muted-foreground"><Loader2 className="h-8 w-8 animate-spin mb-4" />Loading Workflow Planner...</div>
});

const PdfViewerPanel = dynamic(() => import("@/components/PdfViewerPanel"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted/10 animate-pulse rounded-xl border border-border flex flex-col items-center justify-center text-muted-foreground"><Loader2 className="h-8 w-8 animate-spin mb-4" />Loading PDF Engine...</div>
});
import AiErrorCard from "@/components/AiErrorCard";

export default function CommandCenterClient({ circular, obligations, auditLogs, regulatoryChanges, workflowTasks }: { circular: any, obligations: any[], auditLogs: any[], regulatoryChanges: any[], workflowTasks: any[] }) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessingIdentify, setIsProcessingIdentify] = useState(false);
  const [isProcessingAct, setIsProcessingAct] = useState(false);
  
  const [aiError, setAiError] = useState<any>(null);
  const [identifyError, setIdentifyError] = useState<any>(null);
  const [actError, setActError] = useState<any>(null);

  const [activePage, setActivePage] = useState<number | null>(null);

  const [streamStage, setStreamStage] = useState<string | null>(null);
  const [streamedObligations, setStreamedObligations] = useState<any[]>([]);

  const handleRunAI = async () => {
    setIsProcessing(true);
    setAiError(null);
    setStreamStage("Initializing Connection...");
    setStreamedObligations([]);
    
    try {
      const response = await fetch("/api/ai/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ circularId: circular.id })
      });

      if (!response.ok) {
        throw new Error("Failed to connect to AI engine");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No reader available");

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(l => l.trim() !== '');
        
        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.type === 'STAGE_UPDATE') {
              setStreamStage(data.message);
            } else if (data.type === 'OBLIGATION_EXTRACTED') {
              setStreamedObligations(prev => [...prev, data.payload]);
            } else if (data.type === 'ERROR') {
              setAiError({ type: "EXTRACTION_FAILURE", message: data.message });
            } else if (data.type === 'COMPLETE') {
              router.refresh();
            }
          } catch(e) {
            console.error("Parse error on chunk:", e);
          }
        }
      }
    } catch (e: any) {
      setAiError({ type: "UNKNOWN_ERROR", message: e.message || "A critical client-side error occurred." });
    } finally {
      setIsProcessing(false);
      setStreamStage(null);
    }
  };

  const handleRunIdentify = async () => {
    setIsProcessingIdentify(true);
    setIdentifyError(null);
    try {
      const res = await runChangeIntelligenceAction(circular.id);
      if (res && !res.success) setIdentifyError(res.error);
    } catch(e) {
      setIdentifyError({ type: "UNKNOWN_ERROR", message: "A critical client-side error occurred." });
    } finally {
      setIsProcessingIdentify(false);
    }
  };

  const handleRunAct = async () => {
    setIsProcessingAct(true);
    setActError(null);
    try {
      const res = await runWorkflowPlannerAction(circular.id);
      if (res && !res.success) setActError(res.error);
    } catch(e) {
      setActError({ type: "UNKNOWN_ERROR", message: "A critical client-side error occurred." });
    } finally {
      setIsProcessingAct(false);
    }
  };

  const tabs = ['Overview', 'Understand', 'Identify', 'Act', 'Audit Trail'];
  const [activeTab, setActiveTab] = useState('Understand');

  const displayObligations = streamedObligations.length > 0 ? streamedObligations : obligations;
  const hasObligations = displayObligations.length > 0;

  return (
    <div className="flex h-[calc(100vh-2rem)] gap-6 overflow-hidden">
      {/* Left Pane: PDF Viewer */}
      <div className="hidden lg:block w-1/2 h-full">
        <PdfViewerPanel url={circular.documentUrl || "/sample-circular.pdf"} activePage={activePage} />
      </div>

      {/* Right Pane: Workspace */}
      <div className="w-full lg:w-1/2 h-full overflow-y-auto flex flex-col space-y-6 pr-2">
        {/* Header Panel */}
        <div className="bg-card border border-border rounded-xl shadow-sm z-10 shrink-0">
          <div className="px-6 py-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-muted text-muted-foreground font-mono text-xs px-2.5 py-1 rounded-md border border-border">
                    {circular.referenceNumber}
                  </span>
                  <Badge variant="outline" className={
                    circular.status === 'Active' ? 'border-primary/20 text-primary bg-primary/10' :
                    'border-border text-muted-foreground bg-muted'
                  }>
                    {circular.status}
                  </Badge>
                </div>
                <h1 className="text-xl font-extrabold tracking-tight text-foreground">{circular.title}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground font-medium">
                  <span className="flex items-center gap-1"><Activity className="h-3 w-3" /> {circular.issuingAuthority}</span>
                  <span>•</span>
                  <span>{new Date(circular.publicationDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-6 border-b border-border">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 px-1 text-sm font-bold transition-all relative ${
                    activeTab === tab 
                      ? 'text-foreground' 
                      : 'text-muted-foreground hover:text-foreground/80'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-t-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 pb-10">
          
          {/* UNDERSTAND TAB */}
          {activeTab === 'Understand' && (
              <div className="space-y-4">
                {aiError && (
                  <div className="py-8">
                    <AiErrorCard error={aiError} onRetry={handleRunAI} isRetrying={isProcessing} title="AI Extraction Failed" />
                  </div>
                )}
                
                {isProcessing && (
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex items-center justify-between shadow-sm mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Loader2 className="h-5 w-5 text-primary animate-spin" />
                      </div>
                      <div>
                        <h4 className="font-bold tracking-tight text-primary flex items-center gap-2">
                          {streamStage || "Processing..."}
                          <span className="flex gap-1 mt-1.5">
                            <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                            <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                            <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                          </span>
                        </h4>
                        <p className="text-sm text-primary/70">Securely streaming from BrahmOS AI Core</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded border border-primary/20">
                         {streamedObligations.length} EXTRACTED
                       </span>
                    </div>
                  </div>
                )}

                {!hasObligations && !isProcessing && !aiError && (
                  <div className="bg-card rounded-xl border border-border p-8 text-center shadow-sm">
                    <div className="mx-auto w-12 h-12 bg-muted rounded-xl flex items-center justify-center mb-4">
                      <BrainCircuit className="h-6 w-6 text-foreground" />
                    </div>
                    <h3 className="text-lg font-bold tracking-tight text-foreground mb-2">Obligation Extraction</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
                      Our AI engine will scan the uploaded document, extract all mandatory rules, assess compliance priority, and cite the exact source paragraphs.
                    </p>
                    <button 
                      onClick={handleRunAI}
                      className="btn-primary px-5 py-2.5 text-sm inline-flex items-center gap-2"
                    >
                      <BrainCircuit className="h-4 w-4" /> Run AI Extraction
                    </button>
                  </div>
                )}

                {hasObligations && !aiError && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-card p-3 rounded-xl border border-border shadow-sm sticky top-0 z-10">
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                          <ShieldCheck className="h-4 w-4 text-primary" /> {displayObligations.length} Found
                        </div>
                        <div className="w-px h-4 bg-border self-center"></div>
                        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                          <AlertTriangle className="h-4 w-4 text-amber-500" /> {displayObligations.filter((o:any) => o.reviewStatus === 'Pending').length} Pending
                        </div>
                      </div>
                      <button className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg transition-colors border border-border">
                        <Filter className="h-3 w-3" /> Filter <ChevronDown className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {displayObligations.map((obs) => (
                        <div key={obs.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                          <ObligationCard 
                            obs={obs} 
                            logs={auditLogs.filter((l: any) => l.entityId === obs.id)}
                            onSelect={() => setActivePage(obs.sourcePage)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
          )}

        {/* IDENTIFY TAB */}
        {activeTab === 'Identify' && (
          <div className="space-y-6">
            {identifyError ? (
                <div className="py-8">
                  <AiErrorCard error={identifyError} onRetry={handleRunIdentify} isRetrying={isProcessingIdentify} title="Change Intelligence Failed" />
                </div>
            ) : regulatoryChanges.length === 0 ? (
              <div className="bg-card rounded-2xl border border-border p-12 text-center shadow-sm">
                <div className="mx-auto w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-6">
                  <Wand2 className="h-8 w-8 text-foreground" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">Regulatory Change Intelligence</h3>
                <p className="text-muted-foreground max-w-lg mx-auto mb-8">
                  Detect precise deltas between this circular and previous regulations. Instantly see added rules, removed clauses, and deadline extensions.
                </p>
                <button 
                  onClick={handleRunIdentify}
                  disabled={isProcessingIdentify || obligations.length === 0}
                  className="btn-primary px-6 py-3 disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  {isProcessingIdentify ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Analyzing History...</>
                  ) : obligations.length === 0 ? (
                    'Run Extraction First'
                  ) : (
                    <><Wand2 className="h-5 w-5" /> Run Change Intelligence</>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Total Changes</p>
                      <p className="text-2xl font-bold tracking-tighter text-foreground">{regulatoryChanges.length}</p>
                    </div>
                    <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                      <Activity className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">New Rules</p>
                      <p className="text-2xl font-bold tracking-tighter text-foreground">{regulatoryChanges.filter((c:any) => c.changeType==='Added').length}</p>
                    </div>
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Impacted Depts</p>
                      <p className="text-2xl font-bold tracking-tighter text-foreground">
                        {Array.from(new Set(regulatoryChanges.flatMap((c:any) => c.affectedDepartments))).length}
                      </p>
                    </div>
                    <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-foreground" />
                    </div>
                  </div>
                </div>

                {regulatoryChanges.map((change) => (
                  <RegulatoryChangeCard 
                    key={change.id} 
                    change={change} 
                    newObs={change.newObligation} 
                    oldObs={change.oldObligation} 
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ACT TAB */}
        {activeTab === 'Act' && (
          <div className="space-y-6">
             {actError ? (
                <div className="py-8">
                  <AiErrorCard error={actError} onRetry={handleRunAct} isRetrying={isProcessingAct} title="Workflow Generation Failed" />
                </div>
             ) : workflowTasks.length === 0 ? (
              <div className="bg-card rounded-2xl border border-border p-12 text-center shadow-sm">
                <div className="mx-auto w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-6">
                  <CheckCircle className="h-8 w-8 text-foreground" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">Workflow Planner</h3>
                <p className="text-muted-foreground max-w-lg mx-auto mb-8">
                  Automatically generate implementation tasks for all <span className="font-bold text-foreground">Approved</span> obligations and track their progress through your organization.
                </p>
                <button 
                  onClick={handleRunAct}
                  disabled={isProcessingAct || obligations.filter((o:any) => o.reviewStatus === 'Approved').length === 0}
                  className="btn-primary px-6 py-3 disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  {isProcessingAct ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Generating Plan...</>
                  ) : obligations.filter((o:any) => o.reviewStatus === 'Approved').length === 0 ? (
                    'Approve Obligations First'
                  ) : (
                    <><CheckCircle className="h-5 w-5" /> Run Workflow Planner</>
                  )}
                </button>
              </div>
            ) : (
              <WorkflowKanban tasks={workflowTasks} />
            )}
          </div>
        )}

        {activeTab === 'Overview' && (
          <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Circular Overview</h2>
            <div className="prose dark:prose-invert max-w-none text-muted-foreground">
              <p>{circular.summary || "No summary available for this circular."}</p>
            </div>
          </div>
        )}

        {activeTab === 'Audit Trail' && (
          <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Audit Trail</h2>
            <div className="space-y-4">
              {auditLogs.map((log) => (
                <div key={log.id} className="text-sm text-muted-foreground border-b border-border pb-2">
                  <span className="font-bold text-foreground">{log.action}</span> - {new Date(log.timestamp).toLocaleString()} 
                  {log.reason && <span> - {log.reason}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
