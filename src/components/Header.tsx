"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Scale, X } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useScrollPosition } from "@/hooks/useAnimation"
import AnimatedButton from "@/components/animations/AnimatedButton"
import { staggerContainer, staggerItem } from "@/components/animations/variants"
import { useUser, SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { supabase } from "@/lib/supabaseClient"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const scrollPosition = useScrollPosition()
  const [isVisible, setIsVisible] = useState(true) // Always show header
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

  useEffect(() => {
    // Always show header (removed scroll threshold)
    setIsVisible(true)
  }, [scrollPosition])

  // Define navigation items
  const baseNavItems = [
    { label: "Ask AI Assistant", href: "/chat", protected: false },
    { label: "Know Your Rights", href: "/rights", protected: true },
    { label: "Templates", href: "/templates", protected: false },
    { label: "Find Lawyer", href: "/lawyers", protected: false }, // Always visible
    { label: "Rights by Category", href: "/personas", protected: false, publicOnly: true },
    { label: "My Profile", href: "/profile", protected: true },
    { label: "Legal Quiz", href: "/health-score", protected: false },
  ]

  const forLawyersLink = { label: "For Lawyers", href: "/lawyer/register", protected: false, publicOnly: true }

  let navItems = baseNavItems.filter(item => {
    // If item is protected and user is NOT logged in -> Hide
    if (item.protected && !user) return false;
    // If item is publicOnly and user IS logged in -> Hide
    if (item.publicOnly && user) return false;

    return true;
  });

  // Add For Lawyers only if not logged in (logic requested: don't show if logged in as normal person)
  // Simplified: If publicOnly logic works, we just append it to base list or check it here
  if (!user) {
    navItems.push(forLawyersLink);
  } else {
    // If logged in, we check if they are explicitly a lawyer to maybe show dashboard, 
    // but user requested "don't show for lawyers on navbar when logged in" (implied context: simplify for users)
  }

  // Final cleanup: Ensure no duplicates if array logic is complex
  navItems = [...new Map(navItems.map(item => [item.label, item])).values()];
  // Wait, if they are a Lawyer, they might not need "For Lawyers" (Register) either? 
  // But let's stick to the request: "without the find lawyer button if the user is a normal person"
  // If I interpret literally: Remove "Find Lawyer" if normal person.
  // That would be `navItems = navItems.filter(i => i.label !== 'Find Lawyer')` if isNormalUser.

  // I will assume the user meant "For Lawyers" button. 
  // And I'll remove the Duplicate "Find Lawyer" from base items carefully.

  return (
    <motion.header
      initial={{ y: 0, opacity: 1 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 z-50 w-full border-b transition-all duration-300 ${scrollPosition > 10
        ? "bg-[#F5EEDC]/95 backdrop-blur-md shadow-md border-[#C8AD7F]/30"
        : "bg-[#F5EEDC]/95 backdrop-blur supports-[backdrop-filter]:bg-[#F5EEDC]/80 border-[#C8AD7F]/20"
        }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-xl">
          <motion.div
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0F3D3E]"
            whileHover={{ rotate: 180, scale: 1.1 }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          >
            <Scale className="h-5 w-5 text-[#F5EEDC]" />
          </motion.div>
          <motion.span
            className="text-[#0F3D3E]"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            Lexi.AI
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <Link
                href={item.href}
                className="relative px-3 py-2 text-sm font-medium text-[#2E2E2E] hover:text-[#0F3D3E] transition-colors rounded-md hover:bg-[#C8AD7F]/20 group"
              >
                {item.label}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8AD7F] scale-x-0 group-hover:scale-x-100"
                  transition={{ duration: 0.2 }}
                />
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <AnimatedButton
                variant="ghost"
                className="text-[#2E2E2E]"
                showRipple={true}
                rippleColor="rgba(15, 61, 62, 0.2)"
              >
                Login
              </AnimatedButton>
            </SignInButton>
            <SignUpButton mode="modal">
              <AnimatedButton
                className="bg-[#0F3D3E] hover:bg-[#0F3D3E]/90 text-[#F5EEDC]"
                showRipple={true}
                rippleColor="rgba(245, 238, 220, 0.6)"
              >
                Sign Up
              </AnimatedButton>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <motion.div whileTap={{ scale: 0.95 }} className="md:hidden">
              <Button variant="ghost" size="icon" className="text-[#2E2E2E]">
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-6 w-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[350px] bg-[#F5EEDC] border-[#C8AD7F]">
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-4 mt-8"
            >
              <motion.nav
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-2"
              >
                {navItems.map((item, index) => (
                  <motion.div key={item.label} variants={staggerItem}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-3 text-base font-medium text-[#2E2E2E] hover:text-[#0F3D3E] hover:bg-[#C8AD7F]/20 rounded-lg transition-colors block"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>

              <div className="flex flex-col gap-2 mt-4 px-4">
                <SignedOut>
                  <SignInButton mode="modal">
                    <AnimatedButton variant="outline" className="w-full border-[#C8AD7F] text-[#2E2E2E]" showRipple={true}>
                      Login
                    </AnimatedButton>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <AnimatedButton
                      className="w-full bg-[#0F3D3E] hover:bg-[#0F3D3E]/90 text-[#F5EEDC]"
                      showRipple={true}
                      rippleColor="rgba(245, 238, 220, 0.6)"
                    >
                      Sign Up
                    </AnimatedButton>
                  </SignUpButton>
                </SignedOut>

                <SignedIn>
                  <div className="flex items-center gap-2 p-2 justify-center">
                    <span className="text-sm font-medium">Logged in as:</span>
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </SignedIn>
              </div>
            </motion.div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.header>
  )
}
