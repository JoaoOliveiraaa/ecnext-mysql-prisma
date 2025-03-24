import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import BannerForm from "@/components/admin/banner-form"

export const metadata: Metadata = {
  title: "Adicionar Banner | Admin MINISHOP",
  description: "Adicione um novo banner à loja",
}

export default function NewBannerPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Adicionar Banner</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Banner</CardTitle>
          <CardDescription>Preencha as informações do novo banner</CardDescription>
        </CardHeader>
        <CardContent>
          <BannerForm />
        </CardContent>
      </Card>
    </div>
  )
}

