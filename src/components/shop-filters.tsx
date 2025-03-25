"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface Category {
  id: string
  name: string
  slug: string
}

interface ShopFiltersProps {
  categories: Category[]
}

export default function ShopFilters({ categories }: ShopFiltersProps) {
  const [priceRange, setPriceRange] = React.useState([0, 1000])
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([])

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }

  const handleReset = () => {
    setPriceRange([0, 1000])
    setSelectedCategories([])
  }

  return (
    <Card>
      <CardHeader className="px-4 py-3">
        <CardTitle className="text-lg">Filtros</CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-3 space-y-6">
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Preço</h3>
          <Slider
            defaultValue={[0, 1000]}
            max={1000}
            step={10}
            value={priceRange}
            onValueChange={setPriceRange}
          />
          <div className="flex items-center justify-between text-sm">
            <span>R$ {priceRange[0]}</span>
            <span>R$ {priceRange[1]}</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="font-medium text-sm">Categorias</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => handleCategoryChange(category.id)}
                />
                <Label htmlFor={`category-${category.id}`} className="text-sm cursor-pointer">
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={handleReset}
        >
          Limpar filtros
        </Button>
      </CardContent>
    </Card>
  )
}

