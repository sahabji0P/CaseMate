import type React from "react"
import { cn } from "@/lib/utils"
import { DashboardNav } from "@/components/dashboard-nav"

interface DashboardShellProps {
  children: React.ReactNode
  className?: string
}

export function DashboardShell({ children, className }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen">
      <aside className="fixed top-0 z-30 hidden h-screen w-[240px] border-r md:sticky md:block">
        <DashboardNav />
      </aside>
      <main className={cn("flex-1 w-full md:ps-[-80px] md:ml-[220px]", className)}>
        <div className="container mx-auto py-4 page-transition">{children}</div>
      </main>
    </div>
  )
}
