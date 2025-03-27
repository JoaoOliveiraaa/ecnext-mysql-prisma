"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Heart, ShoppingCart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
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
  const [storeName, setStoreName] = useState("MINISHOP")

  // Verificar se estamos em uma página de loja específica
  const isStoreSpecificPage = pathname.includes("/store/") && pathname.split("/").length > 2
  const storeSlug = isStoreSpecificPage ? pathname.split("/")[2] : null

  // Obter o nome da loja se estiver em uma página de loja específica
  useEffect(() => {
    if (isStoreSpecificPage && storeSlug) {
      fetch(`/api/stores/${storeSlug}`)
        .then(res => res.json())
        .then(data => {
          if (data.name) {
            setStoreName(data.name)
          }
        })
        .catch(error => {
          console.error("Erro ao buscar informações da loja:", error)
        })
    } else {
      setStoreName("MINISHOP")
    }
  }, [isStoreSpecificPage, storeSlug])

  // Ajustar os itens de navegação com base na página atual
  const navItems = [
    { 
      name: "Home", 
      href: isStoreSpecificPage ? `/store/${storeSlug}` : "/" 
    },
    { 
      name: "Shop", 
      href: isStoreSpecificPage ? `/store/${storeSlug}/shop` : "/shop" 
    },
    { 
      name: "Categories", 
      href: isStoreSpecificPage ? `/store/${storeSlug}/categories` : "/categories" 
    },
    { 
      name: "About", 
      href: isStoreSpecificPage ? `/store/${storeSlug}/about` : "/about" 
    },
  ]

  // Função para verificar se um link está ativo
  const isLinkActive = (href: string) => {
    if (isStoreSpecificPage) {
      // Para links de loja específica
      if (href === `/store/${storeSlug}` && pathname === `/store/${storeSlug}`) {
        return true;
      }
      return pathname.startsWith(href) && pathname !== `/store/${storeSlug}`;
    } else {
      // Para links gerais
      if (href === "/" && pathname === "/") {
        return true;
      }
      return pathname.startsWith(href) && href !== "/";
    }
  };

  return (
    <>
      <header className="w-full max-w-7xl border-b border-b-gray-100 items-center mx-auto">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link href={isStoreSpecificPage ? `/store/${storeSlug}` : "/"} className="text-xl font-bold">
              {storeName}
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isLinkActive(item.href) ? "text-primary font-bold" : "text-muted-foreground",
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

