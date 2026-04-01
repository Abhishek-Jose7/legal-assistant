"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Check, X, Zap, Crown, Star, ArrowRight,
  Brain, MessageSquare, FolderOpen, FileText,
  Shield, Palette, ChevronDown, ChevronUp,
  Sparkles, Rocket, Users,
} from "lucide-react"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"

// ─── Pricing Data ────────────────────────────────────

interface PlanInfo {
  name: string
  tagline: string
  monthlyPrice: number
  annualPrice: number
  icon: any
  highlight: boolean
  badge?: string
  cta: string
  ctaHref: string
  recommended: string
}

const PLANS: PlanInfo[] = [
  {
    name: "Free",
    tagline: "Trial & light users",
    monthlyPrice: 0,
    annualPrice: 0,
    icon: Zap,
    highlight: false,
    cta: "Start Free",
    ctaHref: "/sign-up",
    recommended: "Casual users, quick legal queries",
  },
  {
    name: "Plus",
    tagline: "Regular & serious users",
    monthlyPrice: 399,
    annualPrice: 319,
    icon: Star,
    highlight: false,
    cta: "Subscribe",
    ctaHref: "/sign-up?plan=plus",
    recommended: "Regular users, litigants, law students",
  },
  {
    name: "Premium",
    tagline: "Power / professional users",
    monthlyPrice: 699,
    annualPrice: 559,
    icon: Crown,
    highlight: true,
    badge: "Most Popular",
    cta: "Subscribe",
    ctaHref: "/sign-up?plan=premium",
    recommended: "Lawyers, professionals, research-heavy users",
  },
]

interface PricingFeature {
  name: string
  description: string
  free: string | boolean
  plus: string | boolean
  premium: string | boolean
}

interface PricingCategory {
  icon: any
  emoji: string
  title: string
  features: PricingFeature[]
}

const LIMITS: PricingFeature[] = [
  { name: "Queries / Month", description: "Total monthly queries", free: "100", plus: "200", premium: "Unlimited" },
  { name: "Daily Query Limit", description: "Max queries per day", free: "10 per day", plus: "No daily limit", premium: "No daily limit" },
  { name: "Monthly Output", description: "Total words generated", free: "~40,000 words", plus: "~1,50,000 words", premium: "Unlimited words" },
  { name: "Storage", description: "Total cloud storage", free: "100 MB", plus: "1 GB", premium: "2 GB" },
]

