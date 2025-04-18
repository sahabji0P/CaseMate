import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider } from "@clerk/nextjs"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import "./globals.css"

import { dark } from '@clerk/themes'
import { Ripple } from "@/components/magicui/ripple";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CaseMate - Your Legal AI Assistant",
  description: "Upload. Understand. Act. Your AI-powered legal document assistant.",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}>

      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
