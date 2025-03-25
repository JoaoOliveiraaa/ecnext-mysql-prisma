"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Edit, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

interface Banner {
  id: string
  title: string
  description: string
  imageUrl: string
  isActive: boolean
}

interface BannersTableProps {
  banners: Banner[]
}

export default function BannersTable({ banners }: BannersTableProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }))
  }

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(id)

      const response = await fetch(`/api/admin/banners/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao excluir banner")
      }

      toast({
        title: "Banner excluído",
        description: "O banner foi excluído com sucesso.",
      })

      router.refresh()
    } catch (error) {
      console.error("Erro ao excluir:", error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao excluir o banner.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  return (
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
            banners.map((banner) => (
              <TableRow key={banner.id}>
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <div className="h-20 w-60 relative rounded overflow-hidden">
                      <Image
                        src={imageErrors[banner.id] ? "/placeholder.svg?height=80&width=240" : banner.imageUrl}
                        alt={banner.title}
                        fill
                        className="object-cover"
                        onError={() => handleImageError(banner.id)}
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
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/banners/edit/${banner.id}`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Link>
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Excluir
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir Banner</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir este banner? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(banner.id)}
                            disabled={isDeleting === banner.id}
                          >
                            {isDeleting === banner.id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Excluindo...
                              </>
                            ) : (
                              "Excluir"
                            )}
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
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
  )
}

