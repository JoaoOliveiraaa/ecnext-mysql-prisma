import Banner from "@/components/banner"
import FeaturedProducts from "@/components/featured-products"
import ProductCarousel from "@/components/product-carousel"
import StyleSection from "@/components/style-section"
import { getBanner, getFeaturedProducts, getProducts, getCategories } from "@/lib/data"

export default async function Home() {
  const banner = await getBanner()
  const featuredProducts = await getFeaturedProducts()
  const newArrivals = await getProducts({ category: "new-arrivals", limit: 8 })
  const categories = await getCategories()

  return (
    <main className="flex min-h-screen flex-col items-center">
      <Banner data={banner} />

      <div className="w-full max-w-7xl px-4 py-8 space-y-12">
        <FeaturedProducts products={featuredProducts} />

        <ProductCarousel title="Novos Produtos" products={newArrivals} />

        <StyleSection categories={categories} />
      </div>
    </main>
  )
}

