import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface SettingsPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: SettingsPageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params)
  const store = await db.store.findUnique({
    where: { slug: resolvedParams.slug },
  })

  if (!store) {
    return {
      title: "Configurações | Página não encontrada",
    }
  }

  return {
    title: `Configurações da Conta | ${store.name}`,
    description: "Gerencie as configurações da sua conta",
  }
}

export default async function StoreSettingsPage({ params }: SettingsPageProps) {
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
        <h1 className="text-3xl font-bold">Configurações da Conta</h1>
        <p className="text-muted-foreground">Gerencie as preferências da sua conta</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Preferências</CardTitle>
          <CardDescription>
            Personalize sua experiência de compra
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Notificações</h3>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Emails de ofertas</p>
                  <p className="text-sm text-muted-foreground">
                    Receba emails com ofertas exclusivas e promoções
                  </p>
                </div>
                <div className="h-6 w-11 cursor-pointer rounded-full bg-primary">
                  <div className="h-5 w-5 translate-x-5 transform rounded-full bg-white shadow-sm transition-transform"></div>
                </div>
              </div>
              
              <Separator className="my-1" />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Atualizações de pedidos</p>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações sobre o status dos seus pedidos
                  </p>
                </div>
                <div className="h-6 w-11 cursor-pointer rounded-full bg-primary">
                  <div className="h-5 w-5 translate-x-5 transform rounded-full bg-white shadow-sm transition-transform"></div>
                </div>
              </div>
              
              <Separator className="my-1" />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Newsletter</p>
                  <p className="text-sm text-muted-foreground">
                    Receba notícias e novidades sobre produtos
                  </p>
                </div>
                <div className="h-6 w-11 cursor-pointer rounded-full bg-muted">
                  <div className="h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform"></div>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-medium mb-2">Privacidade</h3>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Salvar histórico de navegação</p>
                  <p className="text-sm text-muted-foreground">
                    Armazenar histórico de produtos visualizados
                  </p>
                </div>
                <div className="h-6 w-11 cursor-pointer rounded-full bg-primary">
                  <div className="h-5 w-5 translate-x-5 transform rounded-full bg-white shadow-sm transition-transform"></div>
                </div>
              </div>
              
              <Separator className="my-1" />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Recomendações personalizadas</p>
                  <p className="text-sm text-muted-foreground">
                    Receba sugestões baseadas em suas preferências
                  </p>
                </div>
                <div className="h-6 w-11 cursor-pointer rounded-full bg-primary">
                  <div className="h-5 w-5 translate-x-5 transform rounded-full bg-white shadow-sm transition-transform"></div>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-medium mb-2">Tema</h3>
            <div className="grid gap-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border border-primary flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  </div>
                  <span>Claro</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border">
                    <div></div>
                  </div>
                  <span>Escuro</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border">
                    <div></div>
                  </div>
                  <span>Sistema</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 