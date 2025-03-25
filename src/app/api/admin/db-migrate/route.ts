import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { execSync } from "child_process"

// Rota segura apenas para desenvolvimento
// Nunca use isso em ambiente de produção!
export async function POST(req: Request) {
  try {
    // Verificar se o ambiente é de desenvolvimento
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Não disponível em ambiente de produção" },
        { status: 403 }
      )
    }

    const session = await getServerSession(authOptions)

    // Verificar se o usuário está autenticado e é o super admin
    if (!session || session.user?.role !== "superadmin") {
      return NextResponse.json(
        { error: "Apenas o super administrador pode executar migrações" },
        { status: 401 }
      )
    }

    // Executar o comando de migração do Prisma
    const migrationName = "add_store_and_admin_models"
    
    try {
      // Tenta executar a migração
      execSync(`npx prisma migrate dev --name ${migrationName}`, {
        stdio: "inherit",
      })

      return NextResponse.json({
        message: "Migração executada com sucesso",
      })
    } catch (migrationError) {
      console.error("ERRO_MIGRACAO", migrationError)
      return NextResponse.json(
        { error: "Erro ao executar a migração do Prisma" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("ERRO_INTERNO", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
} 