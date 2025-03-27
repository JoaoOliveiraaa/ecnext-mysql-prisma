// Atualizar a página de produtos para buscar dados reais

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import AdminPagination from "@/components/admin/admin-pagination"
import AdminProductActions from "@/components/admin/admin-product-actions"
import { db } from "@/lib/db"
import { formatCurrency } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  // Aguarde os parâmetros searchParams antes de usá-los
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const page = resolvedSearchParams?.page ? Number.parseInt(resolvedSearchParams.page) : 1
  const limit = 10
  const skip = (page - 1) * limit

  // Buscar produtos do banco de dados
  let products = []
  let totalProducts = 0

  try {
    products = await db.product.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    })

    totalProducts = await db.product.count()
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
  }

  const totalPages = Math.ceil(totalProducts / limit) || 1

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Produto
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
              products.map((product: any) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 relative rounded overflow-hidden">
                        <Image
                          src={product.imageUrl || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-muted-foreground">{product.slug}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.category?.name || "Sem categoria"}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      {product.discountPercentage > 0 ? (
                        <>
                          <span className="font-medium">
                            {formatCurrency(product.price - (product.price * product.discountPercentage) / 100)}
                          </span>
                          <span className="text-xs text-muted-foreground line-through">
                            {formatCurrency(product.price)}
                          </span>
                        </>
                      ) : (
                        <span className="font-medium">{formatCurrency(product.price)}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {product.isNew && (
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100/80">
                          Novo
                        </Badge>
                      )}
                      {product.isFeatured && (
                        <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100/80">
                          Destaque
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <AdminProductActions productId={product.id} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum produto encontrado.
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

