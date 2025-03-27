import Link from "next/link"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default async function StoresPage() {
  // Verificar se o usuário está autenticado e é um administrador
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "superadmin" || session?.user?.role === "storeAdmin"

  // Se não for admin, redirecionar para a home
  if (!isAdmin) {
    return redirect("/")
  }

  // Buscar todas as lojas
  const stores = await db.store.findMany({
    orderBy: {
      name: "asc"
    }
  })

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Lojas</h1>
        <p className="text-muted-foreground">
          Visualização administrativa de todas as lojas da plataforma.
        </p>
      </div>

      <Alert className="mb-6 bg-blue-50">
        <Info className="h-4 w-4" />
        <AlertTitle>Acesso administrativo</AlertTitle>
        <AlertDescription>
          Esta página é visível apenas para administradores da plataforma.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {stores.map((store) => (
          <Card key={store.id} className="overflow-hidden">
            <CardHeader className="p-4">
              <CardTitle className="text-xl">
                <Link href={`/store/${store.slug}`} className="hover:underline">
                  {store.name}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-muted-foreground line-clamp-2">
                Uma loja com produtos incríveis.
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Link 
                href={`/store/${store.slug}`}
                className="text-primary font-medium hover:underline"
              >
                Visitar loja
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
} 