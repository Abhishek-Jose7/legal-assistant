// TypeScript types for the lawyer system

export type LawyerCategory = "Labour" | "Property" | "Family" | "Consumer"

export type ResponseTime = "Within 1 hour" | "Within 2 hours" | "Within 4 hours" | "Within 24 hours"

export interface Lawyer {
  id: string
  name: string
  specialization: string
  category: LawyerCategory
  minFee: number
  maxFee: number
  rating: number
  reviewCount: number
  responseTime: ResponseTime
  languages: string[]
  location: string
  verified: boolean
  profileImageUrl: string
  experienceYears: number
  shortBio: string
}

export interface LawyerFilters {
  category: string
  priceRange: string
  sortBy: string
  search: string
  language: string
}

export interface BookingPayload {
  lawyerId: string
  name: string
  email: string
  phone: string
  preferredDate: string
  preferredTime: string
  caseCategory: LawyerCategory | "Other"
  description: string
}

export interface BookingResponse {
  success: boolean
  bookingId?: string
  error?: string
}

export interface LawyersAPIResponse {
  lawyers: Lawyer[]
  total: number
}