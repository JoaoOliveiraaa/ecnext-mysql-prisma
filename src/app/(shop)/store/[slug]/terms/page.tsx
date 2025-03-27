import { notFound } from "next/navigation"
import { Metadata } from "next"
import { db } from "@/lib/db"
import { getStoreSettings } from "@/lib/data"

interface TermsPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
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
    title: `Termos de Serviço - ${store.name}`,
    description: `Termos de Serviço da ${store.name}`,
  }
}

export default async function TermsPage({ params }: TermsPageProps) {
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
      <h1 className="text-3xl font-bold mb-6">Termos de Serviço</h1>
      
      <div className="prose max-w-none">
        {settings.termsOfServiceText ? (
          <div dangerouslySetInnerHTML={{ __html: settings.termsOfServiceText }} />
        ) : (
          <div>
            <p>
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
            
            <h2>1. Aceitação dos Termos</h2>
            <p>
              Ao acessar ou usar o site da {store.name}, você concorda em cumprir estes Termos de Serviço e todas as leis e regulamentos aplicáveis. 
              Se você não concordar com algum destes termos, está proibido de usar ou acessar este site.
            </p>
            
            <h2>2. Uso da Loja</h2>
            <p>
              Você deve ter pelo menos 18 anos de idade ou possuir consentimento legal dos pais ou responsáveis para usar nossos serviços. 
              Ao utilizar nosso site, você garante que tem idade legal para aceitar estes Termos e criar obrigações legais vinculativas.
            </p>
            
            <h2>3. Precisão e Atualização de Informações</h2>
            <p>
              Nós nos esforçamos para garantir que o conteúdo em nossa loja seja preciso, completo e atual. No entanto, não garantimos 
              que o conteúdo em nosso site esteja livre de erros, omissões ou desatualizações.
            </p>
            
            <h2>4. Produtos e Preços</h2>
            <p>
              Reservamo-nos o direito de modificar os preços dos produtos a qualquer momento. Todas as descrições de produtos e preços 
              estão sujeitos a alterações a qualquer momento, sem aviso prévio, a nosso critério exclusivo.
            </p>
            
            <h2>5. Compras e Pagamentos</h2>
            <p>
              Ao fazer um pedido, você declara que os produtos adquiridos serão para seu uso próprio e não para revenda. 
              Reservamo-nos o direito de limitar ou proibir pedidos que, a nosso exclusivo critério, pareçam ser feitos por revendedores ou distribuidores.
            </p>
            
            <h2>6. Entrega de Produtos</h2>
            <p>
              Os prazos de entrega são apenas estimativas e não podemos garantir que os produtos serão entregues exatamente no prazo estimado. 
              Não nos responsabilizamos por atrasos na entrega causados por circunstâncias fora do nosso controle.
            </p>
            
            <h2>7. Política de Cancelamento e Devolução</h2>
            <p>
              Você tem o direito de cancelar seu pedido em até 7 dias após o recebimento do produto, de acordo com o Código de Defesa do Consumidor. 
              Para devoluções, o produto deve estar em condições de revenda, na embalagem original e acompanhado da nota fiscal.
            </p>
            
            <h2>8. Limitação de Responsabilidade</h2>
            <p>
              Em nenhum caso a {store.name} será responsável por quaisquer danos indiretos, incidentais, especiais, punitivos ou consequentes 
              resultantes do uso ou incapacidade de usar nossos produtos ou serviços.
            </p>
            
            <h2>9. Alterações nos Termos</h2>
            <p>
              Reservamo-nos o direito de atualizar, alterar ou substituir qualquer parte destes Termos de Serviço a qualquer momento. 
              É sua responsabilidade verificar periodicamente se houve alterações.
            </p>
            
            <h2>10. Contato</h2>
            <p>
              Para mais informações sobre nossos Termos de Serviço, entre em contato conosco pelo e-mail {settings.contactEmail}.
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 