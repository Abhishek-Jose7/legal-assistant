"use client"

import { Scale } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-slate-50">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-semibold text-xl mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1e3a8a]">
                <Scale className="h-5 w-5 text-white" />
              </div>
              <span className="text-[#1e3a8a]">Lexi.AI</span>
            </Link>
            <p className="text-sm text-slate-600 max-w-md mb-4">
              Your personal legal assistant that explains laws in simple language and connects you to affordable verified lawyers.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
              <span className="text-xs font-medium text-yellow-800">
                ⚠️ This platform does not replace professional legal advice
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-slate-600 hover:text-[#1e3a8a]">
                  AI Assistant
                </Link>
              </li>
              <li>
                <Link href="/rights" className="text-sm text-slate-600 hover:text-[#1e3a8a]">
                  Know Your Rights
                </Link>
              </li>
              <li>
                <Link href="/templates" className="text-sm text-slate-600 hover:text-[#1e3a8a]">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/lawyers" className="text-sm text-slate-600 hover:text-[#1e3a8a]">
                  Find Lawyer
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-slate-600 hover:text-[#1e3a8a]">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-slate-600 hover:text-[#1e3a8a]">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="text-sm text-slate-600 hover:text-[#1e3a8a]">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-sm text-slate-600 hover:text-[#1e3a8a]">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-600">
              © 2024 Lexi.AI. All rights reserved.
            </p>
            <p className="text-xs text-slate-500 text-center md:text-right max-w-md">
              Legal information provided is for educational purposes only and should not be considered as professional legal advice. Please consult a qualified lawyer for your specific situation.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}