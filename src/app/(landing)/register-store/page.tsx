import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import StoreRegistrationForm from "@/components/landing/store-registration-form"
import LandingHeader from "@/components/landing/landing-header"
import LandingFooter from "@/components/landing/landing-footer"

export const metadata: Metadata = {
  title: "Registrar Loja | MINISHOP",
  description: "Crie sua loja online em minutos com MINISHOP",
}

export default function RegisterStorePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />

      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Crie sua loja online</CardTitle>
            <CardDescription className="text-center">
              Preencha o formulário abaixo para começar a vender online
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StoreRegistrationForm />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Já tem uma loja?{" "}
              <Link href="/login-store" className="text-primary hover:underline">
                Faça login
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

