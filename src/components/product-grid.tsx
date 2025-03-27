"use client"

import Link from "next/link"
import { Product } from "@/types/product"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Heart, ShoppingCart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import ProductCard from "./product-card"

export interface ProductGridProps {
  products: Product[]
  currentPage?: number
  totalPages?: number
  totalProducts?: number
  storeSlug?: string
}

export default function ProductGrid({ 
  products,
  currentPage,
  totalPages,
  totalProducts,
  storeSlug
}: ProductGridProps) {
  const cart = useCart()
  const wishlist = useWishlist()

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-semibold">Nenhum produto encontrado</h3>
        <p className="text-muted-foreground mt-2">
          Tente ajustar seus filtros ou buscar por outro termo.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} storeSlug={storeSlug} />
        ))}
      </div>
      
      {currentPage && totalPages && totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Link
                key={page}
                href={`?page=${page}`}
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {page}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

