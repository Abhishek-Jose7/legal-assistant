import { NextRequest, NextResponse } from "next/server"
import { mockLawyers } from "@/data/mockLawyers"
import { LawyersAPIResponse } from "@/types/lawyer"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category") || "all"
    const priceRange = searchParams.get("priceRange") || "all"
    const sortBy = searchParams.get("sortBy") || "recommended"
    const search = searchParams.get("search") || ""
    const language = searchParams.get("language") || "all"

    // Filter lawyers
    let filteredLawyers = [...mockLawyers]

    // Filter by category
    if (category !== "all") {
      filteredLawyers = filteredLawyers.filter(
        lawyer => lawyer.category.toLowerCase() === category.toLowerCase()
      )
    }

    // Filter by price range
    if (priceRange !== "all") {
      switch (priceRange) {
        case "under-500":
          filteredLawyers = filteredLawyers.filter(lawyer => lawyer.maxFee < 500)
          break
        case "500-1000":
          filteredLawyers = filteredLawyers.filter(
            lawyer => lawyer.minFee <= 1000 && lawyer.maxFee >= 500
          )
          break
        case "above-1000":
          filteredLawyers = filteredLawyers.filter(lawyer => lawyer.minFee > 1000)
          break
      }
    }

    // Filter by language
    if (language !== "all") {
      filteredLawyers = filteredLawyers.filter(lawyer =>
        lawyer.languages.some(lang => 
          lang.toLowerCase().includes(language.toLowerCase())
        )
      )
    }

    // Filter by search text
    if (search) {
      const searchLower = search.toLowerCase()
      filteredLawyers = filteredLawyers.filter(lawyer =>
        lawyer.name.toLowerCase().includes(searchLower) ||
        lawyer.specialization.toLowerCase().includes(searchLower) ||
        lawyer.location.toLowerCase().includes(searchLower) ||
        lawyer.shortBio.toLowerCase().includes(searchLower)
      )
    }

    // Sort lawyers
    switch (sortBy) {
      case "rating":
        filteredLawyers.sort((a, b) => b.rating - a.rating)
        break
      case "price":
        filteredLawyers.sort((a, b) => a.minFee - b.minFee)
        break
      case "response-time":
        // Define sort order for response times
        const responseTimeOrder = {
          "Within 1 hour": 1,
          "Within 2 hours": 2,
          "Within 4 hours": 3,
          "Within 24 hours": 4
        }
        filteredLawyers.sort((a, b) => 
          responseTimeOrder[a.responseTime] - responseTimeOrder[b.responseTime]
        )
        break
      case "recommended":
      default:
        // Sort by a combination of rating, review count, and verified status
        filteredLawyers.sort((a, b) => {
          const aScore = (a.rating * a.reviewCount) + (a.verified ? 100 : 0)
          const bScore = (b.rating * b.reviewCount) + (b.verified ? 100 : 0)
          return bScore - aScore
        })
        break
    }

    const response: LawyersAPIResponse = {
      lawyers: filteredLawyers,
      total: filteredLawyers.length
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching lawyers:", error)
    return NextResponse.json(
      { error: "Failed to fetch lawyers" },
      { status: 500 }
    )
  }
}