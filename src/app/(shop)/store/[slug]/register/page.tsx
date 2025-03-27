import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import RegisterForm from "@/components/store-register-form"

interface StoreRegisterPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: StoreRegisterPageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params)
  const store = await db.store.findUnique({
    where: { slug: resolvedParams.slug },
  })

  if (!store) {
    return {
      title: "Registro | Página não encontrada",
    }
  }

  return {
    title: `Criar Conta | ${store.name}`,
    description: "Crie sua conta para fazer compras",
  }
}

export default async function StoreRegisterPage({ params }: StoreRegisterPageProps) {
  const resolvedParams = await Promise.resolve(params)
  const store = await db.store.findUnique({
    where: { slug: resolvedParams.slug },
  })

  if (!store) {
    notFound()
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-100px)] flex-col items-center justify-center px-4 py-10">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Criar Conta</h1>
          <p className="text-muted-foreground">Registre-se para fazer compras na {store.name}</p>
        </div>

        <RegisterForm storeSlug={store.slug} />

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link href={`/store/${store.slug}/login`} className="underline">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 