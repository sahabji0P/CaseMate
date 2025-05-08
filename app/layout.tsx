import { Footer } from "@/components/footer"
import "@/lib/init"

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import "./globals.css"
<<<<<<< HEAD

=======
import { Providers } from "./provider"
import { dark } from '@clerk/themes'
import { Ripple } from "@/components/magicui/ripple";
>>>>>>> 3820ab5c826c44f2be6e5be1368f62c49a18ec89

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
<<<<<<< HEAD
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>

=======
      <Providers>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            </div>
          </ThemeProvider>
        </Providers>
>>>>>>> 3820ab5c826c44f2be6e5be1368f62c49a18ec89
      </body>
    </html>
  )
}
