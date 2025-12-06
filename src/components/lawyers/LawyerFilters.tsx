"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { LawyerFilters as LawyerFiltersType } from "@/types/lawyer"

interface LawyerFiltersProps {
  filters: LawyerFiltersType
  onFiltersChange: (filters: LawyerFiltersType) => void
  isLoading?: boolean
}

export default function LawyerFilters({ filters, onFiltersChange, isLoading = false }: LawyerFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        onFiltersChange({ ...filters, search: searchInput })
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchInput, filters, onFiltersChange])

  const handleClearFilters = () => {
    setSearchInput("")
    onFiltersChange({
      category: "all",
      priceRange: "all",
      sortBy: "recommended",
      search: "",
      language: "all"
    })
  }

  const hasActiveFilters = 
    filters.category !== "all" || 
    filters.priceRange !== "all" || 
    filters.language !== "all" || 
    filters.search !== ""

  return (
    <div className="bg-white p-6 rounded-xl border-2 border-slate-100 shadow-sm">
      <div className="space-y-6">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by name, specialization, or city..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10 h-11 border-2 border-slate-200 focus:border-[#1e3a8a] transition-colors"
            disabled={isLoading}
          />
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Category</label>
            <Select
              value={filters.category}
              onValueChange={(value) => onFiltersChange({ ...filters, category: value })}
              disabled={isLoading}
            >
              <SelectTrigger className="h-11 border-2 border-slate-200 focus:border-[#1e3a8a]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="labour">Labour Law</SelectItem>
                <SelectItem value="property">Property Law</SelectItem>
                <SelectItem value="family">Family Law</SelectItem>
                <SelectItem value="consumer">Consumer Law</SelectItem>
                <SelectItem value="criminal">Criminal Law</SelectItem>
                <SelectItem value="corporate">Corporate Law</SelectItem>
                <SelectItem value="tax">Tax Law</SelectItem>
                <SelectItem value="intellectual property">Intellectual Property</SelectItem>
                <SelectItem value="civil rights">Civil Rights</SelectItem>
                <SelectItem value="immigration">Immigration Law</SelectItem>
                <SelectItem value="banking">Banking Law</SelectItem>
                <SelectItem value="insurance">Insurance Law</SelectItem>
                <SelectItem value="medical">Medical Law</SelectItem>
                <SelectItem value="environmental">Environmental Law</SelectItem>
                <SelectItem value="cyber law">Cyber Law</SelectItem>
                <SelectItem value="constitutional">Constitutional Law</SelectItem>
                <SelectItem value="international">International Law</SelectItem>
                <SelectItem value="trade">Trade Law</SelectItem>
                <SelectItem value="education">Education Law</SelectItem>
                <SelectItem value="sports">Sports Law</SelectItem>
                <SelectItem value="entertainment">Entertainment Law</SelectItem>
                <SelectItem value="transportation">Transportation Law</SelectItem>
                <SelectItem value="energy">Energy Law</SelectItem>
                <SelectItem value="public interest">Public Interest Law</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Price Range</label>
            <Select
              value={filters.priceRange}
              onValueChange={(value) => onFiltersChange({ ...filters, priceRange: value })}
              disabled={isLoading}
            >
              <SelectTrigger className="h-11 border-2 border-slate-200 focus:border-[#1e3a8a]">
                <SelectValue placeholder="All Prices" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under-500">Under ₹500</SelectItem>
                <SelectItem value="500-1000">₹500 - ₹1000</SelectItem>
                <SelectItem value="above-1000">Above ₹1000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Language Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Language</label>
            <Select
              value={filters.language}
              onValueChange={(value) => onFiltersChange({ ...filters, language: value })}
              disabled={isLoading}
            >
              <SelectTrigger className="h-11 border-2 border-slate-200 focus:border-[#1e3a8a]">
                <SelectValue placeholder="All Languages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="hindi">Hindi</SelectItem>
                <SelectItem value="marathi">Marathi</SelectItem>
                <SelectItem value="gujarati">Gujarati</SelectItem>
                <SelectItem value="tamil">Tamil</SelectItem>
                <SelectItem value="bengali">Bengali</SelectItem>
                <SelectItem value="punjabi">Punjabi</SelectItem>
                <SelectItem value="malayalam">Malayalam</SelectItem>
                <SelectItem value="telugu">Telugu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort By Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Sort By</label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => onFiltersChange({ ...filters, sortBy: value })}
              disabled={isLoading}
            >
              <SelectTrigger className="h-11 border-2 border-slate-200 focus:border-[#1e3a8a]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Most Recommended</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price">Lowest Price</SelectItem>
                <SelectItem value="response-time">Fastest Response</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="flex justify-center">
            <Button
              onClick={handleClearFilters}
              variant="outline"
              disabled={isLoading}
              className="h-9 px-6 border-2 hover:bg-slate-50 transition-all"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}