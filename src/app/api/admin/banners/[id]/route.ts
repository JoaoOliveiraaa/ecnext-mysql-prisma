import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET - Buscar um banner específico
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    // Resolver params para evitar erro de API síncrona
    const resolvedParams = await Promise.resolve(params)
    const { id } = resolvedParams

    const banner = await db.banner.findUnique({
      where: { id },
    })

    if (!banner) {
      return NextResponse.json({ error: "Banner não encontrado" }, { status: 404 })
    }

    return NextResponse.json(banner)
  } catch (error) {
    console.error("Erro ao buscar banner:", error)
    return NextResponse.json({ error: "Erro ao buscar banner" }, { status: 500 })
  }
}

// PUT - Atualizar um banner existente
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    // Resolver params para evitar erro de API síncrona
    const resolvedParams = await Promise.resolve(params)
    const { id } = resolvedParams

    // Verificar autenticação - comentado para testes
    // const session = await getServerSession(authOptions)
    // if (!session || session.user?.role !== "ADMIN") {
    //   return NextResponse.json(
    //     { error: "Não autorizado" },
    //     { status: 401 }
    //   )
    // }

    const body = await req.json()

    // Verificar se o banner existe
    const existingBanner = await db.banner.findUnique({
      where: { id },
    })

    if (!existingBanner) {
      return NextResponse.json({ error: "Banner não encontrado" }, { status: 404 })
    }

    // Atualizar o banner
    const updatedBanner = await db.banner.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        imageUrl: body.imageUrl,
        primaryButtonText: body.primaryButtonText,
        primaryButtonLink: body.primaryButtonLink,
        secondaryButtonText: body.secondaryButtonText || "",
        secondaryButtonLink: body.secondaryButtonLink || "",
        isActive: body.isActive,
      },
    })

    return NextResponse.json(updatedBanner)
  } catch (error) {
    console.error("Erro ao atualizar banner:", error)
    return NextResponse.json({ error: "Erro ao atualizar banner" }, { status: 500 })
  }
}

// DELETE - Excluir um banner
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // Resolver params para evitar erro de API síncrona
    const resolvedParams = await Promise.resolve(params)
    const { id } = resolvedParams

    // Verificar autenticação - comentado para testes
    // const session = await getServerSession(authOptions)
    // if (!session || session.user?.role !== "ADMIN") {
    //   return NextResponse.json(
    //     { error: "Não autorizado" },
    //     { status: 401 }
    //   )
    // }

    // Verificar se o banner existe
    const existingBanner = await db.banner.findUnique({
      where: { id },
    })

    if (!existingBanner) {
      return NextResponse.json({ error: "Banner não encontrado" }, { status: 404 })
    }

    // Excluir o banner
    await db.banner.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao excluir banner:", error)
    return NextResponse.json({ error: "Erro ao excluir banner" }, { status: 500 })
  }
}

