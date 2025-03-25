import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import BannerForm from "@/components/admin/banner-form"
import { db } from "@/lib/db"

export const metadata: Metadata = {
  title: "Editar Banner | Admin MINISHOP",
  description: "Edite um banner existente da loja",
}

export default async function EditBannerPage({
  params,
}: {
  params: { id: string }
}) {
  // Aguardar os parâmetros para evitar erro de API síncrona
  const resolvedParams = await Promise.resolve(params)
  const { id } = resolvedParams

  // Buscar o banner pelo ID
  let banner = null
  try {
    banner = await db.banner.findUnique({
      where: { id },
    })
  } catch (error) {
    console.error("Erro ao buscar banner:", error)
  }

  if (!banner) {
    return notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Editar Banner</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Banner</CardTitle>
          <CardDescription>Atualize as informações do banner</CardDescription>
        </CardHeader>
        <CardContent>
          <BannerForm initialData={banner} />
        </CardContent>
      </Card>
    </div>
  )
}
