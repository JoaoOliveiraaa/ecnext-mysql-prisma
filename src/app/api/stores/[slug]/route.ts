import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  req: Request,
  props: { params: { slug: string } }
) {
  try {
    // Aguarde os parâmetros antes de usá-los
    const params = await Promise.resolve(props.params);
    const slug = params.slug;
    
    const store = await db.store.findUnique({
      where: {
        slug: slug
      },
      select: {
        id: true,
        name: true,
        slug: true
      }
    })

    if (!store) {
      return NextResponse.json(
        { error: "Loja não encontrada" },
        { status: 404 }
      )
    }

    return NextResponse.json(store)
  } catch (error) {
    console.error("Erro ao buscar informações da loja:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
} 