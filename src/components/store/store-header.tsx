"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, Search, ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"

interface StoreHeaderProps {
  logoUrl: string
  storeName: string
  storeSlug: string
  categories: {
    id: string
    name: string
    slug: string
  }[]
}

export function StoreHeader({ logoUrl, storeName, storeSlug, categories }: StoreHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  href={`/store/${storeSlug}`}
                  className="font-medium transition-colors hover:text-primary"
                >
                  Início
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/store/${storeSlug}/category/${category.slug}`}
                    className="font-medium transition-colors hover:text-primary"
                  >
                    {category.name}
                  </Link>
                ))}
                <Link
                  href={`/store/${storeSlug}/about`}
                  className="font-medium transition-colors hover:text-primary"
                >
                  Sobre
                </Link>
                <Link
                  href={`/store/${storeSlug}/help`}
                  className="font-medium transition-colors hover:text-primary"
                >
                  Ajuda
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          
          <Link href={`/store/${storeSlug}`} className="flex items-center space-x-2">
            <Image 
              src={logoUrl} 
              alt={storeName} 
              width={40} 
              height={40} 
              className="object-contain" 
            />
            <span className="hidden font-bold sm:inline-block">
              {storeName}
            </span>
          </Link>
          
          <nav className="hidden md:flex gap-6">
            <Link
              href={`/store/${storeSlug}`}
              className="font-medium transition-colors hover:text-primary"
            >
              Início
            </Link>
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category.id}
                href={`/store/${storeSlug}/category/${category.slug}`}
                className="font-medium transition-colors hover:text-primary"
              >
                {category.name}
              </Link>
            ))}
            <Link
              href={`/store/${storeSlug}/about`}
              className="font-medium transition-colors hover:text-primary"
            >
              Sobre
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          <form className="hidden md:flex items-center">
            <Input
              type="search"
              placeholder="Pesquisar produtos..."
              className="w-[200px] lg:w-[300px]"
            />
            <Button type="submit" size="icon" variant="ghost">
              <Search className="h-5 w-5" />
              <span className="sr-only">Pesquisar</span>
            </Button>
          </form>
          
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
            <span className="sr-only">Minha Conta</span>
          </Button>
          
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Carrinho</span>
          </Button>
        </div>
      </div>
    </header>
  )
} 