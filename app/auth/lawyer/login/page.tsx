"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useUserStore } from "@/store/userStore"

export default function LawyerLoginPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const setUser = useUserStore((state) => state.setUser)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const result = await signIn("credentials", {
        email,
        password,
        role: "lawyer",
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid credentials")
        return
      }
      console.log(result,"saved in store")
      // Save user details in store
      setUser({
        id: result?.id || "",
        email: result?.email || "",
        name: result?.name || "",
        role: "lawyer",
        onboardingCompleted: result?.onboardingCompleted || false
      })
     

      router.push("/dashboard/lawyer")
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Lawyer Login</h1>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-500 rounded p-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              className="w-full bg-gray-700 border-gray-600"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="w-full bg-gray-700 border-gray-600"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-4 text-center text-gray-400">
          Don't have an account?{" "}
          <Link href="/auth/lawyer/signup" className="text-blue-400 hover:text-blue-300">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
} 