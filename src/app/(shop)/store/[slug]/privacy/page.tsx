import { notFound } from "next/navigation"
import { Metadata } from "next"
import { db } from "@/lib/db"
import { getStoreSettings } from "@/lib/data"

interface PrivacyPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
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
    title: `Política de Privacidade - ${store.name}`,
    description: `Política de Privacidade da ${store.name}`,
  }
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
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
      <h1 className="text-3xl font-bold mb-6">Política de Privacidade</h1>
      
      <div className="prose max-w-none">
        {settings.privacyPolicyText ? (
          <div dangerouslySetInnerHTML={{ __html: settings.privacyPolicyText }} />
        ) : (
          <div>
            <p>
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
            
            <h2>1. Introdução</h2>
            <p>
              A {store.name} está comprometida em proteger a privacidade dos usuários do nosso site. 
              Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações pessoais.
            </p>
            
            <h2>2. Informações Coletadas</h2>
            <p>
              Coletamos informações quando você se registra em nosso site, faz uma compra, inscreve-se em nosso boletim informativo 
              ou preenche um formulário. As informações coletadas incluem seu nome, endereço de e-mail, número de telefone, 
              endereço de entrega e informações de pagamento.
            </p>
            
            <h2>3. Uso das Informações</h2>
            <p>
              Utilizamos as informações coletadas para:
            </p>
            <ul>
              <li>Processar transações e enviar pedidos</li>
              <li>Enviar e-mails sobre atualizações de pedidos, novidades e promoções</li>
              <li>Melhorar nosso site e serviço ao cliente</li>
              <li>Administrar concursos, promoções ou pesquisas</li>
            </ul>
            
            <h2>4. Proteção de Informações</h2>
            <p>
              Implementamos uma variedade de medidas de segurança para manter a segurança de suas informações pessoais. 
              Utilizamos criptografia de ponta para proteger informações financeiras sensíveis transmitidas online.
            </p>
            
            <h2>5. Cookies</h2>
            <p>
              Nosso site utiliza cookies para melhorar a experiência do usuário. Cookies são pequenos arquivos que um site 
              ou seu provedor de serviços transfere para o disco rígido do seu computador através do navegador da Web.
            </p>
            
            <h2>6. Compartilhamento de Informações</h2>
            <p>
              Não vendemos, trocamos ou transferimos suas informações pessoais identificáveis para terceiros. 
              Isso não inclui terceiros confiáveis que nos auxiliam na operação do nosso site ou na condução de nossos negócios, 
              desde que essas partes concordem em manter essas informações confidenciais.
            </p>
            
            <h2>7. Consentimento</h2>
            <p>
              Ao usar nosso site, você consente com nossa política de privacidade.
            </p>
            
            <h2>8. Alterações na Política de Privacidade</h2>
            <p>
              Qualquer alteração em nossa política de privacidade será publicada nesta página.
            </p>
            
            <h2>9. Contato</h2>
            <p>
              Se você tiver dúvidas sobre esta política de privacidade, entre em contato conosco pelo e-mail {settings.contactEmail}.
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 