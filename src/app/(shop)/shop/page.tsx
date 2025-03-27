import type { Metadata } from "next"
import ProductGrid from "@/components/product-grid"
import ShopFilters from "@/components/shop-filters"
import { getProducts, getCategories } from "@/lib/data"

export const metadata: Metadata = {
  title: "Loja | MINISHOP",
  description: "Explore nossa coleção de produtos",
}

export default async function ShopPage() {
  const products = await getProducts()
  const categories = await getCategories()

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Todos os Produtos</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <ShopFilters categories={categories} />
        </div>

        <div className="md:col-span-3">
          <div className="mb-4 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Mostrando {products.length} produto(s)
            </p>
          </div>
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  )
}

