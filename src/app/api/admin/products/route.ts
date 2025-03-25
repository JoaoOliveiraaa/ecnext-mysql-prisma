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
    const { name, slug, description, price, discountPercentage, imageUrl, categoryId, stock, isNew, isFeatured } = body

    // Validar dados
    if (!name || !slug || !description || !price || !imageUrl || !categoryId) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    // Verificar se o slug já existe (na mesma loja)
    const existingProduct = await db.product.findFirst({
      where: { 
        slug,
        ...(storeId ? { storeId } : {})
      },
    })

    if (existingProduct) {
      return NextResponse.json({ error: "Slug já está em uso" }, { status: 400 })
    }

    // Verificar se a categoria pertence à loja do usuário
    if (storeId) {
      const category = await db.category.findFirst({
        where: {
          id: categoryId,
          storeId
        }
      })

      if (!category) {
        return NextResponse.json({ error: "Categoria não encontrada ou não pertence à sua loja" }, { status: 400 })
      }
    }

    // Criar produto
    const product = await db.product.create({
      data: {
        name,
        slug,
        description,
        price,
        discountPercentage,
        imageUrl,
        categoryId,
        storeId: storeId || "superadmin-store", // Para o superadmin, usar um ID padrão
        stock: stock || 0,
        isNew: isNew || false,
        isFeatured: isFeatured || false,
      },
    })

    return NextResponse.json(
      {
        message: "Produto criado com sucesso",
        product,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("ERRO_CRIAR_PRODUTO", error)
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

    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Filtro adicional para storeId (se não for superadmin)
    const storeFilter = storeId ? { storeId } : {}

    // Buscar produtos com paginação
    const products = await db.product.findMany({
      skip,
      take: limit,
      where: storeFilter,
      orderBy: { createdAt: "desc" },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    })

    // Contar total de produtos (da loja específica, se aplicável)
    const total = await db.product.count({
      where: storeFilter
    })

    return NextResponse.json({
      products,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("ERRO_LISTAR_PRODUTOS", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

