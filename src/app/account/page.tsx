import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, CreditCard, Settings, User } from "lucide-react"

export const metadata: Metadata = {
  title: "Minha Conta | MINISHOP",
  description: "Gerencie sua conta, pedidos e configurações",
}

export default function AccountPage() {
  return (
    <div className="container mx-auto w-full max-w-7xl px-4 py-8 space-y-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Minha Conta</h1>
        <p className="text-muted-foreground">Gerencie sua conta, pedidos e configurações</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-4">
            <User className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="mt-2">Perfil</CardTitle>
            <CardDescription>Gerencie suas informações pessoais</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Atualize seu nome, email, senha e outras informações pessoais.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/account/profile">Editar Perfil</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <Package className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="mt-2">Meus Pedidos</CardTitle>
            <CardDescription>Veja o histórico de pedidos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Acompanhe seus pedidos, veja detalhes e status de entrega.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/account/orders">Ver Pedidos</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="mt-2">Pagamento</CardTitle>
            <CardDescription>Gerencie métodos de pagamento</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Adicione ou remova cartões de crédito e outros métodos de pagamento.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/account/payment">Gerenciar</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="mt-2">Configurações</CardTitle>
            <CardDescription>Ajuste preferências da conta</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Configure notificações, privacidade e outras preferências.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/account/settings">Configurar</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

