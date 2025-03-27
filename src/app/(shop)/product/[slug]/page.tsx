import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { getProductBySlug, getRelatedProducts } from "@/lib/data"
import ProductDetails from "@/components/product-details"
import ProductCarousel from "@/components/product-carousel"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  // Aguardar os parâmetros antes de usá-los
  const paramsResolved = await Promise.resolve(params);
  const product = await getProductBySlug(paramsResolved.slug)        

  if (!product) {
    return {
      title: "Produto não encontrado",
      description: "O produto que você está procurando não foi encontrado.",
    }
  }

  return {
    title: `${product.name} | MINISHOP`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      type: "website",
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Aguardar os parâmetros antes de usá-los
  const paramsResolved = await Promise.resolve(params);
  const product = await getProductBySlug(paramsResolved.slug)        

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.id)

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <ProductDetails product={product} relatedProducts={relatedProducts} />

      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">Produtos Relacionados</h2>
          <ProductCarousel title="Produtos Relacionados" products={relatedProducts} />
        </div>
      )}
    </div>
  )
}

