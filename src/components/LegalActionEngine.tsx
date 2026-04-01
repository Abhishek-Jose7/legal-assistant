"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import {
  Scale, FileText, MapPin, Globe, Phone, Briefcase,
  ChevronDown, ChevronUp, AlertTriangle,
  CheckCircle2, Clock, Download, Copy, Star,
  Loader2, Sparkles, Shield, Zap,
  CircleDot, FileCheck, Users, Gavel, Target, RotateCcw,
  History, Trash2, Plus, PanelLeftClose, PanelLeftOpen,
  ArrowRight, ExternalLink,
} from "lucide-react"
import type {
  Classification, FollowUpQuestion, LegalOption,
  DecisionResult, WorkflowStep, GeneratedDocument,
  TrackingItem, ActionStage, StrategyResult,
} from "@/types/legalAction"

// ─── Types ───────────────────────────────────────────

interface SavedSession {
  id: string
  problem: string
  classification: Classification | null
  questions: FollowUpQuestion[]
  answers: Record<string, string>
  decision: DecisionResult | null
  workflow: WorkflowStep[]
  tracking: TrackingItem[]
  completedIds: string[]
  generatedDocument: GeneratedDocument | null
  strategyResult: StrategyResult | null
  stage: ActionStage
  createdAt: string
}

// ─── Constants ───────────────────────────────────────

const EXAMPLE_PROBLEMS = [
  "My wife left me and took the children",
  "My employer hasn't paid my salary for 3 months",
  "My landlord is refusing to return my security deposit",
  "I bought a defective product and the company won't refund",
  "Someone is sending me threatening messages online",
  "I had a road accident and need to file an insurance claim",
]

const ACTION_ICONS: Record<string, any> = {
  document: FileText, visit: MapPin, online: Globe, lawyer: Briefcase, call: Phone,
}

const ACTION_COLORS: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  document: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", accent: "bg-blue-500" },
  visit: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", accent: "bg-orange-500" },
  online: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", accent: "bg-purple-500" },
  lawyer: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", accent: "bg-emerald-500" },
  call: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", accent: "bg-red-500" },
}

const URGENCY_STYLES: Record<string, string> = {
  high: "bg-red-100 text-red-800 border-red-300",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
  low: "bg-green-100 text-green-800 border-green-300",
}

const fadeUp: any = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

// ─── Session History Sidebar ─────────────────────────

