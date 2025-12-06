"use client"

import { Lawyer } from "@/types/lawyer"
import LawyerCard from "./LawyerCard"
import { FileSearch, Filter } from "lucide-react"

interface LawyerListProps {
  lawyers: Lawyer[]
  isLoading: boolean
  onBookConsultation: (lawyer: Lawyer) => void
  hasActiveFilters: boolean
  onClearFilters: () => void
}

export default function LawyerList({ 
  lawyers, 
  isLoading, 
  onBookConsultation, 
  hasActiveFilters,
  onClearFilters 
}: LawyerListProps) {
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="border-2 border-slate-100 rounded-xl p-6 bg-white animate-pulse">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-slate-200 rounded-xl"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-5 w-48 bg-slate-200 rounded"></div>
                  <div className="h-4 w-36 bg-slate-200 rounded"></div>
                  <div className="h-4 w-32 bg-slate-200 rounded"></div>
                  <div className="h-4 w-full bg-slate-200 rounded"></div>
                  <div className="h-10 w-full bg-slate-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Empty state
  if (lawyers.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
            {hasActiveFilters ? (
              <Filter className="h-12 w-12 text-slate-400" />
            ) : (
              <FileSearch className="h-12 w-12 text-slate-400" />
            )}
          </div>
          
          <h3 className="text-xl font-semibold text-slate-900 mb-3">
            {hasActiveFilters ? "No lawyers match your filters" : "No lawyers found"}
          </h3>
          
          <p className="text-slate-600 mb-6">
            {hasActiveFilters 
              ? "Try adjusting your filters to find more lawyers that match your needs."
              : "We couldn't find any lawyers. Please try again later."
            }
          </p>

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center px-6 py-3 bg-[#1e3a8a] text-white rounded-lg font-semibold hover:bg-[#1e3a8a]/90 transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>
    )
  }

  // Lawyer list
  return (
    <div className="space-y-6">
      {/* Results header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          {lawyers.length === 1 ? "1 lawyer found" : `${lawyers.length} lawyers found`}
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-[#1e3a8a] hover:text-[#1e3a8a]/80 font-medium transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Lawyer cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {lawyers.map((lawyer) => (
          <LawyerCard
            key={lawyer.id}
            lawyer={lawyer}
            onBookConsultation={onBookConsultation}
          />
        ))}
      </div>
    </div>
  )
}