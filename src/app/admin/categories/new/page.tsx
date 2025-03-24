import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CategoryForm from "@/components/admin/category-form"

export const metadata: Metadata = {
  title: "Adicionar Categoria | Admin MINISHOP",
  description: "Adicione uma nova categoria à loja",
}

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Adicionar Categoria</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Categoria</CardTitle>
          <CardDescription>Preencha as informações da nova categoria</CardDescription>
        </CardHeader>
        <CardContent>
          <CategoryForm />
        </CardContent>
      </Card>
    </div>
  )
}

