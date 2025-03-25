import type { Metadata } from "next"
import { notFound } from "next/navigation"
import ProductDetails from "@/components/product-details"
import { getProductBySlug, getRelatedProducts } from "@/lib/data"

type ProductPageProps = {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    return {
      title: "Produto não encontrado | MINISHOP",
      description: "O produto que você está procurando não foi encontrado.",
    }
  }

  return {
    title: `${product.name} | MINISHOP`,
    description: product.description || "Detalhes do produto",
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetails product={product} relatedProducts={relatedProducts} />
    </div>
  )
}

