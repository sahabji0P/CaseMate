"use client"

import { useEffect } from "react"
import { useUserStore } from "@/store/userStore"
import { useCaseFolderStore } from "@/store/caseFolderStore"

export default function CaseFolderManager() {
  const user = useUserStore((state) => state.user)
  const { cases, setCases } = useCaseFolderStore()

  useEffect(() => {
    const fetchCases = async () => {
      if (!user?.id) return

      try {
        const response = await fetch("/api/cases")
        if (!response.ok) {
          throw new Error("Failed to fetch cases")
        }

        const data = await response.json()
        setCases(data)
      } catch (error) {
        console.error("Error fetching cases:", error)
      }
    }

    fetchCases()
  }, [user?.id, setCases])

  // You can now use the cases from the store in your component
  return (
    <div>
      {/* Your case folder UI components here */}
      <pre>{JSON.stringify(cases, null, 2)}</pre>
    </div>
  )
} 