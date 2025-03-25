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

export interface ProductGridProps {
  products: Product[]
  currentPage?: number
  totalPages?: number
  totalProducts?: number
}

export default function ProductGrid({ 
  products,
  currentPage,
  totalPages,
  totalProducts 
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
          <Card key={product.id} className="overflow-hidden group">
            <Link href={`/product/${product.slug}`} className="relative block">
              <div className="aspect-square overflow-hidden bg-gray-100">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="object-cover w-full h-full transition-all duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-200">
                    <span className="text-gray-400">Sem imagem</span>
                  </div>
                )}
              </div>
              {product.discountPercentage > 0 && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                  -{product.discountPercentage}%
                </div>
              )}
              {product.isNew && (
                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded">
                  Novo
                </div>
              )}
            </Link>
            <CardHeader className="p-4 pb-0">
              <CardTitle className="text-base">
                <Link href={`/product/${product.slug}`}>{product.name}</Link>
              </CardTitle>
              <CardDescription className="text-xs">
                {product.category?.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2 pb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold">
                    {formatCurrency(product.price)}
                  </span>
                  {product.discountPercentage > 0 && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatCurrency(
                        product.price * (1 + product.discountPercentage / 100)
                      )}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 flex gap-2">
              <Button
                onClick={() => cart.addItem(product)}
                size="sm"
                className="flex-1"
                variant="default"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                <span>Adicionar</span>
              </Button>
              <Button
                onClick={() => wishlist.toggleWishlist(product)}
                size="icon"
                variant="outline"
              >
                <Heart
                  className={`h-4 w-4 ${
                    wishlist.items.some((item) => item.id === product.id)
                      ? "fill-current text-red-500"
                      : ""
                  }`}
                />
              </Button>
            </CardFooter>
          </Card>
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

