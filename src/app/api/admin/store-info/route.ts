import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    // Verificar se o usuário está autenticado
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Verificar se o usuário é um administrador de loja
    if (session.user.role !== "storeAdmin") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    // Verificar se o storeId está presente
    if (!session.user.storeId) {
      return NextResponse.json({ error: "Loja não encontrada" }, { status: 404 })
    }

    // Buscar informações da loja
    const store = await db.store.findUnique({
      where: { id: session.user.storeId },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    })

    if (!store) {
      return NextResponse.json({ error: "Loja não encontrada" }, { status: 404 })
    }

    return NextResponse.json({ store })
  } catch (error) {
    console.error("ERRO_BUSCAR_LOJA", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
} 