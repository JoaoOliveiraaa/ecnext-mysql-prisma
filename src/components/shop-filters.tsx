"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Search, X } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
  _count: {
    products: number
  }
}

interface ShopFiltersProps {
  categories: Category[]
  selectedCategory?: string
  minPrice?: string
  maxPrice?: string
  searchQuery?: string
  sortOption?: string
}

export default function ShopFilters({
  categories,
  selectedCategory,
  minPrice,
  maxPrice,
  searchQuery,
  sortOption,
}: ShopFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [search, setSearch] = useState(searchQuery || "")

  // Inicializar o range de preço com os valores da URL
  useEffect(() => {
    const min = minPrice ? Number.parseFloat(minPrice) : 0
    const max = maxPrice ? Number.parseFloat(maxPrice) : 1000
    setPriceRange([min, max])
  }, [minPrice, maxPrice])

  const createQueryString = (params: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams.toString())

    // Atualizar ou remover parâmetros
    Object.entries(params).forEach(([name, value]) => {
      if (value === null) {
        newParams.delete(name)
      } else {
        newParams.set(name, value)
      }
    })

    // Sempre voltar para a primeira página ao filtrar
    if (Object.keys(params).some((key) => key !== "page")) {
      newParams.delete("page")
    }

    return newParams.toString()
  }

  const handleCategoryClick = (slug: string) => {
    const isSelected = selectedCategory === slug
    router.push(`/shop?${createQueryString({ category: isSelected ? null : slug })}`)
  }

  const handlePriceChange = (values: number[]) => {
    setPriceRange([values[0], values[1]])
  }

  const applyPriceFilter = () => {
    router.push(`/shop?${createQueryString({ min: priceRange[0].toString(), max: priceRange[1].toString() })}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/shop?${createQueryString({ q: search })}`)
  }

  const clearAllFilters = () => {
    router.push("/shop")
    setSearch("")
    setPriceRange([0, 1000])
  }

  // Verificar se há filtros ativos
  const hasActiveFilters = selectedCategory || minPrice || maxPrice || searchQuery

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Buscar</h3>
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <Input
            type="search"
            placeholder="Buscar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
            <span className="sr-only">Buscar</span>
          </Button>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">Categorias</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.slug ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleCategoryClick(category.slug)}
            >
              {category.name}
              <span className="ml-auto text-muted-foreground text-sm">({category._count.products})</span>
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">Preço</h3>
        <div className="space-y-4">
          <Slider
            defaultValue={[0, 1000]}
            value={priceRange}
            min={0}
            max={1000}
            step={10}
            onValueChange={handlePriceChange}
          />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="min-price">Min</Label>
              <div className="mt-1">R$ {priceRange[0]}</div>
            </div>
            <div>
              <Label htmlFor="max-price">Max</Label>
              <div className="mt-1">R$ {priceRange[1]}</div>
            </div>
          </div>

          <Button onClick={applyPriceFilter} className="w-full">
            Aplicar
          </Button>
        </div>
      </div>

      {hasActiveFilters && (
        <div>
          <Button variant="outline" onClick={clearAllFilters} className="w-full">
            <X className="mr-2 h-4 w-4" />
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  )
}

