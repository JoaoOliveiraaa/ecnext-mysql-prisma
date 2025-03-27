"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Facebook, Instagram, Twitter, Youtube } from "lucide-react"

interface SocialSettingsProps {
  initialSettings: {
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    youtubeUrl: string
  }
  storeId: string
}

export default function SocialSettings({ initialSettings, storeId }: SocialSettingsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState(initialSettings)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: value
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
          type: "social",
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erro ao salvar configurações")
      }

      toast({
        title: "Configurações salvas",
        description: "As redes sociais foram salvas com sucesso.",
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
          <Label htmlFor="facebookUrl" className="flex items-center gap-2">
            <Facebook className="h-4 w-4 text-blue-600" />
            Página do Facebook
          </Label>
          <Input 
            id="facebookUrl"
            name="facebookUrl"
            type="text"
            value={settings.facebookUrl}
            onChange={handleChange}
            placeholder="https://facebook.com/sualoja"
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            URL completa da sua página no Facebook
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="instagramUrl" className="flex items-center gap-2">
            <Instagram className="h-4 w-4 text-pink-500" />
            Perfil do Instagram
          </Label>
          <Input 
            id="instagramUrl"
            name="instagramUrl"
            type="text"
            value={settings.instagramUrl}
            onChange={handleChange}
            placeholder="https://instagram.com/sualoja"
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            URL completa do seu perfil no Instagram
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="twitterUrl" className="flex items-center gap-2">
            <Twitter className="h-4 w-4 text-blue-400" />
            Perfil no Twitter
          </Label>
          <Input 
            id="twitterUrl"
            name="twitterUrl"
            type="text"
            value={settings.twitterUrl}
            onChange={handleChange}
            placeholder="https://twitter.com/sualoja"
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            URL completa do seu perfil no Twitter
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="youtubeUrl" className="flex items-center gap-2">
            <Youtube className="h-4 w-4 text-red-600" />
            Canal do YouTube
          </Label>
          <Input 
            id="youtubeUrl"
            name="youtubeUrl"
            type="text"
            value={settings.youtubeUrl}
            onChange={handleChange}
            placeholder="https://youtube.com/c/sualoja"
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            URL completa do seu canal no YouTube
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