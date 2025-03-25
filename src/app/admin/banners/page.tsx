import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { db } from "@/lib/db"
import BannersTable from "@/components/admin/banners-table"

export const dynamic = "force-dynamic"

export default async function BannersPage() {
  // Buscar banners do banco de dados
  let banners = []

  try {
    banners = await db.banner.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
  } catch (error) {
    console.error("Erro ao buscar banners:", error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Banners</h1>
        <Button asChild>
          <Link href="/admin/banners/new">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Banner
          </Link>
        </Button>
      </div>

      <BannersTable banners={banners} />
    </div>
  )
}

