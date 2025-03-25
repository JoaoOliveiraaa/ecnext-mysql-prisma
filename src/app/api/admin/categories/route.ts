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
    const { name, slug, imageUrl } = body

    // Validar dados
    if (!name || !slug || !imageUrl) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    // Verificar se o slug já existe (na mesma loja)
    const existingCategory = await db.category.findFirst({
      where: { 
        slug,
        ...(storeId ? { storeId } : {})
      },
    })

    if (existingCategory) {
      return NextResponse.json({ error: "Slug já está em uso" }, { status: 400 })
    }

    // Criar categoria
    const category = await db.category.create({
      data: {
        name,
        slug,
        imageUrl,
        storeId: storeId || "superadmin-store", // Para o superadmin, usar um ID padrão
      },
    })

    return NextResponse.json(
      {
        message: "Categoria criada com sucesso",
        category,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("ERRO_CRIAR_CATEGORIA", error)
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

    // Buscar categorias
    const categories = await db.category.findMany({
      where: storeFilter,
      orderBy: { name: "asc" },
    })

    return NextResponse.json({
      categories,
    })
  } catch (error) {
    console.error("ERRO_LISTAR_CATEGORIAS", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

