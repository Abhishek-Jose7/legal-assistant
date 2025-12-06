"use client"

import { Scale } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#1a1a1a] text-slate-300">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-semibold text-xl mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0F3D3E]">
                <Scale className="h-5 w-5 text-[#F5EEDC]" />
              </div>
              <span className="text-[#F5EEDC]">Lexi.AI</span>
            </Link>
            <p className="text-sm text-slate-400 max-w-md mb-4">
              Your personal legal assistant that explains laws in simple language and connects you to affordable verified lawyers.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
              <span className="text-xs font-medium text-slate-400">
                ⚠️ This platform does not replace professional legal advice
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-slate-400 hover:text-[#C8AD7F] transition-colors">
                  AI Assistant
                </Link>
              </li>
              <li>
                <Link href="/rights" className="text-sm text-slate-400 hover:text-[#C8AD7F] transition-colors">
                  Know Your Rights
                </Link>
              </li>
              <li>
                <Link href="/templates" className="text-sm text-slate-400 hover:text-[#C8AD7F] transition-colors">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/lawyers" className="text-sm text-slate-400 hover:text-[#C8AD7F] transition-colors">
                  Find Lawyer
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-slate-400 hover:text-[#C8AD7F] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-slate-400 hover:text-[#C8AD7F] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="text-sm text-slate-400 hover:text-[#C8AD7F] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-sm text-slate-400 hover:text-[#C8AD7F] transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              © 2025 Lexi.AI. All rights reserved.
            </p>
            <p className="text-xs text-slate-600 text-center md:text-right max-w-md">
              Legal information provided is for educational purposes only and should not be considered as professional legal advice. Please consult a qualified lawyer for your specific situation.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}