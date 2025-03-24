"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import ImageUpload from "@/components/admin/image-upload"

export default function BannerForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    primaryButtonText: "",
    primaryButtonLink: "",
    secondaryButtonText: "",
    secondaryButtonLink: "",
    isActive: true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isActive: checked,
    }))
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
        throw new Error("Por favor, faça upload de uma imagem para o banner")
      }

      // Enviar para a API
      const response = await fetch("/api/admin/banners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erro ao criar banner")
      }

      toast({
        title: "Banner criado",
        description: "O banner foi criado com sucesso.",
      })

      router.push("/admin/banners")
      router.refresh()
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao criar o banner.",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input id="title" name="title" value={formData.title} onChange={handleChange} disabled={isLoading} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          disabled={isLoading}
          required
          rows={3}
        />
      </div>

      <ImageUpload onChange={handleImageChange} value={formData.imageUrl} label="Imagem do Banner" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="primaryButtonText">Texto do Botão Principal</Label>
          <Input
            id="primaryButtonText"
            name="primaryButtonText"
            value={formData.primaryButtonText}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="primaryButtonLink">Link do Botão Principal</Label>
          <Input
            id="primaryButtonLink"
            name="primaryButtonLink"
            value={formData.primaryButtonLink}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="secondaryButtonText">Texto do Botão Secundário</Label>
          <Input
            id="secondaryButtonText"
            name="secondaryButtonText"
            value={formData.secondaryButtonText}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="secondaryButtonLink">Link do Botão Secundário</Label>
          <Input
            id="secondaryButtonLink"
            name="secondaryButtonLink"
            value={formData.secondaryButtonLink}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="isActive" checked={formData.isActive} onCheckedChange={handleSwitchChange} disabled={isLoading} />
        <Label htmlFor="isActive">Banner ativo</Label>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/banners")} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Salvando..." : "Salvar Banner"}
        </Button>
      </div>
    </form>
  )
}

