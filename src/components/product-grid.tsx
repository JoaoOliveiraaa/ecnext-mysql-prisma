"use client"

import { useRouter, useSearchParams } from "next/navigation"
import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Product } from "@/types"

interface ProductGridProps {
  products: Product[]
  currentPage: number
  totalPages: number
  totalProducts: number
}

export default function ProductGrid({ products, currentPage, totalPages, totalProducts }: ProductGridProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(name, value)
    return params.toString()
  }

  const handleSortChange = (value: string) => {
    router.push(`/shop?${createQueryString("sort", value)}`)
  }

  const handlePageChange = (page: number) => {
    router.push(`/shop?${createQueryString("page", page.toString())}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p className="text-muted-foreground">
          Mostrando {products.length} de {totalProducts} produtos
        </p>

        <div className="w-full sm:w-auto">
          <Select value={searchParams.get("sort") || "newest"} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mais recentes</SelectItem>
              <SelectItem value="price-asc">Preço: Menor para maior</SelectItem>
              <SelectItem value="price-desc">Preço: Maior para menor</SelectItem>
              <SelectItem value="name-asc">Nome: A-Z</SelectItem>
              <SelectItem value="name-desc">Nome: Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">Nenhum produto encontrado</h3>
          <p className="text-muted-foreground mt-2">Tente ajustar seus filtros ou buscar por outro termo.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Página anterior</span>
            </Button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNumber = i + 1
                const isActive = pageNumber === currentPage

                // Mostrar apenas páginas próximas da atual e primeira/última
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <Button
                      key={pageNumber}
                      variant={isActive ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handlePageChange(pageNumber)}
                      disabled={isActive}
                    >
                      {pageNumber}
                    </Button>
                  )
                }

                // Mostrar reticências para páginas omitidas
                if (
                  (pageNumber === 2 && currentPage > 3) ||
                  (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                ) {
                  return <span key={pageNumber}>...</span>
                }

                return null
              })}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Próxima página</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

