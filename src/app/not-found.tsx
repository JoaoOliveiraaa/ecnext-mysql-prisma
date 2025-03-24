import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] px-4 py-16 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">Página não encontrada</h2>
      <p className="mt-2 text-muted-foreground">A página que você está procurando não existe ou foi removida.</p>
      <Button asChild className="mt-8">
        <Link href="/">Voltar para a página inicial</Link>
      </Button>
    </div>
  )
}

