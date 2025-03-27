"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import ImageUpload from "@/components/admin/image-upload"

interface Category {
  id?: string
  name: string
  slug: string
  imageUrl: string
}

interface CategoryFormProps {
  initialData?: Category
  isEditing?: boolean
}

export default function CategoryForm({ initialData, isEditing = false }: CategoryFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Category>({
    name: "",
    slug: "",
    imageUrl: "",
  })

  // Carregar dados iniciais se estiver editando
  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Gerar slug automaticamente a partir do nome, se não estiver editando
    if (name === "name" && !isEditing) {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")

      setFormData((prev) => ({
        ...prev,
        name: value,
        slug,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleImageChange = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: url,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Verificar se a imagem foi carregada
      if (!formData.imageUrl) {
        throw new Error("Por favor, faça upload de uma imagem para a categoria")
      }

      // URL e método diferentes para criação e edição
      const url = isEditing ? `/api/admin/categories/${formData.id}` : "/api/admin/categories";
      const method = isEditing ? "PATCH" : "POST";

      // Enviar para a API
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || `Erro ao ${isEditing ? 'atualizar' : 'criar'} categoria`)
      }

      toast({
        title: isEditing ? "Categoria atualizada" : "Categoria criada",
        description: `A categoria foi ${isEditing ? 'atualizada' : 'criada'} com sucesso.`,
      })

      router.push("/admin/categories")
      router.refresh()
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : `Ocorreu um erro ao ${isEditing ? 'atualizar' : 'criar'} a categoria.`,
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nome da Categoria</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} disabled={isLoading} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input 
            id="slug" 
            name="slug" 
            value={formData.slug} 
            onChange={handleChange} 
            disabled={isLoading || isEditing} 
            required 
          />
          <p className="text-xs text-muted-foreground">
            {isEditing 
              ? "O slug não pode ser alterado após a criação" 
              : "Identificador único para URLs (gerado automaticamente)"}
          </p>
        </div>
      </div>

      <ImageUpload onChange={handleImageChange} value={formData.imageUrl} label="Imagem da Categoria" />

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/categories")} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Salvando..." : isEditing ? "Atualizar Categoria" : "Salvar Categoria"}
        </Button>
      </div>
    </form>
  )
}

