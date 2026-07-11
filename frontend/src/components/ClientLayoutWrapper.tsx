"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import React from "react";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  // If it's the landing page, don't show the sidebar or standard app constraints
  if (isLanding) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <div className="shrink-0 h-full">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-y-auto custom-scroll">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
