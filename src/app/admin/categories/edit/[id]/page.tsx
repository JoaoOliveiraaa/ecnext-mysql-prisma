import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CategoryForm from "@/components/admin/category-form"
import { db } from "@/lib/db"

export const metadata: Metadata = {
  title: "Editar Categoria | Admin MINISHOP",
  description: "Edite uma categoria existente da loja",
}

interface EditCategoryPageProps {
  params: {
    id: string
  }
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  // Aguardar params
  const resolvedParams = await Promise.resolve(params);
  const categoryId = resolvedParams.id;

  // Buscar categoria
  const category = await db.category.findUnique({
    where: { id: categoryId }
  });

  // Se a categoria não existir, retornar 404
  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Editar Categoria</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Categoria</CardTitle>
          <CardDescription>Edite as informações da categoria</CardDescription>
        </CardHeader>
        <CardContent>
          <CategoryForm 
            initialData={{
              id: category.id,
              name: category.name,
              slug: category.slug,
              imageUrl: category.imageUrl
            }} 
            isEditing={true} 
          />
        </CardContent>
      </Card>
    </div>
  )
} 