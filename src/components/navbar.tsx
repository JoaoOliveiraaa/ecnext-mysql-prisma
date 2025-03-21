"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Heart, ShoppingCart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useCart } from "@/components/cart-provider"
import { useWishlist } from "@/components/wishlist-provider"
import CartSheet from "@/components/cart-sheet"
import WishlistSheet from "@/components/wishlist-sheet"
import UserDropdown from "@/components/user-dropdown"

export default function Navbar() {
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { totalItems: cartItems, openCart } = useCart()
  const { totalItems: wishlistItems, openWishlist } = useWishlist()

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
  ]

  return (
    <>
      <header className="w-full max-w-7xl border-b border-b-gray-100 items-center mx-auto">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold">
              MINISHOP
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className={cn("hidden md:flex items-center relative", isSearchOpen ? "w-64" : "w-auto")}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="absolute right-0 z-10"
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
              {isSearchOpen && (
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full pr-10"
                  autoFocus
                  onBlur={() => setIsSearchOpen(false)}
                />
              )}
            </div>

            <UserDropdown />

            <Button variant="ghost" size="icon" onClick={openWishlist} className="relative">
              <Heart className="h-5 w-5" />
              {wishlistItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {wishlistItems}
                </span>
              )}
              <span className="sr-only">Wishlist</span>
            </Button>

            <Button variant="ghost" size="icon" onClick={openCart} className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {cartItems}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </div>
        </div>
      </header>

      <CartSheet />
      <WishlistSheet />
    </>
  )
}

