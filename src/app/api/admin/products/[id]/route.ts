import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Verificar se o usuário está autenticado e é um administrador
    if (!session || session.user?.email !== "admin@jondev.com") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { id } = params

    // Verificar se o produto existe
    const product = await db.product.findUnique({
      where: { id },
    })

    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
    }

    // Excluir o produto
    await db.product.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Produto excluído com sucesso" })
  } catch (error) {
    console.error("ERRO_EXCLUIR_PRODUTO", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Verificar se o usuário está autenticado e é um administrador
    if (!session || session.user?.email !== "admin@jondev.com") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { id } = params

    // Buscar o produto
    const product = await db.product.findUnique({
      where: { id },
      include: {
        category: true,
        variations: true,
      },
    })

    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("ERRO_BUSCAR_PRODUTO", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Verificar se o usuário está autenticado e é um administrador
    if (!session || session.user?.email !== "admin@jondev.com") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { id } = params
    const body = await req.json()
    const {
      name,
      slug,
      description,
      price,
      discountPercentage,
      imageUrl,
      categoryId,
      stock,
      isNew,
      isFeatured,
      variations = [],
    } = body

    // Validar dados
    if (!name || !slug || !description || !price || !imageUrl || !categoryId) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    // Verificar se o produto existe
    const existingProduct = await db.product.findUnique({
      where: { id },
      include: {
        variations: true,
      },
    })

    if (!existingProduct) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
    }

    // Verificar se o slug já existe em outro produto
    const productWithSlug = await db.product.findUnique({
      where: { slug },
    })

    if (productWithSlug && productWithSlug.id !== id) {
      return NextResponse.json({ error: "Slug já está em uso por outro produto" }, { status: 400 })
    }

    // Atualizar o produto
    const product = await db.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        price,
        discountPercentage,
        imageUrl,
        categoryId,
        stock,
        isNew,
        isFeatured,
      },
    })

    // Remover todas as variações existentes
    await db.productVariation.deleteMany({
      where: { productId: id },
    })

    // Adicionar as novas variações
    if (variations.length > 0) {
      await Promise.all(
        variations.map(async (variation: any) => {
          await db.productVariation.create({
            data: {
              productId: id,
              type: variation.type,
              value: variation.value,
              price: variation.price,
              stock: variation.stock,
            },
          })
        }),
      )
    }

    return NextResponse.json({
      message: "Produto atualizado com sucesso",
      product,
    })
  } catch (error) {
    console.error("ERRO_ATUALIZAR_PRODUTO", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

