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
    const { name, slug, imageUrl } = body

    // Validar dados
    if (!name || !slug || !imageUrl) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    // Verificar se o slug já existe
    const existingCategory = await db.category.findUnique({
      where: { slug },
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

    // Verificar se o usuário está autenticado e é um administrador
    if (!session || session.user?.email !== "admin@jondev.com") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Buscar todas as categorias
    const categories = await db.category.findMany({
      orderBy: { name: "asc" },
    })

    return NextResponse.json({ categories })
  } catch (error) {
    console.error("ERRO_LISTAR_CATEGORIAS", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

