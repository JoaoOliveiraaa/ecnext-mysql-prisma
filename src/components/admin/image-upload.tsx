"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, X } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface ImageUploadProps {
  onChange: (url: string) => void
  value?: string
  label?: string
}

export default function ImageUpload({ onChange, value, label = "Imagem" }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null

    if (file) {
      setIsLoading(true)

      try {
        // Criar FormData para enviar o arquivo
        const formData = new FormData()
        formData.append("file", file)

        // Enviar para a API
        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Erro ao fazer upload da imagem")
        }

        const data = await response.json()

        // Atualizar preview e chamar onChange com a URL da imagem
        setPreview(data.url)
        onChange(data.url)

        toast({
          title: "Upload concluído",
          description: "A imagem foi carregada com sucesso.",
        })
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao fazer upload da imagem. Usando imagem de placeholder.",
          variant: "destructive",
        })

        // Usar um placeholder em caso de erro
        const placeholderUrl = `/placeholder.svg?height=600&width=600&text=${encodeURIComponent(file.name)}`
        setPreview(placeholderUrl)
        onChange(placeholderUrl)

        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleRemoveImage = () => {
    setPreview(null)
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <div className="flex flex-col items-center gap-4">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

        {preview ? (
          <div className="relative w-full max-w-md aspect-video rounded-md overflow-hidden border">
            <Image src={preview || "/placeholder.svg"} alt="Preview" fill className="object-contain" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div
            className="w-full max-w-md aspect-video rounded-md border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={handleButtonClick}
          >
            {isLoading ? (
              <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
            ) : (
              <>
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Clique para fazer upload</p>
              </>
            )}
          </div>
        )}

        <Button type="button" variant="outline" onClick={handleButtonClick} disabled={isLoading}>
          {isLoading ? "Enviando..." : preview ? "Trocar imagem" : "Selecionar imagem"}
        </Button>
      </div>
    </div>
  )
}

