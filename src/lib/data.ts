import { db } from "@/lib/db"

export async function getBanner() {
  try {
    const banner = await db.banner.findFirst({
      where: {
        isActive: true,
      },
    })

    if (!banner) {
      // Retornar um banner padrão se nenhum for encontrado no banco
      return {
        id: "1",
        title: "Spring Collection",
        description: "Discover our new arrivals with up to 30% off. Limited time offer.",
        imageUrl: "/placeholder.svg?height=300&width=500",
        primaryButtonText: "Shop Now",
        primaryButtonLink: "/shop",
        secondaryButtonText: "Learn More",
        secondaryButtonLink: "/about",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }

    return banner
  } catch (error) {
    console.error("Failed to fetch banner:", error)
    // Retornar um banner padrão em caso de erro
    return {
      id: "1",
      title: "Spring Collection",
      description: "Discover our new arrivals with up to 30% off. Limited time offer.",
      imageUrl: "/placeholder.svg?height=300&width=500",
      primaryButtonText: "Shop Now",
      primaryButtonLink: "/shop",
      secondaryButtonText: "Learn More",
      secondaryButtonLink: "/about",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }
}

export async function getFeaturedProducts() {
  try {
    const products = await db.product.findMany({
      where: {
        isFeatured: true,
      },
      take: 6,
    })

    return products
  } catch (error) {
    console.error("Failed to fetch featured products:", error)
    return [
      {
        id: "1",
        name: "Headphones Pro",
        slug: "headphones-pro",
        description: "High quality headphones with noise cancellation",
        price: 199.99,
        discountPercentage: 20,
        imageUrl: "/placeholder.svg?height=300&width=300",
        categoryId: "1",
        isNew: false,
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "Smart Watch Elite",
        slug: "smart-watch-elite",
        description: "Advanced smartwatch with health tracking",
        price: 249.99,
        discountPercentage: 0,
        imageUrl: "/placeholder.svg?height=300&width=300",
        categoryId: "2",
        isNew: true,
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "3",
        name: "Wireless Earbuds",
        slug: "wireless-earbuds",
        description: "Comfortable wireless earbuds with long battery life",
        price: 129.99,
        discountPercentage: 15,
        imageUrl: "/placeholder.svg?height=300&width=300",
        categoryId: "1",
        isNew: false,
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
  }
}

interface GetProductsParams {
  category?: string
  limit?: number
  offset?: number
}

export async function getProducts({ category, limit = 8, offset = 0 }: GetProductsParams = {}) {
  try {
    const products = await db.product.findMany({
      where: category
        ? {
            category: {
              slug: category,
            },
          }
        : undefined,
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: "desc",
      },
    })

    return products
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return [
      {
        id: "4",
        name: "Smartphone X",
        slug: "smartphone-x",
        description: "Latest smartphone with advanced camera",
        price: 899.99,
        discountPercentage: 10,
        imageUrl: "/placeholder.svg?height=300&width=300",
        categoryId: "3",
        isNew: true,
        isFeatured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "5",
        name: "Tablet Pro",
        slug: "tablet-pro",
        description: "Powerful tablet for work and entertainment",
        price: 499.99,
        discountPercentage: 0,
        imageUrl: "/placeholder.svg?height=300&width=300",
        categoryId: "3",
        isNew: true,
        isFeatured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "6",
        name: "Bluetooth Speaker",
        slug: "bluetooth-speaker",
        description: "Portable speaker with amazing sound quality",
        price: 79.99,
        discountPercentage: 5,
        imageUrl: "/placeholder.svg?height=300&width=300",
        categoryId: "4",
        isNew: true,
        isFeatured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "7",
        name: "Fitness Tracker",
        slug: "fitness-tracker",
        description: "Track your fitness goals with this smart device",
        price: 59.99,
        discountPercentage: 0,
        imageUrl: "/placeholder.svg?height=300&width=300",
        categoryId: "2",
        isNew: false,
        isFeatured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
  }
}

export async function getCategories() {
  try {
    const categories = await db.category.findMany()

    return categories
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return [
      {
        id: "1",
        name: "Audio",
        slug: "audio",
        imageUrl: "/placeholder.svg?height=300&width=400",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "Wearables",
        slug: "wearables",
        imageUrl: "/placeholder.svg?height=300&width=400",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "3",
        name: "Smartphones",
        slug: "smartphones",
        imageUrl: "/placeholder.svg?height=300&width=400",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
  }
}

export async function getOrders() {
  try {
    // Aqui você implementaria a chamada ao banco de dados para buscar os pedidos do usuário
    // const orders = await db.order.findMany({
    //   where: { userId: session.user.id },
    //   include: { items: true },
    //   orderBy: { createdAt: 'desc' }
    // })

    // Como ainda não temos a implementação real, retornamos dados de exemplo
    return []
  } catch (error) {
    console.error("Failed to fetch orders:", error)
    return []
  }
}

