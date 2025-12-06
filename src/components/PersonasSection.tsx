"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { GraduationCap, Heart, Briefcase, Home, Users } from "lucide-react"

const personasData = {
  students: [
    { title: "Fee Refund Rights", description: "Know when you can claim refund" },
    { title: "Ragging & Harassment", description: "Legal protection against bullying" },
    { title: "Exam & Result Disputes", description: "Challenge unfair evaluations" },
    { title: "Scholarship Rights", description: "Claim denied scholarships" },
  ],
  women: [
    { title: "Workplace Harassment", description: "POSH Act protection & complaint" },
    { title: "Domestic Violence", description: "Protection orders & legal support" },
    { title: "Maternity Rights", description: "Leave & benefits under law" },
    { title: "Property Rights", description: "Inheritance & ownership rights" },
  ],
  employees: [
    { title: "Unpaid Salary", description: "Legal steps to recover dues" },
    { title: "Wrongful Termination", description: "Challenge unfair dismissal" },
    { title: "PF & Gratuity Claims", description: "Claim your retirement benefits" },
    { title: "Work Hours & Leave", description: "Know your entitlements" },
  ],
  tenants: [
    { title: "Security Deposit", description: "Get your deposit back" },
    { title: "Eviction Rights", description: "Protection against illegal eviction" },
    { title: "Rent Agreement Issues", description: "Understand your lease terms" },
    { title: "Maintenance Claims", description: "Landlord responsibilities" },
  ],
  seniors: [
    { title: "Senior Citizen Rights", description: "Special legal protections" },
    { title: "Property & Will", description: "Estate planning guidance" },
    { title: "Pension & Benefits", description: "Claim government schemes" },
    { title: "Elder Abuse", description: "Legal protection & support" },
  ],
}

export default function PersonasSection() {
  const [activeTab, setActiveTab] = useState("students")

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
              <TabsTrigger
                value="students"
                className="data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white flex flex-col items-center gap-1 py-3 rounded-xl border-2"
              >
                <GraduationCap className="h-5 w-5" />
                <span className="text-xs md:text-sm">Students</span>
              </TabsTrigger>
              <TabsTrigger
                value="women"
                className="data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white flex flex-col items-center gap-1 py-3 rounded-xl border-2"
              >
                <Heart className="h-5 w-5" />
                <span className="text-xs md:text-sm">Women</span>
              </TabsTrigger>
              <TabsTrigger
                value="employees"
                className="data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white flex flex-col items-center gap-1 py-3 rounded-xl border-2"
              >
                <Briefcase className="h-5 w-5" />
                <span className="text-xs md:text-sm">Employees</span>
              </TabsTrigger>
              <TabsTrigger
                value="tenants"
                className="data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white flex flex-col items-center gap-1 py-3 rounded-xl border-2"
              >
                <Home className="h-5 w-5" />
                <span className="text-xs md:text-sm">Tenants</span>
              </TabsTrigger>
              <TabsTrigger
                value="seniors"
                className="data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white flex flex-col items-center gap-1 py-3 rounded-xl border-2"
              >
                <Users className="h-5 w-5" />
                <span className="text-xs md:text-sm">Seniors</span>
              </TabsTrigger>
            </TabsList>

            {Object.entries(personasData).map(([key, rights]) => (
              <TabsContent key={key} value={key} className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rights.map((right) => (
                    <Card
                      key={right.title}
                      className="cursor-pointer hover:shadow-md transition-all hover:border-[#10b981] border-2"
                    >
                      <CardContent className="p-5">
                        <h3 className="text-base font-semibold text-slate-900 mb-1">
                          {right.title}
                        </h3>
                        <p className="text-sm text-slate-600">{right.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  )
}
