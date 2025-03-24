"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function MigrationGuide() {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="space-y-4">
      <Button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Esconder instruções" : "Mostrar instruções de migração"}
      </Button>

      {isOpen && (
        <Card>
          <CardHeader>
            <CardTitle>Instruções para migração do banco de dados</CardTitle>
            <CardDescription>
              Siga estes passos para aplicar as alterações do schema do Prisma ao seu banco de dados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="warning">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Atenção</AlertTitle>
              <AlertDescription>
                O erro que você está vendo ocorre porque o modelo ProductVariation foi adicionado ao schema do Prisma,
                mas as migrações não foram aplicadas ao banco de dados.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Passo 1: Gerar a migração</h3>
              <div className="bg-muted p-4 rounded-md">
                <code className="text-sm">npx prisma migrate dev --name add_product_variations</code>
              </div>
              <p className="text-sm text-muted-foreground">
                Este comando irá gerar os arquivos de migração necessários e aplicá-los ao banco de dados.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Passo 2: Gerar o cliente Prisma atualizado</h3>
              <div className="bg-muted p-4 rounded-md">
                <code className="text-sm">npx prisma generate</code>
              </div>
              <p className="text-sm text-muted-foreground">
                Este comando irá gerar o cliente Prisma com os novos modelos.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Passo 3: Reiniciar o servidor</h3>
              <p className="text-sm text-muted-foreground">
                Após aplicar as migrações, reinicie o servidor de desenvolvimento para que as alterações sejam
                aplicadas.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Fechar
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

