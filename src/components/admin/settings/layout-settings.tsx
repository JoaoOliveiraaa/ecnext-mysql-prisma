"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface LayoutSettingsProps {
  initialSettings: {
    showHeroSection: boolean
    showFeaturedProducts: boolean
    showNewArrivals: boolean
    showCategoriesSection: boolean
    heroTitle: string
    heroDescription: string
    layoutType: string
  }
  storeId: string
}

export default function LayoutSettings({ initialSettings, storeId }: LayoutSettingsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState(initialSettings)

  const handleToggle = (name: string) => {
    setSettings(prev => ({
      ...prev,
      [name]: !prev[name as keyof typeof prev]
    }))
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLayoutTypeChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      layoutType: value
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
          type: "layout",
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erro ao salvar configurações")
      }

      toast({
        title: "Configurações salvas",
        description: "As configurações de layout foram salvas com sucesso.",
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

  const layoutTypes = [
    { value: "modern", label: "Moderno" },
    { value: "classic", label: "Clássico" },
    { value: "minimal", label: "Minimalista" },
    { value: "bold", label: "Arrojado" }
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Label>Exibir seções</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Banner Principal</Label>
              <p className="text-sm text-muted-foreground">
                Seção principal da página inicial
              </p>
            </div>
            <Switch
              checked={settings.showHeroSection}
              onCheckedChange={() => handleToggle("showHeroSection")}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Produtos em Destaque</Label>
              <p className="text-sm text-muted-foreground">
                Exibir produtos em destaque
              </p>
            </div>
            <Switch
              checked={settings.showFeaturedProducts}
              onCheckedChange={() => handleToggle("showFeaturedProducts")}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Novos Produtos</Label>
              <p className="text-sm text-muted-foreground">
                Exibir os produtos mais recentes
              </p>
            </div>
            <Switch
              checked={settings.showNewArrivals}
              onCheckedChange={() => handleToggle("showNewArrivals")}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Categorias</Label>
              <p className="text-sm text-muted-foreground">
                Exibir seção de categorias
              </p>
            </div>
            <Switch
              checked={settings.showCategoriesSection}
              onCheckedChange={() => handleToggle("showCategoriesSection")}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {settings.showHeroSection && (
        <div className="space-y-4">
          <Label>Conteúdo do Banner Principal</Label>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="heroTitle">Título</Label>
              <Input
                id="heroTitle"
                name="heroTitle"
                value={settings.heroTitle}
                onChange={handleTextChange}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="heroDescription">Descrição</Label>
              <Input
                id="heroDescription"
                name="heroDescription"
                value={settings.heroDescription}
                onChange={handleTextChange}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="layoutType">Estilo de Layout</Label>
        <Select 
          value={settings.layoutType} 
          onValueChange={handleLayoutTypeChange}
          disabled={isLoading}
        >
          <SelectTrigger id="layoutType" className="w-full">
            <SelectValue placeholder="Selecione um estilo" />
          </SelectTrigger>
          <SelectContent>
            {layoutTypes.map(layout => (
              <SelectItem key={layout.value} value={layout.value}>
                {layout.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Define o estilo visual geral da sua loja
        </p>
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