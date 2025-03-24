import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ProductEditForm from "@/components/admin/product-edit-form"
import { db } from "@/lib/db"

export const metadata: Metadata = {
  title: "Editar Produto | Admin MINISHOP",
  description: "Edite as informações do produto",
}

export const dynamic = "force-dynamic"

export default async function EditProductPage({
  params,
}: {
  params: { id: string }
}) {
  // Aguardar os parâmetros antes de acessar suas propriedades
  const resolvedParams = await Promise.resolve(params)
  const id = resolvedParams.id

  // Buscar o produto pelo ID
  let product = null
  try {
    product = await db.product.findUnique({
      where: { id },
      include: {
        category: true,
        variations: true,
      },
    })
  } catch (error) {
    console.error("Erro ao buscar produto:", error)
  }

  // Se o produto não existir, retornar 404
  if (!product) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Editar Produto</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Produto</CardTitle>
          <CardDescription>Atualize as informações do produto</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductEditForm product={product} />
        </CardContent>
      </Card>
    </div>
  )
}

