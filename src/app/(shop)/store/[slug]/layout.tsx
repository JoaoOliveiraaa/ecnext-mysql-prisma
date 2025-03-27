import { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { getStoreSettings, getCategories } from "@/lib/data"
import StoreThemeProvider from "@/components/store/store-theme-provider"

interface StoreLayoutProps {
  children: React.ReactNode
  params: { slug: string }
}

export async function generateMetadata({
  params
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params)
  const store = await db.store.findUnique({
    where: {
      slug: resolvedParams.slug,
    },
  })

  if (!store) {
    return {
      title: "Loja não encontrada",
      description: "A loja que você está procurando não existe ou pode ter sido removida."
    }
  }

  return {
    title: store.name,
    description: `Bem-vindo à loja ${store.name}`,
  }
}

export default async function StoreLayout({ children, params }: StoreLayoutProps) {
  // Verificar se a loja existe
  const resolvedParams = await Promise.resolve(params)
  const store = await db.store.findUnique({
    where: {
      slug: resolvedParams.slug,
    },
    select: {
      id: true,
      name: true,
    },
  })

  if (!store) {
    notFound()
  }

  // Não precisamos verificar os cookies aqui, pois o middleware já está tratando isso
  // O middleware remove os cookies de autenticação quando detecta visit_store_as_guest

  // Buscar configurações da loja
  const settings = await getStoreSettings(store.id)
  const categories = await getCategories(store.id)

  return (
    <StoreThemeProvider
      settings={{
        primaryColor: settings?.primaryColor || "#0f766e",
        secondaryColor: settings?.secondaryColor || "#4f46e5",
        accentColor: settings?.accentColor || "#f97316",
        fontFamily: settings?.fontFamily || "Inter"
      }}
    >
      <div className="flex flex-col min-h-screen">
        {children}
      </div>
    </StoreThemeProvider>
  )
} 