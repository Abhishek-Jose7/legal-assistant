"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, MapPin, DollarSign, BadgeCheck, Calendar } from "lucide-react"
import Image from "next/image"

const lawyers = [
  {
    name: "Adv. Priya Sharma",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
    specialization: "Labour & Employment Law",
    price: "₹500 - ₹1000/consultation",
    rating: 4.8,
    reviews: 127,
    verified: true,
    responseTime: "Within 2 hours",
    languages: ["Hindi", "English"],
  },
  {
    name: "Adv. Rajesh Kumar",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop",
    specialization: "Property & Housing Law",
    price: "₹800 - ₹1500/consultation",
    rating: 4.9,
    reviews: 203,
    verified: true,
    responseTime: "Within 1 hour",
    languages: ["Hindi", "English", "Punjabi"],
  },
  {
    name: "Adv. Meera Patel",
    photo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200&h=200&fit=crop",
    specialization: "Women's Rights & Family Law",
    price: "₹600 - ₹1200/consultation",
    rating: 4.7,
    reviews: 156,
    verified: true,
    responseTime: "Within 3 hours",
    languages: ["English", "Gujarati"],
  },
  {
    name: "Adv. Arjun Reddy",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop",
    specialization: "Consumer Protection",
    price: "₹400 - ₹800/consultation",
    rating: 4.6,
    reviews: 89,
    verified: true,
    responseTime: "Within 4 hours",
    languages: ["English", "Telugu", "Hindi"],
  },
]

export default function FindLawyer() {
  const [sortBy, setSortBy] = useState("recommended")
  const [category, setCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")

  return (
    <section id="lawyers" className="w-full py-16 md:py-20 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Find a Lawyer
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Connect with verified lawyers who specialize in your legal needs
          </p>
        </div>

        {/* Filters */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full md:w-[200px] bg-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="labour">Labour Law</SelectItem>
                <SelectItem value="property">Property Law</SelectItem>
                <SelectItem value="family">Family Law</SelectItem>
                <SelectItem value="consumer">Consumer Law</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-full md:w-[200px] bg-white">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="low">Under ₹500</SelectItem>
                <SelectItem value="mid">₹500 - ₹1000</SelectItem>
                <SelectItem value="high">Above ₹1000</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[200px] bg-white">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Most Recommended</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price-low">Lowest Price</SelectItem>
                <SelectItem value="response">Fastest Response</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Lawyer Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {lawyers.map((lawyer) => (
            <Card key={lawyer.name} className="border-2 hover:border-[#10b981] transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="relative shrink-0">
                    <Image
                      src={lawyer.photo}
                      alt={lawyer.name}
                      width={80}
                      height={80}
                      className="rounded-xl object-cover"
                    />
                    {lawyer.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-[#10b981] rounded-full p-1">
                        <BadgeCheck className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {lawyer.name}
                      </h3>
                      {lawyer.verified && (
                        <Badge className="bg-[#10b981] hover:bg-[#059669] shrink-0">
                          Verified
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm font-medium text-[#1e3a8a] mb-2">
                      {lawyer.specialization}
                    </p>

                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">{lawyer.rating}</span>
                      <span className="text-sm text-slate-500">
                        ({lawyer.reviews} reviews)
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <DollarSign className="h-4 w-4" />
                        {lawyer.price}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <Calendar className="h-4 w-4" />
                        {lawyer.responseTime}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {lawyer.languages.map((lang) => (
                        <span
                          key={lang}
                          className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded-full"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>

                    <Button className="w-full bg-[#1e3a8a] hover:bg-[#1e3a8a]/90">
                      Book Consultation
                    </Button>
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
