"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, DollarSign, BadgeCheck, Calendar, Clock } from "lucide-react"
import Image from "next/image"
import { Lawyer } from "@/types/lawyer"

interface LawyerCardProps {
  lawyer: Lawyer
  onBookConsultation: (lawyer: Lawyer) => void
}

export default function LawyerCard({ lawyer, onBookConsultation }: LawyerCardProps) {
  return (
    <Card className="border-2 border-slate-100 hover:border-[#1e3a8a]/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white/50 backdrop-blur-sm group">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Profile Image */}
          <div className="relative shrink-0">
            <Image
              src={lawyer.profileImageUrl}
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

          {/* Lawyer Details */}
          <div className="flex-1 min-w-0">
            {/* Name and Verified Badge */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#1e3a8a] transition-colors">
                {lawyer.name}
              </h3>
              {lawyer.verified && (
                <Badge className="bg-[#10b981] hover:bg-[#059669] shrink-0 text-white">
                  Verified
                </Badge>
              )}
            </div>

            {/* Specialization */}
            <p className="text-sm font-semibold text-[#1e3a8a] mb-2">
              {lawyer.specialization}
            </p>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold text-slate-900">{lawyer.rating}</span>
              </div>
              <span className="text-sm text-slate-500">
                ({lawyer.reviewCount} reviews)
              </span>
              <span className="text-sm text-slate-400">•</span>
              <span className="text-sm text-slate-600 font-medium">
                {lawyer.experienceYears}+ years exp.
              </span>
            </div>

            {/* Price and Response Time */}
            <div className="flex flex-wrap gap-4 mb-3">
              <div className="flex items-center gap-1 text-sm text-slate-600">
                <DollarSign className="h-4 w-4" />
                <span className="font-medium">₹{lawyer.minFee} - ₹{lawyer.maxFee}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-slate-600">
                <Clock className="h-4 w-4" />
                <span>{lawyer.responseTime}</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 text-sm text-slate-600 mb-3">
              <MapPin className="h-4 w-4" />
              <span>{lawyer.location}</span>
            </div>

            {/* Languages */}
            <div className="flex flex-wrap gap-1 mb-4">
              {lawyer.languages.map((lang) => (
                <span
                  key={lang}
                  className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded-full font-medium"
                >
                  {lang}
                </span>
              ))}
            </div>

            {/* Short Bio */}
            <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
              {lawyer.shortBio}
            </p>

            {/* Book Consultation Button */}
            <Button
              onClick={() => onBookConsultation(lawyer)}
              className="w-full bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white h-10 font-semibold rounded-lg shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Book Consultation
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}