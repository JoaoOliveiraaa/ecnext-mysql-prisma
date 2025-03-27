"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import ImageUpload from "@/components/admin/image-upload"

interface LogoSettingsProps {
  initialSettings: {
    logoUrl: string
    faviconUrl: string
    footerText: string
  }
  storeId: string
}

export default function LogoSettings({ initialSettings, storeId }: LogoSettingsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState(initialSettings)

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLogoChange = (url: string) => {
    setSettings(prev => ({
      ...prev,
      logoUrl: url
    }))
  }

  const handleFaviconChange = (url: string) => {
    setSettings(prev => ({
      ...prev,
      faviconUrl: url
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...settings,
          storeId,
          type: "branding",
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erro ao salvar configurações")
      }

      toast({
        title: "Configurações salvas",
        description: "As configurações de marca foram salvas com sucesso.",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Logo da Loja</Label>
          <ImageUpload 
            onChange={handleLogoChange} 
            value={settings.logoUrl} 
            label="Logo principal da loja" 
          />
          <p className="text-xs text-muted-foreground">
            Formato recomendado: PNG ou SVG com fundo transparente (400 x 100px)
          </p>
        </div>
        
        <div className="space-y-2">
          <Label>Favicon</Label>
          <ImageUpload 
            onChange={handleFaviconChange} 
            value={settings.faviconUrl} 
            label="Favicon (ícone da aba do navegador)" 
          />
          <p className="text-xs text-muted-foreground">
            Formato recomendado: ICO, PNG (32 x 32px)
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="footerText">Texto do Rodapé</Label>
          <Input
            id="footerText"
            name="footerText"
            value={settings.footerText}
            onChange={handleTextChange}
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            Texto que aparecerá no rodapé da loja (direitos autorais, etc.)
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  )
} 