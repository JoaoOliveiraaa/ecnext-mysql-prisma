import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ProfileForm from "@/components/profile-form"
import AddressForm from "@/components/address-form"

export const metadata: Metadata = {
  title: "Meu Perfil | MINISHOP",
  description: "Gerencie suas informações pessoais e endereços",
}

export default function ProfilePage() {
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

