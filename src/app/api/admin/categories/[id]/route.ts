import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"

// Obter uma categoria específica
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    // Verificar se o usuário está autenticado e é um administrador
    if (!session || !session.user || (session.user.role !== "storeAdmin" && session.user.role !== "superadmin")) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Obter o storeId do usuário autenticado (exceto para superadmin)
    const storeId = session.user.role === "superadmin" ? null : session.user.storeId
    const storeFilter = storeId ? { storeId } : {}

    // Aguardar pelos parâmetros
    const id = await Promise.resolve(params.id)

    // Buscar categoria por ID (e storeId se aplicável)
    const category = await db.category.findFirst({
      where: {
        id,
        ...storeFilter
      }
    })

    if (!category) {
      return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("ERRO_BUSCAR_CATEGORIA", error)
    return NextResponse.json(
      { error: "Erro interno ao buscar categoria" },
      { status: 500 }
    )
  }
}

// Atualizar uma categoria
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    // Verificar se o usuário está autenticado e é um administrador
    if (!session || !session.user || (session.user.role !== "storeAdmin" && session.user.role !== "superadmin")) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Obter o storeId do usuário autenticado (exceto para superadmin)
    const storeId = session.user.role === "superadmin" ? null : session.user.storeId
    const storeFilter = storeId ? { storeId } : {}

    // Aguardar pelos parâmetros
    const id = await Promise.resolve(params.id)

    // Verificar se a categoria existe (e pertence à loja do usuário se aplicável)
    const existingCategory = await db.category.findFirst({
      where: {
        id,
        ...storeFilter
      }
    })

    if (!existingCategory) {
      return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 })
    }

    // Obter dados da requisição
    const data = await req.json()
    const { name, imageUrl } = data

    // Validar dados
    if (!name || !imageUrl) {
      return NextResponse.json(
        { error: "Dados incompletos. Nome e imagem são obrigatórios" },
        { status: 400 }
      )
    }

    // Atualizar categoria (não permitindo alterar o slug)
    const updatedCategory = await db.category.update({
      where: { id },
      data: {
        name,
        imageUrl
      }
    })

    return NextResponse.json({
      message: "Categoria atualizada com sucesso",
      category: updatedCategory
    })
  } catch (error) {
    console.error("ERRO_ATUALIZAR_CATEGORIA", error)
    return NextResponse.json(
      { error: "Erro interno ao atualizar categoria" },
      { status: 500 }
    )
  }
}

// Excluir uma categoria
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    // Verificar se o usuário está autenticado e é um administrador
    if (!session || !session.user || (session.user.role !== "storeAdmin" && session.user.role !== "superadmin")) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Obter o storeId do usuário autenticado (exceto para superadmin)
    const storeId = session.user.role === "superadmin" ? null : session.user.storeId
    const storeFilter = storeId ? { storeId } : {}

    // Aguardar pelos parâmetros
    const id = await Promise.resolve(params.id)

    // Verificar se a categoria existe (e pertence à loja do usuário se aplicável)
    const existingCategory = await db.category.findFirst({
      where: {
        id,
        ...storeFilter
      }
    })

    if (!existingCategory) {
      return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 })
    }

    // Verificar se há produtos usando esta categoria
    const productsWithCategory = await db.product.count({
      where: {
        categoryId: id
      }
    })

    if (productsWithCategory > 0) {
      return NextResponse.json(
        { error: `Não é possível excluir. Esta categoria possui ${productsWithCategory} produto(s) associado(s).` },
        { status: 400 }
      )
    }

    // Excluir categoria
    await db.category.delete({
      where: { id }
    })

    return NextResponse.json({
      message: "Categoria excluída com sucesso"
    })
  } catch (error) {
    console.error("ERRO_EXCLUIR_CATEGORIA", error)
    return NextResponse.json(
      { error: "Erro interno ao excluir categoria" },
      { status: 500 }
    )
  }
} 