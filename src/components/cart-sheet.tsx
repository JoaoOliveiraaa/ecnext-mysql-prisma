"use client"

import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { useCart } from "@/components/cart-provider"
import Image from "next/image"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"
import { TableCell } from "@/components/ui/table"

export default function CartSheet() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalItems, totalPrice } = useCart()

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle className="flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Carrinho ({totalItems})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-2">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            <div className="text-xl font-medium">Seu carrinho está vazio</div>
            <Button onClick={closeCart} variant="outline">
              Continuar comprando
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-6">
              <ul className="divide-y">
                {items.map((item) => {
                  const price =
                    item.product.discountPercentage > 0
                      ? item.product.price - (item.product.price * item.product.discountPercentage) / 100
                      : item.product.price

                  return (
                    <li key={item.product.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-md">
                          <Image
                            src={item.product.imageUrl || "/placeholder.svg"}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <TableCell>
                          <div className="flex-1 space-y-1">
                            <h3 className="font-medium">
                              <Link
                                href={`/product/${item.product.slug}`}
                                onClick={closeCart}
                                className="hover:underline"
                              >
                                {item.product.name}
                              </Link>
                            </h3>
                            <div className="text-sm text-muted-foreground">
                              {formatCurrency(price)} x {item.quantity} = {formatCurrency(price * item.quantity)}
                            </div>
                            {item.product.selectedVariations &&
                              Object.keys(item.product.selectedVariations).length > 0 && (
                                <div className="text-xs text-muted-foreground">
                                  {Object.entries(item.product.selectedVariations).map(([type, value]) => (
                                    <div key={type}>
                                      <span className="capitalize">{type}: </span>
                                      <span className="font-medium">{value}</span>
                                      {type.toLowerCase() === "cor" && (
                                        <span
                                          className="inline-block ml-1 w-3 h-3 rounded-full border"
                                          style={{
                                            backgroundColor: value.toString().startsWith("#")
                                              ? value.toString()
                                              : undefined,
                                          }}
                                        />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                          </div>
                        </TableCell>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                              <span className="sr-only">Diminuir</span>
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                              <span className="sr-only">Aumentar</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground"
                              onClick={() => removeItem(item.product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
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

            <SheetFooter className="border-t pt-4">
              <div className="space-y-4 w-full">
                <div className="flex items-center justify-between text-base font-medium">
                  <span>Subtotal</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Frete</span>
                  <span>Calculado no checkout</span>
                </div>
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
                <Button className="w-full" size="lg" asChild>
                  <Link href="/checkout">Finalizar Compra</Link>
                </Button>
                <Button variant="outline" className="w-full" onClick={closeCart}>
                  Continuar Comprando
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

