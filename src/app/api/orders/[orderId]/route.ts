import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const orderId = params.orderId

    // Buscar o pedido básico primeiro
    const basicOrder = await db.order.findUnique({
      where: {
        id: orderId,
        userId: session.user.id, // Garantir que o pedido pertence ao usuário logado
      },
    })

    if (!basicOrder) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 })
    }

    // Buscar informações da loja
    const store = await db.store.findUnique({
      where: {
        id: basicOrder.storeId,
      },
      select: {
        name: true,
        slug: true,
      },
    })

    // Buscar informações do usuário
    const user = await db.user.findUnique({
      where: {
        id: basicOrder.userId,
      },
      select: {
        name: true,
        email: true,
      },
    })

    // Buscar os itens do pedido
    // Use @ts-ignore pois o tipo OrderItem pode não estar devidamente refletido no seu ambiente
    // @ts-ignore
    const orderItems = await db.orderItem.findMany({
      where: {
        orderId: orderId,
      },
    })

    // Combinar os dados
    const fullOrder = {
      ...basicOrder,
      store,
      user,
      items: orderItems,
    }

    return NextResponse.json(fullOrder)
  } catch (error) {
    console.error("Erro ao buscar pedido:", error)
    return NextResponse.json(
      { error: "Erro ao buscar informações do pedido" },
      { status: 500 }
    )
  }
} 