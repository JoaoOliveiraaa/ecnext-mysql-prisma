import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import Stripe from "stripe"
import { z } from "zod"

// Criar uma instância do Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
})

// Schema para validação dos dados do pedido
const orderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      name: z.string(),
      price: z.number(),
      quantity: z.number().int().positive(),
      imageUrl: z.string(),
      variations: z.any().optional(),
    })
  ),
  shippingInfo: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
  }),
  totalPrice: z.number(),
  storeSlug: z.string(),
  paymentMethod: z.enum(["stripe", "pix"]),
})

export async function POST(req: Request) {
  try {
    // Verificar a autenticação do usuário
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    // Obter dados do pedido
    const body = await req.json()
    
    // Validar os dados recebidos
    const validationResult = orderSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: validationResult.error.format() },
        { status: 400 }
      )
    }

    const orderData = validationResult.data

    // Obter ID da loja pelo slug
    const store = await db.store.findUnique({
      where: {
        slug: orderData.storeSlug,
      },
      select: {
        id: true,
        name: true,
      }
    })

    if (!store) {
      return NextResponse.json({ error: "Loja não encontrada" }, { status: 404 })
    }

    // Calcular o total correto (verificação de segurança)
    const calculatedTotal = orderData.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )

    // Verificar se o total calculado corresponde ao total enviado
    if (Math.abs(calculatedTotal - orderData.totalPrice) > 0.01) {
      return NextResponse.json(
        { error: "Valor total inválido" },
        { status: 400 }
      )
    }

    // Criar o pedido no banco de dados
    const order = await db.order.create({
      data: {
        userId: session.user.id,
        storeId: store.id,
        status: "pending",
        total: orderData.totalPrice,
        // Informações de entrega
        shippingName: orderData.shippingInfo.name,
        shippingEmail: orderData.shippingInfo.email,
        shippingPhone: orderData.shippingInfo.phone || null,
        shippingAddress: orderData.shippingInfo.address,
        shippingCity: orderData.shippingInfo.city,
        shippingState: orderData.shippingInfo.state,
        shippingZipCode: orderData.shippingInfo.zipCode,
        // Informações de pagamento
        paymentMethod: orderData.paymentMethod,
        paymentStatus: "pending",
      },
    })

    // Criar os itens do pedido
    await db.orderItem.createMany({
      data: orderData.items.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
        variations: item.variations || null,
      })),
    })

    // Processar pagamento com base no método selecionado
    if (orderData.paymentMethod === "stripe") {
      // Criar sessão de checkout do Stripe
      const lineItems = orderData.items.map((item) => ({
        price_data: {
          currency: "brl",
          product_data: {
            name: item.name,
            images: [item.imageUrl],
          },
          unit_amount: Math.round(item.price * 100), // Stripe trabalha com centavos
        },
        quantity: item.quantity,
      }))

      const stripeSession = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/store/${orderData.storeSlug}/order-confirmation/${order.id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/store/${orderData.storeSlug}/checkout`,
        metadata: {
          orderId: order.id,
        },
      })

      // Atualizar o pedido com o ID da intent de pagamento
      await db.order.update({
        where: { id: order.id },
        data: {
          paymentIntentId: stripeSession.id,
        },
      })

      // Retornar URL para redirecionamento
      return NextResponse.json({
        orderId: order.id,
        paymentUrl: stripeSession.url,
      })
    } else if (orderData.paymentMethod === "pix") {
      // Aqui você implementaria a lógica para gerar um QR code PIX
      // Por simplicidade, vamos apenas retornar o ID do pedido
      return NextResponse.json({
        orderId: order.id,
        paymentMethod: "pix",
      })
    }

    return NextResponse.json({
      orderId: order.id,
    })
  } catch (error) {
    console.error("Erro ao processar checkout:", error)
    return NextResponse.json(
      { error: "Erro ao processar o pedido" },
      { status: 500 }
    )
  }
} 