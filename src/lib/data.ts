import { db } from "@/lib/db"

// Versões antigas com nomes diferentes para evitar colisões
export async function getAllBanners() {
  try {
    const banners = await db.banner.findMany({
      where: {
        isActive: true
      },
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

// Renomeada para evitar conflito
export async function getAllFeaturedProducts() {
  try {
    const products = await db.product.findMany({
      where: {
        isFeatured: true,
      },
      take: 8,
      include: {
        category: true,
      },
    })

    return products
  } catch (error) {
    console.error("Failed to fetch featured products:", error)
    return []
  }
}

export async function getProducts() {
  try {
    const products = await db.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return products
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return []
  }
}

// Renomeada para evitar conflito
export async function getAllCategories() {
  try {
    const categories = await db.category.findMany({
      orderBy: {
        name: "asc",
      },
    })

    return categories
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return []
  }
}

// Função para buscar pedidos do usuário
export async function getOrders() {
  try {
    // Em uma implementação real, buscaríamos os pedidos do usuário no banco de dados
    // Por enquanto, retornaremos um array vazio
    return [];
    
    // Em produção, usaríamos algo como:
    /*
    const orders = await db.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    
    return orders;
    */
  } catch (error) {
    console.error("Falha ao buscar pedidos:", error);
    return [];
  }
}

// Função para buscar um pedido específico pelo ID
export async function getOrderById(orderId: string) {
  try {
    // Em uma implementação real, buscaríamos o pedido específico no banco de dados
    // Por enquanto, retornaremos null
    return null;
    
    // Em produção, usaríamos algo como:
    /*
    const order = await db.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        address: true,
      },
    });
    
    return order;
    */
  } catch (error) {
    console.error("Falha ao buscar detalhes do pedido:", error);
    return null;
  }
}

// Obter dados da loja pelo slug
export async function getStoreBySlug(slug: string) {
  try {
    const store = await db.store.findUnique({
      where: { slug },
    })
    return store
  } catch (error) {
    console.error("Erro ao buscar loja:", error)
    return null
  }
}

// Obter produtos em destaque
export async function getFeaturedProducts(storeId: string, limit = 4) {
  try {
    const products = await db.product.findMany({
      where: {
        storeId,
        isFeatured: true,
      },
      take: limit,
      include: {
        category: true,
      },
    })
    return products
  } catch (error) {
    console.error("Erro ao buscar produtos em destaque:", error)
    return []
  }
}

// Obter novos produtos
export async function getNewProducts(storeId: string, limit = 8) {
  try {
    const products = await db.product.findMany({
      where: {
        storeId,
        isNew: true,
      },
      take: limit,
      include: {
        category: true,
      },
    })
    return products
  } catch (error) {
    console.error("Erro ao buscar novos produtos:", error)
    return []
  }
}

// Obter categorias
export async function getCategories(storeId: string) {
  try {
    const categories = await db.category.findMany({
      where: {
        storeId,
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    })
    return categories
  } catch (error) {
    console.error("Erro ao buscar categorias:", error)
    return []
  }
}

// Obter banners
export async function getBanners(storeId: string) {
  try {
    const banners = await db.banner.findMany({
      where: {
        storeId,
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return banners
  } catch (error) {
    console.error("Erro ao buscar banners:", error)
    return []
  }
}

// Obter configurações da loja
export async function getStoreSettings(storeId: string) {
  try {
    // Simulação de configurações de loja - em um sistema real, isso viria do banco de dados
    // const settings = await db.storeSettings.findFirst({ ... })
    
    // Configurações padrão
    const defaultSettings = {
      primaryColor: "#0f766e",
      secondaryColor: "#4f46e5",
      accentColor: "#f97316",
      logoUrl: "/placeholder.svg",
      faviconUrl: "/favicon.ico",
      footerText: "© 2023 MINISHOP. Todos os direitos reservados.",
      showHeroSection: true,
      showFeaturedProducts: true,
      showNewArrivals: true,
      showCategoriesSection: true,
      heroTitle: "Bem-vindo à nossa loja",
      heroDescription: "Encontre os melhores produtos com os melhores preços",
      layoutType: "modern",
      fontFamily: "Inter",
      contactEmail: "contato@exemplo.com",
      contactPhone: "(00) 00000-0000",
      whatsappNumber: "",
      address: "Rua Exemplo, 123 - Cidade - Estado",
      physicalAddress: "Rua Exemplo, 123 - Cidade - Estado",
      googleMapsUrl: "",
      facebookUrl: "",
      instagramUrl: "",
      twitterUrl: "",
      youtubeUrl: "",
      socialFacebook: "",
      socialInstagram: "",
      socialTwitter: "",
      socialYoutube: "",
      aboutText: "Somos uma loja comprometida com a qualidade e satisfação dos nossos clientes.",
      helpText: "Entre em contato conosco para obter ajuda com seus pedidos ou dúvidas sobre nossos produtos.",
      privacyPolicyText: "Política de privacidade da loja.",
      termsOfServiceText: "Termos de serviço da loja.",
      enableWhatsappSupport: false,
      enableNewsletterPopup: false,
      enableReviews: true,
    }
    
    // Em um sistema real, você buscaria no banco de dados e mesclaria com os valores padrão
    return defaultSettings;
  } catch (error) {
    console.error("Erro ao buscar configurações da loja:", error)
    return null
  }
}

