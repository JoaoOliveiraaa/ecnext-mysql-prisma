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
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface ThemeSettingsProps {
  initialSettings: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    fontFamily: string
  }
  storeId: string
}

export default function ThemeSettings({ initialSettings, storeId }: ThemeSettingsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState(initialSettings)

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFontFamilyChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      fontFamily: value
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
          type: "theme",
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erro ao salvar configurações")
      }

      toast({
        title: "Configurações salvas",
        description: "As configurações do tema foram salvas com sucesso.",
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

  const fontFamilies = [
    { value: "Inter", label: "Inter" },
    { value: "Roboto", label: "Roboto" },
    { value: "Poppins", label: "Poppins" },
    { value: "Open Sans", label: "Open Sans" },
    { value: "Montserrat", label: "Montserrat" },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="primaryColor">Cor Primária</Label>
          <div className="flex items-center gap-2">
            <div 
              className="w-10 h-10 rounded border" 
              style={{ backgroundColor: settings.primaryColor }}
            />
            <Input 
              id="primaryColor"
              name="primaryColor"
              type="text"
              value={settings.primaryColor}
              onChange={handleColorChange}
              className="flex-1"
              disabled={isLoading}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Principal cor da sua marca (botões, cabeçalho)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="secondaryColor">Cor Secundária</Label>
          <div className="flex items-center gap-2">
            <div 
              className="w-10 h-10 rounded border" 
              style={{ backgroundColor: settings.secondaryColor }}
            />
            <Input 
              id="secondaryColor"
              name="secondaryColor"
              type="text"
              value={settings.secondaryColor}
              onChange={handleColorChange}
              className="flex-1"
              disabled={isLoading}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Usada para elementos secundários e contrastes
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="accentColor">Cor de Destaque</Label>
          <div className="flex items-center gap-2">
            <div 
              className="w-10 h-10 rounded border" 
              style={{ backgroundColor: settings.accentColor }}
            />
            <Input 
              id="accentColor"
              name="accentColor"
              type="text"
              value={settings.accentColor}
              onChange={handleColorChange}
              className="flex-1"
              disabled={isLoading}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Usada para elementos de destaque como promoções
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fontFamily">Fonte Principal</Label>
        <Select 
          value={settings.fontFamily} 
          onValueChange={handleFontFamilyChange}
          disabled={isLoading}
        >
          <SelectTrigger id="fontFamily" className="w-full">
            <SelectValue placeholder="Selecione uma fonte" />
          </SelectTrigger>
          <SelectContent>
            {fontFamilies.map(font => (
              <SelectItem key={font.value} value={font.value}>
                {font.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Fonte usada em toda a loja
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