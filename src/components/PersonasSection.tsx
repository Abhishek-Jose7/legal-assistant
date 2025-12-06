"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { GraduationCap, Heart, Briefcase, Home, Users, Search, ChevronRight, MessageSquare, FileText, CheckCircle2, Shield } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Map categories to search terms for RAG
const personasData = {
  students: {
    label: "Students",
    color: "bg-blue-100 text-blue-600",
    icon: GraduationCap,
    items: [
      { title: "Fee Refund Rights", description: "Know when you can claim refund", search: "fee refund" },
      { title: "Ragging & Harassment", description: "Legal protection against bullying", search: "ragging harassment" },
      { title: "Exam & Result Disputes", description: "Challenge unfair evaluations", search: "exam result" },
      { title: "Scholarship Rights", description: "Claim denied scholarships", search: "scholarship" },
    ]
  },
  women: {
    label: "Women",
    color: "bg-pink-100 text-pink-600",
    icon: Heart,
    items: [
      { title: "Workplace Harassment", description: "POSH Act protection & complaint", search: "sexual harassment workplace" },
      { title: "Domestic Violence", description: "Protection orders & legal support", search: "domestic violence" },
      { title: "Maternity Rights", description: "Leave & benefits under law", search: "maternity" },
      { title: "Property Rights", description: "Inheritance & ownership rights", search: "property inheritance" },
    ]
  },
  employees: {
    label: "Employees",
    color: "bg-purple-100 text-purple-600",
    icon: Briefcase,
    items: [
      { title: "Unpaid Salary", description: "Legal steps to recover dues", search: "salary wages" },
      { title: "Wrongful Termination", description: "Challenge unfair dismissal", search: "termination" },
      { title: "PF & Gratuity Claims", description: "Claim your retirement benefits", search: "gratuity pension" },
      { title: "Work Hours & Leave", description: "Know your entitlements", search: "working hours leave" },
    ]
  },
  tenants: {
    label: "Tenants",
    color: "bg-orange-100 text-orange-600",
    icon: Home,
    items: [
      { title: "Security Deposit", description: "Get your deposit back", search: "deposit" },
      { title: "Eviction Rights", description: "Protection against illegal eviction", search: "eviction" },
      { title: "Rent Agreement Issues", description: "Understand your lease terms", search: "rent agreement" },
      { title: "Maintenance Claims", description: "Landlord responsibilities", search: "maintenance" },
    ]
  },
  seniors: {
    label: "Seniors",
    color: "bg-indigo-100 text-indigo-600",
    icon: Users,
    items: [
      { title: "Senior Citizen Rights", description: "Special legal protections", search: "senior citizen" },
      { title: "Property & Will", description: "Estate planning guidance", search: "will property" },
      { title: "Pension & Benefits", description: "Claim government schemes", search: "pension" },
      { title: "Elder Abuse", description: "Legal protection & support", search: "abuse" },
    ]
  },
}

interface LegalRight {
  id: string;
  title: string;
  category: string;
  summary: string;
  actions: string[];
  tags: string[];
}

