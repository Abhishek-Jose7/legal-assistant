"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Home, Briefcase, GraduationCap, Heart, ShoppingCart, Shield, Smartphone, Accessibility, ChevronRight, MessageSquare, FileText, CheckCircle2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link" // To link to chat

const rightsCategories = [
  {
    icon: Home,
    title: "Tenants & Housing",
    subtitle: "Deposit, rent, eviction rights",
    color: "bg-blue-100 text-blue-600",
    searchTerm: "Tenant",
  },
  {
    icon: Briefcase,
    title: "Workplace & Labour",
    subtitle: "Salary, leave, termination laws",
    color: "bg-purple-100 text-purple-600",
    searchTerm: "Workplace",
  },
  {
    icon: GraduationCap,
    title: "Student Rights",
    subtitle: "Education, fees, discrimination",
    color: "bg-green-100 text-green-600",
    searchTerm: "Student",
  },
  {
    icon: Heart,
    title: "Women's Rights",
    subtitle: "Safety, harassment, legal protection",
    color: "bg-pink-100 text-pink-600",
    searchTerm: "Women",
  },
  {
    icon: ShoppingCart,
    title: "Consumer Protection",
    subtitle: "Refunds, defective goods, fraud",
    color: "bg-orange-100 text-orange-600",
    searchTerm: "Consumer",
  },
  {
    icon: Shield,
    title: "Police Interaction & FIR",
    subtitle: "Your rights during arrest",
    color: "bg-red-100 text-red-600",
    searchTerm: "Police",
  },
  {
    icon: Smartphone,
    title: "Digital Rights & Cybercrime",
    subtitle: "Online fraud, privacy, data theft",
    color: "bg-cyan-100 text-cyan-600",
    searchTerm: "Cyber",
  },
  {
    icon: Accessibility,
    title: "Disability Rights",
    subtitle: "Accessibility, discrimination laws",
    color: "bg-indigo-100 text-indigo-600",
    searchTerm: "Disability",
  },
]

interface LegalRight {
  id: string;
  title: string;
  category: string;
  summary: string;
  actions: string[];
  tags: string[];
}

export default function KnowYourRights() {
  const [rightsData, setRightsData] = useState<LegalRight[]>([])
  const [selectedCategory, setSelectedCategory] = useState<typeof rightsCategories[0] | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    fetch('/api/legal-rights')
      .then(res => res.json())
      .then(data => setRightsData(data))
      .catch(err => console.error("Failed to load legal rights:", err))
  }, [])

  const handleCardClick = (category: typeof rightsCategories[0]) => {
    setSelectedCategory(category)
    setIsOpen(true)
  }

  const filteredRights = selectedCategory
    ? rightsData.filter(r =>
      r.category.toLowerCase().includes(selectedCategory.searchTerm.toLowerCase()) ||
      r.tags.some(tag => tag.toLowerCase().includes(selectedCategory.searchTerm.toLowerCase()))
    )
    : []

  return (
    <section id="rights" className="w-full py-16 md:py-20 bg-[#F5EEDC]/95 backdrop-blur-sm relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2E2E2E] mb-4 drop-shadow-md">
            Know Your Rights
          </h2>
          <p className="text-lg text-[#2E2E2E]/80 max-w-2xl mx-auto drop-shadow-sm">
            Empower yourself with legal knowledge. Click a category to learn more.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {rightsCategories.map((category) => {
            const Icon = category.icon
            return (
              <Card
                key={category.title}
                onClick={() => handleCardClick(category)}
                className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 border-2 hover:border-[#10b981]"
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-2xl ${category.color} flex items-center justify-center mb-4`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {category.title}
                  </h3>
                  <p className="text-sm text-slate-600">{category.subtitle}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl bg-[#F5EEDC] max-h-[90vh] flex flex-col overflow-hidden p-0 gap-0 rounded-xl">
          <DialogHeader className="p-6 pb-2 shrink-0 bg-white/50 border-b border-[#C8AD7F]/20">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${selectedCategory?.color} flex items-center justify-center shrink-0`}>
                {selectedCategory && <selectedCategory.icon className="h-6 w-6" />}
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-[#0F3D3E]">
                  {selectedCategory?.title}
                </DialogTitle>
                <DialogDescription className="text-[#2E2E2E]/80">
                  {filteredRights.length} legal rights found for {selectedCategory?.subtitle}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 p-6 bg-[#F5EEDC]">
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
                  <p className="text-xl font-medium">No specific laws found for this category yet.</p>
                  <Button variant="link" className="text-[#0F3D3E]">browse all categories</Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </section>
  )
}
