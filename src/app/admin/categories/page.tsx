import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"
import AdminPagination from "@/components/admin/admin-pagination"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = searchParams?.page ? Number.parseInt(searchParams.page) : 1
  const limit = 10
  const skip = (page - 1) * limit

  // Buscar categorias do banco de dados
  let categories = []
  let totalCategories = 0

  try {
    categories = await db.category.findMany({
      skip,
      take: limit,
      orderBy: {
        name: "asc",
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    })

    totalCategories = await db.category.count()
  } catch (error) {
    console.error("Erro ao buscar categorias:", error)
  }

  const totalPages = Math.ceil(totalCategories / limit) || 1

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categorias</h1>
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Categoria
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Categoria</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Produtos</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length > 0 ? (
              categories.map((category: any) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 relative rounded overflow-hidden">
                        <Image
                          src={category.imageUrl || "/placeholder.svg"}
                          alt={category.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-medium">{category.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell>{category._count.products}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/categories/edit/${category.id}`}>Editar</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Nenhuma categoria encontrada.
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

