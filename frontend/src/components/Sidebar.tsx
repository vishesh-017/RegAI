"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, CheckSquare, GitCompare, Settings, BookOpen, Calendar, PieChart, ShieldCheck, BarChart2, Bell, Search, Sun, Moon } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { LogOut, User } from "lucide-react"
import { useTheme } from "next-themes"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, group: "Overview" },
  { name: "Analytics", href: "/analytics", icon: BarChart2, group: "Overview" },
  { name: "Timeline", href: "/timeline", icon: Calendar, group: "Overview" },
  { name: "Circulars", href: "/circulars", icon: FileText, group: "Intelligence" },
  { name: "Understand", href: "/circulars/upload", icon: BookOpen, group: "Intelligence" },
  { name: "Identify", href: "/identify", icon: GitCompare, group: "Intelligence" },
  { name: "Act", href: "/act", icon: CheckSquare, group: "Compliance" },
  { name: "Reports", href: "/reports", icon: PieChart, group: "Compliance" },
  { name: "Audit Logs", href: "/audit-logs", icon: ShieldCheck, group: "Compliance" },
  { name: "Notifications", href: "/notifications", icon: Bell, group: "Compliance" },
]

const groups = ["Overview", "Intelligence", "Compliance"]

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const triggerSearch = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'k', 'ctrlKey': true }));
  };

  const isActive = (item: typeof navigation[0]) => {
    if (item.name === "Circulars") return pathname.startsWith("/circulars");
    return pathname === item.href;
  };

  return (
    <div className="flex h-full w-64 flex-col bg-slate-950 text-slate-100 select-none border-r border-slate-800/50">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-5 border-b border-slate-800/60">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg p-1.5 shadow-md shadow-indigo-800/40 group-hover:shadow-indigo-600/50 transition-shadow">
            <img src="/logo.svg" className="h-4 w-4 text-white" alt="BrahmOS" />
          </span>
          <span className="text-lg font-bold tracking-tight text-white">BrahmOS</span>
        </Link>
      </div>

      {/* Search */}
      <div className="px-3 pt-4 pb-2">
        <button
          onClick={triggerSearch}
          className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-400 bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 hover:border-slate-700 transition-all duration-150 group"
        >
          <span className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5" />
            <span className="text-xs">Search...</span>
          </span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-medium text-slate-600 bg-slate-950 rounded border border-slate-800 font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex flex-1 flex-col overflow-y-auto custom-scroll py-2">
        <nav className="flex-1 px-3 pb-4">
          {groups.map((group) => {
            const items = navigation.filter(n => n.group === group);
            return (
              <div key={group} className="mb-5">
                <p className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                  {group}
                </p>
                <div className="space-y-0.5">
                  {items.map((item) => {
                    const active = isActive(item);
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`group relative flex items-center rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-150 ${
                          active
                            ? "bg-indigo-600/20 text-indigo-300 sidebar-link-active"
                            : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-200"
                        }`}
                      >
                        <item.icon
                          className={`mr-2.5 h-4 w-4 flex-shrink-0 transition-colors ${
                            active ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
                          }`}
                          aria-hidden="true"
                        />
                        {item.name}
                        {active && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400" />
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800/60 p-3 space-y-0.5">
        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between px-2.5 py-2 h-10">
          {mounted ? (
            <>
              <span className="text-xs font-medium text-slate-500">
                {theme === 'dark' ? 'Dark mode' : 'Light mode'}
              </span>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 bg-slate-700 hover:bg-slate-600"
                role="switch"
                aria-checked={theme === 'dark'}
                title="Toggle dark mode"
              >
                <span
                  className={`${
                    theme === 'dark' ? 'translate-x-5' : 'translate-x-1'
                  } inline-flex h-4 w-4 items-center justify-center transform rounded-full bg-white transition-transform duration-200 shadow-sm`}
                >
                  {theme === 'dark' ? (
                    <Moon className="h-2.5 w-2.5 text-slate-700" />
                  ) : (
                    <Sun className="h-2.5 w-2.5 text-yellow-500" />
                  )}
                </span>
              </button>
            </>
          ) : null}
        </div>

        <Link
          href="/settings"
          className={`group flex items-center rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-150 ${
            pathname === '/settings' 
              ? 'bg-slate-800 text-white' 
              : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
          }`}
        >
          <Settings className="mr-2.5 h-4 w-4 text-slate-500 group-hover:text-slate-300" />
          Settings
        </Link>
        <div className="flex items-center justify-between rounded-lg px-2.5 py-2 hover:bg-slate-800/50 transition-colors cursor-pointer">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-7 w-7 rounded-full bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <User className="h-3.5 w-3.5 text-indigo-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white truncate">{session?.user?.email?.split('@')[0] ?? 'Account'}</p>
              <p className="text-[10px] text-slate-500 capitalize">{session?.user?.role?.toLowerCase() ?? 'user'}</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="text-slate-600 hover:text-red-400 p-1.5 rounded-md hover:bg-red-500/10 transition-all ml-1 shrink-0"
            title="Sign Out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
