"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, User, Send, Upload, Sparkles, Briefcase, FileText } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { Badge } from "@/components/ui/badge"

const quickPrompts = [
  "My landlord isn't returning my deposit",
  "Help me draft a rent agreement notice",
  "I need a lawyer for divorce",
]

// Mock data for "Smart Matching" - in a real app, this would fetch from a DB
const RECOMMENDED_LAWYERS = [
  {
    name: "Adv. Priya Sharma",
    specialization: "Women's Rights & Family Law",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop"
  },
  {
    name: "Adv. Rajesh Kumar",
    specialization: "Property & Housing Law",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop"
  }
]

interface Message {
  role: "user" | "assistant"
  content: string
  action?: "NONE" | "SHOW_LAWYERS" | "SHOW_TEMPLATE" | "DRAFT_DOCUMENT"
  actionData?: any
}

export default function AIChatSection() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm Lexi, your AI legal assistant. I can help you understand your rights, draft documents, or find the right lawyer. How can I assist you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (text: string = input) => {
    if (!text.trim()) return

    const userMessage: Message = { role: "user", content: text }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // 1. Prepare history for API (exclude action data to keep it clean)
      // We only send the last few messages to save tokens/context window if needed, 
      // but sending full session is better for context.
      const conversationHistory = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        content: m.content // sending plain content
      }))

      // 2. Call API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: conversationHistory
        }),
      })

      const data = await response.json()

      // 3. Handle 'Smart' Response
      const aiMessage: Message = {
        role: "assistant",
        content: data.message,
        action: data.action,
        actionData: data.action_data
      }

      setMessages((prev) => [...prev, aiMessage])

    } catch (error) {
      console.error("Chat Error:", error)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I apologize, but I'm having trouble connecting to the server. Please try again." }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // --- RENDER HELPERS ---

  const renderActionCard = (msg: Message) => {
    if (!msg.action || msg.action === "NONE") return null

    if (msg.action === "SHOW_LAWYERS") {
      const spec = msg.actionData?.specialization || "General"
      // Simple client-side filter mock
      const lawyers = RECOMMENDED_LAWYERS.filter(l =>
        msg.actionData?.specialization ? l.specialization.includes(spec) || spec.includes("Family") && l.specialization.includes("Family") || spec.includes("Property") && l.specialization.includes("Housing") : true
      )

      const displayLawyers = lawyers.length > 0 ? lawyers : RECOMMENDED_LAWYERS // Fallback

      return (
        <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-[#1e3a8a]">
            <Briefcase className="h-5 w-5" />
            <h4 className="font-semibold">Recommended Lawyers for {spec}</h4>
          </div>
          <div className="grid gap-3">
            {displayLawyers.map((lawyer, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                <img src={lawyer.image} alt={lawyer.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-medium text-slate-900">{lawyer.name}</p>
                  <p className="text-xs text-slate-500">{lawyer.specialization}</p>
                </div>
                <div className="ml-auto text-xs font-bold text-[#10b981] flex items-center">
                  ★ {lawyer.rating}
                </div>
              </div>
            ))}
          </div>
          <Button size="sm" className="w-full mt-3 bg-[#1e3a8a]" onClick={() => window.location.href = '/lawyers'}>
            View All Lawyers
          </Button>
        </div>
      )
    }

    if (msg.action === "DRAFT_DOCUMENT") {
      return (
        <div className="mt-4 p-4 bg-white rounded-xl border-l-4 border-l-[#10b981] shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-[#10b981]">
            <FileText className="h-5 w-5" />
            <h4 className="font-semibold">Draft Generated: {msg.actionData?.title}</h4>
          </div>
          <div className="bg-slate-50 p-4 rounded-md font-mono text-sm text-slate-700 whitespace-pre-wrap max-h-60 overflow-y-auto mb-3 border">
            {msg.actionData?.content}
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="flex-1 bg-[#10b981]">
              <Sparkles className="mr-2 h-4 w-4" /> Copy Text
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              Download PDF
            </Button>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <section id="ai-assistant" className="w-full py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            AI Legal Chat Assistant
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Powered by advanced AI to provide instant legal guidance and recommendations.
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
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="rounded-full border-[#1e3a8a]/20 hover:bg-[#1e3a8a]/5 hover:border-[#1e3a8a]"
              >
                {prompt}
              </Button>
            ))}
          </div>

          {/* Chat Interface */}
          <Card className="overflow-hidden border-2 shadow-xl h-[600px] flex flex-col">
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50"
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm ${message.role === "assistant"
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
                  <div className={`flex flex-col max-w-[85%]`}>
                    <div
                      className={`rounded-2xl px-5 py-4 shadow-sm ${message.role === "assistant"
                          ? "bg-white border text-slate-800"
                          : "bg-[#1e3a8a] text-white"
                        }`}
                    >
                      <div className={`text-sm leading-relaxed prose ${message.role === 'assistant' ? 'prose-slate' : 'prose-invert'} max-w-none`}>
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    </div>

                    {/* Render specialized UI for this message if any */}
                    {message.role === "assistant" && renderActionCard(message)}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1e3a8a]">
                    <Bot className="h-5 w-5 text-white animate-pulse" />
                  </div>
                  <div className="bg-white border rounded-2xl px-5 py-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t p-4 bg-white">
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="shrink-0" title="Upload document">
                  <Upload className="h-4 w-4" />
                </Button>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
                  placeholder="Ask a legal question or request a draft..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !input.trim()}
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

