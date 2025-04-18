"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageSquare, Send, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content: "Hello! I'm CaseMate AI. How can I help with your legal documents today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    setMessages([...messages, { role: "user", content: input }])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            "I've analyzed your question. Based on your documents, I recommend reviewing the recent court order which has a deadline coming up on May 4th. Would you like me to help you prepare a response?",
        },
      ])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full h-12 w-12 p-0 shimmer-button bg-blue-600 hover:bg-blue-700"
      >
        <MessageSquare className="h-5 w-5" />
        <span className="sr-only">Open Chat</span>
      </Button>

      {isOpen && (
        <Card className="fixed bottom-4 right-4 w-80 sm:w-96 shadow-lg z-50 border-blue-200 dark:border-blue-800">
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">CaseMate Assistant</CardTitle>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </CardHeader>
          <CardContent className="p-4 h-80 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                    )}
                  >
                    {message.role === "bot" && (
                      <div className="flex items-center space-x-2 mb-1">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="CaseMate" />
                          <AvatarFallback>CM</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">CaseMate AI</span>
                      </div>
                    )}
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg px-3 py-2 text-sm bg-muted">
                    <div className="flex items-center space-x-2 mb-1">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="CaseMate" />
                        <AvatarFallback>CM</AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium">CaseMate AI</span>
                    </div>
                    <div className="flex space-x-1">
                      <div
                        className="h-2 w-2 rounded-full bg-blue-500 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="h-2 w-2 rounded-full bg-blue-500 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="h-2 w-2 rounded-full bg-blue-500 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="p-3 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex w-full items-center space-x-2"
            >
              <Input
                type="text"
                placeholder="Ask about your case..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading}
                className="shimmer-button bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  )
}
