import type React from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminHeader from "@/components/admin/admin-header"
import { headers } from "next/headers"
import { Inter } from "next/font/google"
import "../globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Admin | MINISHOP",
  description: "Painel administrativo da loja MINISHOP",
}

// Definir esse layout como layout raiz para evitar herança
export const dynamic = "force-dynamic"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  
  // Para qualquer página do admin, verificar se o usuário está autenticado
  // e é um storeAdmin ou superadmin
  const isAdmin = session?.user?.role === "storeAdmin" || session?.user?.role === "superadmin"
  
  if (!session || !isAdmin) {
    // Redirecionar para a nova página de login admin
    redirect("/admin-login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}

