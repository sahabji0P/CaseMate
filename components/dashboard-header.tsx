import { cn } from "@/lib/utils"
import type React from "react"

interface DashboardHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
  className?: string
}

export function DashboardHeader({ heading, text, children, className }: DashboardHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-2 md:flex-row md:items-center md:justify-between", className)}>
      <div className="space-y-0.5 flex items-center gap-4 mb-10">
        <h1 className="text-4xl font-bold tracking-tight ">{heading}</h1>
        {/* <ModelViewer className="hidden md:block" /> */}
        {text && <p className="text-muted-foreground">{text}</p>}
      </div>
      {children}
    </div>
  )
}
