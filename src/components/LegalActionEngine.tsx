"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Scale, FileText, MapPin, Globe, Phone, Briefcase,
  ChevronRight, ChevronDown, ChevronUp, AlertTriangle,
  CheckCircle2, Clock, Download, Copy, Star,
  ArrowRight, Loader2, Sparkles, Shield, Zap,
  CircleDot, FileCheck, Users, Gavel, Target, RotateCcw,
} from "lucide-react"
import type {
  Classification, FollowUpQuestion, LegalOption,
  DecisionResult, WorkflowStep, GeneratedDocument,
  TrackingItem, ActionStage,
} from "@/types/legalAction"

// ─── Constants ───────────────────────────────────────
const STEP_LABELS = [
  { num: 1, label: "Describe Problem", icon: Target },
  { num: 2, label: "Classification", icon: Shield },
  { num: 3, label: "Follow-up Info", icon: Users },
  { num: 4, label: "Legal Options", icon: Scale },
  { num: 5, label: "Action Plan", icon: Gavel },
  { num: 6, label: "Documents & Track", icon: FileCheck },
]

const EXAMPLE_PROBLEMS = [
  "My wife left me and took the children",
  "My employer hasn't paid my salary for 3 months",
  "My landlord is refusing to return my security deposit",
  "I bought a defective product and the company won't refund",
  "Someone is sending me threatening messages online",
  "I had a road accident and need to file an insurance claim",
]

const ACTION_ICONS: Record<string, any> = {
  document: FileText,
  visit: MapPin,
  online: Globe,
  lawyer: Briefcase,
  call: Phone,
}

const ACTION_COLORS: Record<string, string> = {
  document: "bg-blue-100 text-blue-700 border-blue-200",
  visit: "bg-orange-100 text-orange-700 border-orange-200",
  online: "bg-purple-100 text-purple-700 border-purple-200",
  lawyer: "bg-emerald-100 text-emerald-700 border-emerald-200",
  call: "bg-red-100 text-red-700 border-red-200",
}

const URGENCY_STYLES: Record<string, string> = {
  high: "bg-red-100 text-red-800 border-red-300",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
  low: "bg-green-100 text-green-800 border-green-300",
}

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

const staggerChildren = {
  visible: { transition: { staggerChildren: 0.08 } },
}

