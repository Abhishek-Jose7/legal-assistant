"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Sparkles, Download } from "lucide-react"

const templates = [
  {
    title: "Salary Recovery Notice",
    description: "Legal notice to employer for unpaid salary",
    category: "Workplace",
  },
  {
    title: "Security Deposit Claim for Tenants",
    description: "Demand letter for deposit refund from landlord",
    category: "Housing",
  },
  {
    title: "Complaint Letter for Harassment",
    description: "Formal complaint for workplace harassment",
    category: "Workplace",
  },
  {
    title: "RTI Request",
    description: "Right to Information application template",
    category: "Government",
  },
  {
    title: "Consumer Complaint",
    description: "File complaint for defective products",
    category: "Consumer",
  },
  {
    title: "Legal Notice Template",
    description: "General purpose legal notice format",
    category: "General",
  },
]

export default function DocumentTemplates() {
  return (
    <section id="templates" className="w-full py-16 md:py-20 bg-[#F5EEDC]/95 backdrop-blur-sm relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2E2E2E] mb-4 drop-shadow-md">
            Document Templates
          </h2>
          <p className="text-lg text-[#2E2E2E]/80 max-w-2xl mx-auto drop-shadow-sm">
            Pre-written legal templates you can customize for your situation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {templates.map((template) => (
            <Card
              key={template.title}
              className="border-2 hover:border-[#1e3a8a] transition-all hover:shadow-md"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#1e3a8a]/10 flex items-center justify-center shrink-0">
                    <FileText className="h-6 w-6 text-[#1e3a8a]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="inline-block px-2 py-1 text-xs font-medium text-[#10b981] bg-[#10b981]/10 rounded-full mb-2">
                      {template.category}
                    </span>
                    <h3 className="text-base font-semibold text-slate-900 mb-1">
                      {template.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      {template.description}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-[#10b981] hover:bg-[#059669] flex-1"
                      >
                        <Sparkles className="mr-1 h-3 w-3" />
                        Auto-fill with AI
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
