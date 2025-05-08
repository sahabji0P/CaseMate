import { Footer } from "@/components/footer"

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import "./globals.css"


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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>

      </body>
    </html>
  )
}
