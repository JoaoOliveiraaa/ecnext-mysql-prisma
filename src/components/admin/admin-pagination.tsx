"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface AdminPaginationProps {
  currentPage: number
  totalPages: number
}

export default function AdminPagination({ currentPage, totalPages }: AdminPaginationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  // Gerar array de páginas a serem exibidas
  const generatePagination = () => {
    // Se tivermos 7 ou menos páginas, mostrar todas
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    // Caso contrário, mostrar primeira, última e algumas do meio
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5, "...", totalPages]
    }

    if (currentPage >= totalPages - 2) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    }

    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages]
  }

  const pagination = generatePagination()

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button variant="outline" size="icon" asChild disabled={currentPage <= 1}>
        <Link href={createPageURL(currentPage - 1)}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Página anterior</span>
        </Link>
      </Button>

      {pagination.map((page, i) => (
        <div key={i}>
          {page === "..." ? (
            <span className="px-3 py-2 text-sm text-muted-foreground">...</span>
          ) : (
            <Button
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              asChild={currentPage !== page}
              className="h-9 w-9"
            >
              {currentPage !== page ? <Link href={createPageURL(page)}>{page}</Link> : <span>{page}</span>}
            </Button>
          )}
        </div>
      ))}

      <Button variant="outline" size="icon" asChild disabled={currentPage >= totalPages}>
        <Link href={createPageURL(currentPage + 1)}>
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Próxima página</span>
        </Link>
      </Button>
    </div>
  )
}