export default function PersonasSection() {
  const [activeTab, setActiveTab] = useState("students")
  const [rightsData, setRightsData] = useState<LegalRight[]>([])
  const [selectedTopic, setSelectedTopic] = useState<{ title: string, search: string } | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    fetch('/api/legal-rights')
      .then(res => res.json())
      .then(data => setRightsData(data))
      .catch(err => console.error("Failed to load legal rights:", err))
  }, [])

  const handleCardClick = (item: { title: string, search: string }) => {
    setSelectedTopic(item)
    setIsOpen(true)
  }

  // Filter rights based on the selected card's search terms
  const filteredRights = selectedTopic
    ? rightsData.filter(r => {
      const terms = selectedTopic.search.split(" ")
      const text = (r.title + " " + r.summary + " " + r.tags.join(" ")).toLowerCase()
      return terms.some(term => text.includes(term))
    })
    : []

  const activeCategory = personasData[activeTab as keyof typeof personasData];

  return (
    <section className="w-full py-16 md:py-20 bg-[#F5EEDC]/95 backdrop-blur-sm relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2E2E2E] mb-4 drop-shadow-md">
            Rights by Category
          </h2>
          <p className="text-lg text-[#2E2E2E]/80 max-w-2xl mx-auto drop-shadow-sm">
            Quick access to legal rights based on your situation
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto gap-2 bg-transparent">
              <TabsTrigger value="students" className="data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white flex flex-col items-center gap-1 py-3 rounded-xl border-2">
                <GraduationCap className="h-5 w-5" /><span className="text-xs md:text-sm">Students</span>
              </TabsTrigger>
              <TabsTrigger value="women" className="data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white flex flex-col items-center gap-1 py-3 rounded-xl border-2">
                <Heart className="h-5 w-5" /><span className="text-xs md:text-sm">Women</span>
              </TabsTrigger>
              <TabsTrigger value="employees" className="data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white flex flex-col items-center gap-1 py-3 rounded-xl border-2">
                <Briefcase className="h-5 w-5" /><span className="text-xs md:text-sm">Employees</span>
              </TabsTrigger>
              <TabsTrigger value="tenants" className="data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white flex flex-col items-center gap-1 py-3 rounded-xl border-2">
                <Home className="h-5 w-5" /><span className="text-xs md:text-sm">Tenants</span>
              </TabsTrigger>
              <TabsTrigger value="seniors" className="data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white flex flex-col items-center gap-1 py-3 rounded-xl border-2">
                <Users className="h-5 w-5" /><span className="text-xs md:text-sm">Seniors</span>
              </TabsTrigger>
            </TabsList>

            {Object.entries(personasData).map(([key, section]) => (
              <TabsContent key={key} value={key} className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.items.map((item) => (
                    <Card
                      key={item.title}
                      onClick={() => handleCardClick(item)}
                      className="cursor-pointer hover:shadow-md transition-all hover:border-[#10b981] border-2 group"
                    >
                      <CardContent className="p-5 flex items-start justify-between">
                        <div>
                          <h3 className="text-base font-semibold text-slate-900 mb-1 group-hover:text-[#10b981] transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-sm text-slate-600">{item.description}</p>
                        </div>
                        <Search className="h-5 w-5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl bg-[#F5EEDC] h-[85vh] flex flex-col overflow-hidden p-0 gap-0 rounded-xl">
          <DialogHeader className="p-6 pb-2 shrink-0 bg-white/50 border-b border-[#C8AD7F]/20">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${activeCategory?.color} flex items-center justify-center shrink-0`}>
                {activeCategory && <activeCategory.icon className="h-6 w-6" />}
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-[#0F3D3E] flex items-center gap-2">
                  {selectedTopic?.title}
                </DialogTitle>
                <DialogDescription className="text-[#2E2E2E]/80">
                  Relevant legal rights from our knowledge base
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 bg-[#F5EEDC] overscroll-contain">
            <div className="max-w-3xl mx-auto">
              {filteredRights.length > 0 ? (
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {filteredRights.map((right) => (
                    <AccordionItem key={right.id} value={right.id} className="border-none">
                      <Card className="border border-[#C8AD7F]/40 bg-white/60 hover:bg-white/80 transition-colors">
                        <AccordionTrigger className="px-6 py-4 hover:no-underline [&[data-state=open]]:pb-2">
                          <div className="flex flex-col text-left gap-1">
                            <h4 className="font-bold text-[#2E2E2E] text-lg leading-tight">{right.title}</h4>
                            <div className="flex gap-2">
                              {right.tags.slice(0, 2).map(tag => (
                                <Badge key={tag} variant="secondary" className="text-[10px] bg-[#0F3D3E]/10 text-[#0F3D3E] hover:bg-[#0F3D3E]/20 px-1 py-0 h-5">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                          <div className="space-y-6 pt-2">
                            {/* Summary Section */}
                            <div className="bg-[#F8F9FA] p-4 rounded-lg border-l-4 border-[#0F3D3E]">
                              <h5 className="text-sm font-semibold text-[#0F3D3E] mb-2 flex items-center gap-2">
                                <FileText className="h-4 w-4" /> What does the law say?
                              </h5>
                              <p className="text-sm text-slate-700 leading-relaxed">
                                {right.summary}
                              </p>
                            </div>

                            {/* Action Plan */}
                            {right.actions.length > 0 && (
                              <div>
                                <h5 className="text-sm font-bold text-[#2E2E2E] mb-3 flex items-center gap-2">
                                  <Shield className="h-4 w-4 text-emerald-600" /> Action Plan
                                </h5>
                                <div className="grid gap-2">
                                  {right.actions.map((action, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded border border-slate-100 shadow-sm">
                                      <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                                      <span className="text-sm text-slate-700 font-medium">{action}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Interactive Buttons */}
                            <div className="flex gap-3 pt-2">
                              <Button asChild size="sm" className="bg-[#0F3D3E] hover:bg-[#0F3D3E]/90 text-white gap-2">
                                <Link href="/?chat=true">
                                  <MessageSquare className="h-4 w-4" /> Ask AI about this
                                </Link>
                              </Button>
                              <Button asChild variant="outline" size="sm" className="border-[#0F3D3E] text-[#0F3D3E] hover:bg-[#0F3D3E]/10 gap-2">
                                <Link href="/templates">
                                  <FileText className="h-4 w-4" /> Draft Notice
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </Card>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-20 opacity-60 flex flex-col items-center gap-4">
                  <Shield className="h-16 w-16 text-slate-300" />
                  <p className="text-xl font-medium">No specific laws found matching "{selectedTopic?.title}" in the database.</p>
                  <Button variant="ghost" onClick={() => setIsOpen(false)}>Close</Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
