"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { Product } from "@/types"

interface WishlistContextType {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  clearWishlist: () => void
  isInWishlist: (productId: string) => boolean
  isOpen: boolean
  openWishlist: () => void
  closeWishlist: () => void
  totalItems: number
}

const WishlistContext = createContext<WishlistContextType | null>(null)

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}

export default function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Modificar o useEffect para carregar a wishlist apenas uma vez na montagem
  // e salvar no localStorage sempre que a wishlist mudar
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist")
    if (savedWishlist) {
      try {
        setItems(JSON.parse(savedWishlist))
      } catch (error) {
        console.error("Failed to parse wishlist from localStorage:", error)
      }
    }
  }, [])

  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("wishlist", JSON.stringify(items))
    } else {
      localStorage.removeItem("wishlist")
    }
  }, [items])

  const addItem = (product: Product) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)

      if (existingItem) {
        return prevItems
      }

      return [...prevItems, product]
    })
  }

  const removeItem = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  const clearWishlist = () => {
    setItems([])
    localStorage.removeItem("wishlist")
  }

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.id === productId)
  }

  const openWishlist = () => setIsOpen(true)
  const closeWishlist = () => setIsOpen(false)

  const totalItems = items.length

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearWishlist,
        isInWishlist,
        isOpen,
        openWishlist,
        closeWishlist,
        totalItems,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

