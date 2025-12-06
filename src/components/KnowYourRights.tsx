"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Home, Briefcase, GraduationCap, Heart, ShoppingCart, Shield, Smartphone, Accessibility, ChevronRight } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

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
            Explore your legal rights across different areas of law
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

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px] bg-[#F5EEDC] overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl font-bold text-[#0F3D3E] flex items-center gap-2">
              {selectedCategory?.title}
            </SheetTitle>
            <SheetDescription>
              Legal rights and protections related to {selectedCategory?.subtitle}
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-120px)] pr-4">
            <div className="space-y-6">
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
                  <p>No specific laws found for this category in the knowledge base.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </section>
  )
}
