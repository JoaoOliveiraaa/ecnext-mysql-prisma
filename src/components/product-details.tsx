"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Share2, ArrowLeft, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/components/cart-provider"
import { useWishlist } from "@/components/wishlist-provider"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"
import ProductCard from "@/components/product-card"

interface Variation {
  id?: string
  type: string
  value: string
  price: number
  stock: number
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  discountPercentage: number
  imageUrl: string
  categoryId: string
  stock: number
  isNew: boolean
  isFeatured: boolean
  category?: {
    id: string
    name: string
    slug?: string
  }
  variations?: Variation[]
}

interface ProductDetailsProps {
  product: Product
  relatedProducts: Product[]
}

export default function ProductDetails({ product, relatedProducts }: ProductDetailsProps) {
  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()
  const [quantity, setQuantity] = useState(1)
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({})

  // Garantir que variations existe
  const variations = product.variations || []

  // Agrupar variações por tipo
  const variationsByType: Record<string, Variation[]> = {}
  variations.forEach((variation) => {
    if (!variationsByType[variation.type]) {
      variationsByType[variation.type] = []
    }
    variationsByType[variation.type].push(variation)
  })

  // Verificar se o produto está na lista de desejos
  const isWishlisted = isInWishlist(product.id)

  // Calcular preço com desconto
  const discountedPrice =
    product.discountPercentage > 0 ? product.price - (product.price * product.discountPercentage) / 100 : product.price

  // Encontrar a variação selecionada para obter o preço específico
  const getSelectedVariationPrice = () => {
    // Se não houver variações ou nenhuma selecionada, retornar o preço padrão
    if (variations.length === 0 || Object.keys(selectedVariations).length === 0) {
      return discountedPrice
    }

    // Verificar se todas as variações disponíveis foram selecionadas
    const allVariationTypesSelected = Object.keys(variationsByType).every((type) => selectedVariations[type])

    if (!allVariationTypesSelected) {
      return discountedPrice
    }

    // Encontrar a variação que corresponde à seleção atual
    const selectedVariation = variations.find(
      (variation) =>
        variation.type === Object.keys(selectedVariations)[0] &&
        variation.value === selectedVariations[Object.keys(selectedVariations)[0]],
    )

    return selectedVariation?.price || discountedPrice
  }

  const finalPrice = getSelectedVariationPrice()

  const handleVariationChange = (type: string, value: string) => {
    setSelectedVariations((prev) => ({
      ...prev,
      [type]: value,
    }))
  }

  const handleAddToCart = () => {
    // Criar um objeto de produto com as variações selecionadas
    const productToAdd = {
      ...product,
      selectedVariations,
      price: finalPrice, // Usar o preço da variação se selecionada
    }

    addItem(productToAdd, quantity)
    toast({
      title: "Adicionado ao carrinho",
      description: `${product.name} foi adicionado ao seu carrinho.`,
    })
  }

  const handleAddToWishlist = () => {
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

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
        .catch((error) => console.log("Erro ao compartilhar", error))
    } else {
      // Fallback para copiar o link
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copiado",
        description: "O link do produto foi copiado para a área de transferência.",
      })
    }
  }

  const incrementQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, product.stock))
  }

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1))
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href="/shop">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
        <div className="flex-1">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-muted-foreground">/</span>
                  <Link href="/shop" className="text-sm text-muted-foreground hover:text-foreground">
                    Shop
                  </Link>
                </div>
              </li>
              {product.category && (
                <li>
                  <div className="flex items-center">
                    <span className="mx-2 text-muted-foreground">/</span>
                    <Link
                      href={`/categories/${product.category.slug || product.category.id}`}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {product.category.name}
                    </Link>
                  </div>
                </li>
              )}
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-muted-foreground">/</span>
                  <span className="text-sm text-foreground">{product.name}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square overflow-hidden rounded-lg border">
          <Image
            src={product.imageUrl || "/placeholder.svg?height=600&width=600"}
            alt={product.name}
            fill
            className="object-contain"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {product.discountPercentage > 0 && (
            <Badge className="absolute top-4 left-4 bg-black text-white">{product.discountPercentage}% OFF</Badge>
          )}
          {product.isNew && <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">Novo</Badge>}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="mt-2 flex items-center">
              <div className="flex items-center gap-2">
                {product.discountPercentage > 0 ? (
                  <>
                    <span className="text-2xl font-bold">{formatCurrency(finalPrice)}</span>
                    <span className="text-lg text-muted-foreground line-through">{formatCurrency(product.price)}</span>
                  </>
                ) : (
                  <span className="text-2xl font-bold">{formatCurrency(finalPrice)}</span>
                )}
              </div>
            </div>
          </div>

          <div className="prose max-w-none">
            <p>{product.description}</p>
          </div>

          {Object.keys(variationsByType).length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium">Opções disponíveis</h3>

              {Object.entries(variationsByType).map(([type, variations]) => (
                <div key={type} className="space-y-2">
                  <label className="text-sm font-medium capitalize">{type}</label>
                  <Select
                    value={selectedVariations[type] || ""}
                    onValueChange={(value) => handleVariationChange(type, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Selecione ${type}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {variations.map((variation, idx) => (
                        <SelectItem key={variation.id || idx} value={variation.value}>
                          {variation.value}{" "}
                          {variation.price !== product.price ? `(${formatCurrency(variation.price)})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-md">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="h-10 w-10 rounded-none"
                >
                  <Minus className="h-4 w-4" />
                  <span className="sr-only">Diminuir</span>
                </Button>
                <span className="w-10 text-center">{quantity}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                  className="h-10 w-10 rounded-none"
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Aumentar</span>
                </Button>
              </div>

              <Button onClick={handleAddToCart} className="flex-1" disabled={product.stock <= 0}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                {product.stock > 0 ? "Adicionar ao Carrinho" : "Produto Indisponível"}
              </Button>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleAddToWishlist}>
                <Heart className="mr-2 h-4 w-4" fill={isWishlisted ? "currentColor" : "none"} />
                {isWishlisted ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
              </Button>

              <Button variant="outline" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Compartilhar
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Disponibilidade:</span>
              <span className="text-sm">
                {product.stock > 0 ? `Em estoque (${product.stock} unidades)` : "Fora de estoque"}
              </span>
            </div>
            {product.category && (
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm font-medium">Categoria:</span>
                <Link
                  href={`/categories/${product.category.slug || product.category.id}`}
                  className="text-sm hover:underline"
                >
                  {product.category.name}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="description" className="mt-12">
        <TabsList>
          <TabsTrigger value="description">Descrição</TabsTrigger>
          <TabsTrigger value="specifications">Especificações</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-4">
          <div className="prose max-w-none">
            <p>{product.description}</p>
          </div>
        </TabsContent>
        <TabsContent value="specifications" className="mt-4">
          <div className="prose max-w-none">
            <table className="w-full">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-medium">Nome</td>
                  <td className="py-2">{product.name}</td>
                </tr>
                {product.category && (
                  <tr className="border-b">
                    <td className="py-2 font-medium">Categoria</td>
                    <td className="py-2">{product.category.name}</td>
                  </tr>
                )}
                <tr className="border-b">
                  <td className="py-2 font-medium">Preço</td>
                  <td className="py-2">{formatCurrency(product.price)}</td>
                </tr>
                {product.discountPercentage > 0 && (
                  <tr className="border-b">
                    <td className="py-2 font-medium">Desconto</td>
                    <td className="py-2">{product.discountPercentage}%</td>
                  </tr>
                )}
                <tr className="border-b">
                  <td className="py-2 font-medium">Estoque</td>
                  <td className="py-2">{product.stock}</td>
                </tr>
                {Object.entries(variationsByType).length > 0 &&
                  Object.entries(variationsByType).map(([type, variations]) => (
                    <tr key={type} className="border-b">
                      <td className="py-2 font-medium capitalize">{type}s disponíveis</td>
                      <td className="py-2">{variations.map((v) => v.value).join(", ")}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Produtos Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

