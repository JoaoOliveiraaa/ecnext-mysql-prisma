"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export default function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b max-w-7xl mx-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/landing" className="flex items-center space-x-2">
            <span className="text-xl font-bold">MINISHOP</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/landing#features" className="text-sm font-medium hover:text-primary">
            Recursos
          </Link>
          <Link href="/landing#pricing" className="text-sm font-medium hover:text-primary">
            Preços
          </Link>
          <Link href="/landing#testimonials" className="text-sm font-medium hover:text-primary">
            Depoimentos
          </Link>
          <Link href="/landing#faq" className="text-sm font-medium hover:text-primary">
            FAQ
          </Link>
          <Link href="/demo" className="text-sm font-medium hover:text-primary">
            Demo
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/login-store">Entrar</Link>
          </Button>
          <Button asChild>
            <Link href="/register-store">Começar Grátis</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle Menu">
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/landing#features"
                className="text-sm font-medium hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Recursos
              </Link>
              <Link
                href="/landing#pricing"
                className="text-sm font-medium hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Preços
              </Link>
              <Link
                href="/landing#testimonials"
                className="text-sm font-medium hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Depoimentos
              </Link>
              <Link
                href="/landing#faq"
                className="text-sm font-medium hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link
                href="/demo"
                className="text-sm font-medium hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Demo
              </Link>
            </nav>
            <div className="flex flex-col space-y-2">
              <Button variant="outline" asChild className="w-full">
                <Link href="/login-store" onClick={() => setIsMenuOpen(false)}>
                  Entrar
                </Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/register-store" onClick={() => setIsMenuOpen(false)}>
                  Começar Grátis
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

