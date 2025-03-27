import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { db } from "@/lib/db"
import { getProductBySlug, getRelatedProducts } from "@/lib/data"
import ProductDetails from "@/components/product-details"
import ProductCarousel from "@/components/product-carousel"

interface StoreProductPageProps {
  params: {
    slug: string
    productSlug: string
  }
}

export async function generateMetadata({ params }: StoreProductPageProps): Promise<Metadata> {
  // Resolver os parâmetros de forma assíncrona
  const resolvedParams = await Promise.resolve(params)
  const storeSlug = resolvedParams.slug
  const productSlug = resolvedParams.productSlug
  
  // Verificar se a loja existe
  const store = await db.store.findUnique({
    where: {
      slug: storeSlug,
    },
    select: {
      id: true,
      name: true,
    },
  })

  if (!store) {
    return {
      title: "Loja não encontrada",
      description: "A loja que você está procurando não existe.",
    }
  }

  // Buscar produto na loja específica
  const product = await db.product.findFirst({
    where: {
      slug: productSlug,
      storeId: store.id,
    },
  })

  if (!product) {
    return {
      title: "Produto não encontrado",
      description: "O produto que você está procurando não foi encontrado nesta loja.",
    }
  }

  return {
    title: `${product.name} | ${store.name}`,
    description: product.description || `Detalhes do produto ${product.name}`,
    openGraph: {
      title: product.name,
      description: product.description || `Detalhes do produto ${product.name}`,
      type: "website",
    },
  }
}

export default async function StoreProductPage({ params }: StoreProductPageProps) {
  // Resolver os parâmetros de forma assíncrona
  const resolvedParams = await Promise.resolve(params)
  const storeSlug = resolvedParams.slug
  const productSlug = resolvedParams.productSlug
  
  // Verificar se a loja existe
  const store = await db.store.findUnique({
    where: {
      slug: storeSlug,
    },
    select: {
      id: true,
      name: true,
    },
  })

  if (!store) {
    notFound()
  }

  // Buscar produto na loja específica
  const product = await db.product.findFirst({
    where: {
      slug: productSlug,
      storeId: store.id,
    },
    include: {
      category: true,
      variations: true,
    },
  })

  if (!product) {
    notFound()
  }

  // Buscar produtos relacionados da mesma loja
  const relatedProducts = await db.product.findMany({
    where: {
      storeId: store.id,
      categoryId: product.categoryId,
      id: {
        not: product.id,
      },
    },
    take: 4, // Reduzido para mostrar menos produtos
  })

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <ProductDetails product={product} relatedProducts={relatedProducts} storeSlug={storeSlug} />
    </div>
  )
} 