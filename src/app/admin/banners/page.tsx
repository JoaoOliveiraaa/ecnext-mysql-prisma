// Atualizar a página de banners para buscar dados reais

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import AdminPagination from "@/components/admin/admin-pagination"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

export default async function BannersPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = searchParams?.page ? Number.parseInt(searchParams.page) : 1
  const limit = 10
  const skip = (page - 1) * limit

  // Buscar banners do banco de dados
  let banners = []
  let totalBanners = 0

  try {
    banners = await db.banner.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    })

    totalBanners = await db.banner.count()
  } catch (error) {
    console.error("Erro ao buscar banners:", error)
  }

  const totalPages = Math.ceil(totalBanners / limit) || 1

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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Banner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners.length > 0 ? (
              banners.map((banner: any) => (
                <TableRow key={banner.id}>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <div className="h-20 w-60 relative rounded overflow-hidden">
                        <Image
                          src={banner.imageUrl || "/placeholder.svg"}
                          alt={banner.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{banner.title}</h3>
                        <p className="text-sm text-muted-foreground">{banner.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={banner.isActive ? "default" : "outline"}>
                      {banner.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/banners/edit/${banner.id}`}>Editar</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  Nenhum banner encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AdminPagination currentPage={page} totalPages={totalPages} />
    </div>
  )
}

