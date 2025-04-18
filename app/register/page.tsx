"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Mail, User } from "lucide-react"
import { motion } from "framer-motion"

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      window.location.href = "/dashboard"
    }, 1500)
  }

  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="bg-black/40 backdrop-blur-md border-blue-900/50">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <Link href="/" className="text-blue-400 hover:text-blue-300 flex items-center">
                  <ArrowLeft size={16} className="mr-1" />
                  Back
                </Link>
                <div className="text-sm text-blue-400">Step 1 of 2</div>
              </div>
              <CardTitle className="text-2xl text-white">Create an account</CardTitle>
              <CardDescription className="text-blue-200">
                Enter your information to get started with CaseMate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="email" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="google">Google</TabsTrigger>
                </TabsList>
                <TabsContent value="email">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-blue-100">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
                        <Input
                          id="name"
                          placeholder="John Doe"
                          required
                          className="pl-10 bg-blue-950/50 border-blue-900 text-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-blue-100">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          required
                          className="pl-10 bg-blue-950/50 border-blue-900 text-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-blue-100">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        required
                        className="bg-blue-950/50 border-blue-900 text-white"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full shimmer-button bg-blue-600 hover:bg-blue-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
                <TabsContent value="google">
                  <div className="space-y-4">
                    <Button
                      variant="outline"
                      className="w-full border-blue-800 text-white hover:bg-blue-900/30"
                      onClick={() => {
                        setIsLoading(true)
                        setTimeout(() => {
                          setIsLoading(false)
                          window.location.href = "/dashboard"
                        }, 1500)
                      }}
                      disabled={isLoading}
                    >
                      <img src="/placeholder.svg?height=20&width=20" alt="Google" className="mr-2 h-5 w-5" />
                      {isLoading ? "Connecting..." : "Continue with Google"}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col">
              <div className="text-sm text-blue-300 mt-2">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                  Login
                </Link>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      {/* Marquee of user avatars */}
      <div className="marquee mt-12 max-w-2xl overflow-hidden">
        <div className="marquee-content flex space-x-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <img
                src={`/placeholder.svg?height=40&width=40&text=${i + 1}`}
                alt="User"
                className="h-10 w-10 rounded-full border-2 border-blue-500"
              />
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={`dup-${i}`} className="flex flex-col items-center">
              <img
                src={`/placeholder.svg?height=40&width=40&text=${i + 1}`}
                alt="User"
                className="h-10 w-10 rounded-full border-2 border-blue-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="mt-12 max-w-md text-center">
        <p className="text-blue-200 italic">
          "CaseMate simplified my legal documents and saved me thousands in legal fees."
        </p>
        <div className="mt-4 flex items-center justify-center">
          <img src="/placeholder.svg?height=40&width=40" alt="Testimonial" className="h-10 w-10 rounded-full mr-3" />
          <div className="text-left">
            <p className="text-white font-medium">Robert Chen</p>
            <p className="text-blue-300 text-sm">Small Claims Case</p>
          </div>
        </div>
      </div>
    </div>
  )
}
