import Banner from "@/components/banner"
import FeaturedProducts from "@/components/featured-products"
import ProductCarousel from "@/components/product-carousel"
import StyleSection from "@/components/style-section"
import { getBanners, getFeaturedProducts, getNewArrivals, getPopularProducts } from "@/lib/data"

export default async function Home() {
  // Buscar dados
  const banners = await getBanners()
  const featuredProducts = await getFeaturedProducts()
  const newArrivals = await getNewArrivals()
  const popularProducts = await getPopularProducts()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* Banner principal */}
      <Banner banners={banners} />

      {/* Produtos em destaque */}
      <FeaturedProducts products={featuredProducts} />

      {/* Novos produtos */}
      <ProductCarousel
        title="Novos Produtos"
        description="Confira as novidades que acabaram de chegar"
        products={newArrivals}
      />

      {/* Seção de estilo */}
      <StyleSection />

      {/* Produtos populares */}
      <ProductCarousel
        title="Mais Vendidos"
        description="Os produtos favoritos dos nossos clientes"
        products={popularProducts}
      />
    </main>
  )
}

