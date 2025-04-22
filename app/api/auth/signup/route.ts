import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"

export async function POST(req: Request) {
  try {
    const { name, email, password, role, barCouncilId, mobileNumber } = await req.json()

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    // Connect to database
    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user
    const user = await User.create({
      name,
      email,
      passwordHash: hashedPassword,
      role,
      barCouncilId,
      mobileNumber,
      onboardingCompleted: false,
    })

    return NextResponse.json(
      { message: "User created successfully", userId: user._id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { message: "Error creating user" },
      { status: 500 }
    )
  }
} 