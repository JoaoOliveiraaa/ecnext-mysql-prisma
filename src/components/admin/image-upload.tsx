"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ImageUploadProps {
  onChange: (url: string) => void
  value?: string
  label?: string
  previewHeight?: number
  previewWidth?: number
}

export default function ImageUpload({
  onChange,
  value,
  label = "Imagem",
  previewHeight = 300,
  previewWidth = 300,
}: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [imageError, setImageError] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsLoading(true)
      setImageError(false)

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
      onChange(data.url)

      toast({
        title: "Upload concluído",
        description: "A imagem foi carregada com sucesso.",
      })
    } catch (error) {
      console.error("Erro no upload:", error)
      toast({
        title: "Erro",
        description: "Falha ao fazer upload da imagem.",
        variant: "destructive",
      })
      setImageError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveImage = () => {
    onChange("")
    setImageError(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <div className="space-y-4">
      <Label>{label}</Label>

      <div className="flex flex-col items-center gap-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          disabled={isLoading}
        />

        {value && !imageError ? (
          <div className="relative w-full max-w-md rounded-md overflow-hidden border">
            <Image
              src={value || "/placeholder.svg"}
              alt="Preview"
              width={previewWidth}
              height={previewHeight}
              className="object-contain"
              onError={handleImageError}
            />
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
            className="w-full max-w-md aspect-video rounded-md border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors p-6"
            onClick={handleButtonClick}
          >
            {isLoading ? (
              <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
            ) : (
              <>
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Clique para fazer upload</p>
                <p className="text-xs text-muted-foreground mt-1">Formatos aceitos: JPG, PNG, GIF</p>
              </>
            )}
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          onClick={handleButtonClick}
          disabled={isLoading}
          className="w-full max-w-md"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : value && !imageError ? (
            "Trocar imagem"
          ) : (
            "Selecionar imagem"
          )}
        </Button>
      </div>
    </div>
  )
}

