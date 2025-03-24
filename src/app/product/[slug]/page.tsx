import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import ProductDetails from "@/components/product-details"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params

  try {
    const product = await db.product.findUnique({
      where: { slug },
    })

    if (!product) {
      return {
        title: "Produto não encontrado | MINISHOP",
        description: "O produto que você está procurando não foi encontrado.",
      }
    }

    return {
      title: `${product.name} | MINISHOP`,
      description: product.description.substring(0, 160),
    }
  } catch (error) {
    console.error("Erro ao buscar produto para metadata:", error)
    return {
      title: "Produto | MINISHOP",
      description: "Detalhes do produto",
    }
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = params

  let product = null
  try {
    // Tentar buscar o produto com variações
    try {
      product = await db.product.findUnique({
        where: { slug },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          variations: true,
        },
      })
    } catch (variationsError) {
      // Se falhar ao incluir variações, buscar sem elas
      console.error("Erro ao buscar variações:", variationsError)
      product = await db.product.findUnique({
        where: { slug },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      })

      // Adicionar um array vazio de variações para evitar erros no componente
      if (product) {
        product.variations = []
      }
    }
  } catch (error) {
    console.error("Erro ao buscar produto:", error)
  }

  if (!product) {
    notFound()
  }

  // Buscar produtos relacionados da mesma categoria
  let relatedProducts = []
  try {
    relatedProducts = await db.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      take: 4,
    })
  } catch (error) {
    console.error("Erro ao buscar produtos relacionados:", error)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetails product={product} relatedProducts={relatedProducts} />
    </div>
  )
}

