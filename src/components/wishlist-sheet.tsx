"use client"

import { Heart, X, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useWishlist } from "@/components/wishlist-provider"
import { useCart } from "@/components/cart-provider"
import Image from "next/image"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"

export default function WishlistSheet() {
  const { items, isOpen, closeWishlist, removeItem, totalItems } = useWishlist()

  const { addItem } = useCart()

  const handleAddToCart = (product: any) => {
    addItem(product)
    removeItem(product.id)
  }

  return (
    <Sheet open={isOpen} onOpenChange={closeWishlist}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle className="flex items-center">
            <Heart className="mr-2 h-5 w-5" />
            Lista de Desejos ({totalItems})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-2">
            <Heart className="h-12 w-12 text-muted-foreground" />
            <div className="text-xl font-medium">Sua lista de desejos está vazia</div>
            <Button onClick={closeWishlist} variant="outline">
              Continuar comprando
            </Button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto py-6">
            <ul className="divide-y">
              {items.map((product) => {
                const price =
                  product.discountPercentage > 0
                    ? product.price - (product.price * product.discountPercentage) / 100
                    : product.price

                return (
                  <li key={product.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-md">
                        <Image
                          src={product.imageUrl || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h3 className="font-medium">
                          <Link href={`/product/${product.slug}`} onClick={closeWishlist} className="hover:underline">
                            {product.name}
                          </Link>
                        </h3>
                        <div className="text-sm text-muted-foreground">{formatCurrency(price)}</div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" className="h-8" onClick={() => handleAddToCart(product)}>
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Adicionar ao Carrinho
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground"
                            onClick={() => removeItem(product.id)}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remover</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

