import type { Metadata } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import AdminLoginForm from "@/components/admin/admin-login-form"
import { redirect } from "next/navigation"

// Metadados da página de login
export const metadata: Metadata = {
  title: "Admin Login | MINISHOP",
  description: "Acesso ao painel administrativo da loja MINISHOP",
}

export default async function AdminLoginPage() {
  const session = await getServerSession(authOptions)

  
  if (session?.user?.role === "storeAdmin" || session?.user?.role === "superadmin") {
    redirect("/admin")
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">MINISHOP</h1>
        <p className="text-muted-foreground">Painel Administrativo</p>
      </div>

      <div className="rounded-lg border bg-card p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold">Login Administrativo</h2>
          <p className="text-sm text-muted-foreground">Entre com suas credenciais para acessar o painel</p>
        </div>

        <AdminLoginForm />
      </div>
    </div>
  )
}

