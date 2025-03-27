import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import Banner from "@/components/banner"
import { getBanners, getFeaturedProducts, getNewArrivals, getPopularProducts, getCategories } from "@/lib/data"

export default async function Home() {
  // Buscar dados
  const banners = await getBanners()
  const featuredProducts = await getFeaturedProducts()
  const newArrivals = await getNewArrivals()
  const popularProducts = await getPopularProducts()
  const categories = await getCategories()

  // Pegar o primeiro banner (o mais recente)
  const primaryBanner = banners.length > 0 ? banners[0] : null

  return (
    <main className="flex min-h-screen flex-col">
      {/* Banner principal */}
      <div className="w-full max-w-7xl mx-auto">
        {primaryBanner ? (
          <Banner data={primaryBanner} />
        ) : (
          <div className="w-full max-w-7xl mx-auto px-4 py-6">
            <div className="relative w-full rounded-lg bg-muted overflow-hidden">
              <div className="flex flex-col md:flex-row items-center">
                <div className="p-8 md:p-12 space-y-4 md:w-1/2">
                  <h1 className="text-3xl md:text-4xl font-bold">Bem-vindo ao MINISHOP</h1>
                  <p className="text-muted-foreground">
                    Encontre os melhores produtos com preços imbatíveis.
                  </p>
                  <div className="flex gap-4">
                    <Button asChild variant="default">
                      <Link href="/shop">Ver Produtos</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/categories">Ver Categorias</Link>
                    </Button>
                  </div>
                </div>
                <div className="md:w-1/2 flex justify-center">
                  <div className="relative h-[300px] w-full max-w-[500px]">
                    <Image
                      src="/placeholder.svg"
                      alt="MINISHOP"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Categorias em carrossel */}
      <div className="w-full max-w-7xl mx-auto px-4 py-10 bg-gray-50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Categorias</h2>
          <Link href="/categories" className="text-primary hover:underline">
            Ver todas
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.slice(0, 8).map((category) => (
            <div key={category.id} className="group relative overflow-hidden rounded-lg bg-white shadow hover:shadow-md transition-all">
              <Link href={`/shop?category=${category.slug}`} className="block p-6 text-center">
                <h3 className="text-lg font-medium">{category.name}</h3>
                <span className="text-sm text-muted-foreground mt-1 block">
                  Explorar
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Produtos em destaque */}
      <div className="w-full max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Produtos em Destaque</h2>
          <Link href="/shop?featured=true" className="text-primary hover:underline">
            Ver todos
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Banner promocional (segundo banner, se existir) */}
      {banners.length > 1 ? (
        <div className="w-full max-w-7xl mx-auto">
          <Banner data={banners[1]} />
        </div>
      ) : (
        <div className="w-full max-w-7xl mx-auto px-4 py-10">
          <div className="relative w-full rounded-lg bg-primary/10 overflow-hidden">
            <div className="p-8 md:p-12 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold">Promoção Especial</h2>
              <p className="text-muted-foreground">
                Compre agora e ganhe 10% de desconto em toda a loja. Use o código PROMO10.
              </p>
              <Button asChild variant="default">
                <Link href="/shop">Comprar Agora</Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Novos produtos */}
      <div className="w-full max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Novos Produtos</h2>
          <Link href="/shop?sort=newest" className="text-primary hover:underline">
            Ver todos
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {newArrivals.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Produtos populares */}
      <div className="w-full max-w-7xl mx-auto px-4 py-10 mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Mais Vendidos</h2>
          <Link href="/shop?sort=popular" className="text-primary hover:underline">
            Ver todos
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {popularProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  )
}

