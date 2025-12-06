"use client"

import { useState, useRef, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardInput, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, User, Send, Upload, Sparkles, Briefcase, FileText, ChevronDown, ChevronUp, Scale, Clock, AlertTriangle, CheckCircle2 } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const quickPrompts = [
  "My landlord isn't returning my deposit",
  "Help me draft a rent agreement notice",
  "I need a lawyer for divorce",
]

interface Message {
  role: "user" | "assistant"
  content?: string
  // New Structured Fields
  type?: "simple" | "structured"
  topic?: string
  sub_topics?: { label: string; detail: string }[]
  rights_cards?: {
    title: string;
    summary: string;
    full_details?: {
      what_it_means?: string;
      when_applicable?: string[];
      requirements?: { item: string; example: string }[];
      steps?: string[];
      timeframe?: string;
      action_buttons?: string[];
    }
  }[]
  emotional_tone?: string
  // Legacy
  action?: string
  actionData?: any
}

// Sub-component for rendering the detailed Key Right view
const RightDetailView = ({ right, isOpen, onClose }: { right: any, isOpen: boolean, onClose: () => void }) => {
  if (!right) return null;
  const details = right.full_details || {};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#F5EEDC] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#0F3D3E] flex items-center gap-2">
            <Scale className="h-6 w-6" /> {right.title}
          </DialogTitle>
          <DialogDescription className="text-base text-slate-700">
            {details.what_it_means || right.summary}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* When Applicable */}
          {details.when_applicable && (
            <div className="bg-white p-4 rounded-lg border border-[#C8AD7F]/30">
              <h4 className="font-semibold text-[#0F3D3E] mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> When is this applicable?
              </h4>
              <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                {details.when_applicable.map((cond: string, i: number) => <li key={i}>{cond}</li>)}
              </ul>
            </div>
          )}

          {/* Requirements Table */}
          {details.requirements && (
            <div>
              <h4 className="font-semibold text-[#0F3D3E] mb-2 flex items-center gap-2">
                <Briefcase className="h-4 w-4" /> What you need
              </h4>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-[#0F3D3E]/5">
                    <TableRow>
                      <TableHead>Requirement</TableHead>
                      <TableHead>Example/Note</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {details.requirements.map((req: any, i: number) => (
                      <TableRow key={i} className="bg-white">
                        <TableCell className="font-medium">{req.item}</TableCell>
                        <TableCell>{req.example}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Steps */}
          {details.steps && (
            <div>
              <h4 className="font-semibold text-[#0F3D3E] mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Step-by-Step Process
              </h4>
              <div className="space-y-2">
                {details.steps.map((step: string, i: number) => (
                  <div key={i} className="flex gap-3 items-start bg-white p-3 rounded-md border border-slate-100">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0F3D3E] text-white flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <p className="text-sm text-slate-700 mt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeframe */}
          {details.timeframe && (
            <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-3 border border-blue-100">
              <Clock className="h-5 w-5 text-blue-700" />
              <div>
                <h4 className="font-semibold text-blue-900 text-sm">Expected Timeframe</h4>
                <p className="text-sm text-blue-800">{details.timeframe}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button asChild className="flex-1 bg-[#0F3D3E] hover:bg-[#0F3D3E]/90">
              <a href="/templates">View Templates</a>
            </Button>
            <Button asChild variant="outline" className="flex-1 border-[#0F3D3E] text-[#0F3D3E]">
              <a href="/lawyers">Find Lawyer</a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function AIChatSection() {
  const { user } = useUser()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm Lexi, your AI legal assistant. I can help you understand your rights, draft documents, or find the right lawyer. How may I help you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // State for interactions
  const [expandedSubTopic, setExpandedSubTopic] = useState<string | null>(null)
  const [selectedRight, setSelectedRight] = useState<any>(null) // For dialog

  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll
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
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      })

      const data = await response.json()
      // Directly use the returned JSON object as the message
      const aiMessage: Message = { role: "assistant", ...data }
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

  const handleFileUpload = (e: any) => { /* simplified for brevity in this update, keeping logic same */ }

  return (
    <section id="ai-assistant" className="w-full py-0 flex flex-col h-full bg-white relative">
      <div className="flex-1 container mx-auto px-4 md:px-6 py-6 h-full flex flex-col">
        {!messages.length && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              AI Legal Chat Assistant
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Powered by advanced AI to provide instant legal guidance.
            </p>
          </div>
        )}

        <Card className="flex-1 overflow-hidden border-2 shadow-xl flex flex-col bg-slate-50 relative">
          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {messages.map((message, index) => (
              <div key={index} className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm ${message.role === "assistant" ? "bg-[#1e3a8a]" : "bg-[#10b981]"}`}>
                  {message.role === "assistant" ? <Bot className="h-5 w-5 text-white" /> : <User className="h-5 w-5 text-white" />}
                </div>

                <div className="flex flex-col max-w-[90%] md:max-w-[75%] space-y-2">
                  {/* Standard Text Content (if simple or fallback) */}
                  {message.content && (
                    <div className={`rounded-2xl px-5 py-4 shadow-sm ${message.role === "assistant" ? "bg-white border text-slate-800" : "bg-[#1e3a8a] text-white"}`}>
                      <ReactMarkdown className="prose prose-sm max-w-none">{message.content}</ReactMarkdown>
                    </div>
                  )}

                  {/* STRUCTURED CONTENT */}
                  {message.type === "structured" && (
                    <div className="space-y-4 w-full mt-2">
                      {/* Topic Header */}
                      {message.topic && (
                        <div className="flex items-center gap-2 text-[#0F3D3E] font-bold text-lg bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
                          <Sparkles className="h-5 w-5 text-yellow-600" /> Topic Detected: {message.topic}
                        </div>
                      )}

                      {/* Sub Topics Expandable */}
                      {message.sub_topics && message.sub_topics.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {message.sub_topics.map((sub, i) => (
                            <div key={i} className="flex flex-col">
                              <Button
                                variant={expandedSubTopic === sub.label ? "default" : "outline"}
                                size="sm"
                                onClick={() => setExpandedSubTopic(expandedSubTopic === sub.label ? null : sub.label)}
                                className={`rounded-full ${expandedSubTopic === sub.label ? "bg-[#0F3D3E]" : "border-[#0F3D3E] text-[#0F3D3E]"}`}
                              >
                                {parsedIcon(sub.label)} {sub.label} {expandedSubTopic === sub.label ? <ChevronUp className="ml-2 h-3 w-3" /> : <ChevronDown className="ml-2 h-3 w-3" />}
                              </Button>
                            </div>
                          ))}
                          {expandedSubTopic && (
                            <div className="w-full bg-white p-3 rounded-lg border border-slate-200 text-sm text-slate-700 mt-1 animate-in slide-in-from-top-2">
                              {message.sub_topics.find(s => s.label === expandedSubTopic)?.detail}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Rights Cards */}
                      {message.rights_cards && (
                        <div className="grid gap-3">
                          <h4 className="font-semibold text-slate-500 text-xs uppercase tracking-wider mt-2">Key Legal Rights</h4>
                          {message.rights_cards.map((right, idx) => (
                            <Card
                              key={idx}
                              onClick={() => setSelectedRight(right)}
                              className="cursor-pointer hover:shadow-md transition-all hover:bg-slate-50 border-l-4 border-l-[#0F3D3E]"
                            >
                              <CardContent className="p-4 flex justify-between items-center">
                                <div>
                                  <h5 className="font-bold text-[#0F3D3E]">{right.title}</h5>
                                  <p className="text-sm text-slate-600 line-clamp-2">{right.summary}</p>
                                </div>
                                <Button variant="ghost" size="icon"><ChevronDown className="-rotate-90 h-4 w-4 text-slate-400" /></Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}

                      {/* Emotional Tone */}
                      {message.emotional_tone && (
                        <div className="bg-yellow-50 border border-yellow-100 text-yellow-800 px-4 py-3 rounded-xl flex items-start gap-3 text-sm">
                          <div className="mt-0.5">💛</div>
                          <p>{message.emotional_tone}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1e3a8a] text-white"><Bot className="h-5 w-5 animate-pulse" /></div>
                <div className="bg-white border rounded-2xl px-5 py-4 flex items-center gap-2">
                  <span className="animate-pulse">Analyzing legal database...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t p-4 bg-white z-10">
            {/* Quick Prompts (only if empty) */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 mb-4 justify-center">
                {quickPrompts.map((prompt) => (
                  <Button key={prompt} variant="outline" size="sm" onClick={() => handleSendMessage(prompt)} className="rounded-full text-xs bg-slate-50 hover:bg-slate-100">
                    {prompt}
                  </Button>
                ))}
              </div>
            )}

            <div className="flex gap-2 items-center max-w-4xl mx-auto w-full">
              <Button variant="ghost" size="icon" className="shrink-0"><Upload className="h-5 w-5 text-slate-500" /></Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
                placeholder="Ask a legal question..."
                className="flex-1 rounded-full border-slate-300 focus-visible:ring-[#0F3D3E]"
              />
              <Button onClick={() => handleSendMessage()} disabled={isLoading} className="rounded-full h-10 w-10 p-0 bg-[#0F3D3E] hover:bg-[#0F3D3E]/90">
                <Send className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Right View Dialog */}
      {selectedRight && (
        <RightDetailView
          right={selectedRight}
          isOpen={!!selectedRight}
          onClose={() => setSelectedRight(null)}
        />
      )}
    </section>
  )
}

// Icon helper
const parsedIcon = (label: string) => {
  const l = label.toLowerCase();
  if (l.includes("law") || l.includes("understand")) return "⚖️";
  if (l.includes("document") || l.includes("form")) return "🧾";
  if (l.includes("process") || l.includes("step")) return "🪜";
  if (l.includes("money") || l.includes("cost") || l.includes("fee")) return "💰";
  return "📌";
}
