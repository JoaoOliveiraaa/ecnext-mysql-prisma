import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import LandingHeader from "@/components/landing/landing-header"
import LandingFooter from "@/components/landing/landing-footer"
import FeatureCard from "@/components/landing/feature-card"
import PricingCard from "@/components/landing/pricing-card"
import TestimonialCard from "@/components/landing/testimonial-card"
import FaqAccordion from "@/components/landing/faq-accordion"
import { ShoppingBag, Users, BarChart4, Zap, Shield } from "lucide-react"

export const metadata: Metadata = {
  title: "MINISHOP - Sua Loja Online em Minutos",
  description: "Crie sua loja online completa em minutos com MINISHOP. Fácil de configurar, poderosa para vender.",
}

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />

      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-primary/10 to-background">
        <div className="container max-w-7xl mx-auto px-4 md:px-4">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Sua Loja Online Completa em Minutos
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Crie, gerencie e escale seu e-commerce com facilidade. Sem conhecimentos técnicos necessários.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link href="/register-store">Começar Agora</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/demo">Ver Demonstração</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background" id="features">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Tudo que você precisa para vender online
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Uma plataforma completa com todas as ferramentas para criar e gerenciar sua loja online.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 pt-8">
              <FeatureCard
                icon={<ShoppingBag className="h-10 w-10 text-primary" />}
                title="Catálogo de Produtos"
                description="Gerencie facilmente seus produtos, categorias, variações e estoque em um só lugar."
              />
              <FeatureCard
                icon={<Users className="h-10 w-10 text-primary" />}
                title="Gestão de Clientes"
                description="Acompanhe pedidos, histórico de compras e preferências dos seus clientes."
              />
              <FeatureCard
                icon={<BarChart4 className="h-10 w-10 text-primary" />}
                title="Relatórios Detalhados"
                description="Analise o desempenho da sua loja com relatórios e métricas em tempo real."
              />
              <FeatureCard
                icon={<Zap className="h-10 w-10 text-primary" />}
                title="Rápido e Responsivo"
                description="Loja otimizada para todos os dispositivos, garantindo a melhor experiência para seus clientes."
              />
              <FeatureCard
                icon={<Shield className="h-10 w-10 text-primary" />}
                title="Segurança Integrada"
                description="Proteção de dados e pagamentos seguros para você e seus clientes."
              />
              <FeatureCard
                icon={<ShoppingBag className="h-10 w-10 text-primary" />}
                title="Múltiplos Métodos de Pagamento"
                description="Aceite diversos métodos de pagamento para facilitar a compra dos seus clientes."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-muted/50" id="pricing">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Planos que crescem com seu negócio</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Escolha o plano ideal para o tamanho do seu negócio. Sem taxas ocultas.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8 pt-8">
              <PricingCard
                title="Iniciante"
                price="R$ 49"
                description="Perfeito para quem está começando"
                features={["Até 100 produtos", "2 usuários administradores", "Relatórios básicos", "Suporte por email"]}
                buttonText="Começar Grátis"
                buttonLink="/register-store"
                popular={false}
              />
              <PricingCard
                title="Profissional"
                price="R$ 99"
                description="Para negócios em crescimento"
                features={[
                  "Até 1.000 produtos",
                  "5 usuários administradores",
                  "Relatórios avançados",
                  "Suporte prioritário",
                  "Personalização avançada",
                ]}
                buttonText="Escolher Plano"
                buttonLink="/register-store"
                popular={true}
              />
              <PricingCard
                title="Empresarial"
                price="R$ 199"
                description="Para operações de grande escala"
                features={[
                  "Produtos ilimitados",
                  "Usuários ilimitados",
                  "Relatórios personalizados",
                  "Suporte 24/7",
                  "API completa",
                  "Integrações avançadas",
                ]}
                buttonText="Falar com Vendas"
                buttonLink="/register-store"
                popular={false}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background" id="testimonials">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">O que nossos clientes dizem</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Histórias de sucesso de empreendedores que transformaram seus negócios com MINISHOP.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8 pt-8">
              <TestimonialCard
                quote="Consegui montar minha loja online em menos de um dia. As vendas aumentaram 40% no primeiro mês!"
                author="Ana Silva"
                role="Proprietária, Moda Elegante"
              />
              <TestimonialCard
                quote="Interface intuitiva e suporte excelente. Finalmente uma plataforma que entende as necessidades de pequenos lojistas."
                author="Carlos Mendes"
                role="CEO, Tech Gadgets"
              />
              <TestimonialCard
                quote="A facilidade de gerenciar produtos e pedidos me economiza horas por semana. Valeu cada centavo!"
                author="Mariana Costa"
                role="Fundadora, Aromas Naturais"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/50" id="faq">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Perguntas Frequentes</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Respostas para as dúvidas mais comuns sobre nossa plataforma.
              </p>
            </div>

            <div className="w-full max-w-3xl mx-auto pt-8">
              <FaqAccordion
                items={[
                  {
                    question: "Quanto tempo leva para configurar minha loja?",
                    answer:
                      "A maioria dos nossos clientes consegue configurar uma loja básica em menos de 1 hora. Para lojas mais complexas com muitos produtos, pode levar algumas horas adicionais.",
                  },
                  {
                    question: "Preciso ter conhecimentos técnicos?",
                    answer:
                      "Não! Nossa plataforma foi projetada para ser fácil de usar, mesmo para quem não tem experiência técnica. A interface intuitiva permite que você configure tudo sem precisar de conhecimentos de programação.",
                  },
                  {
                    question: "Posso personalizar o design da minha loja?",
                    answer:
                      "Sim, oferecemos várias opções de personalização. Você pode escolher entre diferentes temas, cores, fontes e layouts para criar uma loja que reflita a identidade da sua marca.",
                  },
                  {
                    question: "Como funciona o processo de pagamento?",
                    answer:
                      "Nossa plataforma integra com os principais gateways de pagamento do mercado. Você pode escolher quais métodos de pagamento deseja oferecer aos seus clientes, como cartão de crédito, boleto, PIX e outros.",
                  },
                  {
                    question: "Existe alguma taxa por venda?",
                    answer:
                      "Não cobramos comissões por venda. Você paga apenas a mensalidade do plano escolhido, independentemente do volume de vendas da sua loja.",
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Pronto para começar a vender online?</h2>
              <p className="mx-auto max-w-[700px] md:text-xl">
                Crie sua loja agora e comece a vender em minutos. Sem complicações, sem conhecimentos técnicos.
              </p>
            </div>
            <div className="space-x-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register-store">Criar Minha Loja</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  )
}

