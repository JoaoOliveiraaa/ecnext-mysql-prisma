import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ProfileForm from "@/components/profile-form"
import AddressForm from "@/components/address-form"
import { db } from "@/lib/db"

interface ProfilePageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params)
  const store = await db.store.findUnique({
    where: { slug: resolvedParams.slug },
  })

  if (!store) {
    return {
      title: "Perfil | Página não encontrada",
    }
  }

  return {
    title: `Meu Perfil | ${store.name}`,
    description: "Gerencie suas informações pessoais e endereços",
  }
}

export default async function StoreProfilePage({ params }: ProfilePageProps) {
  const resolvedParams = await Promise.resolve(params)
  const store = await db.store.findUnique({
    where: { slug: resolvedParams.slug },
  })

  if (!store) {
    notFound()
  }

  return (
    <div className="container mx-auto w-full max-w-7xl px-4 py-8 space-y-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Meu Perfil</h1>
        <p className="text-muted-foreground">Gerencie suas informações pessoais e endereços</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Atualize seus dados pessoais</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Endereços</CardTitle>
            <CardDescription>Gerencie seus endereços de entrega</CardDescription>
          </CardHeader>
          <CardContent>
            <AddressForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 