import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  name: string
  email: string
  mobileNumber?: string
  aadharNumber?: string
  barCouncilId?: string
  role: 'lawyer' | 'client'
  linkedLawyers?: string[]
  linkedClients?: string[]
  onboardingCompleted: boolean
}

interface UserState {
  user: User | null
  setUser: (user: User | null) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
    }
  )
) 