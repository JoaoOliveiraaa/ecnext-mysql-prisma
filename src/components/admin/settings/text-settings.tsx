"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2, FileText, HelpCircle, Shield, File } from "lucide-react"

interface TextSettingsProps {
  initialSettings: {
    aboutText?: string | null
    helpText?: string | null
    privacyPolicyText?: string | null
    termsOfServiceText?: string | null
  }
  storeId: string
}

export default function TextSettings({ initialSettings, storeId }: TextSettingsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    aboutText: initialSettings.aboutText || "Somos uma loja comprometida com a qualidade e satisfação dos nossos clientes.",
    helpText: initialSettings.helpText || "Entre em contato conosco para obter ajuda com seus pedidos ou dúvidas sobre nossos produtos.",
    privacyPolicyText: initialSettings.privacyPolicyText || "Política de privacidade da loja.",
    termsOfServiceText: initialSettings.termsOfServiceText || "Termos de serviço da loja."
  })

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
          type: "texts",
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erro ao salvar configurações")
      }

      toast({
        title: "Configurações salvas",
        description: "Os textos institucionais foram salvos com sucesso.",
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
          <Label htmlFor="aboutText" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Texto "Sobre Nós"
          </Label>
          <Textarea 
            id="aboutText"
            name="aboutText"
            value={settings.aboutText}
            onChange={handleChange}
            rows={5}
            disabled={isLoading}
            className="min-h-[100px]"
          />
          <p className="text-xs text-muted-foreground">
            Texto que aparecerá na página "Sobre Nós"
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="helpText" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Texto de Ajuda
          </Label>
          <Textarea 
            id="helpText"
            name="helpText"
            value={settings.helpText}
            onChange={handleChange}
            rows={5}
            disabled={isLoading}
            className="min-h-[100px]"
          />
          <p className="text-xs text-muted-foreground">
            Texto que aparecerá na página "Ajuda/Suporte"
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="privacyPolicyText" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Política de Privacidade
          </Label>
          <Textarea 
            id="privacyPolicyText"
            name="privacyPolicyText"
            value={settings.privacyPolicyText}
            onChange={handleChange}
            rows={5}
            disabled={isLoading}
            className="min-h-[100px]"
          />
          <p className="text-xs text-muted-foreground">
            Texto da política de privacidade da loja
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="termsOfServiceText" className="flex items-center gap-2">
            <File className="h-4 w-4" />
            Termos de Serviço
          </Label>
          <Textarea 
            id="termsOfServiceText"
            name="termsOfServiceText"
            value={settings.termsOfServiceText}
            onChange={handleChange}
            rows={5}
            disabled={isLoading}
            className="min-h-[100px]"
          />
          <p className="text-xs text-muted-foreground">
            Texto dos termos de serviço da loja
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