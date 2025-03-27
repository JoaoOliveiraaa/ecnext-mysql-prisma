import type { Metadata } from "next"
import Link from "next/link"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Categorias | MINISHOP",
  description: "Explore as categorias de produtos da nossa loja"
}

export default async function CategoriesPage() {
  // Buscar todas as categorias
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc"
    },
    include: {
      _count: {
        select: {
          products: true
        }
      }
    }
  })

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Categorias</h1>
        <p className="text-muted-foreground">
          Explore nossos produtos por categorias.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <CardHeader className="p-4">
              <CardTitle className="text-xl">
                <Link href={`/shop?category=${category.slug}`} className="hover:underline">
                  {category.name}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-muted-foreground">
                {category._count.products} produtos
              </p>
              <Link 
                href={`/shop?category=${category.slug}`}
                className="text-primary font-medium hover:underline mt-2 inline-block"
              >
                Ver produtos
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 