import Link from "next/link"
import RegisterForm from "@/components/register-form"

export default function RegisterPage() {
  return (
    <div className="container mx-auto flex h-screen flex-col items-center justify-center px-4">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Criar Conta</h1>
          <p className="text-muted-foreground">Preencha os dados abaixo para se registrar</p>
        </div>

        <RegisterForm />

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link href="/login" className="underline">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

