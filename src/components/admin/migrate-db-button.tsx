"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function MigrateDbButton() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleMigrate = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch("/api/admin/db-migrate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Falha ao migrar banco de dados")
      }

      toast({
        title: "Sucesso!",
        description: "Migração do banco de dados concluída com sucesso.",
      })
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao migrar o banco de dados",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleMigrate} 
      disabled={isLoading}
      variant="destructive"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Migrando...
        </>
      ) : (
        "Migrar BD"
      )}
    </Button>
  )
} 