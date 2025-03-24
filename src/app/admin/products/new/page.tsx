import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ProductForm from "@/components/admin/product-form"

export const metadata: Metadata = {
  title: "Adicionar Produto | Admin MINISHOP",
  description: "Adicione um novo produto à loja",
}

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Adicionar Produto</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Produto</CardTitle>
          <CardDescription>Preencha as informações do novo produto</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm />
        </CardContent>
      </Card>
    </div>
  )
}

