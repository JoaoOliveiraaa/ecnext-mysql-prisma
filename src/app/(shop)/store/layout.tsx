import type React from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import CartProvider from "@/components/cart-provider"
import WishlistProvider from "@/components/wishlist-provider"
import CartSheet from "@/components/cart-sheet"
import WishlistSheet from "@/components/wishlist-sheet"

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CartProvider>
      <WishlistProvider>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartSheet />
          <WishlistSheet />
        </div>
      </WishlistProvider>
    </CartProvider>
  )
} 