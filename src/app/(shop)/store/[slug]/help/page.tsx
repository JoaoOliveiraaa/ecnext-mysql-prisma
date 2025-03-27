import { notFound } from "next/navigation"
import { Metadata } from "next"
import { db } from "@/lib/db"
import { getStoreSettings } from "@/lib/data"

interface HelpPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: HelpPageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params)
  const store = await db.store.findUnique({
    where: { slug: resolvedParams.slug },
  })

  if (!store) {
    return {
      title: "Página não encontrada",
    }
  }

  return {
    title: `Ajuda - ${store.name}`,
    description: `Central de ajuda e suporte da ${store.name}`,
  }
}

export default async function HelpPage({ params }: HelpPageProps) {
  const resolvedParams = await Promise.resolve(params)
  const store = await db.store.findUnique({
    where: { slug: resolvedParams.slug },
  })

  if (!store) {
    notFound()
  }

  const settings = await getStoreSettings(store.id)

  return (
    <div className="container py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Central de Ajuda</h1>
      
      <div className="prose max-w-none">
        {settings.helpText ? (
          <div dangerouslySetInnerHTML={{ __html: settings.helpText }} />
        ) : (
          <div>
            <h2>Perguntas Frequentes</h2>
            
            <h3>Como faço um pedido?</h3>
            <p>
              Para fazer um pedido, navegue pelo nosso catálogo, selecione os produtos desejados e adicione-os ao carrinho. 
              Após finalizar suas escolhas, prossiga para o checkout onde você poderá escolher o método de pagamento e entrega.
            </p>
            
            <h3>Quais são as opções de pagamento?</h3>
            <p>
              Aceitamos cartões de crédito, boleto bancário e transferências via PIX.
            </p>
            
            <h3>Qual o prazo de entrega?</h3>
            <p>
              O prazo de entrega varia de acordo com a sua localização. Após a confirmação do pagamento, 
              os produtos são despachados em até 2 dias úteis. O prazo estimado será exibido durante o processo de checkout.
            </p>
            
            <h3>Como posso rastrear meu pedido?</h3>
            <p>
              Após o envio do seu pedido, você receberá um e-mail com o código de rastreamento e instruções para acompanhar 
              a entrega. Você também pode verificar o status do seu pedido na seção "Meus Pedidos" da sua conta.
            </p>
            
            <h3>Política de trocas e devoluções</h3>
            <p>
              Você tem até 7 dias após o recebimento do produto para solicitar a troca ou devolução. 
              Os produtos devem estar em perfeito estado, sem sinais de uso e com a embalagem original.
            </p>
            
            <h2>Entre em contato</h2>
            <p>
              Se você não encontrou a resposta para sua dúvida, entre em contato conosco através do e-mail 
              {settings.contactEmail} ou pelo telefone {settings.contactPhone}.
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 