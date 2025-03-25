import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LandingHeader from "@/components/landing/landing-header"
import LandingFooter from "@/components/landing/landing-footer"

export const metadata: Metadata = {
  title: "Demonstração | MINISHOP",
  description: "Veja como funciona a plataforma MINISHOP",
}

export default function DemoPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />

      <main className="flex-1">
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-8">
              <h1 className="text-3xl font-bold tracking-tighter md:text-4xl">Conheça o MINISHOP em ação</h1>
              <p className="max-w-[700px] text-muted-foreground md:text-lg">
                Explore as principais funcionalidades da nossa plataforma de e-commerce
              </p>
            </div>

            <Tabs defaultValue="store" className="w-full max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="store">Loja Online</TabsTrigger>
                <TabsTrigger value="admin">Painel Administrativo</TabsTrigger>
              </TabsList>

              <TabsContent value="store" className="mt-6 space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Experiência de Compra Intuitiva</CardTitle>
                    <CardDescription>Interface moderna e responsiva para seus clientes</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="relative h-[300px] md:h-[400px] w-full rounded-lg overflow-hidden border">
                      <Image
                        src="/placeholder.svg?height=400&width=800"
                        alt="Página inicial da loja"
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Catálogo de Produtos</h3>
                        <p className="text-sm text-muted-foreground">
                          Navegação intuitiva por categorias, filtros avançados e busca rápida para encontrar produtos
                          facilmente.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">Carrinho e Checkout</h3>
                        <p className="text-sm text-muted-foreground">
                          Processo de compra simplificado com múltiplas opções de pagamento e cálculo automático de
                          frete.
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <Button asChild>
                        <Link href="/shop">Visitar Loja Demo</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Páginas de Produto Detalhadas</CardTitle>
                    <CardDescription>Apresente seus produtos com todos os detalhes necessários</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="relative h-[300px] md:h-[400px] w-full rounded-lg overflow-hidden border">
                      <Image
                        src="/placeholder.svg?height=400&width=800"
                        alt="Página de produto"
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Variações de Produto</h3>
                        <p className="text-sm text-muted-foreground">
                          Suporte para múltiplas variações como tamanho, cor e material com gerenciamento de estoque
                          individual.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">Avaliações e Comentários</h3>
                        <p className="text-sm text-muted-foreground">
                          Sistema de avaliações para aumentar a confiança dos clientes e melhorar o SEO da sua loja.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="admin" className="mt-6 space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Painel Administrativo Completo</CardTitle>
                    <CardDescription>Gerencie sua loja com facilidade através de um painel intuitivo</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="relative h-[300px] md:h-[400px] w-full rounded-lg overflow-hidden border">
                      <Image
                        src="/placeholder.svg?height=400&width=800"
                        alt="Painel administrativo"
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Dashboard Analítico</h3>
                        <p className="text-sm text-muted-foreground">
                          Visualize métricas importantes como vendas, visitas e conversões em tempo real.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">Gestão de Pedidos</h3>
                        <p className="text-sm text-muted-foreground">
                          Acompanhe e gerencie pedidos, status de entrega e histórico de compras dos clientes.
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <Button asChild>
                        <Link href="/admin/login">Acessar Painel Demo</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Gerenciamento de Produtos</CardTitle>
                    <CardDescription>Interface completa para cadastro e edição de produtos</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="relative h-[300px] md:h-[400px] w-full rounded-lg overflow-hidden border">
                      <Image
                        src="/placeholder.svg?height=400&width=800"
                        alt="Gerenciamento de produtos"
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Cadastro Simplificado</h3>
                        <p className="text-sm text-muted-foreground">
                          Adicione produtos rapidamente com um formulário intuitivo e organizado.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">Gestão de Estoque</h3>
                        <p className="text-sm text-muted-foreground">
                          Controle seu estoque com alertas automáticos e atualizações em tempo real.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-8">
              <h2 className="text-2xl font-bold tracking-tighter md:text-3xl">Pronto para começar sua jornada?</h2>
              <p className="max-w-[600px] text-muted-foreground">
                Crie sua loja online hoje mesmo e comece a vender para clientes em todo o Brasil.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button asChild size="lg">
                  <Link href="/register-store">Criar Minha Loja</Link>
                </Button>
                <Button variant="outline" asChild size="lg">
                  <Link href="/landing#pricing">Ver Planos</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}

