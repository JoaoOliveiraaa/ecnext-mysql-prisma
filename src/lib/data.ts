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
    // Verificar se o usuário está autenticado seria ideal aqui
    // Por enquanto, retornaremos dados simulados
    
    const mockOrders = [
      {
        id: "ORD123456",
        status: "Entregue",
        createdAt: new Date("2023-05-15"),
        total: 250.99,
        items: [
          { id: "1", name: "Camiseta Básica", price: 79.99, quantity: 2 },
          { id: "2", name: "Calça Jeans", price: 159.90, quantity: 1 }
        ]
      },
      {
        id: "ORD789012",
        status: "Em trânsito",
        createdAt: new Date("2023-06-20"),
        total: 349.97,
        items: [
          { id: "3", name: "Tênis Casual", price: 199.99, quantity: 1 },
          { id: "4", name: "Meia Kit 3 pares", price: 49.99, quantity: 1 },
          { id: "5", name: "Boné", price: 99.99, quantity: 1 }
        ]
      },
      {
        id: "ORD345678",
        status: "Processando",
        createdAt: new Date("2023-07-05"),
        total: 129.90,
        items: [
          { id: "6", name: "Camiseta Estampada", price: 89.90, quantity: 1 },
          { id: "7", name: "Chaveiro", price: 19.99, quantity: 2 }
        ]
      }
    ];
    
    return mockOrders;
    
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
    const settings = await db.storeSettings.findFirst({
      where: {
        storeId,
      },
    })

    // Se não existirem configurações, retornar valores padrão
    if (!settings) {
      return {
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
    }

    return {
      ...settings,
      // Garantir valores padrão para campos de texto que podem ser nulos
      aboutText: settings.aboutText || "Somos uma loja comprometida com a qualidade e satisfação dos nossos clientes.",
      helpText: settings.helpText || "Entre em contato conosco para obter ajuda com seus pedidos ou dúvidas sobre nossos produtos.",
      privacyPolicyText: settings.privacyPolicyText || "Política de privacidade da loja.",
      termsOfServiceText: settings.termsOfServiceText || "Termos de serviço da loja.",
      // Campos adicionais compatíveis com o que está sendo usado na aplicação
      physicalAddress: settings.address || "Rua Exemplo, 123 - Cidade - Estado",
      socialFacebook: settings.facebookUrl || "",
      socialInstagram: settings.instagramUrl || "",
      socialTwitter: settings.twitterUrl || "",
      socialYoutube: settings.youtubeUrl || "",
    }
  } catch (error) {
    console.error("Erro ao buscar configurações da loja:", error)
    return null
  }
}

