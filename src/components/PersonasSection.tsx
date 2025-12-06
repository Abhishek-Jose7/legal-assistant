"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { GraduationCap, Heart, Briefcase, Home, Users, Search, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

// Map categories to search terms for RAG
const personasData = {
  students: {
    label: "Students",
    items: [
      { title: "Fee Refund Rights", description: "Know when you can claim refund", search: "fee refund" },
      { title: "Ragging & Harassment", description: "Legal protection against bullying", search: "ragging harassment" },
      { title: "Exam & Result Disputes", description: "Challenge unfair evaluations", search: "exam result" },
      { title: "Scholarship Rights", description: "Claim denied scholarships", search: "scholarship" },
    ]
  },
  women: {
    label: "Women",
    items: [
      { title: "Workplace Harassment", description: "POSH Act protection & complaint", search: "sexual harassment workplace" },
      { title: "Domestic Violence", description: "Protection orders & legal support", search: "domestic violence" },
      { title: "Maternity Rights", description: "Leave & benefits under law", search: "maternity" },
      { title: "Property Rights", description: "Inheritance & ownership rights", search: "property inheritance" },
    ]
  },
  employees: {
    label: "Employees",
    items: [
      { title: "Unpaid Salary", description: "Legal steps to recover dues", search: "salary wages" },
      { title: "Wrongful Termination", description: "Challenge unfair dismissal", search: "termination" },
      { title: "PF & Gratuity Claims", description: "Claim your retirement benefits", search: "gratuity pension" },
      { title: "Work Hours & Leave", description: "Know your entitlements", search: "working hours leave" },
    ]
  },
  tenants: {
    label: "Tenants",
    items: [
      { title: "Security Deposit", description: "Get your deposit back", search: "deposit" },
      { title: "Eviction Rights", description: "Protection against illegal eviction", search: "eviction" },
      { title: "Rent Agreement Issues", description: "Understand your lease terms", search: "rent agreement" },
      { title: "Maintenance Claims", description: "Landlord responsibilities", search: "maintenance" },
    ]
  },
  seniors: {
    label: "Seniors",
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
      // Match if any term is found (broad matching) or improve to all terms
      return terms.some(term => text.includes(term))
    })
    : []

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
        <DialogContent className="max-w-4xl bg-[#F5EEDC] max-h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader className="mb-2 shrink-0">
            <DialogTitle className="text-2xl font-bold text-[#0F3D3E] flex items-center gap-2">
              {selectedTopic?.title}
            </DialogTitle>
            <DialogDescription>
              Relevant legal rights from our knowledge base
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4 -mr-4">
            <div className="space-y-6 pb-6 pr-4">
              {filteredRights.length > 0 ? (
                filteredRights.map((right) => (
                  <Card key={right.id} className="border border-[#C8AD7F]/40 bg-white/50 backdrop-blur-sm">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-[#2E2E2E] text-lg">{right.title}</h4>
                        <Badge variant="outline" className="text-[#0F3D3E] border-[#0F3D3E]/20 text-xs">
                          {right.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                        {right.summary}
                      </p>

                      {right.actions.length > 0 && (
                        <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                          <h5 className="text-xs font-semibold text-blue-800 mb-2 uppercase tracking-wide">
                            Recommended Actions
                          </h5>
                          <ul className="space-y-1">
                            {right.actions.slice(0, 3).map((action, idx) => (
                              <li key={idx} className="text-xs text-blue-700 flex items-start gap-2">
                                <ChevronRight className="h-3 w-3 mt-0.5 shrink-0" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10 opacity-60">
                  <p>No specific laws found matching "{selectedTopic?.title}" in the database.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </section>
  )
}
