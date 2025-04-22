import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.role) {
          throw new Error("Missing credentials")
        }

        await connectDB()

        const user = await User.findOne({ 
          email: credentials.email,
          role: credentials.role
        })

        if (!user) {
          throw new Error("User not found")
        }

        const isPasswordValid = await compare(credentials.password, user.passwordHash)

        if (!isPasswordValid) {
          throw new Error("Invalid password")
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          onboardingCompleted: user.onboardingCompleted
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.onboardingCompleted = user.onboardingCompleted
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string
        session.user.onboardingCompleted = token.onboardingCompleted as boolean
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: "jwt"
  }
})

export { handler as GET, handler as POST } 