import { NextRequest, NextResponse } from "next/server"
import { BookingPayload, BookingResponse } from "@/types/lawyer"

export async function POST(request: NextRequest) {
  try {
    const body: BookingPayload = await request.json()

    // Validate required fields
    const { lawyerId, name, email, phone, preferredDate, preferredTime, caseCategory, description } = body

    if (!lawyerId || !name || !email || !phone || !preferredDate || !preferredTime || !caseCategory || !description) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Validate description length
    if (description.length < 20) {
      return NextResponse.json(
        { success: false, error: "Description must be at least 20 characters long" },
        { status: 400 }
      )
    }

    // Validate phone (basic check for Indian phone numbers)
    const phoneRegex = /^[+]?[0-9]{10,13}$/
    if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
      return NextResponse.json(
        { success: false, error: "Invalid phone number format" },
        { status: 400 }
      )
    }

    // Validate date is not in the past
    const selectedDate = new Date(preferredDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (selectedDate < today) {
      return NextResponse.json(
        { success: false, error: "Preferred date cannot be in the past" },
        { status: 400 }
      )
    }

    // Generate a mock booking ID
    const bookingId = `BK-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000))

    // In a real app, you would:
    // 1. Save booking to database
    // 2. Send confirmation emails
    // 3. Notify the lawyer
    // 4. Create calendar events
    // 5. Set up payment processing

    console.log("Mock booking created:", {
      bookingId,
      lawyerId,
      userDetails: { name, email, phone },
      appointment: { preferredDate, preferredTime },
      case: { caseCategory, description }
    })

    const response: BookingResponse = {
      success: true,
      bookingId
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create booking" },
      { status: 500 }
    )
  }
}