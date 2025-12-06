"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, User, Phone, Mail, FileText, Star, AlertCircle, CheckCircle2 } from "lucide-react"
import { Lawyer, LawyerCategory, BookingPayload } from "@/types/lawyer"
import Image from "next/image"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  lawyer: Lawyer | null
}

interface FormData {
  name: string
  email: string
  phone: string
  preferredDate: string
  preferredTime: string
  caseCategory: LawyerCategory | "Other" | ""
  description: string
}

interface FormErrors {
  [key: string]: string
}

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00"
]

const caseCategories = [
  { value: "Labour", label: "Labour & Employment" },
  { value: "Property", label: "Property & Real Estate" },
  { value: "Family", label: "Family & Matrimonial" },
  { value: "Consumer", label: "Consumer Protection" },
  { value: "Other", label: "Other" }
]

export default function BookingModal({ isOpen, onClose, lawyer }: BookingModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    caseCategory: "",
    description: ""
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [bookingId, setBookingId] = useState("")

  // Reset form when modal opens/closes
  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      preferredDate: "",
      preferredTime: "",
      caseCategory: "",
      description: ""
    })
    setErrors({})
    setIsSubmitting(false)
    setIsSuccess(false)
    setBookingId("")
    onClose()
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^[+]?[0-9]{10,13}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid phone number"
    }

    if (!formData.preferredDate) {
      newErrors.preferredDate = "Preferred date is required"
    } else {
      const selectedDate = new Date(formData.preferredDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selectedDate < today) {
        newErrors.preferredDate = "Date cannot be in the past"
      }
    }

    if (!formData.preferredTime) {
      newErrors.preferredTime = "Preferred time is required"
    }

    if (!formData.caseCategory) {
      newErrors.caseCategory = "Case category is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    } else if (formData.description.trim().length < 20) {
      newErrors.description = "Description must be at least 20 characters long"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !lawyer) return

    setIsSubmitting(true)

    try {
      const payload: BookingPayload = {
        lawyerId: lawyer.id,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        caseCategory: formData.caseCategory as LawyerCategory | "Other",
        description: formData.description.trim()
      }

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setBookingId(result.bookingId)
        setIsSuccess(true)
      } else {
        throw new Error(result.error || "Failed to book consultation")
      }
    } catch (error) {
      console.error("Booking error:", error)
      setErrors({
        submit: error instanceof Error ? error.message : "Failed to book consultation. Please try again."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!lawyer) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white p-6">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-2">
              <Image
                src={lawyer.profileImageUrl}
                alt={lawyer.name}
                width={60}
                height={60}
                className="rounded-full object-cover border-2 border-white/20"
              />
              <div>
                <DialogTitle className="text-2xl font-bold text-white mb-1">
                  {isSuccess ? "Booking Confirmed!" : "Book Consultation"}
                </DialogTitle>
                <div className="flex items-center gap-3 text-blue-100">
                  <span className="font-medium">{lawyer.name}</span>
                  <span>•</span>
                  <span>{lawyer.specialization}</span>
                  {lawyer.verified && <Badge className="bg-green-500 text-white">Verified</Badge>}
                </div>
              </div>
            </div>
            <DialogDescription className="text-blue-100">
              {isSuccess 
                ? "Your consultation request has been submitted successfully."
                : "Fill in your details to book a consultation with this lawyer."
              }
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isSuccess ? (
            /* Success State */
            <div className="p-6 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Consultation Request Submitted
                </h3>
                
                <p className="text-slate-600 mb-6">
                  Your booking request has been sent to {lawyer.name}. You will receive a confirmation email within {lawyer.responseTime.toLowerCase()}.
                </p>

                <Card className="border-2 border-green-100 bg-green-50 mb-6">
                  <CardContent className="p-4">
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-green-800">Booking ID:</span>
                        <span className="font-mono text-green-700">{bookingId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-green-800">Date & Time:</span>
                        <span className="text-green-700">
                          {new Date(formData.preferredDate).toLocaleDateString()} at {formData.preferredTime}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-green-800">Consultation Fee:</span>
                        <span className="text-green-700">₹{lawyer.minFee} - ₹{lawyer.maxFee}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  <Button
                    onClick={handleClose}
                    className="w-full bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white h-11"
                  >
                    Done
                  </Button>
                  <p className="text-xs text-slate-500">
                    Save this booking ID for your records. You'll also receive it via email.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-500" />
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Enter your full name"
                        className={`h-11 ${errors.name ? "border-red-500" : ""}`}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                        className={`h-11 ${errors.phone ? "border-red-500" : ""}`}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="your.email@example.com"
                        className={`h-11 ${errors.email ? "border-red-500" : ""}`}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-500" />
                    Appointment Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-sm font-medium">Preferred Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => handleInputChange("preferredDate", e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className={`h-11 ${errors.preferredDate ? "border-red-500" : ""}`}
                      />
                      {errors.preferredDate && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.preferredDate}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time" className="text-sm font-medium">Preferred Time *</Label>
                      <Select value={formData.preferredTime} onValueChange={(value) => handleInputChange("preferredTime", value)}>
                        <SelectTrigger className={`h-11 ${errors.preferredTime ? "border-red-500" : ""}`}>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.preferredTime && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.preferredTime}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="category" className="text-sm font-medium">Case Category *</Label>
                      <Select value={formData.caseCategory} onValueChange={(value) => handleInputChange("caseCategory", value)}>
                        <SelectTrigger className={`h-11 ${errors.caseCategory ? "border-red-500" : ""}`}>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {caseCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.caseCategory && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.caseCategory}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Case Description */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-500" />
                    Case Description
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium">
                      Briefly describe your legal issue *
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Please provide details about your legal concern, including any relevant background information..."
                      rows={4}
                      className={`resize-none ${errors.description ? "border-red-500" : ""}`}
                    />
                    <div className="flex justify-between items-center">
                      {errors.description && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.description}
                        </p>
                      )}
                      <p className="text-sm text-slate-500 ml-auto">
                        {formData.description.length}/500 characters
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fee Information */}
                <Card className="border-2 border-blue-100 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-bold">₹</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">
                          Consultation Fee: ₹{lawyer.minFee} - ₹{lawyer.maxFee}
                        </h4>
                        <p className="text-sm text-blue-700">
                          Payment will be collected during or after the consultation. No advance payment required.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Error Message */}
                {errors.submit && (
                  <Card className="border-2 border-red-200 bg-red-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-red-800">
                        <AlertCircle className="h-5 w-5" />
                        <span className="font-medium">{errors.submit}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Submit Button */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={handleClose}
                    variant="outline"
                    disabled={isSubmitting}
                    className="h-11 px-6"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 px-8 bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white font-semibold min-w-[160px]"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Booking...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Book Consultation
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}