const CATEGORIES: PricingCategory[] = [
  {
    icon: Brain,
    emoji: "🔬",
    title: "AI Legal Research",
    features: [
      { name: "AI Legal Chat", description: "Indian legal AI assistance", free: true, plus: true, premium: true },
      { name: "Web-Based Legal Research", description: "Live online legal search", free: true, plus: "Fast", premium: "Highest" },
      { name: "Response Modes", description: "Short / Medium / Detailed / Auto", free: "Short, Medium", plus: "All Modes", premium: "All Modes" },
      { name: "Response Language", description: "Hindi, English & more", free: true, plus: true, premium: true },
    ],
  },
  {
    icon: MessageSquare,
    emoji: "💬",
    title: "Chat Capabilities",
    features: [
      { name: "Chat with PDFs", description: "Ask questions about docs", free: true, plus: true, premium: true },
      { name: "OCR (Scanned Docs)", description: "Extract text from images", free: "Basic", plus: "Full", premium: "Advanced" },
      { name: "Max File Uploads per Query", description: "Files per chat message", free: "1", plus: "5", premium: "10" },
      { name: "File Size Limits", description: "Maximum upload size", free: "5 MB", plus: "25 MB", premium: "100 MB" },
      { name: "Real-time Streaming", description: "See responses as generated", free: true, plus: true, premium: true },
      { name: "Temporary / Private Chats", description: "Private, non-saved chats", free: false, plus: true, premium: true },
      { name: "Voice Input (Speech-to-Text)", description: "Speak your queries", free: false, plus: true, premium: true },
      { name: "Edit & Regenerate Answers", description: "Modify & retry responses", free: true, plus: true, premium: true },
      { name: "Message Versioning", description: "Compare response versions", free: false, plus: true, premium: true },
      { name: "Priority Response Speed", description: "Faster AI processing", free: false, plus: "Good", premium: "Best" },
      { name: "Rich Text Copy", description: "Formatted clipboard copy", free: true, plus: true, premium: true },
    ],
  },
  {
    icon: FolderOpen,
    emoji: "📁",
    title: "Chat Organization & History",
    features: [
      { name: "Auto Chat Titles", description: "AI-generated names", free: true, plus: true, premium: true },
      { name: "Distraction-Free Chat Mode", description: "Fullscreen mode", free: false, plus: true, premium: true },
      { name: "Chat Response Actions", description: "Feedback & actions", free: true, plus: true, premium: true },
      { name: "Expand/Collapse Threads", description: "Organize long chats", free: true, plus: true, premium: true },
      { name: "Chat Collections", description: "Folders for chats", free: "3", plus: "10", premium: "Unlimited" },
      { name: "Export Chat", description: "TXT / DOCX / PDF", free: "TXT Only", plus: "All Formats", premium: "All Formats" },
      { name: "Share Chat", description: "Public shareable link", free: false, plus: true, premium: true },
      { name: "Pin/Unpin Chat", description: "Pin important chats", free: false, plus: true, premium: true },
      { name: "Favorite Chats", description: "Bookmark chats", free: false, plus: "Unlimited", premium: "Unlimited" },
      { name: "Chat History", description: "Access past chats", free: "30 Days", plus: "1 Year", premium: "Forever" },
    ],
  },
  {
    icon: FileText,
    emoji: "📄",
    title: "Documents & Notes",
    features: [
      { name: "Document Uploads (Total)", description: "Total storage limit", free: "10", plus: "50", premium: "Unlimited" },
      { name: "Bulk Document Upload", description: "Upload multiple at once", free: false, plus: true, premium: true },
      { name: "File Size Limits", description: "Per-file size", free: "5 MB", plus: "25 MB", premium: "100 MB" },
      { name: "Document Previews", description: "View docs in-app", free: true, plus: true, premium: true },
      { name: "Notes", description: "Personal annotations", free: "10", plus: "50", premium: "Unlimited" },
      { name: "Save Chat to Notes", description: "Save responses as notes", free: false, plus: true, premium: true },
      { name: "Collections (Folders)", description: "Organize docs & notes", free: "3", plus: "10", premium: "Unlimited" },
      { name: "Favorites / Bookmarks", description: "Quick access bookmarks", free: false, plus: "Unlimited", premium: "Unlimited" },
    ],
  },
  {
    icon: Shield,
    emoji: "🔐",
    title: "Security & Access",
    features: [
      { name: "Secure Authentication", description: "End-to-end protection", free: true, plus: true, premium: true },
      { name: "Session Management", description: "Control active sessions", free: true, plus: true, premium: true },
      { name: "Data Security", description: "Protected storage", free: true, plus: true, premium: true },
      { name: "Multi-device Access", description: "Use on any device", free: true, plus: true, premium: true },
      { name: "Backup & Export Data", description: "Download all data", free: false, plus: true, premium: true },
    ],
  },
  {
    icon: Palette,
    emoji: "🎨",
    title: "Platform & Experience",
    features: [
      { name: "Dark/Light Theme", description: "Visual preferences", free: true, plus: true, premium: true },
      { name: "Usage History", description: "Track usage stats", free: true, plus: true, premium: true },
      { name: "Global Search", description: "Search all content", free: true, plus: true, premium: true },
      { name: "Early Access Features", description: "Beta features", free: false, plus: false, premium: true },
      { name: "Support", description: "Help & support", free: "Basic", plus: "Standard", premium: "Priority" },
    ],
  },
]

// ─── Helper ──────────────────────────────────────────

