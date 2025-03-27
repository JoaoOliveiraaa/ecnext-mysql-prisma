import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { getOrders } from "@/lib/data"

interface OrderDetailsPageProps {
  params: {
    id: string
  }
}

export default async function OrderDetailsPage(props: OrderDetailsPageProps) {
  // Aguardar os params antes de usá-los
  const params = await Promise.resolve(props.params);
  const orderId = params.id;
  
  // Buscar todos os pedidos e filtrar pelo ID
  const orders = await getOrders();
  const order = orders.find(order => order.id === orderId);
  
  if (!order) {
    notFound();
  }
  
  return (
    <div className="container mx-auto w-full max-w-7xl px-4 py-8 space-y-6">
      <div className="mb-8">
        <Link href="/account/orders" className="flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para pedidos
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Pedido {order.id}</h1>
            <p className="text-muted-foreground">Realizado em {new Date(order.createdAt).toLocaleDateString("pt-BR")}</p>
          </div>
          <Badge className="w-fit" variant={
            order.status === "Entregue" ? "default" : 
            order.status === "Em trânsito" ? "secondary" : "outline"
          }>
            {order.status}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Itens do Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded bg-muted">
                    <Image
                      src="/placeholder.svg" 
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Qtd: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.quantity} x {formatCurrency(item.price)}
                  </p>
                </div>
              </div>
            ))}
            
            <div className="mt-6 space-y-2 text-right">
              <div className="flex justify-between">
                <p className="font-medium">Subtotal</p>
                <p className="font-medium">{formatCurrency(order.total)}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-medium">Frete</p>
                <p className="font-medium">Grátis</p>
              </div>
              <div className="flex justify-between border-t pt-2">
                <p className="text-lg font-bold">Total</p>
                <p className="text-lg font-bold">{formatCurrency(order.total)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/account/orders">Voltar para pedidos</Link>
        </Button>
        <Button asChild>
          <Link href="/shop">Continuar comprando</Link>
        </Button>
      </div>
    </div>
  )
} 