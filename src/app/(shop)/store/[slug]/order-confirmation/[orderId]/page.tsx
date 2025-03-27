"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, formatDate } from "@/lib/utils"
import { CheckCircle, ShoppingBag, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface OrderItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  imageUrl: string
  variations?: any
}

interface Order {
  id: string
  status: string
  total: number
  shippingName: string
  shippingEmail: string
  shippingPhone: string | null
  shippingAddress: string
  shippingCity: string
  shippingState: string
  shippingZipCode: string
  paymentMethod: string
  paymentStatus: string
  createdAt: string
  items: OrderItem[]
}

export default function OrderConfirmationPage() {
  const params = useParams()
  const orderId = params.orderId as string
  const storeSlug = params.slug as string
  const router = useRouter()
  const { toast } = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Buscar detalhes do pedido
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Erro ao buscar detalhes do pedido")
        }

        setOrder(data)
      } catch (error) {
        console.error("Erro ao buscar pedido:", error)
        setError(error instanceof Error ? error.message : "Ocorreu um erro ao buscar os detalhes do pedido")
        toast({
          title: "Erro",
          description: "Não foi possível obter os detalhes do pedido",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId, toast])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container mx-auto max-w-7xl py-10 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">Pedido não encontrado</CardTitle>
            <CardDescription className="text-center">
              Não foi possível encontrar os detalhes do pedido solicitado
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href={`/store/${storeSlug}`}>Voltar para a loja</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl py-10 px-4 sm:px-6 lg:px-8">
      <Card className="mb-8">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl">Pedido Confirmado!</CardTitle>
          <CardDescription>
            Seu pedido #{order.id.substring(0, 8)} foi recebido e está sendo processado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-2 rounded-md bg-muted p-4">
            <div className="text-sm">Data do pedido: {formatDate(order.createdAt)}</div>
            <div className="mt-2 text-sm">
              Status: <span className="font-medium">{order.status === "pending" ? "Aguardando pagamento" : order.status}</span>
            </div>
            <div className="mt-2 text-sm">
              Pagamento: <span className="font-medium">{order.paymentMethod === "stripe" ? "Cartão de Crédito" : "Pix"}</span> -{" "}
              <span className="font-medium">
                {order.paymentStatus === "pending" ? "Aguardando pagamento" : order.paymentStatus}
              </span>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-semibold">Endereço de Entrega</h3>
              <div className="mt-2 text-sm">
                <p>{order.shippingName}</p>
                <p>{order.shippingAddress}</p>
                <p>
                  {order.shippingCity}, {order.shippingState} - {order.shippingZipCode}
                </p>
                <p>{order.shippingPhone}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold">Resumo do Pedido</h3>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Frete</span>
                  <span>Grátis</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <h3 className="mb-4 font-semibold">Itens do Pedido</h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Quantidade: {item.quantity} x {formatCurrency(item.price)}
                  </div>
                  {item.variations && Object.entries(item.variations).length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {Object.entries(item.variations).map(([key, value]) => (
                        <span key={key} className="mr-2">
                          {key}: {String(value)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(item.price * item.quantity)}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-x-4 sm:space-y-0">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href={`/store/${storeSlug}`}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continue comprando
            </Link>
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href={`/store/${storeSlug}/account/orders`}>Meus pedidos</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 