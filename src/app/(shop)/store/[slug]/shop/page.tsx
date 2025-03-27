import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import ProductGrid from "@/components/product-grid"
import ShopFilters from "@/components/shop-filters"

interface ShopPageProps {
  params: {
    slug: string
  }
}

export default async function ShopPage(props: ShopPageProps) {
  // Aguarde os parâmetros antes de usá-los
  const params = await Promise.resolve(props.params);
  const slug = params.slug;

  // Buscar a loja pelo slug
  const store = await db.store.findUnique({
    where: { slug },
    include: {
      products: {
        include: {
          category: true
        }
      },
      categories: true
    }
  })

  // Se a loja não existir, retornar 404
  if (!store) {
    notFound()
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Produtos - {store.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <ShopFilters categories={store.categories} />
        </div>

        <div className="md:col-span-3">
          <div className="mb-4 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Mostrando {store.products.length} produto(s)
            </p>
          </div>
          <ProductGrid products={store.products} storeSlug={slug} />
        </div>
      </div>
    </div>
  )
} 