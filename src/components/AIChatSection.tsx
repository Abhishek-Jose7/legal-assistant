"use client"

import { useState, useRef, useEffect } from "react"
import { useUser, useClerk } from "@clerk/nextjs"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, User, Send, Upload, Sparkles, Briefcase, FileText, ChevronDown, ChevronUp, Scale, Clock, AlertTriangle, CheckCircle2, Download } from "lucide-react"
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
  confidence_level?: "High" | "Medium" | "Low"
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
      citations?: { act: string; section?: string; link?: string }[];
      common_mistakes?: string[];
    }
  }[]
  emotional_tone?: string
  // Legacy
  action?: string
  actionData?: any
  // Snap & Audit Analysis
  analysis?: {
    summary: string;
    category: string;
    clauses: string[];
    risks: ({ risk: string; severity: "High" | "Medium" | "Low" } | string)[]; // Union for backward compact
    worst_case_scenario?: string;
    missing_clauses?: string[];
    actions: string[];
    lawyer_recommended: boolean;
  }
  suggested_lawyers?: {
    id: string | number;
    name: string;
    specialization: string | string[];
    rating?: number;
    fee?: number;
  }[]
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

// Sub-component for rendering the detailed Key Right view
const RightDetailView = ({ right, isOpen, onClose }: { right: any, isOpen: boolean, onClose: () => void }) => {
  if (!right) return null;
  const details = right.full_details || {};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-3xl md:max-w-5xl bg-[#F5EEDC] max-h-[85vh] overflow-y-auto">
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

          {/* Legal Sources / Citations */}
          {(details.citations || right.law_links) && (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Scale className="h-4 w-4" /> Source of Law
              </h4>
              <div className="flex flex-wrap gap-2">
                {[...(details.citations || []), ...(right.law_links || [])].map((cit: any, i: number) => (
                  <a
                    key={i}
                    href={cit.link || `https://indiankanoon.org/search/?formInput=${encodeURIComponent(`${cit.act} ${cit.section || ''}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs flex items-center gap-1 bg-white border border-slate-300 hover:border-[#0F3D3E] text-slate-600 hover:text-[#0F3D3E] px-3 py-1.5 rounded-full transition-all"
                  >
                    <span className="font-medium">{cit.act}</span> {cit.section && <span className="opacity-75">Section {cit.section}</span>}
                  </a>
                ))}
              </div>
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
  const { openSignIn } = useClerk()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm Nyaaya, your AI legal assistant. I can help you understand your rights, draft documents, or find the right lawyer. How may I help you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAnalyzingDoc, setIsAnalyzingDoc] = useState(false)

  // Chat History State
  const [sessions, setSessions] = useState<any[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // Mobile sidebar toggle

  // State for interactions
  const [expandedSubTopic, setExpandedSubTopic] = useState<string | null>(null)
  const [selectedRight, setSelectedRight] = useState<any>(null) // For dialog

  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load Sessions on Mount
  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  const fetchSessions = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) setSessions(data);
  };

  const loadSession = async (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setIsLoading(true);
    // Fetch Messages
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (data) {
      const formatted: Message[] = data.map(m => ({
        role: m.role as "user" | "assistant",
        content: m.content || "",
        ...(m.meta_data || {})
      }));
      setMessages(formatted.length > 0 ? formatted : [{
        role: "assistant",
        content: "Hello! This is a past conversation. How can I help you further?",
      }]);
    }
    setIsLoading(false);
    setIsSidebarOpen(false); // Close sidebar on mobile
  };

  // Auto-run if context param exists
  useEffect(() => {
    // Only run on client
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const context = params.get('context');
      if (context && messages.length === 1) { // Only if initial state
        const initialMsg = `I want to know about my rights regarding ${context}. What should I know?`;
        // Remove param from URL to avoid loop on refresh
        window.history.replaceState({}, '', '/chat');
        handleSendMessage(initialMsg);
      }
    }
  }, []);

  const startNewChat = () => {
    setCurrentSessionId(null);
    setMessages([{
      role: "assistant",
      content: "Hello! I'm Nyaaya, your AI legal assistant. I can help you understand your rights, draft documents, or find the right lawyer. How may I help you today?",
    }]);
    setIsSidebarOpen(false);
  };

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
    setIsAnalyzingDoc(false)
    let sessionId = currentSessionId;

    try {
      // 1. Ensure Session Exists
      if (!sessionId && user) {
        const { data: newSession, error: sessionError } = await supabase
          .from('chat_sessions')
          .insert({ user_id: user.id, title: text.slice(0, 30) + (text.length > 30 ? '...' : '') })
          .select()
          .single();
        if (newSession) {
          sessionId = newSession.id;
          setCurrentSessionId(newSession.id);
          setSessions((prev) => [newSession, ...prev]); // Update sidebar safely
        } else if (sessionError) {
          console.error("Error creating session:", sessionError);
        }
      }

      // 2. Save User Message
      if (sessionId && user) {
        await supabase.from('chat_messages').insert({
          session_id: sessionId,
          role: 'user',
          content: text,
          created_at: new Date().toISOString()
        });
      }

      // 3. Get AI Response
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          userId: user?.id
        }),
      })

      const data = await response.json()
      // Directly use the returned JSON object as the message
      const aiMessage: Message = {
        role: "assistant",
        content: data.message,
        ...data
      }
      setMessages((prev) => [...prev, aiMessage])

      // 4. Save AI Message
      if (sessionId && user) {
        await supabase.from('chat_messages').insert({
          session_id: sessionId,
          role: 'assistant',
          content: data.message,
          meta_data: data, // Store the structured data!
          created_at: new Date().toISOString()
        });
      }

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Restriction: Must be logged in
    if (!user) {
      openSignIn();
      return;
    }

    const file = e.target.files?.[0]
    if (!file) return

    // 1. Show user message
    const userMessage: Message = { role: "user", content: `Analyzed Document: ${file.name}` }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setIsAnalyzingDoc(true)

    // TODO: Ideally we create the session here too if null, but for now we skip session creation for just upload until a query follows? 
    // Actually, let's create it on upload if we want to save the history.
    let sessionId = currentSessionId;
    if (!sessionId && user) {
      const { data: newSession, error: sessionError } = await supabase
        .from('chat_sessions')
        .insert({ user_id: user.id, title: `Doc: ${file.name}` })
        .select()
        .single();
      if (newSession) {
        sessionId = newSession.id;
        setCurrentSessionId(newSession.id);
        setSessions((prev) => [newSession, ...prev]);
        // Save user msg
        await supabase.from('chat_messages').insert({ session_id: sessionId, role: 'user', content: `Analyzed Document: ${file.name}` });
      } else if (sessionError) {
        console.error("Error creating session during upload:", sessionError);
      }
    } else if (sessionId && user) {
      await supabase.from('chat_messages').insert({ session_id: sessionId, role: 'user', content: `Analyzed Document: ${file.name}` });
    }

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/analyze-document", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed")
      }

      // 3. Add Assistant Message with Analysis
      const aiMessage: Message = {
        role: "assistant",
        content: `I've analyzed **${file.name}**. Here is the legal breakdown:`,
        type: "structured", // reusing structured styling for base
        topic: data.analysis.category,
        analysis: data.analysis
      }
      setMessages((prev) => [...prev, aiMessage])

      // Save AI Response
      if (sessionId && user) {
        await supabase.from('chat_messages').insert({
          session_id: sessionId,
          role: 'assistant',
          content: aiMessage.content,
          meta_data: aiMessage
        });
      }

    } catch (error: any) {
      console.error("Analysis Error:", error)
      setMessages((prev) => [...prev, { role: "assistant", content: `I encountered an error analyzing that document. ${error.message}` }])
    } finally {
      setIsLoading(false)
      setIsAnalyzingDoc(false)
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleSaveChat = () => {
    const chatContent = messages.map(m => {
      let text = `${m.role.toUpperCase()}: ${m.content || ''}`;
      if (m.type === 'structured') {
        text += `\n[Topic: ${m.topic}]\n`;
        m.rights_cards?.forEach(r => text += `- Right: ${r.title}: ${r.summary}\n`);
      }
      return text;
    }).join('\n\n-------------------\n\n');

    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nyaaya-ai-chat-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
  }

  return (
    <div className="flex flex-1 w-full bg-[#F5EEDC] overflow-hidden">
      {/* Sidebar - Desktop: always visible, Mobile: conditionally visible */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-[#C8AD7F]/30 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col`}>
        <div className="p-4 border-b border-[#C8AD7F]/20 flex items-center justify-between">
          <h3 className="font-bold text-[#0F3D3E]">History</h3>
          <Button variant="ghost" size="sm" onClick={startNewChat} className="text-xs border border-[#0F3D3E] text-[#0F3D3E] hover:bg-[#0F3D3E] hover:text-white">
            + New
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {sessions.map(session => (
            <div
              key={session.id}
              onClick={() => loadSession(session.id)}
              className={`p-3 rounded-lg cursor-pointer text-sm truncate ${currentSessionId === session.id ? 'bg-[#0F3D3E] text-white' : 'hover:bg-slate-100 text-slate-700'}`}
            >
              {session.title || 'Untitled Chat'}
              <div className="text-[10px] opacity-70 mt-1">{new Date(session.created_at).toLocaleDateString()}</div>
            </div>
          ))}
          {sessions.length === 0 && (
            <div className="text-center text-slate-400 text-xs py-10">No history yet.</div>
          )}
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Chat Header */}
        <div className="bg-white border-b px-4 py-3 flex justify-between items-center shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-2">
            {/* Mobile Sidebar Toggle */}
            <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setIsSidebarOpen(true)}>
              <svg width="24" height="24" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
            </Button>
            <div className="bg-[#1e3a8a] text-white p-1.5 rounded-lg">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Nyaaya AI</h3>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-[10px] text-slate-500 font-medium">Online</span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleSaveChat} className="text-xs h-8 gap-2 bg-slate-50 hover:bg-slate-100 hidden sm:flex">
            <Download className="h-3 w-3" /> Save Chat
          </Button>
        </div>

        {/* TRUST BANNER */}
        <div className="bg-yellow-50 border-b border-yellow-100 px-4 py-2 flex items-center justify-center gap-2 text-[10px] md:text-xs text-yellow-800 text-center">
          <Scale className="h-3 w-3 shrink-0" />
          <span>This platform provides legal information and risk awareness, not professional legal advice. <span className="hidden sm:inline">Always consult a qualified lawyer for serious matters.</span></span>
        </div>

        {/* Messages Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50">
          {messages.map((message, index) => (
            <div key={index} className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm ${message.role === "assistant" ? "bg-[#1e3a8a]" : "bg-[#10b981]"}`}>
                {message.role === "assistant" ? <Bot className="h-5 w-5 text-white" /> : <User className="h-5 w-5 text-white" />}
              </div>

              <div className={`flex flex-col max-w-[90%] md:max-w-[90%] space-y-2 ${message.role === "assistant" ? "w-full" : ""}`}>
                {/* Standard Text Content (if simple or fallback) */}
                {message.content && (
                  <div className={`rounded-2xl px-5 py-4 shadow-sm ${message.role === "assistant" ? "bg-white border text-slate-800" : "bg-[#1e3a8a] text-white"}`}>
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          a: ({ node, ...props }) => (
                            <a
                              {...props}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline font-medium"
                            />
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
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

                    {/* CONFIDENCE & SOURCES (Trust Indicators) */}
                    {(message.confidence_level || (message.rights_cards && message.rights_cards[0]?.full_details?.citations)) && (
                      <div className="flex flex-wrap gap-3 mt-2">
                        {message.confidence_level && (
                          <Badge variant="outline" className={`
                            text-xs border px-2 py-0.5 rounded-full flex items-center gap-1
                            ${message.confidence_level === 'High' ? 'bg-green-50 text-green-700 border-green-200' :
                              message.confidence_level === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                'bg-red-50 text-red-700 border-red-200'}
                          `}>
                            {message.confidence_level === 'High' ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                            {message.confidence_level} Confidence
                          </Badge>
                        )}

                        {/* Source Citations */}
                        {message.rights_cards?.map((rc, idx) =>
                          rc.full_details?.citations?.map((cit, cIdx) => (
                            <a
                              key={`${idx}-${cIdx}`}
                              href={cit.link || `https://indiankanoon.org/search/?formInput=${encodeURIComponent(`${cit.act} ${cit.section || ''}`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded-full transition-colors"
                            >
                              <Scale className="h-3 w-3" />
                              {cit.act} {cit.section && `(§${cit.section})`}
                            </a>
                          ))
                        )}
                      </div>
                    )}

                    {/* ANALYSIS RESULT RENDERER */}
                    {message.analysis && (
                      <div className="mt-4 animate-in fade-in slide-in-from-bottom-2">
                        <Card className="border-l-4 border-l-red-500 bg-red-50/50 overflow-hidden shadow-none">
                          <CardHeader className="pb-2 p-3">
                            <CardTitle className="text-base text-red-900 flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-red-600" /> Risk Assessment
                            </CardTitle>
                            <CardDescription className="text-red-800 text-xs font-medium">
                              Category: {message.analysis.category}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3 p-3 pt-0">
                            {/* RISKS */}
                            <div>
                              <h4 className="font-bold text-red-900 text-xs uppercase tracking-wide mb-2 flex items-center justify-between">
                                <span>⚠️ Potential Risks</span>
                                <span className="text-[10px] font-normal normal-case opacity-70">Severity Level</span>
                              </h4>
                              <ul className="space-y-2">
                                {message.analysis.risks.map((riskItem: any, idx) => {
                                  // Handle both legacy string and new object format
                                  const riskText = typeof riskItem === 'string' ? riskItem : riskItem.risk;
                                  const severity = typeof riskItem === 'string' ? 'Medium' : riskItem.severity;

                                  return (
                                    <li key={idx} className="flex gap-2 text-xs text-red-800 bg-red-100/50 p-2 rounded border border-red-200 items-start justify-between">
                                      <div className="flex gap-2">
                                        <span className="mt-0.5">•</span>
                                        <span>{riskText}</span>
                                      </div>
                                      <Badge className={`
                                        text-[9px] h-5 px-1.5 hover:none border shadow-none
                                        ${severity === 'High' ? 'bg-red-600 text-white' :
                                          severity === 'Medium' ? 'bg-orange-500 text-white' :
                                            'bg-yellow-500 text-white'}
                                      `}>
                                        {severity}
                                      </Badge>
                                    </li>
                                  )
                                })}
                                {message.analysis.risks.length === 0 && <p className="text-xs text-green-700 italic">No major risks detected.</p>}
                              </ul>
                            </div>

                            {/* WORST CASE SCENARIO */}
                            {message.analysis.worst_case_scenario && (
                              <div className="mt-3 bg-red-900/5 border border-red-900/10 p-2 rounded">
                                <h4 className="font-bold text-red-900 text-[10px] uppercase mb-1 flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3" /> Worst Case Scenario
                                </h4>
                                <p className="text-xs text-red-800 leading-snug">
                                  {message.analysis.worst_case_scenario}
                                </p>
                              </div>
                            )}

                            {/* SUMMARY */}
                            <div className="bg-white p-2 rounded border border-slate-200">
                              <h4 className="font-bold text-slate-700 text-[10px] uppercase mb-1">Summary</h4>
                              <p className="text-xs text-slate-600">{message.analysis.summary}</p>
                            </div>

                            {/* KEY CLAUSES */}
                            <div>
                              <h4 className="font-bold text-slate-700 text-[10px] uppercase mb-1">Key Clauses</h4>
                              <div className="flex flex-wrap gap-1">
                                {message.analysis.clauses.map((clause, cIdx) => (
                                  <Badge key={cIdx} variant="secondary" className="bg-slate-200 text-slate-700 hover:bg-slate-300 text-[10px] h-auto py-0.5">
                                    {clause}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* ACTIONS */}
                            {message.analysis.lawyer_recommended && (
                              <div className="flex items-center gap-2 text-xs font-bold text-blue-800 bg-blue-100 p-2 rounded justify-center">
                                <Briefcase className="h-3 w-3" /> Lawyer Consultation Recommended
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {/* Suggested Lawyers */}
                    {message.suggested_lawyers && message.suggested_lawyers.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-slate-500 text-xs uppercase tracking-wider mb-2">Recommended Lawyers</h4>
                        <div className="grid gap-3 md:grid-cols-2">
                          {message.suggested_lawyers.map((lawyer, lIdx) => (
                            <Card key={lIdx} className="border border-l-4 border-l-[#0F3D3E] overflow-hidden bg-white">
                              <CardContent className="p-3">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h5 className="font-bold text-[#0F3D3E] text-sm">{lawyer.name}</h5>
                                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{Array.isArray(lawyer.specialization) ? lawyer.specialization.join(", ") : lawyer.specialization}</p>
                                  </div>
                                  {lawyer.rating && (
                                    <Badge variant="outline" className="text-[10px] bg-yellow-50 text-yellow-700 border-yellow-200 shrink-0">
                                      ★ {lawyer.rating}
                                    </Badge>
                                  )}
                                </div>
                                <div className="mt-3 flex items-center justify-between">
                                  <div className="text-xs text-slate-700 font-medium">
                                    {lawyer.fee ? `₹${lawyer.fee}/consult` : "Contact for Fee"}
                                  </div>
                                  <Button size="sm" variant="outline" className="h-7 text-xs border-[#0F3D3E] text-[#0F3D3E]" asChild>
                                    <a href={`/lawyers/${lawyer.id}`}>View Profile</a>
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}


          {isLoading && (
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1e3a8a] text-white"><Bot className="h-5 w-5 animate-pulse" /></div>
              <div className="bg-white border rounded-2xl px-5 py-4 flex items-center gap-2">
                <span className="animate-pulse">
                  {isAnalyzingDoc ? "Reading document & consulting legal database (approx 15-20s)..." : "Consulting legal database..."}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t p-4 bg-white z-10 shrink-0">
          {/* Quick Prompts */}
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
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".txt,.pdf,.jpg,.jpeg,.png"
              className="hidden"
            />
            <Button variant="ghost" size="icon" className="shrink-0" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-5 w-5 text-slate-500" />
            </Button>
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
      </div>

      {/* Detailed Right View Dialog */}
      {selectedRight && (
        <RightDetailView
          right={selectedRight}
          isOpen={!!selectedRight}
          onClose={() => setSelectedRight(null)}
        />
      )}
    </div>
  )
}
