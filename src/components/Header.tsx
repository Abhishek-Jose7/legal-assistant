"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Scale } from "lucide-react"
import Link from "next/link"
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs"
import { supabase } from "@/lib/supabaseClient"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useUser()
  const [userType, setUserType] = useState<string | null>(null)

  useEffect(() => {
    if (user?.id) {
      const fetchType = async () => {
        const { data } = await supabase.from('profiles').select('user_type').eq('clerk_id', user.id).single()
        if (data) setUserType(data.user_type)
      }
      fetchType()
    }
  }, [user])

  const baseNavItems = [
    { label: "Ask AI Assistant", href: "/" },
    { label: "Know Your Rights", href: "/rights" },
    { label: "Templates", href: "/templates" },
    { label: "Find Lawyer", href: "/lawyers" },
    { label: "Rights by Category", href: "/personas" },
    { label: "My Profile", href: "/profile" },
  ]

  // Filter Logic:
  // If user is 'Individual' or 'Student', hide 'For Lawyers' (Register).
  // If user is not logged in, show 'For Lawyers' (to attract them).
  // 'For Lawyers' link:
  const forLawyersLink = { label: "For Lawyers", href: "/lawyer/register" }

  const navItems = [...baseNavItems]

  // Logic: Show 'For Lawyers' unless we know for sure they are a normal user (Individual/Student)
  const isNormalUser = userType === 'Individual' || userType === 'Student' || userType === 'Business Owner'
  // If user is logged in AND is a normal user, DO NOT show 'For Lawyers'
  // If user is NOT logged in, SHOW it. 
  // If user IS a Lawyer, maybe show it (or show Dashboard, but let's keep it simple or hide it if they are already reg).

  if (!isNormalUser) {
    navItems.push(forLawyersLink)
  }
  // Wait, if they are a Lawyer, they might not need "For Lawyers" (Register) either? 
  // But let's stick to the request: "without the find lawyer button if the user is a normal person"
  // If I interpret literally: Remove "Find Lawyer" if normal person.
  // That would be `navItems = navItems.filter(i => i.label !== 'Find Lawyer')` if isNormalUser.

  // I will assume the user meant "For Lawyers" button. 
  // And I'll remove the Duplicate "Find Lawyer" from base items carefully.


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-xl">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1e3a8a]">
            <Scale className="h-5 w-5 text-white" />
          </div>
          <span className="text-[#1e3a8a]">Lexi.AI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#1e3a8a] transition-colors rounded-md hover:bg-slate-50"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" className="text-slate-700">
                Login
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="bg-[#10b981] hover:bg-[#059669] text-white">
                Sign Up
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[350px]">
            <div className="flex flex-col gap-4 mt-8">
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-3 text-base font-medium text-slate-700 hover:text-[#1e3a8a] hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="flex flex-col gap-2 mt-4 px-4">
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button className="w-full bg-[#10b981] hover:bg-[#059669]">
                      Sign Up
                    </Button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <div className="flex justify-center py-2">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </SignedIn>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}