"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Product } from "@/types"
import { useCart } from "@/components/cart-provider"
import { useWishlist } from "@/components/wishlist-provider"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()

  const isWishlisted = isInWishlist(product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    addItem(product)
    toast({
      title: "Adicionado ao carrinho",
      description: `${product.name} foi adicionado ao seu carrinho.`,
    })
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isWishlisted) {
      removeFromWishlist(product.id)
      toast({
        title: "Removido da lista de desejos",
        description: `${product.name} foi removido da sua lista de desejos.`,
      })
    } else {
      addToWishlist(product)
      toast({
        title: "Adicionado à lista de desejos",
        description: `${product.name} foi adicionado à sua lista de desejos.`,
      })
    }
  }

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-md">
        <Image
          src={product.imageUrl || "/placeholder.svg?height=300&width=300"}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={true}
        />
        {product.discountPercentage > 0 && (
          <Badge className="absolute top-2 left-2 bg-black text-white">{product.discountPercentage}% OFF</Badge>
        )}
        {product.isNew && (
          <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">New Arrival</Badge>
        )}

        <div className="absolute bottom-2 right-2 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full" onClick={handleAddToCart}>
            <ShoppingCart className="h-4 w-4" />
            <span className="sr-only">Add to cart</span>
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className={cn("h-8 w-8 rounded-full", isWishlisted && "text-red-500")}
            onClick={handleToggleWishlist}
          >
            <Heart className="h-4 w-4" fill={isWishlisted ? "currentColor" : "none"} />
            <span className="sr-only">Add to wishlist</span>
          </Button>
        </div>
      </div>
      <div className="mt-3">
        <h3 className="font-medium">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          {product.discountPercentage > 0 ? (
            <>
              <span className="font-medium">${product.price - (product.price * product.discountPercentage) / 100}</span>
              <span className="text-sm text-muted-foreground line-through">${product.price}</span>
            </>
          ) : (
            <span className="font-medium">${product.price}</span>
          )}
        </div>
      </div>
    </Link>
  )
}

