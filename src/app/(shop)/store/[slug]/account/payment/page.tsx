import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PaymentMethodForm from "@/components/payment-method-form"

interface PaymentPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PaymentPageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params)
  const store = await db.store.findUnique({
    where: { slug: resolvedParams.slug },
  })

  if (!store) {
    return {
      title: "Métodos de Pagamento | Página não encontrada",
    }
  }

  return {
    title: `Métodos de Pagamento | ${store.name}`,
    description: "Gerencie seus métodos de pagamento",
  }
}

export default async function StorePaymentPage({ params }: PaymentPageProps) {
  const resolvedParams = await Promise.resolve(params)
  const store = await db.store.findUnique({
    where: { slug: resolvedParams.slug },
  })

  if (!store) {
    notFound()
  }

  return (
    <div className="container mx-auto w-full max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Métodos de Pagamento</h1>
        <p className="text-muted-foreground">Gerencie seus cartões e outros métodos de pagamento</p>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cartões Salvos</CardTitle>
            <CardDescription>
              Adicione, edite ou remova seus cartões de crédito e débito
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentMethodForm />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Métodos Alternativos</CardTitle>
            <CardDescription>
              Configure outras formas de pagamento para usar em suas compras
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">PIX</h3>
                  <p className="text-sm text-muted-foreground">
                    Pagamento instantâneo usando chave PIX
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Boleto Bancário</h3>
                  <p className="text-sm text-muted-foreground">
                    Pagamento com boleto com vencimento em até 3 dias úteis
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 