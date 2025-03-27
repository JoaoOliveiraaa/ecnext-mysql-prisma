"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Mail, Phone, MapPin, MessageSquare } from "lucide-react"

interface ContactSettingsProps {
  initialSettings: {
    contactEmail: string
    contactPhone: string
    whatsappNumber: string
    address: string
    googleMapsUrl: string
    enableWhatsappSupport: boolean
  }
  storeId: string
}

export default function ContactSettings({ initialSettings, storeId }: ContactSettingsProps) {
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

  const handleToggle = (field: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev]
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
          type: "contact",
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erro ao salvar configurações")
      }

      toast({
        title: "Configurações salvas",
        description: "As informações de contato foram salvas com sucesso.",
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="contactEmail" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email de Contato
          </Label>
          <Input 
            id="contactEmail"
            name="contactEmail"
            type="email"
            value={settings.contactEmail}
            onChange={handleChange}
            placeholder="contato@sualoja.com"
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            Email exibido para seus clientes entrarem em contato
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactPhone" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Telefone de Contato
          </Label>
          <Input 
            id="contactPhone"
            name="contactPhone"
            type="text"
            value={settings.contactPhone}
            onChange={handleChange}
            placeholder="(00) 0000-0000"
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            Número de telefone principal da loja
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="whatsappNumber" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Número do WhatsApp
        </Label>
        <Input 
          id="whatsappNumber"
          name="whatsappNumber"
          type="text"
          value={settings.whatsappNumber}
          onChange={handleChange}
          placeholder="5500000000000"
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">
          Número do WhatsApp com código do país (ex: 5511999999999)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Endereço
        </Label>
        <Input 
          id="address"
          name="address"
          type="text"
          value={settings.address}
          onChange={handleChange}
          placeholder="Rua Exemplo, 123 - Cidade - Estado"
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">
          Endereço físico da loja, se aplicável
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="googleMapsUrl">Link do Google Maps</Label>
        <Input 
          id="googleMapsUrl"
          name="googleMapsUrl"
          type="text"
          value={settings.googleMapsUrl}
          onChange={handleChange}
          placeholder="https://maps.google.com/..."
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">
          URL do Google Maps para seu endereço (opcional)
        </p>
      </div>

      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label className="text-base">Suporte via WhatsApp</Label>
          <p className="text-sm text-muted-foreground">
            Exibir botão de WhatsApp flutuante para contato rápido
          </p>
        </div>
        <Switch
          checked={settings.enableWhatsappSupport}
          onCheckedChange={() => handleToggle("enableWhatsappSupport")}
          disabled={isLoading}
        />
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