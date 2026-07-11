"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckSquare, Clock, Calendar, ChevronRight, Check } from "lucide-react"

type Task = {
  id: string
  title: string
  owner: string
  department: string
  priority: "High" | "Medium" | "Low"
  dueDate: string
  status: "TODO" | "IN_PROGRESS" | "DONE"
}

const mockTasks: Task[] = [
  {
    id: "t1",
    title: "Configure storage for AI audit logs",
    owner: "Alex IT Lead",
    department: "IT Security",
    priority: "High",
    dueDate: "2026-08-01",
    status: "TODO"
  },
  {
    id: "t2",
    title: "Update KYC processing SOPs to 15 days",
    owner: "Sarah Compliance",
    department: "Compliance",
    priority: "High",
    dueDate: "2026-08-15",
    status: "IN_PROGRESS"
  },
  {
    id: "t3",
    title: "Train staff on new AI retention rules",
    owner: "HR Team",
    department: "HR",
    priority: "Medium",
    dueDate: "2026-09-01",
    status: "DONE"
  }
]

export default function ActEngine() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)

  const moveTask = (id: string, newStatus: Task["status"]) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t))
  }

  const columns: { title: string; status: Task["status"]; color: string }[] = [
    { title: "To Do", status: "TODO", color: "border-t-slate-500" },
    { title: "In Progress", status: "IN_PROGRESS", color: "border-t-blue-500" },
    { title: "Done", status: "DONE", color: "border-t-green-500" },
  ]

  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === "DONE").length
  const completionPercent = Math.round((completedTasks / totalTasks) * 100)

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <CheckSquare className="h-8 w-8 text-green-600" />
            Engine 3: Act
          </h1>
          <p className="text-muted-foreground mt-2">Workflow Planner: Convert obligations into operational tasks.</p>
        </div>
        
        <div className="text-right">
          <div className="text-sm font-medium text-muted-foreground mb-1">Completion</div>
          <div className="flex items-center gap-3">
            <div className="w-32 bg-slate-200 rounded-full h-2.5 dark:bg-slate-700">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${completionPercent}%` }}></div>
            </div>
            <span className="font-bold">{completionPercent}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(col => (
          <div key={col.status} className={`bg-slate-100 dark:bg-slate-900 rounded-lg p-4 border-t-4 ${col.color}`}>
            <h3 className="font-semibold text-lg mb-4 flex justify-between items-center">
              {col.title}
              <Badge variant="secondary" className="rounded-full">{tasks.filter(t => t.status === col.status).length}</Badge>
            </h3>
            <div className="flex flex-col gap-3">
              {tasks.filter(t => t.status === col.status).map(task => (
                <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant={task.priority === "High" ? "destructive" : "default"} className="text-[10px]">
                        {task.priority}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">{task.department}</Badge>
                    </div>
                    <CardTitle className="text-sm leading-tight">{task.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <div className="h-5 w-5 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-[9px] font-bold text-slate-700 dark:text-slate-300">
                          {task.owner.charAt(0)}
                        </div>
                        <span className="truncate max-w-[80px]">{task.owner}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {task.dueDate}
                      </div>
                    </div>
                  </CardContent>
                  <div className="border-t bg-slate-50 dark:bg-slate-950/50 p-2 flex justify-end gap-1 rounded-b-lg">
                    {task.status === "TODO" && (
                      <button onClick={() => moveTask(task.id, "IN_PROGRESS")} className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30">
                        Start <ChevronRight className="h-3 w-3" />
                      </button>
                    )}
                    {task.status === "IN_PROGRESS" && (
                      <button onClick={() => moveTask(task.id, "DONE")} className="text-xs flex items-center gap-1 text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/30">
                        Complete <Check className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </Card>
              ))}
              {tasks.filter(t => t.status === col.status).length === 0 && (
                <div className="text-center p-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg border-slate-200 dark:border-slate-800">
                  No tasks
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
