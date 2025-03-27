import { notFound, redirect } from "next/navigation"
import { Metadata } from "next"
import { db } from "@/lib/db"
import { getCategories, getBanners, getNewProducts, getStoreSettings } from "@/lib/data"
import Banner from "@/components/banner"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"

interface StorePageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params)
  const store = await db.store.findUnique({
    where: { slug: resolvedParams.slug },
  })

  if (!store) {
    return {
      title: "Loja não encontrada",
    }
  }

  return {
    title: store.name,
    description: `Bem-vindo à ${store.name}. Confira nossos produtos e ofertas.`,
  }
}

export default async function StorePage({ params }: StorePageProps) {
  const resolvedParams = await Promise.resolve(params)
  const store = await db.store.findUnique({
    where: { slug: resolvedParams.slug },
  })

  if (!store) {
    notFound()
  }

  const categories = await getCategories(store.id)
  const banners = await getBanners(store.id)
  const newProducts = await getNewProducts(store.id)
  const settings = await getStoreSettings(store.id)

  return (
    <main className="flex-1">
      <div className="w-full max-w-7xl mx-auto">
        {/* Banners */}
        {banners.length > 0 ? (
          <Banner 
            data={{
              id: banners[0].id,
              title: banners[0].title,
              description: banners[0].description,
              imageUrl: banners[0].imageUrl,
              primaryButtonText: banners[0].primaryButtonText,
              primaryButtonLink: banners[0].primaryButtonLink,
              secondaryButtonText: banners[0].secondaryButtonText,
              secondaryButtonLink: banners[0].secondaryButtonLink,
              isActive: banners[0].isActive,
              createdAt: banners[0].createdAt,
              updatedAt: banners[0].updatedAt
            }}
          />
        ) : (
          <div className="w-full max-w-7xl mx-auto px-4 py-6">
            <div className="relative w-full rounded-lg bg-muted overflow-hidden">
              <div className="flex flex-col md:flex-row items-center">
                <div className="p-8 md:p-12 space-y-4 md:w-1/2">
                  <h1 className="text-3xl md:text-4xl font-bold">Bem-vindo à {store.name}</h1>
                  <p className="text-muted-foreground">
                    Aqui você encontra os melhores produtos com preços imbatíveis.
                  </p>
                  <div className="flex gap-4">
                    <Button asChild variant="default">
                      <Link href={`/store/${store.slug}/categories`}>Ver Categorias</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href={`/store/${store.slug}/about`}>Sobre nós</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Categorias */}
        <div className="w-full max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold mb-6">Categorias</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                href={`/store/${store.slug}/category/${category.slug}`}
                className="group block bg-card hover:bg-card/90 rounded-lg p-4 text-center transition"
              >
                <div className="font-medium group-hover:text-primary transition">{category.name}</div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Produtos Novos */}
        <div className="w-full max-w-7xl mx-auto px-4 py-10 mb-8">
          <h2 className="text-2xl font-bold mb-6">Novidades</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} storeSlug={store.slug} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}