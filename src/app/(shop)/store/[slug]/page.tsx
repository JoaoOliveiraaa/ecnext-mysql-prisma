import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import ProductGrid from "@/components/product-grid"
import ShopFilters from "@/components/shop-filters"

interface StorePageProps {
  params: {
    slug: string
  }
}

export default async function StorePage({ params }: StorePageProps) {
  // Aguardar os parâmetros completos antes de desestruturar
  const slug = await params.slug

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
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{store.name}</h1>
        <p className="text-muted-foreground">
          Bem-vindo à loja {store.name}. Aqui você encontra os melhores produtos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <ShopFilters 
            categories={store.categories.map(category => ({
              id: category.id,
              name: category.name,
              slug: category.slug
            }))} 
          />
        </div>
        <div className="lg:col-span-3">
          <ProductGrid 
            products={store.products.map(product => ({
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              discountPercentage: product.discountPercentage,
              imageUrl: product.imageUrl,
              category: {
                name: product.category.name
              },
              isFeatured: product.isFeatured,
              isNew: product.isNew
            }))}
          />
        </div>
      </div>
    </div>
  )
} 