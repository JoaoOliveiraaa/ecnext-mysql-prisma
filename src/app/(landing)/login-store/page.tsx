import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import StoreLoginForm from "@/components/landing/store-login-form"
import LandingHeader from "@/components/landing/landing-header"
import LandingFooter from "@/components/landing/landing-footer"

export const metadata: Metadata = {
  title: "Login | MINISHOP",
  description: "Acesse o painel administrativo da sua loja MINISHOP",
}

export default function LoginStorePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />

      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Acesse sua loja</CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais para acessar o painel administrativo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StoreLoginForm />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Não tem uma loja?{" "}
              <Link href="/register-store" className="text-primary hover:underline">
                Crie agora
              </Link>
            </div>
            <Button variant="outline" asChild className="w-full">
              <Link href="/landing">Voltar para a página inicial</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <LandingFooter />
    </div>
  )
}

