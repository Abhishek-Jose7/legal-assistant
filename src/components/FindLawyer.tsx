"use client"

import { useState, useEffect, useCallback } from "react"
import { Lawyer, LawyerFilters as LawyerFiltersType, LawyersAPIResponse } from "@/types/lawyer"
import LawyerFilters from "@/components/lawyers/LawyerFilters"
import LawyerList from "@/components/lawyers/LawyerList"
import BookingModal from "@/components/lawyers/BookingModal"

export default function FindLawyer() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [filters, setFilters] = useState<LawyerFiltersType>({
    category: "all",
    priceRange: "all",
    sortBy: "recommended",
    search: "",
    language: "all"
  })

  // Fetch lawyers from API
  const fetchLawyers = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") {
          params.append(key, value)
        }
      })

      const response = await fetch(`/api/lawyers?${params.toString()}`)
      if (!response.ok) {
        throw new Error("Failed to fetch lawyers")
      }

      const data: LawyersAPIResponse = await response.json()
      setLawyers(data.lawyers)
    } catch (error) {
      console.error("Error fetching lawyers:", error)
      setLawyers([])
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  // Fetch lawyers on mount and when filters change
  useEffect(() => {
    fetchLawyers()
  }, [fetchLawyers])

  // Handle filter changes
  const handleFiltersChange = (newFilters: LawyerFiltersType) => {
    setFilters(newFilters)
  }

  // Handle clear filters
  const handleClearFilters = () => {
    setFilters({
      category: "all",
      priceRange: "all",
      sortBy: "recommended",
      search: "",
      language: "all"
    })
  }

  // Check if filters are active
  const hasActiveFilters = 
    filters.category !== "all" || 
    filters.priceRange !== "all" || 
    filters.language !== "all" || 
    filters.search !== ""

  // Handle booking consultation
  const handleBookConsultation = (lawyer: Lawyer) => {
    setSelectedLawyer(lawyer)
    setIsBookingModalOpen(true)
  }

  // Handle close booking modal
  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false)
    setSelectedLawyer(null)
  }

  return (
    <section id="lawyers" className="w-full py-16 md:py-20 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Find a Lawyer
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Connect with verified lawyers who specialize in your legal needs. 
            Filter by category, budget, and language to find the perfect match.
          </p>
        </div>

        <div className="max-w-7xl mx-auto space-y-8">
          {/* Filters */}
          <LawyerFilters 
            filters={filters}
            onFiltersChange={handleFiltersChange}
            isLoading={isLoading}
          />

          {/* Lawyer List */}
          <LawyerList
            lawyers={lawyers}
            isLoading={isLoading}
            onBookConsultation={handleBookConsultation}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Booking Modal */}
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={handleCloseBookingModal}
          lawyer={selectedLawyer}
        />
      </div>
    </section>
  )
}
