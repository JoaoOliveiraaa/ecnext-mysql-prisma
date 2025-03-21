import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { getOrders } from "@/lib/data"

export const metadata: Metadata = {
  title: "Meus Pedidos | MINISHOP",
  description: "Histórico e detalhes dos seus pedidos",
}

export default async function OrdersPage() {
  const orders = await getOrders()

  return (
    <div className="container mx-auto w-full max-w-7xl px-4 py-8 space-y-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meus Pedidos</h1>
          <p className="text-muted-foreground">Histórico e detalhes dos seus pedidos</p>
        </div>
        <Button asChild>
          <Link href="/shop">Continuar Comprando</Link>
        </Button>
      </div>

      <div className="space-y-6">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <p className="mb-4 text-lg font-medium">Você ainda não fez nenhum pedido</p>
              <Button asChild>
                <Link href="/shop">Começar a Comprar</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Pedido {order.id}</CardTitle>
                  <Badge
                    variant={
                      order.status === "Entregue" ? "default" : order.status === "Em trânsito" ? "secondary" : "outline"
                    }
                  >
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium">Data do Pedido</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Itens</p>
                    <p className="text-sm text-muted-foreground">{order.items.length} produtos</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Total</p>
                    <p className="text-sm text-muted-foreground">{formatCurrency(order.total)}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/account/orders/${order.id}`}>Ver Detalhes</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

