import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { db } from "@/lib/db"
import { getOrderById } from "@/lib/data"

interface OrderDetailsPageProps {
  params: {
    slug: string
    id: string
  }
}

// Definir interfaces para tipagem correta
interface OrderItem {
  id: string
  quantity: number
  product: {
    name: string
    price: number
    images: { url: string }[]
  }
}

interface OrderAddress {
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
  postalCode: string
}

interface Order {
  id: string
  status: string
  createdAt: Date
  total: number
  shipping: number
  items: OrderItem[]
  address: OrderAddress
  paymentMethod: string
}

export async function generateMetadata({ params }: OrderDetailsPageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params)
  const store = await db.store.findUnique({
    where: { slug: resolvedParams.slug },
  })

  if (!store) {
    return {
      title: "Detalhes do Pedido | Página não encontrada",
    }
  }

  return {
    title: `Pedido #${params.id} | ${store.name}`,
    description: "Detalhes do pedido",
  }
}

export default async function StoreOrderDetailsPage({ params }: OrderDetailsPageProps) {
  const resolvedParams = await Promise.resolve(params)
  const store = await db.store.findUnique({
    where: { slug: resolvedParams.slug },
  })

  if (!store) {
    notFound()
  }

  const order = await getOrderById(params.id)

  if (!order) {
    return (
      <div className="container mx-auto w-full max-w-7xl px-4 py-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Pedido não encontrado</h1>
            <p className="text-muted-foreground">
              O pedido que você está procurando não existe ou não está disponível.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href={`/store/${store.slug}/account/orders`}>Voltar aos pedidos</Link>
          </Button>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="mb-4 text-lg font-medium">Pedido não encontrado</p>
            <Button asChild>
              <Link href={`/store/${store.slug}`}>Ir para a loja</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto w-full max-w-7xl px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Pedido #{params.id}</h1>
          <p className="text-muted-foreground">
            Este pedido não contém dados pois é uma simulação.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/store/${store.slug}/account/orders`}>Voltar aos pedidos</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="py-10">
          <p className="text-center text-lg mb-6">
            Esta é apenas uma página de exemplo. Em uma implementação real, aqui seriam exibidos os detalhes do seu pedido.
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 