function FeatureValue({ value }: { value: string | boolean }) {
  if (value === true) return <Check className="h-4 w-4 text-emerald-500 mx-auto" />
  if (value === false) return <X className="h-4 w-4 text-slate-300 mx-auto" />
  return <span className="text-xs font-medium text-slate-700">{value}</span>
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

// ─── Plan Card ───────────────────────────────────────

function PlanCard({
  plan,
  isAnnual,
  isCurrentPlan,
  isLoggedIn,
}: {
  plan: PlanInfo
  isAnnual: boolean
  isCurrentPlan?: boolean
  isLoggedIn?: boolean
}) {
  const Icon = plan.icon
  const price = isAnnual ? plan.annualPrice : plan.monthlyPrice

  return (
    <motion.div variants={fadeUp} className="flex">
      <Card
        className={`flex-1 relative overflow-hidden transition-all duration-300 ${
          plan.highlight
            ? "border-2 border-[#0F3D3E] shadow-2xl scale-[1.02] lg:scale-105"
            : "border border-slate-200 shadow-lg hover:shadow-xl"
        } ${isCurrentPlan ? "ring-4 ring-[#C8AD7F]/50" : ""}`}
      >
        {plan.badge && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-0">
            <Badge className="bg-[#0F3D3E] text-[#F5EEDC] text-xs font-bold px-4 py-1 rounded-b-lg rounded-t-none">
              {plan.badge}
            </Badge>
          </div>
        )}
        {isCurrentPlan && (
          <div className="absolute top-0 right-0">
            <Badge className="bg-[#C8AD7F] text-[#0F3D3E] text-xs font-bold px-3 py-1 rounded-bl-lg rounded-t-none rounded-r-none">
              Current Plan
            </Badge>
          </div>
        )}

        <CardContent className={`p-8 ${plan.highlight ? "pt-12" : "pt-8"}`}>
          <div className="text-center space-y-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto ${
              plan.highlight ? "bg-[#0F3D3E]" : "bg-slate-100"
            }`}>
              <Icon className={`h-7 w-7 ${plan.highlight ? "text-[#C8AD7F]" : "text-[#0F3D3E]"}`} />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-[#2E2E2E]">{plan.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{plan.tagline}</p>
            </div>

            <div className="py-2">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-extrabold text-[#0F3D3E]">
                  {price === 0 ? "₹0" : `₹${price}`}
                </span>
                <span className="text-sm text-slate-500">/month</span>
              </div>
              {isAnnual && plan.monthlyPrice > 0 && (
                <p className="text-xs text-emerald-600 font-medium mt-1">
                  Save ₹{(plan.monthlyPrice - plan.annualPrice) * 12}/year
                </p>
              )}
            </div>

            {isCurrentPlan ? (
              <Button
                disabled
                className="w-full h-12 rounded-xl bg-slate-200 text-slate-500 cursor-not-allowed"
              >
                Current Plan
              </Button>
            ) : (
              <Link href={isLoggedIn ? "/profile" : plan.ctaHref}>
                <Button
                  className={`w-full h-12 rounded-xl text-base font-semibold transition-all ${
                    plan.highlight
                      ? "bg-[#0F3D3E] hover:bg-[#0F3D3E]/90 text-[#F5EEDC] shadow-lg hover:shadow-xl"
                      : "bg-white border-2 border-[#0F3D3E] text-[#0F3D3E] hover:bg-[#0F3D3E] hover:text-white"
                  }`}
                >
                  {isLoggedIn ? "Upgrade" : plan.cta}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            )}

            <p className="text-[11px] text-slate-400 leading-tight mt-3">
              {plan.recommended}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ─── Feature Comparison Table ────────────────────────

function FeatureTable() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(CATEGORIES.map((c) => c.title))
  )

  const toggleCategory = (title: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(title)) next.delete(title)
      else next.add(title)
      return next
    })
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="border-b-2 border-[#0F3D3E]/10">
            <th className="text-left py-4 px-4 w-[40%]"></th>
            {PLANS.map((p) => (
              <th key={p.name} className="text-center py-4 px-3 w-[20%]">
                <span className={`text-sm font-bold ${p.highlight ? "text-[#0F3D3E]" : "text-slate-600"}`}>
                  {p.name}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Limits */}
          <tr>
            <td colSpan={4} className="pt-6 pb-2 px-4">
              <span className="text-sm font-bold text-[#0F3D3E] uppercase tracking-wider flex items-center gap-2">
                <Rocket className="h-4 w-4" /> Usage Limits
              </span>
            </td>
          </tr>
          {LIMITS.map((feat, i) => (
            <tr key={feat.name} className={`${i % 2 === 0 ? "bg-slate-50/50" : ""} hover:bg-[#F5EEDC]/30 transition-colors`}>
              <td className="py-3 px-4">
                <p className="text-sm font-medium text-[#2E2E2E]">{feat.name}</p>
                <p className="text-[11px] text-slate-400">{feat.description}</p>
              </td>
              <td className="py-3 px-3 text-center"><FeatureValue value={feat.free} /></td>
              <td className="py-3 px-3 text-center"><FeatureValue value={feat.plus} /></td>
              <td className="py-3 px-3 text-center">
                <span className="text-xs font-bold text-[#0F3D3E]">{typeof feat.premium === "string" ? feat.premium : ""}</span>
                {typeof feat.premium === "boolean" && <FeatureValue value={feat.premium} />}
              </td>
            </tr>
          ))}

          {/* Categories */}
          {CATEGORIES.map((cat) => {
            const isExpanded = expandedCategories.has(cat.title)
            const CatIcon = cat.icon
            return (
              <>
                <tr
                  key={`cat-${cat.title}`}
                  className="cursor-pointer hover:bg-[#F5EEDC]/30 transition-colors"
                  onClick={() => toggleCategory(cat.title)}
                >
                  <td colSpan={4} className="pt-6 pb-2 px-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#0F3D3E] uppercase tracking-wider flex items-center gap-2">
                        <span>{cat.emoji}</span> {cat.title}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      )}
                    </div>
                  </td>
                </tr>
                {isExpanded &&
                  cat.features.map((feat, i) => (
                    <tr
                      key={`${cat.title}-${feat.name}`}
                      className={`${i % 2 === 0 ? "bg-slate-50/50" : ""} hover:bg-[#F5EEDC]/30 transition-colors`}
                    >
                      <td className="py-3 px-4 pl-8">
                        <p className="text-sm font-medium text-[#2E2E2E]">{feat.name}</p>
                        <p className="text-[11px] text-slate-400">{feat.description}</p>
                      </td>
                      <td className="py-3 px-3 text-center"><FeatureValue value={feat.free} /></td>
                      <td className="py-3 px-3 text-center"><FeatureValue value={feat.plus} /></td>
                      <td className="py-3 px-3 text-center"><FeatureValue value={feat.premium} /></td>
                    </tr>
                  ))}
              </>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── Logged-In Plan View ─────────────────────────────

function CurrentPlanView({ isAnnual }: { isAnnual: boolean }) {
  // Default to Free plan since we don't have real subscriptions yet
  const currentPlanName = "Free"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto"
    >
      <div className="text-center mb-8">
        <Badge className="bg-[#0F3D3E] text-[#F5EEDC] mb-4 text-sm px-4 py-1.5">
          <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Your Account
        </Badge>
        <h2 className="text-3xl font-bold text-[#0F3D3E] mb-2">Manage Your Plan</h2>
        <p className="text-slate-600">
          You&apos;re currently on the <span className="font-bold text-[#0F3D3E]">{currentPlanName}</span> plan. Upgrade to unlock more features.
        </p>
      </div>

      {/* Current Plan Highlight */}
      <div className="mb-8 bg-gradient-to-r from-[#0F3D3E] to-[#0F3D3E]/80 rounded-2xl p-6 text-[#F5EEDC]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#C8AD7F]/20 flex items-center justify-center">
              <Zap className="h-7 w-7 text-[#C8AD7F]" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Free Plan</h3>
              <p className="text-sm text-[#F5EEDC]/70">100 queries/month • 10 per day • 100 MB storage</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/legal-action">
              <Button className="bg-[#C8AD7F] hover:bg-[#C8AD7F]/90 text-[#0F3D3E] font-bold rounded-xl">
                Use Legal Action
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Upgrade Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {PLANS.filter((p) => p.name !== currentPlanName).map((plan) => (
          <PlanCard
            key={plan.name}
            plan={plan}
            isAnnual={isAnnual}
            isLoggedIn={true}
          />
        ))}
      </div>
    </motion.div>
  )
}

// ─── Main Component ──────────────────────────────────

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)
  const { isSignedIn } = useUser()

  return (
    <div className="min-h-screen bg-[#F5EEDC]">
      {/* Hero */}
      <section className="relative w-full bg-gradient-to-b from-[#0F3D3E] via-[#0F3D3E]/95 to-[#F5EEDC] pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-20 left-[10%] text-white/5"
            animate={{ y: [0, -15, 0], rotate: [0, 3, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <Crown className="w-20 h-20" />
          </motion.div>
          <motion.div
            className="absolute top-32 right-[15%] text-white/5"
            animate={{ y: [0, 12, 0], rotate: [0, -3, 0] }}
            transition={{ duration: 7, repeat: Infinity, delay: 1 }}
          >
            <Star className="w-16 h-16" />
          </motion.div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge className="bg-[#C8AD7F]/20 text-[#C8AD7F] border border-[#C8AD7F]/30 mb-6 text-sm px-4 py-1.5">
              Simple, Transparent Pricing
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#F5EEDC] mb-4 tracking-tight">
              Plans & <span className="text-[#C8AD7F]">Pricing</span>
            </h1>
            <p className="text-lg text-[#F5EEDC]/70 mb-10 max-w-2xl mx-auto">
              Choose the plan that fits your legal needs. Start free and upgrade as your needs grow. All plans include core AI features.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm font-medium transition-colors ${!isAnnual ? "text-[#F5EEDC]" : "text-[#F5EEDC]/50"}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  isAnnual ? "bg-[#C8AD7F]" : "bg-white/20"
                }`}
              >
                <motion.div
                  className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md"
                  animate={{ x: isAnnual ? 28 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
              <span className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${isAnnual ? "text-[#F5EEDC]" : "text-[#F5EEDC]/50"}`}>
                Annual
                {isAnnual && (
                  <Badge className="bg-emerald-500 text-white text-[10px] px-2 py-0">
                    Save 20%
                  </Badge>
                )}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 -mt-8 relative z-10 pb-20">
        {isSignedIn ? (
          /* Logged-in: Show current plan + upgrade */
          <CurrentPlanView isAnnual={isAnnual} />
        ) : (
          /* Guest: Show full pricing */
          <>
            {/* Plan Cards */}
            <motion.div
              className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              {PLANS.map((plan) => (
                <PlanCard key={plan.name} plan={plan} isAnnual={isAnnual} />
              ))}
            </motion.div>

            {/* Feature Comparison */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-5xl mx-auto"
            >
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-[#0F3D3E] mb-2">Compare All Features</h2>
                <p className="text-slate-600">Detailed comparison of what each plan includes</p>
              </div>

              <Card className="border border-slate-200 shadow-xl overflow-hidden bg-white">
                <CardContent className="p-0 md:p-2">
                  <FeatureTable />
                </CardContent>
              </Card>
            </motion.div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-16 max-w-2xl mx-auto"
            >
              <div className="bg-gradient-to-r from-[#0F3D3E] to-[#0F3D3E]/80 rounded-2xl p-10 text-[#F5EEDC]">
                <Users className="h-10 w-10 text-[#C8AD7F] mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Not sure which plan is right?</h3>
                <p className="text-[#F5EEDC]/70 text-sm mb-6">
                  Start with the Free plan — no credit card required. You can upgrade anytime as your legal needs evolve.
                </p>
                <Link href="/sign-up">
                  <Button className="bg-[#C8AD7F] hover:bg-[#C8AD7F]/90 text-[#0F3D3E] font-bold h-12 px-8 rounded-xl text-base gap-2">
                    <Sparkles className="h-5 w-5" /> Get Started for Free
                  </Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </section>
    </div>
  )
}
