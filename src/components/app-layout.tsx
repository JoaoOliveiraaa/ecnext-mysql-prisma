"use client"

import type React from "react"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}

