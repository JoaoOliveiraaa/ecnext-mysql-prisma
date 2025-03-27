import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { db } from "@/lib/db"
import { getOrders } from "@/lib/data"

interface OrdersPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: OrdersPageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params)
  const store = await db.store.findUnique({
    where: { slug: resolvedParams.slug },
  })

  if (!store) {
    return {
      title: "Pedidos | Página não encontrada",
    }
  }

  return {
    title: `Meus Pedidos | ${store.name}`,
    description: "Visualize e acompanhe seus pedidos",
  }
}

export default async function StoreOrdersPage({ params }: OrdersPageProps) {
  const resolvedParams = await Promise.resolve(params)
  const store = await db.store.findUnique({
    where: { slug: resolvedParams.slug },
  })

  if (!store) {
    notFound()
  }

  // Obter pedidos do usuário
  const orders = await getOrders()

  return (
    <div className="container mx-auto w-full max-w-7xl px-4 py-8 space-y-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meus Pedidos</h1>
          <p className="text-muted-foreground">Histórico e detalhes dos seus pedidos</p>
        </div>
        <Button asChild>
          <Link href={`/store/${store.slug}`}>Continuar Comprando</Link>
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="mb-4 text-lg font-medium">Você ainda não fez nenhum pedido</p>
            <Button asChild>
              <Link href={`/store/${store.slug}`}>Começar a Comprar</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 