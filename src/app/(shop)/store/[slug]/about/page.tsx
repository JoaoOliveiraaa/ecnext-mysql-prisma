import { notFound } from "next/navigation"
import { Metadata } from "next"
import { db } from "@/lib/db"
import { getStoreSettings } from "@/lib/data"

interface AboutPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
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
    title: `Sobre - ${store.name}`,
    description: `Saiba mais sobre a ${store.name} e nossa história`,
  }
}

export default async function AboutPage({ params }: AboutPageProps) {
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
      <h1 className="text-3xl font-bold mb-6">Sobre Nós</h1>
      
      <div className="prose max-w-none">
        {settings.aboutText ? (
          <div dangerouslySetInnerHTML={{ __html: settings.aboutText }} />
        ) : (
          <div>
            <p>Bem-vindo à {store.name}!</p>
            <p>
              Somos uma loja comprometida com a qualidade e satisfação dos nossos clientes. 
              Nossa missão é fornecer produtos excepcionais e uma experiência de compra inigualável.
            </p>
            <p>
              Fundada com a visão de transformar o mercado, buscamos constantemente inovar e oferecer 
              as melhores soluções para nossos clientes. Nossa equipe é formada por profissionais dedicados 
              e apaixonados pelo que fazem.
            </p>
            <p>
              Agradecemos por escolher nossa loja e esperamos atender e superar suas expectativas.
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 