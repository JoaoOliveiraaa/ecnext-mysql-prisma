"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    emailNotifications: true,
    orderUpdates: true,
    promotions: false,
    newsletter: false,
    language: "pt-BR",
    currency: "BRL",
  })

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Aqui você implementaria a chamada à API para salvar as configurações
      // const response = await fetch("/api/account/settings", {...})

      // Simulando uma atualização bem-sucedida
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Configurações salvas",
        description: "Suas preferências foram atualizadas com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 ">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notificações</h3>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="emailNotifications">Notificações por email</Label>
            <p className="text-sm text-muted-foreground">Receba emails sobre sua conta, pedidos e mais</p>
          </div>
          <Switch
            id="emailNotifications"
            checked={settings.emailNotifications}
            onCheckedChange={(checked) => handleSwitchChange("emailNotifications", checked)}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="orderUpdates">Atualizações de pedidos</Label>
            <p className="text-sm text-muted-foreground">Receba notificações sobre o status dos seus pedidos</p>
          </div>
          <Switch
            id="orderUpdates"
            checked={settings.orderUpdates}
            onCheckedChange={(checked) => handleSwitchChange("orderUpdates", checked)}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="promotions">Promoções e descontos</Label>
            <p className="text-sm text-muted-foreground">Receba ofertas exclusivas e promoções especiais</p>
          </div>
          <Switch
            id="promotions"
            checked={settings.promotions}
            onCheckedChange={(checked) => handleSwitchChange("promotions", checked)}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="newsletter">Newsletter</Label>
            <p className="text-sm text-muted-foreground">Receba nossa newsletter mensal com novidades</p>
          </div>
          <Switch
            id="newsletter"
            checked={settings.newsletter}
            onCheckedChange={(checked) => handleSwitchChange("newsletter", checked)}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-medium">Preferências regionais</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="language">Idioma</Label>
            <Select
              value={settings.language}
              onValueChange={(value) => handleSelectChange("language", value)}
              disabled={isLoading}
            >
              <SelectTrigger id="language">
                <SelectValue placeholder="Selecione um idioma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Moeda</Label>
            <Select
              value={settings.currency}
              onValueChange={(value) => handleSelectChange("currency", value)}
              disabled={isLoading}
            >
              <SelectTrigger id="currency">
                <SelectValue placeholder="Selecione uma moeda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BRL">Real (R$)</SelectItem>
                <SelectItem value="USD">US Dollar ($)</SelectItem>
                <SelectItem value="EUR">Euro (€)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar configurações"}
        </Button>
      </div>
    </form>
  )
}

