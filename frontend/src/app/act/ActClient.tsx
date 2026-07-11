"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckSquare, Clock, Calendar, ChevronRight, Check, Lock, Filter, Link2, ShieldAlert, Sparkles, UserPlus } from "lucide-react"
import { updateTaskStatusAction, assignTaskAction, uploadEvidenceAction, updateFindingsAction } from "@/app/actions/ai"
import { toast } from "sonner"

type Task = {
  id: string
  title: string
  owner: string
  ownerId: string
  department: string
  priority: string
  dueDate: string
  status: "Todo" | "In Progress" | "Done"
  evidenceUrl: string
  findings: string
}

type TeamMember = {
  id: string
  email: string
  name: string
  role: string
  department: string
}

export default function ActClient({ initialTasks, role, teamMembers = [] }: { initialTasks: Task[]; role: string; teamMembers?: TeamMember[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [filterDept, setFilterDept] = useState<string>("all")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  
  // Forms states
  const [evidenceInput, setEvidenceInput] = useState("")
  const [findingsInput, setFindingsInput] = useState("")
  const [assignedUserId, setAssignedUserId] = useState("")

  const isReadOnly = role === "Auditor"
  const isManagerOrAdmin = role === "Manager" || role === "Admin" || role === "Compliance Officer"

  const departments = ["all", ...Array.from(new Set(tasks.map(t => t.department).filter(Boolean)))]
  const filteredTasks = filterDept === "all" ? tasks : tasks.filter(t => t.department === filterDept)

  const moveTask = async (id: string, newStatus: Task["status"]) => {
    if (isReadOnly) return
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t))
    try {
      await updateTaskStatusAction(id, newStatus)
      toast.success(`Task moved to ${newStatus}`)
    } catch {
      setTasks(initialTasks)
      toast.error("Failed to update task status")
    }
  }

  const handleAssign = async (taskId: string) => {
    if (!assignedUserId) return
    try {
      await assignTaskAction(taskId, assignedUserId)
      const memberName = teamMembers.find(m => m.id === assignedUserId)?.name || "assigned user"
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, owner: memberName, ownerId: assignedUserId } : t))
      toast.success(`Task assigned successfully to ${memberName}`)
      setSelectedTask(null)
    } catch {
      toast.error("Failed to assign task")
    }
  }

  const handleUploadEvidence = async (taskId: string) => {
    if (!evidenceInput) return
    try {
      await uploadEvidenceAction(taskId, evidenceInput)
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, evidenceUrl: evidenceInput, status: "In Progress" } : t))
      toast.success("Evidence URL saved successfully")
      setEvidenceInput("")
      setSelectedTask(null)
    } catch {
      toast.error("Failed to save evidence")
    }
  }

  const handleLogFindings = async (taskId: string) => {
    if (!findingsInput) return
    try {
      await updateFindingsAction(taskId, findingsInput)
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, findings: findingsInput } : t))
      toast.success("Audit finding saved successfully")
      setFindingsInput("")
      setSelectedTask(null)
    } catch {
      toast.error("Failed to save finding")
    }
  }

  const columns: { title: string; status: Task["status"]; color: string }[] = [
    { title: "To Do", status: "Todo", color: "border-t-slate-500" },
    { title: "In Progress", status: "In Progress", color: "border-t-blue-500" },
    { title: "Done", status: "Done", color: "border-t-green-500" },
  ]

  const totalTasks = filteredTasks.length
  const completedTasks = filteredTasks.filter(t => t.status === "Done").length
  const completionPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const roleBadge: Record<string, { label: string; cls: string }> = {
    "Admin": { label: "ADMIN", cls: "border-indigo-500/30 text-indigo-400 bg-indigo-500/10" },
    "Compliance Officer": { label: "COMPLIANCE", cls: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" },
    "Manager": { label: "MANAGER", cls: "border-blue-500/30 text-blue-400 bg-blue-500/10" },
    "Auditor": { label: "AUDITOR • READ-ONLY", cls: "border-amber-500/30 text-amber-400 bg-amber-500/10" },
  }

  const badge = roleBadge[role] || roleBadge["Admin"]

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <Badge variant="outline" className={`text-[10px] font-bold mb-2 ${badge.cls}`}>{badge.label}</Badge>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <CheckSquare className="h-8 w-8 text-green-600" />
            Workflow Board (Act Engine)
          </h1>
          <p className="text-muted-foreground mt-2">
            {isReadOnly ? "Read-only view of compliance workflow tasks and evidence verification." : "Manage, assign team tasks, and link operational evidence."}
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          {/* Department Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <select 
              value={filterDept} 
              onChange={(e) => setFilterDept(e.target.value)}
              className="text-xs bg-slate-900 border border-border rounded-lg px-2 py-1.5 text-foreground focus:outline-none"
            >
              {departments.map(d => (
                <option key={d} value={d}>{d === "all" ? "All Departments" : d}</option>
              ))}
            </select>
          </div>

          <div className="text-right">
            <div className="text-xs font-medium text-muted-foreground mb-1">Completion</div>
            <div className="flex items-center gap-2">
              <div className="w-24 bg-slate-800 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full transition-all" style={{ width: `${completionPercent}%` }}></div>
              </div>
              <span className="font-bold text-xs">{completionPercent}%</span>
            </div>
          </div>
        </div>
      </div>

      {isReadOnly && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-center gap-3">
          <Lock className="h-4 w-4 text-amber-500 shrink-0" />
          <p className="text-xs text-muted-foreground">You are logged in as an <span className="font-bold text-foreground">Auditor</span>. You can inspect chains and log audit findings, but cannot change task execution states.</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Kanban Board Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {columns.map(col => (
            <div key={col.status} className={`bg-slate-900/40 dark:bg-slate-900/45 rounded-lg p-4 border border-border/80 border-t-4 ${col.color}`}>
              <h3 className="font-bold text-sm mb-4 flex justify-between items-center text-slate-200">
                {col.title}
                <Badge variant="secondary" className="rounded-full text-[10px] bg-slate-800 text-slate-300">{filteredTasks.filter(t => t.status === col.status).length}</Badge>
              </h3>
              <div className="flex flex-col gap-3">
                {filteredTasks.filter(t => t.status === col.status).map(task => (
                  <Card 
                    key={task.id} 
                    onClick={() => {
                      setSelectedTask(task);
                      setAssignedUserId(task.ownerId);
                    }}
                    className={`cursor-pointer hover:border-indigo-500/50 bg-slate-950/80 border-border/60 transition-all ${selectedTask?.id === task.id ? "ring-2 ring-indigo-600 border-transparent" : ""}`}
                  >
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant={task.priority === "High" || task.priority === "Critical" ? "destructive" : "default"} className="text-[9px] py-0 px-1.5 uppercase font-mono">
                          {task.priority}
                        </Badge>
                        <Badge variant="outline" className="text-[9px] border-slate-700 text-slate-400">{task.department}</Badge>
                      </div>
                      <CardTitle className="text-xs font-semibold leading-normal text-slate-200">{task.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      {task.evidenceUrl && (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium mb-3 mt-1 bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded w-fit">
                          <Link2 className="h-3 w-3" /> Evidence Linked
                        </div>
                      )}
                      {task.findings && (
                        <div className="flex items-center gap-1 text-[10px] text-amber-400 font-medium mb-3 mt-1 bg-amber-500/5 border border-amber-500/10 px-2 py-0.5 rounded w-fit">
                          <ShieldAlert className="h-3 w-3" /> Audit Finding Listed
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-3 text-[10px] text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <div className="h-4 w-4 rounded-full bg-slate-800 flex items-center justify-center text-[8px] font-bold text-slate-300">
                            {task.owner.charAt(0).toUpperCase()}
                          </div>
                          <span className="truncate max-w-[80px] font-medium">{task.owner}</span>
                        </div>
                        <div className="flex items-center gap-1 font-mono">
                          <Calendar className="h-3 w-3 text-slate-500" />
                          {task.dueDate}
                        </div>
                      </div>
                    </CardContent>
                    {!isReadOnly && (
                      <div className="border-t border-border/40 bg-slate-900/20 p-2 flex justify-end gap-1 rounded-b-lg" onClick={e => e.stopPropagation()}>
                        {task.status === "Todo" && (
                          <button onClick={() => moveTask(task.id, "In Progress")} className="text-[10px] font-bold flex items-center gap-1 text-blue-400 hover:text-blue-300 px-2 py-1 hover:bg-blue-500/10 rounded transition-all">
                            Start <ChevronRight className="h-3 w-3" />
                          </button>
                        )}
                        {task.status === "In Progress" && (
                          <button onClick={() => moveTask(task.id, "Done")} className="text-[10px] font-bold flex items-center gap-1 text-emerald-400 hover:text-emerald-300 px-2 py-1 hover:bg-emerald-500/10 rounded transition-all">
                            Complete <Check className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </Card>
                ))}
                {filteredTasks.filter(t => t.status === col.status).length === 0 && (
                  <div className="text-center py-10 text-xs text-slate-500 border border-dashed rounded-lg border-slate-800">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Task Inspector Sidebar (Side Panel) */}
        {selectedTask && (
          <Card className="w-full lg:w-80 bg-slate-900/60 border-border shrink-0 self-stretch sticky top-6">
            <CardHeader className="border-b border-border/60 pb-3">
              <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-indigo-400" /> Task Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-5 text-xs text-slate-300">
              <div>
                <p className="font-bold text-slate-200 text-sm leading-snug">{selectedTask.title}</p>
                <div className="flex gap-2 mt-2">
                  <Badge className="text-[9px] uppercase font-mono">{selectedTask.priority}</Badge>
                  <Badge variant="outline" className="text-[9px] border-slate-800">{selectedTask.department}</Badge>
                </div>
              </div>

              <div className="space-y-1.5 border-t border-border/40 pt-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Assigned Professional</p>
                <p className="font-semibold text-slate-200">{selectedTask.owner}</p>
              </div>

              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Due Date</p>
                <p className="font-mono text-slate-200">{selectedTask.dueDate}</p>
              </div>

              {selectedTask.evidenceUrl && (
                <div className="space-y-1 bg-emerald-950/20 border border-emerald-900/30 p-2.5 rounded">
                  <p className="text-[9px] font-bold text-emerald-400 uppercase flex items-center gap-1"><Link2 className="h-3 w-3" /> Linked Evidence</p>
                  <a href={selectedTask.evidenceUrl} target="_blank" rel="noreferrer" className="text-slate-300 underline font-mono text-[10px] hover:text-emerald-300 break-all">{selectedTask.evidenceUrl}</a>
                </div>
              )}

              {selectedTask.findings && (
                <div className="space-y-1 bg-amber-950/20 border border-amber-900/30 p-2.5 rounded">
                  <p className="text-[9px] font-bold text-amber-400 uppercase flex items-center gap-1"><ShieldAlert className="h-3 w-3" /> Auditor Finding</p>
                  <p className="text-slate-300 italic">{selectedTask.findings}</p>
                </div>
              )}

              {/* Actions Section based on Role */}
              {!isReadOnly && isManagerOrAdmin && (
                <div className="border-t border-border/40 pt-4 space-y-4">
                  {/* Reassignment */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><UserPlus className="h-3.5 w-3.5" /> Reassign Task</label>
                    <div className="flex gap-1.5">
                      <select
                        value={assignedUserId}
                        onChange={(e) => setAssignedUserId(e.target.value)}
                        className="w-full bg-slate-950 border border-border rounded px-2 py-1 text-xs text-foreground focus:outline-none"
                      >
                        <option value="">Select Assignee</option>
                        {teamMembers.map(m => (
                          <option key={m.id} value={m.id}>{m.name} ({m.department})</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleAssign(selectedTask.id)}
                        disabled={!assignedUserId}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-2.5 py-1 rounded transition-colors disabled:opacity-50"
                      >
                        Apply
                      </button>
                    </div>
                  </div>

                  {/* Evidence Upload */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Link2 className="h-3.5 w-3.5" /> Link Evidence Link/File</label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="https://s3.sebi-audit/proof.pdf"
                        value={evidenceInput}
                        onChange={(e) => setEvidenceInput(e.target.value)}
                        className="w-full bg-slate-950 border border-border rounded px-2 py-1 text-xs text-foreground focus:outline-none placeholder:text-slate-700"
                      />
                      <button
                        onClick={() => handleUploadEvidence(selectedTask.id)}
                        disabled={!evidenceInput}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-2.5 py-1 rounded transition-colors disabled:opacity-50"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Auditor Action: Add Findings */}
              {(role === "Auditor" || role === "Admin") && (
                <div className="border-t border-border/40 pt-4 space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><ShieldAlert className="h-3.5 w-3.5 text-amber-500" /> Log Compliance Finding</label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="e.g. Audit trail verified with Hash"
                      value={findingsInput}
                      onChange={(e) => setFindingsInput(e.target.value)}
                      className="w-full bg-slate-950 border border-border rounded px-2 py-1 text-xs text-foreground focus:outline-none placeholder:text-slate-700"
                    />
                    <button
                      onClick={() => handleLogFindings(selectedTask.id)}
                      disabled={!findingsInput}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-2.5 py-1 rounded transition-colors disabled:opacity-50"
                    >
                      Log
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
