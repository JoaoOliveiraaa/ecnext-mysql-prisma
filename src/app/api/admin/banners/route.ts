import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Verificar se o usuário está autenticado e é um administrador
    if (!session || session.user?.email !== "admin@jondev.com") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await req.json()
    const {
      title,
      description,
      imageUrl,
      primaryButtonText,
      primaryButtonLink,
      secondaryButtonText,
      secondaryButtonLink,
      isActive,
    } = body

    // Validar dados
    if (!title || !description || !imageUrl || !primaryButtonText || !primaryButtonLink) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    // Criar banner
    const banner = await db.banner.create({
      data: {
        title,
        description,
        imageUrl,
        primaryButtonText,
        primaryButtonLink,
        secondaryButtonText: secondaryButtonText || "",
        secondaryButtonLink: secondaryButtonLink || "",
        isActive: isActive !== undefined ? isActive : true,
      },
    })

    return NextResponse.json(
      {
        message: "Banner criado com sucesso",
        banner,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("ERRO_CRIAR_BANNER", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Verificar se o usuário está autenticado e é um administrador
    if (!session || session.user?.email !== "admin@jondev.com") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Buscar todos os banners
    const banners = await db.banner.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ banners })
  } catch (error) {
    console.error("ERRO_LISTAR_BANNERS", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

