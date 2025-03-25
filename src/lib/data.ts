import { db } from "@/lib/db"

export async function getBanners() {
  try {
    const banners = await db.banner.findMany({
      orderBy: { createdAt: "desc" },
    })

    return banners
  } catch (error) {
    console.error("Failed to fetch banners:", error)
    return []
  }
}

export async function getNewArrivals() {
  try {
    const products = await db.product.findMany({
      where: {
        isNew: true,
      },
      take: 8,
    })

    return products
  } catch (error) {
    console.error("Failed to fetch new arrivals:", error)
    return []
  }
}

export async function getPopularProducts() {
  try {
    const products = await db.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 8,
    })

    return products
  } catch (error) {
    console.error("Failed to fetch popular products:", error)
    return []
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await db.product.findUnique({
      where: {
        slug: slug,
      },
      include: {
        category: true,
        variations: true,
      },
    })

    return product
  } catch (error) {
    console.error("Failed to fetch product by slug:", error)
    return null
  }
}

export async function getRelatedProducts(productId: string) {
  try {
    const product = await db.product.findUnique({
      where: {
        id: productId,
      },
    })

    if (!product) {
      return []
    }

    const relatedProducts = await db.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: {
          not: productId,
        },
      },
      take: 4,
    })

    return relatedProducts
  } catch (error) {
    console.error("Failed to fetch related products:", error)
    return []
  }
}

