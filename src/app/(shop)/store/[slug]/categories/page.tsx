import { notFound } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CategoriesPageProps {
  params: {
    slug: string
  }
}

export default async function CategoriesPage(props: CategoriesPageProps) {
  // Aguarde os parâmetros antes de usá-los
  const params = await Promise.resolve(props.params);
  const slug = params.slug;

  // Buscar a loja pelo slug
  const store = await db.store.findUnique({
    where: { slug },
    include: {
      categories: true
    }
  })

  // Se a loja não existir, retornar 404
  if (!store) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Categorias - {store.name}</h1>
        <p className="text-muted-foreground">
          Explore nossos produtos por categorias.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {store.categories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <CardHeader className="p-4">
              <CardTitle className="text-xl">
                <Link href={`/store/${slug}/category/${category.slug}`} className="hover:underline">
                  {category.name}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Link 
                href={`/store/${slug}/category/${category.slug}`}
                className="text-primary font-medium hover:underline"
              >
                Ver produtos
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {store.categories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhuma categoria disponível.</p>
        </div>
      )}
    </div>
  )
} 