// ─── Sub-Components ──────────────────────────────────

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="hidden lg:flex flex-col gap-0 w-56 shrink-0">
      {STEP_LABELS.map((step, idx) => {
        const Icon = step.icon
        const isActive = currentStep === step.num
        const isCompleted = currentStep > step.num
        const isFuture = currentStep < step.num
        return (
          <div key={step.num} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <motion.div
                animate={{
                  scale: isActive ? 1.15 : 1,
                  backgroundColor: isCompleted ? "#0F3D3E" : isActive ? "#0F3D3E" : "#e2e8f0",
                }}
                className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                  isCompleted || isActive ? "border-[#0F3D3E]" : "border-slate-300"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-white" />
                ) : (
                  <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                )}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-[#C8AD7F]"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>
              {idx < STEP_LABELS.length - 1 && (
                <div className={`w-0.5 h-12 ${isCompleted ? "bg-[#0F3D3E]" : "bg-slate-200"} transition-colors`} />
              )}
            </div>
            <div className="pt-2">
              <p className={`text-sm font-medium leading-tight ${isActive ? "text-[#0F3D3E]" : isCompleted ? "text-[#0F3D3E]/70" : "text-slate-400"}`}>
                {step.label}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function MobileStepBar({ currentStep }: { currentStep: number }) {
  const progress = ((currentStep - 1) / (STEP_LABELS.length - 1)) * 100
  return (
    <div className="lg:hidden mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-[#0F3D3E]">
          Step {currentStep} of {STEP_LABELS.length}
        </span>
        <span className="text-xs text-slate-500">{STEP_LABELS[currentStep - 1]?.label}</span>
      </div>
      <Progress value={progress} className="h-2 bg-slate-200" />
    </div>
  )
}

function ClassificationCard({ classification }: { classification: Classification }) {
  return (
    <motion.div variants={fadeUpVariant} initial="hidden" animate="visible">
      <Card className="border-2 border-[#C8AD7F]/40 bg-white overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-[#0F3D3E] to-[#0F3D3E]/80 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#F5EEDC] flex items-center gap-2">
              <Shield className="h-5 w-5" /> Problem Classification
            </h3>
            <Badge className={`${URGENCY_STYLES[classification.urgency]} text-xs font-bold uppercase border`}>
              {classification.urgency === "high" && <AlertTriangle className="h-3 w-3 mr-1" />}
              {classification.urgency} urgency
            </Badge>
          </div>
        </div>
        <CardContent className="p-6 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Legal Category</p>
            <Badge variant="outline" className="text-sm px-3 py-1 border-[#0F3D3E] text-[#0F3D3E] font-semibold">
              <Scale className="h-3.5 w-3.5 mr-1.5" />
              {classification.category}
            </Badge>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">Possible Legal Issues</p>
            <div className="flex flex-wrap gap-2">
              {classification.possible_issues.map((issue, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <Badge variant="secondary" className="bg-[#F5EEDC] text-[#2E2E2E] border border-[#C8AD7F]/30 text-xs">
                    {issue}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
            <p className="text-sm text-slate-700 leading-relaxed">{classification.summary}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function QuestionsForm({
  questions,
  answers,
  onAnswerChange,
  onSubmit,
  isLoading,
}: {
  questions: FollowUpQuestion[]
  answers: Record<string, string>
  onAnswerChange: (id: string, value: string) => void
  onSubmit: () => void
  isLoading: boolean
}) {
  return (
    <motion.div variants={fadeUpVariant} initial="hidden" animate="visible">
      <Card className="border-2 border-[#C8AD7F]/40 bg-white overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-[#C8AD7F]/20 to-[#C8AD7F]/5 px-6 py-4 border-b border-[#C8AD7F]/20">
          <h3 className="text-lg font-bold text-[#0F3D3E] flex items-center gap-2">
            <Users className="h-5 w-5" /> We need a few more details
          </h3>
          <p className="text-sm text-slate-600 mt-1">Answer these questions so we can build your precise action plan.</p>
        </div>
        <CardContent className="p-6">
          <motion.div className="space-y-5" variants={staggerChildren} initial="hidden" animate="visible">
            {questions.map((q, idx) => (
              <motion.div key={q.id} variants={fadeUpVariant} className="space-y-2">
                <label className="text-sm font-semibold text-[#2E2E2E] flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0F3D3E] text-white flex items-center justify-center text-xs font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  <span>
                    {q.question}
                    {q.required && <span className="text-red-500 ml-1">*</span>}
                  </span>
                </label>
                {q.type === "text" && (
                  <Input
                    value={answers[q.id] || ""}
                    onChange={(e) => onAnswerChange(q.id, e.target.value)}
                    placeholder="Type your answer..."
                    className="ml-8 border-slate-300 focus-visible:ring-[#0F3D3E]"
                  />
                )}
                {q.type === "select" && q.options && (
                  <div className="ml-8 flex flex-wrap gap-2">
                    {q.options.map((opt) => (
                      <Button
                        key={opt}
                        size="sm"
                        variant={answers[q.id] === opt ? "default" : "outline"}
                        onClick={() => onAnswerChange(q.id, opt)}
                        className={`rounded-full text-xs transition-all ${
                          answers[q.id] === opt
                            ? "bg-[#0F3D3E] text-white hover:bg-[#0F3D3E]/90"
                            : "border-slate-300 text-slate-600 hover:border-[#0F3D3E] hover:text-[#0F3D3E]"
                        }`}
                      >
                        {opt}
                      </Button>
                    ))}
                  </div>
                )}
                {q.type === "boolean" && (
                  <div className="ml-8 flex gap-2">
                    {["Yes", "No"].map((opt) => (
                      <Button
                        key={opt}
                        size="sm"
                        variant={answers[q.id] === opt ? "default" : "outline"}
                        onClick={() => onAnswerChange(q.id, opt)}
                        className={`rounded-full px-6 text-xs ${
                          answers[q.id] === opt
                            ? "bg-[#0F3D3E] text-white hover:bg-[#0F3D3E]/90"
                            : "border-slate-300 text-slate-600"
                        }`}
                      >
                        {opt}
                      </Button>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
          <div className="mt-8 flex justify-end">
            <Button
              onClick={onSubmit}
              disabled={isLoading}
              className="bg-[#0F3D3E] hover:bg-[#0F3D3E]/90 text-[#F5EEDC] px-8 h-12 text-base rounded-xl gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Building Your Action Plan...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5" /> Generate Legal Action Plan
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function DecisionEngine({
  decision,
  selectedOption,
  onSelect,
}: {
  decision: DecisionResult
  selectedOption: string | null
  onSelect: (name: string) => void
}) {
  const [expanded, setExpanded] = useState<string | null>(null)
  return (
    <motion.div variants={fadeUpVariant} initial="hidden" animate="visible" className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Scale className="h-5 w-5 text-[#0F3D3E]" />
        <h3 className="text-xl font-bold text-[#0F3D3E]">Your Legal Options</h3>
      </div>

      <motion.div className="grid gap-4 md:grid-cols-2" variants={staggerChildren} initial="hidden" animate="visible">
        {decision.options.map((opt) => {
          const isRecommended = opt.name === decision.recommended
          const isSelected = selectedOption === opt.name
          const isExpanded = expanded === opt.name
          return (
            <motion.div key={opt.name} variants={fadeUpVariant}>
              <Card
                onClick={() => onSelect(opt.name)}
                className={`cursor-pointer transition-all duration-300 relative overflow-hidden ${
                  isSelected
                    ? "border-2 border-[#0F3D3E] shadow-xl ring-2 ring-[#0F3D3E]/20"
                    : isRecommended
                    ? "border-2 border-[#C8AD7F] shadow-lg hover:shadow-xl"
                    : "border border-slate-200 hover:border-[#C8AD7F] hover:shadow-md"
                }`}
              >
                {isRecommended && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-[#0F3D3E] text-[#F5EEDC] text-[10px] font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
                      <Star className="h-3 w-3 fill-[#C8AD7F] text-[#C8AD7F]" /> RECOMMENDED
                    </div>
                  </div>
                )}
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isSelected ? "bg-[#0F3D3E]" : "bg-slate-100"}`}>
                      {isSelected ? (
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      ) : (
                        <CircleDot className="h-4 w-4 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[#2E2E2E] text-base">{opt.name}</h4>
                      <p className="text-sm text-slate-600 mt-1 leading-relaxed">{opt.description}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 text-xs mb-3">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="h-3 w-3" /> {opt.estimated_time}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      💰 {opt.estimated_cost}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); setExpanded(isExpanded ? null : opt.name) }}
                    className="text-xs text-[#0F3D3E] hover:bg-[#0F3D3E]/5 w-full justify-center gap-1"
                  >
                    {isExpanded ? "Hide" : "View"} Details
                    {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </Button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 border-t border-slate-100 mt-3 space-y-3">
                          {opt.pros?.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-green-700 mb-1">✅ Advantages</p>
                              <ul className="text-xs text-slate-600 space-y-1">
                                {opt.pros.map((p, i) => <li key={i} className="flex gap-1.5"><span className="text-green-500 shrink-0">•</span>{p}</li>)}
                              </ul>
                            </div>
                          )}
                          {opt.cons?.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-red-700 mb-1">⚠️ Disadvantages</p>
                              <ul className="text-xs text-slate-600 space-y-1">
                                {opt.cons.map((c, i) => <li key={i} className="flex gap-1.5"><span className="text-red-500 shrink-0">•</span>{c}</li>)}
                              </ul>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Reasoning */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-[#F5EEDC] border border-[#C8AD7F]/30 rounded-xl p-4 flex items-start gap-3"
      >
        <Sparkles className="h-5 w-5 text-[#C8AD7F] shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-[#0F3D3E] uppercase tracking-wide mb-1">AI Recommendation</p>
          <p className="text-sm text-[#2E2E2E] leading-relaxed">{decision.reason}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

function WorkflowTimeline({
  workflow,
  onGenerateDocument,
  isGenerating,
}: {
  workflow: WorkflowStep[]
  onGenerateDocument: (docType: string, context: string) => void
  isGenerating: boolean
}) {
  return (
    <motion.div variants={fadeUpVariant} initial="hidden" animate="visible" className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Gavel className="h-5 w-5 text-[#0F3D3E]" />
        <h3 className="text-xl font-bold text-[#0F3D3E]">Your Step-by-Step Action Plan</h3>
      </div>

      <motion.div className="space-y-0" variants={staggerChildren} initial="hidden" animate="visible">
        {workflow.map((step, idx) => {
          const ActionIcon = ACTION_ICONS[step.action_type] || FileText
          const colorClass = ACTION_COLORS[step.action_type] || ACTION_COLORS.document
          const isLast = idx === workflow.length - 1
          return (
            <motion.div key={step.step} variants={fadeUpVariant} className="flex gap-4">
              {/* Timeline connector */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 ${colorClass}`}>
                  <ActionIcon className="h-4 w-4" />
                </div>
                {!isLast && <div className="w-0.5 flex-1 min-h-[20px] bg-slate-200" />}
              </div>

              {/* Step content */}
              <Card className="flex-1 mb-4 border border-slate-200 hover:shadow-md transition-shadow overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-400 uppercase">Step {step.step}</span>
                        <Badge variant="outline" className={`text-[10px] ${colorClass} border`}>
                          {step.action_type}
                        </Badge>
                      </div>
                      <h4 className="font-bold text-[#2E2E2E] text-base">{step.title}</h4>
                    </div>
                    {step.time_estimate && (
                      <span className="text-xs text-slate-500 flex items-center gap-1 shrink-0 bg-slate-50 px-2 py-1 rounded-full">
                        <Clock className="h-3 w-3" /> {step.time_estimate}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed mb-3">{step.description}</p>

                  {step.details && (
                    <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg mb-3 italic">{step.details}</p>
                  )}

                  {step.required_documents && step.required_documents.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Required Documents</p>
                      <div className="flex flex-wrap gap-1.5">
                        {step.required_documents.map((doc, i) => (
                          <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-600 text-[10px] border border-slate-200">
                            📄 {doc}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {step.action_type === "document" && (
                    <Button
                      size="sm"
                      onClick={() => onGenerateDocument(step.cta, step.description)}
                      disabled={isGenerating}
                      className="bg-[#0F3D3E] hover:bg-[#0F3D3E]/90 text-[#F5EEDC] rounded-lg gap-2 mt-1"
                    >
                      {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                      {step.cta}
                    </Button>
                  )}
                  {step.action_type === "visit" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-orange-300 text-orange-700 hover:bg-orange-50 rounded-lg gap-2 mt-1"
                      asChild
                    >
                      <a href={`https://www.google.com/maps/search/${encodeURIComponent(step.cta)}`} target="_blank" rel="noopener noreferrer">
                        <MapPin className="h-4 w-4" /> {step.cta}
                      </a>
                    </Button>
                  )}
                  {step.action_type === "lawyer" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-lg gap-2 mt-1"
                      asChild
                    >
                      <a href="/lawyers">
                        <Briefcase className="h-4 w-4" /> {step.cta}
                      </a>
                    </Button>
                  )}
                  {step.action_type === "online" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-purple-300 text-purple-700 hover:bg-purple-50 rounded-lg gap-2 mt-1"
                    >
                      <Globe className="h-4 w-4" /> {step.cta}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}

function DocumentPreview({
  document,
  onClose,
}: {
  document: GeneratedDocument
  onClose: () => void
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(document.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([document.content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = window.document.createElement("a")
    a.href = url
    a.download = `${document.document_type.replace(/\s+/g, "_").toLowerCase()}_${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card className="border-2 border-[#0F3D3E]/30 bg-white overflow-hidden shadow-xl">
        <div className="bg-gradient-to-r from-[#0F3D3E] to-[#0F3D3E]/80 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#F5EEDC] flex items-center gap-2">
            <FileCheck className="h-5 w-5" /> {document.document_type}
          </h3>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopy}
              className="text-[#F5EEDC] hover:bg-white/10 gap-1"
            >
              {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDownload}
              className="text-[#F5EEDC] hover:bg-white/10 gap-1"
            >
              <Download className="h-4 w-4" /> Download
            </Button>
          </div>
        </div>
        <CardContent className="p-0">
          <pre className="p-6 text-sm text-slate-800 font-mono whitespace-pre-wrap leading-relaxed bg-white max-h-[500px] overflow-y-auto border-b border-slate-100">
            {document.content}
          </pre>
          {document.instructions && (
            <div className="p-6 bg-yellow-50 border-t border-yellow-100">
              <h4 className="font-bold text-yellow-800 text-sm flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4" /> Instructions for Filing
              </h4>
              <p className="text-sm text-yellow-800 leading-relaxed whitespace-pre-wrap">{document.instructions}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ProgressTracker({
  tracking,
  completedIds,
  onToggle,
}: {
  tracking: TrackingItem[]
  completedIds: Set<string>
  onToggle: (id: string) => void
}) {
  const total = tracking.length
  const done = completedIds.size
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <motion.div variants={fadeUpVariant} initial="hidden" animate="visible" className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-[#0F3D3E]" />
          <h3 className="text-xl font-bold text-[#0F3D3E]">Progress Tracker</h3>
        </div>
        <Badge variant="outline" className="border-[#0F3D3E] text-[#0F3D3E] font-bold text-sm px-3">
          {done}/{total}
        </Badge>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Progress value={pct} className="flex-1 h-3 bg-slate-100" />
          <span className="text-sm font-bold text-[#0F3D3E] w-12 text-right">{pct}%</span>
        </div>

        <div className="space-y-2">
          {tracking.map((item) => {
            const isDone = completedIds.has(item.id)
            return (
              <motion.div
                key={item.id}
                onClick={() => onToggle(item.id)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                  isDone ? "bg-green-50 border border-green-100" : "bg-slate-50 border border-slate-100 hover:bg-slate-100"
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  isDone ? "bg-[#0F3D3E] border-[#0F3D3E]" : "bg-white border-slate-300"
                }`}>
                  {isDone && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isDone ? "text-green-800 line-through" : "text-[#2E2E2E]"}`}>
                    {item.task}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Step {item.step_number}</p>
                </div>
                {isDone && (
                  <Badge className="bg-green-100 text-green-700 text-[10px] border-green-200 border">
                    Done
                  </Badge>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main Component ──────────────────────────────────

export default function LegalActionEngine() {
  // State
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

  const resultsRef = useRef<HTMLDivElement>(null)

  // Compute current step for the indicator
  const currentStep =
    stage === "input" ? 1 :
    stage === "classifying" ? 2 :
    stage === "classified" || stage === "answering" ? 3 :
    stage === "analyzing" ? 4 :
    stage === "results" ? 6 :
    stage === "generating_doc" || stage === "document_ready" ? 6 : 1

  // Load persisted tracking from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("nyaaya_legal_action_progress")
      if (saved) {
        setCompletedIds(new Set(JSON.parse(saved)))
      }
    } catch {}
  }, [])

  // Persist tracking
  useEffect(() => {
    if (completedIds.size > 0) {
      localStorage.setItem("nyaaya_legal_action_progress", JSON.stringify([...completedIds]))
    }
  }, [completedIds])

  // Auto-scroll when new sections appear
  useEffect(() => {
    if (stage !== "input") {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 300)
    }
  }, [stage])

  // API Calls
  const handleClassify = async () => {
    if (!problem.trim()) return
    setError(null)
    setStage("classifying")

    try {
      const res = await fetch("/api/legal-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "classify", data: { problem } }),
      })
      if (!res.ok) throw new Error("Classification failed")
      const data = await res.json()

      if (data.classification) {
        setClassification(data.classification)
        setQuestions(data.questions || [])
        setStage("classified")
      } else if (data.error) {
        throw new Error(data.error)
      } else {
        // Sometimes the LLM wraps differently
        setClassification(data)
        setQuestions(data.questions || [])
        setStage("classified")
      }
    } catch (err: any) {
      setError(err.message || "Failed to classify your problem. Please try again.")
      setStage("input")
    }
  }

  const handleAnalyze = async () => {
    setError(null)
    setStage("analyzing")

    // Build question-answer pairs using question text as keys
    const namedAnswers: Record<string, string> = {}
    questions.forEach((q) => {
      if (answers[q.id]) namedAnswers[q.question] = answers[q.id]
    })

    try {
      const res = await fetch("/api/legal-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "analyze",
          data: { problem, classification, answers: namedAnswers },
        }),
      })
      if (!res.ok) throw new Error("Analysis failed")
      const data = await res.json()

      if (data.decision) {
        setDecision(data.decision)
        setWorkflow(data.workflow || [])
        setTracking(data.tracking || [])
        setSelectedOption(data.decision.recommended)
        setStage("results")
      } else if (data.error) {
        throw new Error(data.error)
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate action plan. Please try again.")
      setStage("classified")
    }
  }

  const handleGenerateDocument = async (docType: string, context: string) => {
    setStage("generating_doc")

    const namedAnswers: Record<string, string> = {}
    questions.forEach((q) => {
      if (answers[q.id]) namedAnswers[q.question] = answers[q.id]
    })

    try {
      const res = await fetch("/api/legal-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate_document",
          data: {
            problem,
            classification,
            answers: namedAnswers,
            documentType: docType,
            workflowContext: context,
          },
        }),
      })
      if (!res.ok) throw new Error("Document generation failed")
      const data = await res.json()

      if (data.document) {
        setGeneratedDocument(data.document)
        setStage("document_ready")
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate document.")
      setStage("results")
    }
  }

  const handleToggleTracking = (id: string) => {
    setCompletedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleReset = () => {
    setStage("input")
    setProblem("")
    setClassification(null)
    setQuestions([])
    setAnswers({})
    setDecision(null)
    setSelectedOption(null)
    setWorkflow([])
    setTracking([])
    setGeneratedDocument(null)
    setCompletedIds(new Set())
    setError(null)
    localStorage.removeItem("nyaaya_legal_action_progress")
  }

  // ─── Render ──────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F5EEDC]">
      {/* Hero Input Section */}
      <section className="relative w-full bg-gradient-to-b from-[#0F3D3E] via-[#0F3D3E]/95 to-[#F5EEDC] pt-28 pb-16 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-20 left-[10%] text-white/5"
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <Scale className="w-24 h-24" />
          </motion.div>
          <motion.div
            className="absolute top-40 right-[15%] text-white/5"
            animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 7, repeat: Infinity, delay: 1 }}
          >
            <Gavel className="w-20 h-20" />
          </motion.div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-[#C8AD7F]/20 text-[#C8AD7F] border border-[#C8AD7F]/30 mb-6 text-sm px-4 py-1.5">
              <Zap className="h-3.5 w-3.5 mr-1.5" />
              AI Legal Execution System
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#F5EEDC] mb-4 tracking-tight leading-tight">
              Turn Legal <span className="text-[#C8AD7F]">Confusion</span>
              <br />Into <span className="text-[#C8AD7F]">Action</span>
            </h1>
            <p className="text-lg text-[#F5EEDC]/70 mb-10 max-w-2xl mx-auto">
              Describe your legal problem in plain language. Our AI will classify it, build a step-by-step action plan, and generate the legal documents you need.
            </p>
          </motion.div>

          {/* Problem Input */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-2xl">
              <Textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Describe your legal problem in simple words... e.g., 'My employer hasn't paid my salary for 3 months'"
                className="min-h-[120px] resize-none bg-white/95 border-0 rounded-xl text-[#2E2E2E] placeholder:text-slate-400 text-base focus-visible:ring-2 focus-visible:ring-[#C8AD7F] shadow-inner"
                disabled={stage !== "input"}
              />
              <div className="mt-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="flex gap-2 flex-wrap justify-center">
                  {stage === "input" && EXAMPLE_PROBLEMS.slice(0, 3).map((ex) => (
                    <Button
                      key={ex}
                      variant="ghost"
                      size="sm"
                      onClick={() => setProblem(ex)}
                      className="text-[10px] sm:text-xs text-white/60 hover:text-white hover:bg-white/10 rounded-full border border-white/10"
                    >
                      {ex.length > 40 ? ex.slice(0, 40) + "..." : ex}
                    </Button>
                  ))}
                </div>
                {stage === "input" ? (
                  <Button
                    onClick={handleClassify}
                    disabled={!problem.trim()}
                    className="bg-[#C8AD7F] hover:bg-[#C8AD7F]/90 text-[#0F3D3E] font-bold h-12 px-8 rounded-xl text-base gap-2 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Sparkles className="h-5 w-5" /> Analyze My Problem
                  </Button>
                ) : (
                  <Button
                    onClick={handleReset}
                    variant="ghost"
                    className="text-white/70 hover:text-white hover:bg-white/10 gap-2"
                  >
                    <RotateCcw className="h-4 w-4" /> Start Over
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      {stage !== "input" && (
        <section ref={resultsRef} className="container mx-auto px-4 md:px-6 py-10 max-w-6xl">
          <div className="flex gap-10">
            {/* Step Indicator sidebar */}
            <StepIndicator currentStep={currentStep} />

            {/* Main content */}
            <div className="flex-1 min-w-0 space-y-8">
              <MobileStepBar currentStep={currentStep} />

              {/* Loading: Classifying */}
              {stage === "classifying" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div className="relative">
                    <Loader2 className="h-12 w-12 text-[#0F3D3E] animate-spin" />
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-[#C8AD7F]/30"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <p className="mt-6 text-lg font-semibold text-[#0F3D3E]">Analyzing your legal problem...</p>
                  <p className="text-sm text-slate-500 mt-2">Identifying legal category, issues, and urgency level</p>
                </motion.div>
              )}

              {/* Error */}
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-4 flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
                      <div>
                        <p className="font-semibold text-red-800 text-sm">Something went wrong</p>
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => { setError(null); setStage("input") }} className="ml-auto shrink-0 border-red-300 text-red-700">
                        Try Again
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 2: Classification */}
              {classification && stage !== "classifying" && (
                <ClassificationCard classification={classification} />
              )}

              {/* Step 3: Follow-up Questions */}
              {(stage === "classified" || stage === "answering") && questions.length > 0 && (
                <QuestionsForm
                  questions={questions}
                  answers={answers}
                  onAnswerChange={(id, val) => setAnswers((prev) => ({ ...prev, [id]: val }))}
                  onSubmit={handleAnalyze}
                  isLoading={stage === "analyzing"}
                />
              )}

              {/* Loading: Analyzing */}
              {stage === "analyzing" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div className="relative">
                    <Loader2 className="h-12 w-12 text-[#0F3D3E] animate-spin" />
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-[#C8AD7F]/30"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <p className="mt-6 text-lg font-semibold text-[#0F3D3E]">Building your legal action plan...</p>
                  <p className="text-sm text-slate-500 mt-2">Generating legal options, workflow steps, and documents</p>
                </motion.div>
              )}

              {/* Step 4: Decision Engine */}
              {decision && (stage === "results" || stage === "generating_doc" || stage === "document_ready") && (
                <DecisionEngine
                  decision={decision}
                  selectedOption={selectedOption}
                  onSelect={setSelectedOption}
                />
              )}

              {/* Step 5: Workflow */}
              {workflow.length > 0 && (stage === "results" || stage === "generating_doc" || stage === "document_ready") && (
                <WorkflowTimeline
                  workflow={workflow}
                  onGenerateDocument={handleGenerateDocument}
                  isGenerating={stage === "generating_doc"}
                />
              )}

              {/* Document Generation Loading */}
              {stage === "generating_doc" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3 bg-blue-50 rounded-xl p-4 border border-blue-100"
                >
                  <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                  <p className="text-sm font-medium text-blue-700">Drafting your legal document...</p>
                </motion.div>
              )}

              {/* Generated Document */}
              {generatedDocument && stage === "document_ready" && (
                <DocumentPreview
                  document={generatedDocument}
                  onClose={() => { setGeneratedDocument(null); setStage("results") }}
                />
              )}

              {/* Step 6: Progress Tracker */}
              {tracking.length > 0 && (stage === "results" || stage === "generating_doc" || stage === "document_ready") && (
                <ProgressTracker
                  tracking={tracking}
                  completedIds={completedIds}
                  onToggle={handleToggleTracking}
                />
              )}

              {/* Disclaimer */}
              {stage === "results" || stage === "document_ready" ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex items-start gap-3 text-sm"
                >
                  <Scale className="h-5 w-5 text-yellow-700 shrink-0 mt-0.5" />
                  <div className="text-yellow-800">
                    <p className="font-semibold mb-1">Important Disclaimer</p>
                    <p className="text-xs leading-relaxed">
                      This AI-generated action plan provides general legal guidance based on Indian law. 
                      It is not a substitute for professional legal advice. For serious matters, 
                      always consult a qualified lawyer. 
                      <a href="/lawyers" className="underline font-medium ml-1">Find a verified lawyer →</a>
                    </p>
                  </div>
                </motion.div>
              ) : null}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