function SessionSidebar({
  sessions,
  currentId,
  onSelect,
  onDelete,
  onNew,
  isOpen,
  onToggle,
}: {
  sessions: SavedSession[]
  currentId: string | null
  onSelect: (s: SavedSession) => void
  onDelete: (id: string) => void
  onNew: () => void
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <>
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="fixed top-24 left-4 z-40 w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors lg:hidden"
      >
        {isOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-20 left-0 bottom-0 w-72 bg-white border-r border-slate-200 z-30 flex flex-col shadow-xl lg:shadow-none lg:static lg:top-auto lg:left-auto"
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#0F3D3E] flex items-center gap-2">
                <History className="h-4 w-4" /> Case History
              </h3>
              <Button size="sm" variant="ghost" onClick={onNew} className="h-8 w-8 p-0 hover:bg-[#F5EEDC]">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {sessions.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  <History className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  No previous cases
                </div>
              ) : (
                sessions.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => onSelect(s)}
                    className={`group p-3 rounded-lg cursor-pointer transition-all text-left w-full ${
                      currentId === s.id
                        ? "bg-[#0F3D3E] text-white"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <p className={`text-xs font-medium line-clamp-2 leading-tight ${currentId === s.id ? "text-white" : ""}`}>
                      {s.problem}
                    </p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className={`text-[10px] ${currentId === s.id ? "text-white/60" : "text-slate-400"}`}>
                        {new Date(s.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(s.id) }}
                        className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded ${
                          currentId === s.id ? "hover:bg-white/10" : "hover:bg-red-50"
                        }`}
                      >
                        <Trash2 className={`h-3 w-3 ${currentId === s.id ? "text-white/70" : "text-red-400"}`} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Compact Problem Bar (shown after submission) ────

function ProblemBar({ problem, onReset }: { problem: string; onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-[#C8AD7F]/20 px-6 py-3 flex items-center gap-4 sticky top-0 z-50 shadow-sm"
    >
      <div className="w-8 h-8 rounded-lg bg-[#0F3D3E] flex items-center justify-center shrink-0">
        <Scale className="h-4 w-4 text-[#C8AD7F]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-400 font-medium">Your Legal Problem</p>
        <p className="text-sm font-semibold text-[#2E2E2E] truncate">{problem}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={onReset} className="shrink-0 text-slate-500 hover:text-red-500 gap-1.5 text-xs">
        <RotateCcw className="h-3.5 w-3.5" /> New Case
      </Button>
    </motion.div>
  )
}

// ─── Classification Card ─────────────────────────────

function ClassificationCard({ classification }: { classification: Classification }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible">
      <Card className="bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-[#0F3D3E] px-5 py-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#F5EEDC] flex items-center gap-2">
            <Shield className="h-4 w-4" /> Classification
          </h3>
          <Badge className={`${URGENCY_STYLES[classification.urgency]} text-[10px] font-bold uppercase border`}>
            {classification.urgency === "high" && <AlertTriangle className="h-3 w-3 mr-1" />}
            {classification.urgency}
          </Badge>
        </div>
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs px-2.5 py-0.5 border-[#0F3D3E] text-[#0F3D3E] font-semibold">
              <Scale className="h-3 w-3 mr-1" /> {classification.category}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {classification.possible_issues.map((issue, i) => (
              <Badge key={i} variant="secondary" className="bg-[#F5EEDC] text-[#2E2E2E] border border-[#C8AD7F]/20 text-[10px]">
                {issue}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-lg p-3">{classification.summary}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ─── Questions Form ──────────────────────────────────

function QuestionsForm({
  questions, answers, onAnswerChange, onSubmit, isLoading,
}: {
  questions: FollowUpQuestion[]
  answers: Record<string, string>
  onAnswerChange: (id: string, value: string) => void
  onSubmit: () => void
  isLoading: boolean
}) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible">
      <Card className="bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-sm font-bold text-[#0F3D3E] flex items-center gap-2">
            <Users className="h-4 w-4" /> Tell us more
          </h3>
        </div>
        <CardContent className="p-5 space-y-4">
          {questions.map((q, idx) => (
            <div key={q.id} className="space-y-1.5">
              <label className="text-sm font-medium text-[#2E2E2E] flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0F3D3E] text-white flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0">{idx + 1}</span>
                <span>{q.question}{q.required && <span className="text-red-500 ml-0.5">*</span>}</span>
              </label>
              {q.type === "text" && (
                <Input value={answers[q.id] || ""} onChange={(e) => onAnswerChange(q.id, e.target.value)} placeholder="Type your answer..." className="ml-7 border-slate-200 text-sm" />
              )}
              {q.type === "select" && q.options && (
                <div className="ml-7 flex flex-wrap gap-1.5">
                  {q.options.map((opt) => (
                    <Button key={opt} size="sm" variant={answers[q.id] === opt ? "default" : "outline"} onClick={() => onAnswerChange(q.id, opt)}
                      className={`rounded-full text-xs h-7 ${answers[q.id] === opt ? "bg-[#0F3D3E] text-white" : "border-slate-200 text-slate-600"}`}>
                      {opt}
                    </Button>
                  ))}
                </div>
              )}
              {q.type === "boolean" && (
                <div className="ml-7 flex gap-1.5">
                  {["Yes", "No"].map((opt) => (
                    <Button key={opt} size="sm" variant={answers[q.id] === opt ? "default" : "outline"} onClick={() => onAnswerChange(q.id, opt)}
                      className={`rounded-full text-xs h-7 px-5 ${answers[q.id] === opt ? "bg-[#0F3D3E] text-white" : "border-slate-200 text-slate-600"}`}>
                      {opt}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="pt-3 flex justify-end">
            <Button onClick={onSubmit} disabled={isLoading}
              className="bg-[#0F3D3E] hover:bg-[#0F3D3E]/90 text-[#F5EEDC] h-10 px-6 rounded-xl gap-2 text-sm">
              {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Building Plan...</> : <><Zap className="h-4 w-4" /> Generate Action Plan</>}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ─── Decision Engine ─────────────────────────────────

function DecisionEngine({ decision, selectedOption, onSelect }: {
  decision: DecisionResult; selectedOption: string | null; onSelect: (name: string) => void
}) {
  const [expanded, setExpanded] = useState<string | null>(null)
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-3">
      <h3 className="text-base font-bold text-[#0F3D3E] flex items-center gap-2">
        <Scale className="h-4 w-4" /> Legal Options
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {decision.options.map((opt) => {
          const isRecommended = opt.name === decision.recommended
          const isSelected = selectedOption === opt.name
          return (
            <Card key={opt.name} onClick={() => onSelect(opt.name)}
              className={`cursor-pointer transition-all bg-white relative ${isSelected ? "border-2 border-[#0F3D3E] shadow-lg" : isRecommended ? "border-2 border-[#C8AD7F] shadow-md" : "border border-slate-200 hover:shadow-md"}`}>
              {isRecommended && (
                <div className="absolute -top-2.5 left-4">
                  <Badge className="bg-[#0F3D3E] text-[#F5EEDC] text-[9px] font-bold px-2 py-0.5 shadow-sm">
                    <Star className="h-2.5 w-2.5 fill-[#C8AD7F] text-[#C8AD7F] mr-1" /> RECOMMENDED
                  </Badge>
                </div>
              )}
              <CardContent className="p-4 pt-5">
                <div className="flex items-start gap-2.5 mb-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isSelected ? "bg-[#0F3D3E]" : "bg-slate-100"}`}>
                    {isSelected ? <CheckCircle2 className="h-3.5 w-3.5 text-white" /> : <CircleDot className="h-3.5 w-3.5 text-slate-400" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2E2E2E] text-sm">{opt.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{opt.description}</p>
                  </div>
                </div>
                <div className="flex gap-3 text-[10px] text-slate-400 mb-2 ml-8">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{opt.estimated_time}</span>
                  <span>💰 {opt.estimated_cost}</span>
                </div>
                <Button variant="ghost" size="sm"
                  onClick={(e) => { e.stopPropagation(); setExpanded(expanded === opt.name ? null : opt.name) }}
                  className="text-[10px] text-[#0F3D3E] w-full justify-center gap-1 h-7">
                  {expanded === opt.name ? "Hide" : "Details"}
                  {expanded === opt.name ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </Button>
                <AnimatePresence>
                  {expanded === opt.name && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="pt-2 border-t border-slate-100 mt-2 space-y-2">
                        {opt.pros?.length > 0 && <div><p className="text-[10px] font-semibold text-green-700">✅ Pros</p>
                          <ul className="text-[10px] text-slate-600 space-y-0.5">{opt.pros.map((p, i) => <li key={i}>• {p}</li>)}</ul></div>}
                        {opt.cons?.length > 0 && <div><p className="text-[10px] font-semibold text-red-700">⚠️ Cons</p>
                          <ul className="text-[10px] text-slate-600 space-y-0.5">{opt.cons.map((c, i) => <li key={i}>• {c}</li>)}</ul></div>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          )
        })}
      </div>
      <div className="bg-[#F5EEDC] border border-[#C8AD7F]/20 rounded-xl p-3 flex items-start gap-2.5">
        <Sparkles className="h-4 w-4 text-[#C8AD7F] shrink-0 mt-0.5" />
        <div><p className="text-[10px] font-semibold text-[#0F3D3E] uppercase mb-0.5">AI Recommendation</p>
          <p className="text-xs text-[#2E2E2E] leading-relaxed">{decision.reason}</p></div>
      </div>
    </motion.div>
  )
}

// ─── Horizontal Workflow Cards ───────────────────────

function WorkflowCards({ workflow, onGenerateDocument, isGenerating }: {
  workflow: WorkflowStep[]
  onGenerateDocument: (docType: string, context: string) => void
  isGenerating: boolean
}) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-3">
      <h3 className="text-base font-bold text-[#0F3D3E] flex items-center gap-2">
        <Gavel className="h-4 w-4" /> Step-by-Step Action Plan
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {workflow.map((step) => {
          const ActionIcon = ACTION_ICONS[step.action_type] || FileText
          const colors = ACTION_COLORS[step.action_type] || ACTION_COLORS.document
          return (
            <motion.div key={step.step} variants={fadeUp}>
              <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all h-full flex flex-col overflow-hidden">
                {/* Colored top accent */}
                <div className={`h-1 ${colors.accent}`} />
                <CardContent className="p-4 flex-1 flex flex-col">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}>
                      <ActionIcon className={`h-4 w-4 ${colors.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400">STEP {step.step}</span>
                        <Badge variant="outline" className={`text-[8px] ${colors.text} ${colors.border} border px-1 py-0`}>{step.action_type}</Badge>
                      </div>
                      <h4 className="font-bold text-[#2E2E2E] text-sm leading-tight truncate">{step.title}</h4>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-500 leading-relaxed mb-3 flex-1">{step.description}</p>

                  {/* Time + Docs */}
                  <div className="space-y-2 mt-auto">
                    {step.time_estimate && (
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {step.time_estimate}
                      </span>
                    )}
                    {step.required_documents?.length > 0 && (
                      <div className="bg-amber-50 rounded-lg p-2.5 border border-amber-200 mt-2 flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-amber-800 uppercase flex items-center gap-1">
                           <FileText className="h-3 w-3" /> Documents to Collect:
                        </span>
                        <div className="flex flex-wrap gap-1.5 mt-0.5">
                          {step.required_documents.map((doc, i) => (
                            <Badge key={i} variant="secondary" className="bg-white text-slate-700 text-[10px] font-semibold border-amber-300 shadow-sm px-2 py-0.5">
                              {doc}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CTA */}
                    {step.action_type === "document" && (
                      <Button size="sm" onClick={() => onGenerateDocument(step.cta, step.description)} disabled={isGenerating}
                        className="w-full bg-[#0F3D3E] hover:bg-[#0F3D3E]/90 text-[#F5EEDC] text-xs h-8 rounded-lg gap-1.5">
                        {isGenerating ? <Loader2 className="h-3 w-3 animate-spin" /> : <FileText className="h-3 w-3" />} {step.cta}
                      </Button>
                    )}
                    {step.action_type === "visit" && (
                      <a href={`https://www.google.com/maps/search/${encodeURIComponent(step.cta)}`} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline" className={`w-full ${colors.border} ${colors.text} text-xs h-8 rounded-lg gap-1.5`}>
                          <MapPin className="h-3 w-3" /> {step.cta} <ExternalLink className="h-2.5 w-2.5" />
                        </Button>
                      </a>
                    )}
                    {step.action_type === "lawyer" && (
                      <a href="/lawyers">
                        <Button size="sm" variant="outline" className={`w-full ${colors.border} ${colors.text} text-xs h-8 rounded-lg gap-1.5`}>
                          <Briefcase className="h-3 w-3" /> {step.cta}
                        </Button>
                      </a>
                    )}
                    {step.action_type === "online" && (
                      <Button size="sm" variant="outline" className={`w-full ${colors.border} ${colors.text} text-xs h-8 rounded-lg gap-1.5`}>
                        <Globe className="h-3 w-3" /> {step.cta}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

// ─── Document Preview ────────────────────────────────

function DocumentPreview({ document: doc }: { document: GeneratedDocument }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => { navigator.clipboard.writeText(doc.content); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const handleDownload = () => {
    const blob = new Blob([doc.content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = window.document.createElement("a"); a.href = url
    a.download = `${doc.document_type.replace(/\s+/g, "_").toLowerCase()}_${new Date().toISOString().slice(0, 10)}.txt`
    a.click(); URL.revokeObjectURL(url)
  }
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible">
      <Card className="bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-[#0F3D3E] px-5 py-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#F5EEDC] flex items-center gap-2"><FileCheck className="h-4 w-4" /> {doc.document_type}</h3>
          <div className="flex gap-1.5">
            <Button size="sm" variant="ghost" onClick={handleCopy} className="text-[#F5EEDC] hover:bg-white/10 gap-1 h-7 text-xs">
              {copied ? <CheckCircle2 className="h-3 w-3" /> : <Copy className="h-3 w-3" />} {copied ? "Copied" : "Copy"}
            </Button>
            <Button size="sm" variant="ghost" onClick={handleDownload} className="text-[#F5EEDC] hover:bg-white/10 gap-1 h-7 text-xs">
              <Download className="h-3 w-3" /> Download
            </Button>
          </div>
        </div>
        <pre className="p-5 text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto">{doc.content}</pre>
        {doc.instructions && (
          <div className="p-5 bg-yellow-50 border-t border-yellow-100">
            <h4 className="font-bold text-yellow-800 text-xs flex items-center gap-1.5 mb-1"><AlertTriangle className="h-3.5 w-3.5" /> Filing Instructions</h4>
            <p className="text-xs text-yellow-800 leading-relaxed whitespace-pre-wrap">{doc.instructions}</p>
          </div>
        )}
      </Card>
    </motion.div>
  )
}

// ─── Progress Tracker ────────────────────────────────

function ProgressTracker({ tracking, completedIds, onToggle }: {
  tracking: TrackingItem[]; completedIds: Set<string>; onToggle: (id: string) => void
}) {
  const done = completedIds.size
  const total = tracking.length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-[#0F3D3E] flex items-center gap-2"><FileCheck className="h-4 w-4" /> Progress</h3>
        <Badge variant="outline" className="border-[#0F3D3E] text-[#0F3D3E] font-bold text-xs">{done}/{total}</Badge>
      </div>
      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Progress value={pct} className="flex-1 h-2 bg-slate-100" />
            <span className="text-xs font-bold text-[#0F3D3E] w-10 text-right">{pct}%</span>
          </div>
          <div className="space-y-1.5">
            {tracking.map((item) => {
              const isDone = completedIds.has(item.id)
              return (
                <motion.div key={item.id} onClick={() => onToggle(item.id)} whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer transition-all ${isDone ? "bg-green-50 border border-green-100" : "bg-slate-50 border border-slate-100 hover:bg-slate-100"}`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isDone ? "bg-[#0F3D3E] border-[#0F3D3E]" : "bg-white border-slate-300"}`}>
                    {isDone && <CheckCircle2 className="h-3 w-3 text-white" />}
                  </div>
                  <p className={`text-xs font-medium flex-1 ${isDone ? "text-green-800 line-through" : "text-[#2E2E2E]"}`}>{item.task}</p>
                  <span className="text-[9px] text-slate-400">Step {item.step_number}</span>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ─── Loading Spinner ─────────────────────────────────

function LoadingState({ message, sub }: { message: string; sub: string }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
      <div className="relative">
        <Loader2 className="h-10 w-10 text-[#0F3D3E] animate-spin" />
        <motion.div className="absolute inset-0 rounded-full border-2 border-[#C8AD7F]/30"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
      </div>
      <p className="mt-4 text-base font-semibold text-[#0F3D3E]">{message}</p>
      <p className="text-xs text-slate-500 mt-1">{sub}</p>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════

export default function LegalActionEngine() {
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()

  // Auth guard
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in?redirect_url=/legal-action")
    }
  }, [isLoaded, isSignedIn, router])

  // Core state
  const [stage, setStage] = useState<ActionStage>("input")
  const [problem, setProblem] = useState("")
  const [classification, setClassification] = useState<Classification | null>(null)
  const [questions, setQuestions] = useState<FollowUpQuestion[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [decision, setDecision] = useState<DecisionResult | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [workflow, setWorkflow] = useState<WorkflowStep[]>([])
  const [tracking, setTracking] = useState<TrackingItem[]>([])
  const [generatedDocument, setGeneratedDocument] = useState<GeneratedDocument | null>(null)
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)

  // Session state
  const [sessions, setSessions] = useState<SavedSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const contentRef = useRef<HTMLDivElement>(null)

  // Load sessions from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("nyaaya_legal_sessions")
      if (saved) setSessions(JSON.parse(saved))
    } catch {}
  }, [])

  // Save sessions to localStorage
  const persistSessions = useCallback((updated: SavedSession[]) => {
    setSessions(updated)
    localStorage.setItem("nyaaya_legal_sessions", JSON.stringify(updated))
  }, [])

  // Save current state as a session
  const saveCurrentSession = useCallback(() => {
    if (!problem.trim() || stage === "input") return

    const session: SavedSession = {
      id: currentSessionId || crypto.randomUUID(),
      problem, classification, questions, answers,
      decision, workflow, tracking,
      completedIds: [...completedIds],
      generatedDocument, strategyResult: null,
      stage, createdAt: new Date().toISOString(),
    }

    const existingIdx = sessions.findIndex((s) => s.id === session.id)
    let updated: SavedSession[]
    if (existingIdx >= 0) {
      updated = [...sessions]; updated[existingIdx] = session
    } else {
      updated = [session, ...sessions]
    }
    setCurrentSessionId(session.id)
    persistSessions(updated.slice(0, 20)) // Keep last 20
  }, [problem, classification, questions, answers, decision, workflow, tracking, completedIds, generatedDocument, stage, currentSessionId, sessions, persistSessions])

  // Auto-save whenever results are ready
  useEffect(() => {
    if (stage === "results" || stage === "document_ready") {
      saveCurrentSession()
    }
  }, [stage, saveCurrentSession])

  // Load a saved session
  const loadSession = (session: SavedSession) => {
    setProblem(session.problem)
    setClassification(session.classification)
    setQuestions(session.questions)
    setAnswers(session.answers)
    setDecision(session.decision)
    setWorkflow(session.workflow)
    setTracking(session.tracking)
    setCompletedIds(new Set(session.completedIds))
    setGeneratedDocument(session.generatedDocument)
    setStage(session.stage)
    setCurrentSessionId(session.id)
    setError(null)
  }

  const deleteSession = (id: string) => {
    const updated = sessions.filter((s) => s.id !== id)
    persistSessions(updated)
    if (currentSessionId === id) handleReset()
  }

  // Auto-scroll on stage change
  useEffect(() => {
    if (stage !== "input") {
      setTimeout(() => contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200)
    }
  }, [stage])

  // ─── API Calls ───────────────────────────────
  const handleClassify = async () => {
    if (!problem.trim()) return
    setError(null); setStage("classifying")
    try {
      const res = await fetch("/api/legal-action", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "classify", data: { problem } }),
      })
      if (!res.ok) throw new Error("Classification failed")
      const data = await res.json()
      if (data.classification) {
        setClassification(data.classification); setQuestions(data.questions || []); setStage("classified")
      } else if (data.error) { throw new Error(data.error) }
      else { setClassification(data); setQuestions(data.questions || []); setStage("classified") }
    } catch (err: any) {
      setError(err.message || "Failed to classify. Please try again."); setStage("input")
    }
  }

  const handleAnalyze = async () => {
    setError(null); setStage("analyzing")
    const namedAnswers: Record<string, string> = {}
    questions.forEach((q) => { if (answers[q.id]) namedAnswers[q.question] = answers[q.id] })
    try {
      const res = await fetch("/api/legal-action", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "analyze", data: { problem, classification, answers: namedAnswers } }),
      })
      if (!res.ok) throw new Error("Analysis failed")
      const data = await res.json()
      if (data.decision) {
        setDecision(data.decision); setWorkflow(data.workflow || []); setTracking(data.tracking || [])
        setSelectedOption(data.decision.recommended); setStage("results")
      } else if (data.error) { throw new Error(data.error) }
    } catch (err: any) {
      setError(err.message || "Failed to generate action plan."); setStage("classified")
    }
  }

  const handleGenerateDocument = async (docType: string, context: string) => {
    setStage("generating_doc")
    const namedAnswers: Record<string, string> = {}
    questions.forEach((q) => { if (answers[q.id]) namedAnswers[q.question] = answers[q.id] })
    try {
      const res = await fetch("/api/legal-action", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate_document", data: { problem, classification, answers: namedAnswers, documentType: docType, workflowContext: context } }),
      })
      if (!res.ok) throw new Error("Document generation failed")
      const data = await res.json()
      if (data.document) { setGeneratedDocument(data.document); setStage("document_ready") }
    } catch (err: any) {
      setError(err.message || "Failed to generate document."); setStage("results")
    }
  }

  const handleToggleTracking = (id: string) => {
    setCompletedIds((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next })
  }

  const handleReset = () => {
    setStage("input"); setProblem(""); setClassification(null); setQuestions([]); setAnswers({})
    setDecision(null); setSelectedOption(null); setWorkflow([]); setTracking([])
    setGeneratedDocument(null); setCompletedIds(new Set()); setError(null); setCurrentSessionId(null)
  }

  // Auth loading
  if (!isLoaded) return <div className="h-full w-full bg-[#F5EEDC] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#0F3D3E]" /></div>
  if (!isSignedIn) return null

  const showInputView = stage === "input"

  // ─── RENDER ──────────────────────────────────
  return (
    <div className="h-full w-full bg-[#F5EEDC] flex overflow-hidden">
      {/* Session History Sidebar */}
      <SessionSidebar
        sessions={sessions} currentId={currentSessionId}
        onSelect={loadSession} onDelete={deleteSession} onNew={handleReset}
        isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto relative">
        {/* Problem Bar (shown after submission) */}
        {!showInputView && <ProblemBar problem={problem} onReset={handleReset} />}

        {/* Input View */}
        {showInputView && (
          <div className="flex-1 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#0F3D3E] flex items-center justify-center mx-auto mb-5">
                  <Scale className="h-8 w-8 text-[#C8AD7F]" />
                </div>
                <h1 className="text-3xl font-bold text-[#2E2E2E] mb-2">Take Legal Action</h1>
                <p className="text-slate-500 text-sm max-w-md mx-auto">
                  Describe your legal problem in plain language. We'll build a complete action plan with documents and tracking.
                </p>
              </div>

              <Card className="bg-white border border-slate-200 shadow-lg">
                <CardContent className="p-6">
                  <Textarea value={problem} onChange={(e) => setProblem(e.target.value)}
                    placeholder="e.g., 'My employer hasn't paid my salary for 3 months and is threatening to fire me'"
                    className="min-h-[100px] resize-none border-slate-200 text-sm focus-visible:ring-[#0F3D3E] mb-4" />
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {EXAMPLE_PROBLEMS.slice(0, 2).map((ex) => (
                        <Button key={ex} variant="ghost" size="sm" onClick={() => setProblem(ex)}
                          className="text-[10px] text-slate-400 hover:text-[#0F3D3E] h-6 px-2 rounded-full border border-slate-100">
                          {ex.length > 35 ? ex.slice(0, 35) + "..." : ex}
                        </Button>
                      ))}
                    </div>
                    <Button onClick={handleClassify} disabled={!problem.trim()}
                      className="bg-[#0F3D3E] hover:bg-[#0F3D3E]/90 text-[#F5EEDC] h-10 px-6 rounded-xl text-sm font-semibold gap-2">
                      <Sparkles className="h-4 w-4" /> Analyze
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Results Content */}
        {!showInputView && (
          <div ref={contentRef} className="flex-1 p-6 max-w-5xl mx-auto w-full space-y-6">
            {/* Loading: Classifying */}
            {stage === "classifying" && <LoadingState message="Analyzing your legal problem..." sub="Identifying category, issues, and urgency" />}

            {/* Error */}
            {error && (
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-4 flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
                  <div className="flex-1"><p className="font-semibold text-red-800 text-sm">Error</p><p className="text-xs text-red-700">{error}</p></div>
                  <Button size="sm" variant="outline" onClick={() => { setError(null); setStage("input") }} className="border-red-300 text-red-700 text-xs">Retry</Button>
                </CardContent>
              </Card>
            )}

            {/* Classification */}
            {classification && stage !== "classifying" && <ClassificationCard classification={classification} />}

            {/* Follow-up Questions */}
            {(stage === "classified" || stage === "answering" || stage === "analyzing") && questions.length > 0 && (
              <QuestionsForm questions={questions} answers={answers}
                onAnswerChange={(id, val) => setAnswers((prev) => ({ ...prev, [id]: val }))}
                onSubmit={handleAnalyze} isLoading={stage === "analyzing"} />
            )}

            {/* Loading: Analyzing */}
            {stage === "analyzing" && <LoadingState message="Building your legal action plan..." sub="Generating options, workflow, and documents" />}

            {/* Decision Engine */}
            {decision && (stage === "results" || stage === "generating_doc" || stage === "document_ready") && (
              <DecisionEngine decision={decision} selectedOption={selectedOption} onSelect={setSelectedOption} />
            )}

            {/* Workflow Cards (HORIZONTAL) */}
            {workflow.length > 0 && (stage === "results" || stage === "generating_doc" || stage === "document_ready") && (
              <WorkflowCards workflow={workflow} onGenerateDocument={handleGenerateDocument} isGenerating={stage === "generating_doc"} />
            )}

            {/* Document Loading */}
            {stage === "generating_doc" && (
              <div className="flex items-center gap-3 bg-blue-50 rounded-xl p-3 border border-blue-100">
                <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                <p className="text-xs font-medium text-blue-700">Drafting your legal document...</p>
              </div>
            )}

            {/* Generated Document */}
            {generatedDocument && stage === "document_ready" && <DocumentPreview document={generatedDocument} />}

            {/* Progress Tracker */}
            {tracking.length > 0 && (stage === "results" || stage === "generating_doc" || stage === "document_ready") && (
              <ProgressTracker tracking={tracking} completedIds={completedIds} onToggle={handleToggleTracking} />
            )}

            {/* Disclaimer */}
            {(stage === "results" || stage === "document_ready") && (
              <motion.div variants={fadeUp} initial="hidden" animate="visible"
                className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 flex items-start gap-2.5 text-xs">
                <Scale className="h-4 w-4 text-yellow-700 shrink-0 mt-0.5" />
                <div className="text-yellow-800">
                  <p className="font-semibold mb-0.5">Disclaimer</p>
                  <p className="text-[11px] leading-relaxed">
                    This AI-generated action plan provides general legal guidance based on Indian law.
                    Always consult a qualified lawyer for serious matters.
                    <a href="/lawyers" className="underline font-medium ml-1">Find a verified lawyer →</a>
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
