import Link from "next/link"
import LoginForm from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="container mx-auto flex h-screen flex-col items-center justify-center px-4">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-muted-foreground">Entre com sua conta para continuar</p>
        </div>

        <LoginForm />

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <Link href="/register" className="underline">
              Registre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

