"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Home, Briefcase, GraduationCap, Heart, ShoppingCart, Shield, Smartphone, Accessibility } from "lucide-react"

const rightsCategories = [
  {
    icon: Home,
    title: "Tenants & Housing",
    subtitle: "Deposit, rent, eviction rights",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Briefcase,
    title: "Workplace & Labour",
    subtitle: "Salary, leave, termination laws",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: GraduationCap,
    title: "Student Rights",
    subtitle: "Education, fees, discrimination",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Heart,
    title: "Women's Rights",
    subtitle: "Safety, harassment, legal protection",
    color: "bg-pink-100 text-pink-600",
  },
  {
    icon: ShoppingCart,
    title: "Consumer Protection",
    subtitle: "Refunds, defective goods, fraud",
    color: "bg-orange-100 text-orange-600",
  },
  {
    icon: Shield,
    title: "Police Interaction & FIR",
    subtitle: "Your rights during arrest",
    color: "bg-red-100 text-red-600",
  },
  {
    icon: Smartphone,
    title: "Digital Rights & Cybercrime",
    subtitle: "Online fraud, privacy, data theft",
    color: "bg-cyan-100 text-cyan-600",
  },
  {
    icon: Accessibility,
    title: "Disability Rights",
    subtitle: "Accessibility, discrimination laws",
    color: "bg-indigo-100 text-indigo-600",
  },
]

export default function KnowYourRights() {
  return (
    <section id="rights" className="w-full py-16 md:py-20 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Know Your Rights
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore your legal rights across different areas of law
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {rightsCategories.map((category) => {
            const Icon = category.icon
            return (
              <Card
                key={category.title}
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
    </section>
  )
}
