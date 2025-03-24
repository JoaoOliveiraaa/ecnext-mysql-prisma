"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SetupGuide() {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="space-y-4">
      <Button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Esconder instruções" : "Mostrar instruções de configuração"}
      </Button>

      {isOpen && (
        <Card>
          <CardHeader>
            <CardTitle>Instruções para configuração do projeto</CardTitle>
            <CardDescription>
              Siga estes passos para configurar corretamente o upload de imagens e as variações de produtos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Configuração de imagens</AlertTitle>
              <AlertDescription>
                Para que as imagens funcionem corretamente, você precisa criar uma pasta de uploads no diretório public.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Passo 1: Criar pasta de uploads</h3>
              <div className="bg-muted p-4 rounded-md">
                <code className="text-sm">mkdir -p public/uploads</code>
              </div>
              <p className="text-sm text-muted-foreground">
                Este comando criará a pasta uploads dentro do diretório public, onde as imagens serão armazenadas.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Passo 2: Configurar permissões (se necessário)</h3>
              <div className="bg-muted p-4 rounded-md">
                <code className="text-sm">chmod 755 public/uploads</code>
              </div>
              <p className="text-sm text-muted-foreground">
                Este comando garante que a pasta tenha as permissões corretas para escrita (apenas para sistemas
                Unix/Linux).
              </p>
            </div>

            <Alert variant="warning">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Alternativa: Vercel Blob Storage</AlertTitle>
              <AlertDescription>
                Para uma solução mais robusta, configure o Vercel Blob Storage adicionando a variável de ambiente
                BLOB_READ_WRITE_TOKEN.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Passo 3: Aplicar migrações do Prisma</h3>
              <div className="bg-muted p-4 rounded-md">
                <code className="text-sm">npx prisma migrate dev --name add_product_variations</code>
              </div>
              <p className="text-sm text-muted-foreground">
                Este comando aplicará as migrações necessárias para habilitar as variações de produtos.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Passo 4: Gerar o cliente Prisma</h3>
              <div className="bg-muted p-4 rounded-md">
                <code className="text-sm">npx prisma generate</code>
              </div>
              <p className="text-sm text-muted-foreground">
                Este comando gerará o cliente Prisma atualizado com os novos modelos.
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

