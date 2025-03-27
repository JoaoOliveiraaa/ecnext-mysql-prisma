import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import LoginForm from "@/components/store-login-form"

interface StoreLoginPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: StoreLoginPageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params)
  const store = await db.store.findUnique({
    where: { slug: resolvedParams.slug },
  })

  if (!store) {
    return {
      title: "Login | Página não encontrada",
    }
  }

  return {
    title: `Login | ${store.name}`,
    description: "Entre com sua conta para continuar suas compras",
  }
}

export default async function StoreLoginPage({ params }: StoreLoginPageProps) {
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
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-muted-foreground">Entre com sua conta para continuar suas compras na {store.name}</p>
        </div>

        <LoginForm storeSlug={store.slug} />

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <Link href={`/store/${store.slug}/register`} className="underline">
              Registre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 