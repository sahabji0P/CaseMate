"use client"

import { Ripple } from "@/components/magicui/ripple"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowDown, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import {
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

export default function WelcomePage() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen gradient-bg text-white">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-black/80 backdrop-blur-md py-2" : "py-4"}`}
      >
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">Case<span className="text-red-800">Mate</span></div>
          <div className="space-x-4">
            <SignedOut>
              <Link href={"/auth/sign-in"}>
                <Button className="shimmer-button bg-blue-600 hover:bg-blue-700 text-white">Login</Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="ripple-bg min-h-screen flex flex-col justify-center items-center text-center px-4 pt-16 relative">
        <Ripple mainCircleSize={250} mainCircleOpacity={0.5} numCircles={12} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto relative z-10"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Meet Case<span className="text-red-800">Mate</span> – Your Legal AI Assistant</h1>
          <p className="text-xl md:text-2xl mb-10 text-blue-200">Upload. Understand. Act.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* <Link href="/register">
              <Button size="lg" className="shimmer-button bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"s
                className="text-lg px-8 py-6 border-blue-400 text-blue-200 hover:bg-blue-900/30"
              >
                Login
              </Button>
            </Link> */}
          </div>
          <button
            onClick={scrollToHowItWorks}
            className="mt-20 text-blue-300 flex flex-col items-center animate-bounce"
          >
            <span className="mb-2">Learn More</span>
            <ArrowDown size={24} />
          </button>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Upload Legal Document",
                description:
                  "Simply upload your legal documents in any format. CaseMate supports PDFs, Word documents, and scanned images.",
                icon: "📄",
              },
              {
                title: "AI Analyzes & Explains",
                description:
                  "Our advanced AI reads and interprets your documents, extracting key information and explaining complex legal terms in simple language.",
                icon: "🧠",
              },
              {
                title: "Get Actionable Insights",
                description:
                  "Receive clear next steps, deadline reminders, and document templates to help you navigate your legal journey.",
                icon: "✅",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-blue-900/30 backdrop-blur-sm rounded-xl p-6 card-hover"
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-blue-100">{step.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/register">
              <Button size="lg" className="shimmer-button bg-blue-600 hover:bg-blue-700">
                Start Your Legal Journey
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-black/50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose CaseMate</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Simple Language Explanations",
                description: "Complex legal jargon translated into plain, understandable language.",
              },
              {
                title: "Smart Deadline Tracking",
                description: "Never miss an important filing date or court appearance again.",
              },
              {
                title: "Document Templates",
                description: "Access to professionally drafted templates for common legal responses.",
              },
              {
                title: "Case Timeline Visualization",
                description: "See your entire case journey in an intuitive visual timeline.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="flex items-start space-x-4"
              >
                <div className="bg-blue-600 p-2 rounded-full mt-1">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-blue-100">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">What Our Users Say</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Small Business Owner",
                testimonial:
                  "CaseMate helped me understand my commercial lease agreement without expensive lawyer consultations.",
                image: "/placeholder.svg?height=80&width=80",
              },
              {
                name: "Michael Chen",
                role: "Divorce Proceedings",
                testimonial:
                  "The document timeline feature helped me keep track of all my divorce paperwork and upcoming deadlines.",
                image: "/placeholder.svg?height=80&width=80",
              },
              {
                name: "Priya Patel",
                role: "Immigration Case",
                testimonial:
                  "As a non-native English speaker, the simple language explanations were invaluable for my immigration documents.",
                image: "/placeholder.svg?height=80&width=80",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-blue-900/20 backdrop-blur-sm rounded-xl p-6 card-hover"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-bold">{testimonial.name}</h3>
                    <p className="text-sm text-blue-300">{testimonial.role}</p>
                  </div>
                </div>
                <p className="italic text-blue-100">"{testimonial.testimonial}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-900/30">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Simplify Your Legal Journey?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-blue-100">
            Join thousands of users who have transformed their legal experience with CaseMate.
          </p>
          <Link href="/register">
            <Button size="lg" className="shimmer-button bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/80 py-10 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl font-bold mb-4 md:mb-0">CaseMate</div>
            <div className="flex space-x-6">
              <Link href="#" className="text-blue-300 hover:text-white">
                Terms
              </Link>
              <Link href="#" className="text-blue-300 hover:text-white">
                Privacy
              </Link>
              <Link href="#" className="text-blue-300 hover:text-white">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-blue-400 text-sm">
            © {new Date().getFullYear()} CaseMate. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
