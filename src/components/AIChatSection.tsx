"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, User, Send, Upload, Image as ImageIcon } from "lucide-react"

const quickPrompts = [
  "My landlord isn't returning my deposit",
  "My employer refuses to pay salary",
  "How to file a cybercrime complaint",
]

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function AIChatSection() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm Lexi, your AI legal assistant. I can help you understand your legal rights and guide you through various legal processes. How can I assist you today?",
    },
  ])
  const [input, setInput] = useState("")

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { role: "user", content: input }])
      setInput("")
      // Simulate AI response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Thank you for your question. I'm analyzing your situation and will provide you with relevant legal information shortly...",
          },
        ])
      }, 1000)
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    setMessages([...messages, { role: "user", content: prompt }])
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I understand your concern. Let me help you with that...",
        },
      ])
    }, 1000)
  }

  return (
    <section id="ai-assistant" className="w-full py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            AI Legal Chat Assistant
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Ask questions about your legal rights in plain language and get instant guidance
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {quickPrompts.map((prompt) => (
              <Button
                key={prompt}
                variant="outline"
                size="sm"
                onClick={() => handleQuickPrompt(prompt)}
                className="rounded-full border-[#1e3a8a]/20 hover:bg-[#1e3a8a]/5 hover:border-[#1e3a8a]"
              >
                {prompt}
              </Button>
            ))}
          </div>

          {/* Chat Interface */}
          <Card className="overflow-hidden border-2">
            <ScrollArea className="h-[500px] p-6">
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        message.role === "assistant"
                          ? "bg-[#1e3a8a]"
                          : "bg-[#10b981]"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <Bot className="h-5 w-5 text-white" />
                      ) : (
                        <User className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div
                      className={`flex-1 rounded-2xl px-5 py-3 ${
                        message.role === "assistant"
                          ? "bg-slate-100"
                          : "bg-[#10b981]/10 border border-[#10b981]/20"
                      }`}
                    >
                      <p className="text-sm text-slate-800">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t p-4 bg-slate-50">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  title="Upload document"
                >
                  <Upload className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  title="Upload image"
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your legal question here..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  className="shrink-0 bg-[#1e3a8a] hover:bg-[#1e3a8a]/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
