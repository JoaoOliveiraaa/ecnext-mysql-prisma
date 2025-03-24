import { Suspense } from "react"
import { db } from "@/lib/db"
import ProductGrid from "@/components/product-grid"
import ShopFilters from "@/components/shop-filters"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Loja | MINISHOP",
  description: "Explore nossa coleção de produtos",
}

export const dynamic = "force-dynamic"

export default async function ShopPage({
  searchParams,
}: {
  searchParams: {
    category?: string
    sort?: string
    page?: string
    min?: string
    max?: string
    q?: string
  }
}) {
  const page = searchParams?.page ? Number.parseInt(searchParams.page) : 1
  const limit = 12
  const skip = (page - 1) * limit

  // Construir a query baseada nos filtros
  const where: any = {}

  // Filtro por categoria
  if (searchParams.category) {
    where.category = {
      slug: searchParams.category,
    }
  }

  // Filtro por preço
  if (searchParams.min || searchParams.max) {
    where.price = {}

    if (searchParams.min) {
      where.price.gte = Number.parseFloat(searchParams.min)
    }

    if (searchParams.max) {
      where.price.lte = Number.parseFloat(searchParams.max)
    }
  }

  // Busca por texto
  if (searchParams.q) {
    where.OR = [
      { name: { contains: searchParams.q, mode: "insensitive" } },
      { description: { contains: searchParams.q, mode: "insensitive" } },
    ]
  }

  // Ordenação
  let orderBy: any = { createdAt: "desc" }

  if (searchParams.sort) {
    switch (searchParams.sort) {
      case "price-asc":
        orderBy = { price: "asc" }
        break
      case "price-desc":
        orderBy = { price: "desc" }
        break
      case "name-asc":
        orderBy = { name: "asc" }
        break
      case "name-desc":
        orderBy = { name: "desc" }
        break
      default:
        orderBy = { createdAt: "desc" }
    }
  }

  // Buscar produtos e categorias
  let products = []
  let totalProducts = 0
  let categories = []

  try {
    // Buscar produtos com filtros
    products = await db.product.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        category: true,
      },
    })

    // Contar total de produtos com os mesmos filtros
    totalProducts = await db.product.count({ where })

    // Buscar todas as categorias para o filtro
    categories = await db.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    })
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
  }

  const totalPages = Math.ceil(totalProducts / limit) || 1

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Loja</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <ShopFilters
            categories={categories}
            selectedCategory={searchParams.category}
            minPrice={searchParams.min}
            maxPrice={searchParams.max}
            searchQuery={searchParams.q}
            sortOption={searchParams.sort}
          />
        </div>

        <div className="lg:col-span-3">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid products={products} currentPage={page} totalPages={totalPages} totalProducts={totalProducts} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function ProductGridSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-60 w-full rounded-md" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Skeleton className="h-10 w-64" />
      </div>
    </div>
  )
}

