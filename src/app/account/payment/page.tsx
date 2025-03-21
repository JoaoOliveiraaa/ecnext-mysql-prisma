import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PaymentMethodForm from "@/components/payment-method-form"

export const metadata: Metadata = {
  title: "Métodos de Pagamento | MINISHOP",
  description: "Gerencie seus métodos de pagamento",
}

export default function PaymentPage() {
  return (
    <div className="container mx-auto w-full max-w-7xl px-4 py-8 space-y-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Métodos de Pagamento</h1>
        <p className="text-muted-foreground">Gerencie seus cartões e outras formas de pagamento</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cartões de Crédito</CardTitle>
          <CardDescription>Adicione ou remova cartões de crédito para compras futuras</CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentMethodForm />
        </CardContent>
      </Card>
    </div>
  )
}

