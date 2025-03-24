import { db } from "@/lib/db"

export async function getUsers(page = 1, limit = 10) {
  try {
    const skip = (page - 1) * limit

    // Buscar usuários com contagem de pedidos
    const users = await db.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
    })

    // Formatar dados para a tabela
    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      ordersCount: user._count.orders,
      createdAt: user.createdAt.toISOString(),
    }))

    // Contar total de usuários
    const total = await db.user.count()

    return {
      users: formattedUsers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  } catch (error) {
    console.error("Erro ao buscar usuários:", error)
    return {
      users: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    }
  }
}

export async function getCategories() {
  try {
    const categories = await db.category.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    })

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      imageUrl: category.imageUrl,
      productsCount: category._count.products,
    }))
  } catch (error) {
    console.error("Erro ao buscar categorias:", error)
    return []
  }
}

// Modificar a função getDashboardStats para remover a referência ao campo stock
export async function getDashboardStats() {
  try {
    // Total de vendas (implementação fictícia)
    const totalSales = 0
    const salesGrowth = 0

    // Total de pedidos - verificando se o modelo existe
    let totalOrders = 0
    const ordersGrowth = 0
    try {
      if (db.order) {
        totalOrders = await db.order.count()
      }
    } catch (error) {
      console.error("Erro ao contar pedidos:", error)
    }

    // Total de produtos
    let totalProducts = 0
    let activeProducts = 0
    try {
      totalProducts = await db.product.count()
      // Como não temos o campo stock, vamos considerar todos os produtos como ativos
      activeProducts = totalProducts
    } catch (error) {
      console.error("Erro ao contar produtos:", error)
    }

    // Total de usuários
    let totalUsers = 0
    const usersGrowth = 0
    try {
      totalUsers = await db.user.count()
    } catch (error) {
      console.error("Erro ao contar usuários:", error)
    }

    return {
      totalSales,
      salesGrowth,
      totalOrders,
      ordersGrowth,
      totalProducts,
      activeProducts,
      totalUsers,
      usersGrowth,
    }
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error)
    return {
      totalSales: 0,
      salesGrowth: 0,
      totalOrders: 0,
      ordersGrowth: 0,
      totalProducts: 0,
      activeProducts: 0,
      totalUsers: 0,
      usersGrowth: 0,
    }
  }
}

export async function getRecentOrders(limit = 5) {
  try {
    // Verificar se o modelo order existe
    if (!db.order) {
      return []
    }

    const orders = await db.order.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    })

    return orders.map((order) => ({
      id: order.id,
      customer: order.user?.name || "Cliente",
      date: order.createdAt.toLocaleDateString("pt-BR"),
      status: order.status,
      total: order.total,
    }))
  } catch (error) {
    console.error("Erro ao buscar pedidos recentes:", error)
    return []
  }
}

export async function getTopProducts(limit = 5) {
  try {
    // Esta é uma implementação fictícia
    // Em um sistema real, você calcularia os produtos mais vendidos
    const products = await db.product.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
    })

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      price: product.price,
      stock: 0,
      sold: 0,
      revenue: 0,
    }))
  } catch (error) {
    console.error("Erro ao buscar produtos mais vendidos:", error)
    return []
  }
}

export async function getAdminProducts(page = 1, limit = 10) {
  try {
    const skip = (page - 1) * limit

    const products = await db.product.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    })

    const total = await db.product.count()

    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      imageUrl: product.imageUrl,
      price: product.price,
      discountPercentage: product.discountPercentage,
      stock: 0,
      isNew: product.isNew,
      isFeatured: product.isFeatured,
      category: product.category.name,
    }))

    return {
      products: formattedProducts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return {
      products: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    }
  }
}

