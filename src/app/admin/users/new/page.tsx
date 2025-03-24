import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import UsersTable from "@/components/admin/users-table"
import { getUsers } from "@/lib/admin-data"

export const metadata: Metadata = {
  title: "Usuários | Admin MINISHOP",
  description: "Gerenciar usuários da loja",
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1
  const { users, total, totalPages } = await getUsers(page)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Usuários</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>Visualize e gerencie os usuários registrados na loja</CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable users={users} currentPage={page} totalPages={totalPages} />
        </CardContent>
      </Card>
    </div>
  )
}

