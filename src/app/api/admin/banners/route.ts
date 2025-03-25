import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Verificar se o usuário está autenticado e é um administrador de loja
    if (!session || !session.user || (session.user.role !== "storeAdmin" && session.user.role !== "superadmin")) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Obter o storeId do usuário autenticado (exceto para superadmin)
    const storeId = session.user.role === "superadmin" ? null : session.user.storeId

    if (session.user.role === "storeAdmin" && !storeId) {
      return NextResponse.json({ error: "Loja não encontrada" }, { status: 400 })
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
    if (
      !title ||
      !description ||
      !imageUrl ||
      !primaryButtonText ||
      !primaryButtonLink ||
      !secondaryButtonText ||
      !secondaryButtonLink
    ) {
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
        secondaryButtonText,
        secondaryButtonLink,
        isActive: isActive || true,
        storeId: storeId || "superadmin-store", // Para o superadmin, usar um ID padrão
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

    // Verificar se o usuário está autenticado e é um administrador de loja
    if (!session || !session.user || (session.user.role !== "storeAdmin" && session.user.role !== "superadmin")) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }
    
    // Obter o storeId do usuário autenticado (exceto para superadmin)
    const storeId = session.user.role === "superadmin" ? null : session.user.storeId
    
    // Filtro adicional para storeId (se não for superadmin)
    const storeFilter = storeId ? { storeId } : {}

    // Buscar banners
    const banners = await db.banner.findMany({
      where: storeFilter,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      banners,
    })
  } catch (error) {
    console.error("ERRO_LISTAR_BANNERS", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

