import { hash } from "bcrypt"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { storeName, storeSlug, adminName, email, password } = body

    // Validar dados
    if (!storeName || !storeSlug || !adminName || !email || !password) {
      return NextResponse.json(
        { message: "Todos os campos são obrigatórios" },
        { status: 400 }
      )
    }

    // Verificar se o email já está em uso
    const existingStoreAdmin = await db.storeAdmin.findUnique({
      where: { email },
    })

    if (existingStoreAdmin) {
      return NextResponse.json(
        { message: "Este email já está em uso" },
        { status: 400 }
      )
    }

    // Verificar se o slug já está em uso
    const existingStore = await db.store.findUnique({
      where: { slug: storeSlug },
    })

    if (existingStore) {
      return NextResponse.json(
        { message: "Este slug de loja já está em uso" },
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await hash(password, 10)

    // Criar o administrador da loja e a loja em uma transação
    const result = await db.$transaction(async (prisma) => {
      // 1. Criar o admin da loja
      const storeAdmin = await prisma.storeAdmin.create({
        data: {
          name: adminName,
          email,
          password: hashedPassword,
        },
      })

      // 2. Criar a loja associada a este admin
      const store = await prisma.store.create({
        data: {
          name: storeName,
          slug: storeSlug,
          adminId: storeAdmin.id,
        },
      })

      return { storeAdmin, store }
    })

    // Retornar resposta de sucesso (sem expor a senha)
    return NextResponse.json(
      {
        message: "Loja criada com sucesso",
        admin: {
          id: result.storeAdmin.id,
          name: result.storeAdmin.name,
          email: result.storeAdmin.email,
        },
        store: {
          id: result.store.id,
          name: result.store.name,
          slug: result.store.slug,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("STORE_REGISTRATION_ERROR", error)
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    )
  }
} 