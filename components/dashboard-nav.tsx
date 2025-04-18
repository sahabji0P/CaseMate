"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { SignedIn, UserButton } from "@clerk/nextjs"
import { Bell, CreditCard, FileText, FolderOpen, Home, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { NotificationsSettings } from "./notifications-settings"
import { SubscriptionManagement } from "./subscription-management"

export function DashboardNav() {
  const pathname = usePathname()

  const routes = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard",
      variant: "default",
    },
    {
      title: "Case Explorer",
      icon: FolderOpen,
      href: "/case-explorer",
      variant: "default",
    },
    {
      title: "Documents",
      icon: FileText,
      href: "/documents",
      variant: "default",
    },
  ]

  const DotIcon = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
      </svg>
    )
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="flex h-14 items-center border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <div className="h-6 w-6 rounded-full bg-blue-600"></div>
            <span>CaseMate</span>
          </Link>
          <div className="ml-auto md:hidden">
            <SidebarTrigger />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {routes.map((route) => (
                  <SidebarMenuItem key={route.href}>
                    <SidebarMenuButton asChild isActive={pathname === route.href}>
                      <Link href={route.href}>
                        <route.icon className="h-4 w-4" />
                        <span>{route.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <div className="text-xs text-muted-foreground">
                  <SignedIn>
                    <UserButton showName>
                      <UserButton.UserProfilePage label="Notifications" url="notifications" labelIcon={<Bell className="h-4 w-4" />}>
                        <NotificationsSettings />
                      </UserButton.UserProfilePage>
                      <UserButton.UserProfilePage label="Subscription" url="subscription" labelIcon={<CreditCard className="h-4 w-4" />}>
                        <SubscriptionManagement />
                      </UserButton.UserProfilePage>
                    </UserButton>
                  </SignedIn>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/login">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}
