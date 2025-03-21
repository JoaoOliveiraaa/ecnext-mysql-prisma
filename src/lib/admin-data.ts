// Dados de exemplo para o dashboard administrativo

export async function getDashboardStats() {
  // Aqui você implementaria a chamada ao banco de dados para buscar as estatísticas
  // Retornando dados de exemplo para demonstração
  return {
    totalSales: 15750.99,
    salesGrowth: 12.5,
    totalOrders: 124,
    ordersGrowth: 8.3,
    totalProducts: 87,
    activeProducts: 72,
    totalUsers: 256,
    usersGrowth: 15.2,
  }
}

export async function getRecentOrders() {
  // Aqui você implementaria a chamada ao banco de dados para buscar os pedidos recentes
  // Retornando dados de exemplo para demonstração
  return [
    {
      id: "ORD-001",
      customer: "João Silva",
      date: "21/03/2025",
      status: "delivered" as const,
      total: 299.99,
    },
    {
      id: "ORD-002",
      customer: "Maria Oliveira",
      date: "20/03/2025",
      status: "shipped" as const,
      total: 149.5,
    },
    {
      id: "ORD-003",
      customer: "Pedro Santos",
      date: "19/03/2025",
      status: "processing" as const,
      total: 499.99,
    },
    {
      id: "ORD-004",
      customer: "Ana Costa",
      date: "18/03/2025",
      status: "pending" as const,
      total: 89.9,
    },
    {
      id: "ORD-005",
      customer: "Carlos Ferreira",
      date: "17/03/2025",
      status: "delivered" as const,
      total: 199.99,
    },
    {
      id: "ORD-006",
      customer: "Mariana Lima",
      date: "16/03/2025",
      status: "cancelled" as const,
      total: 129.99,
    },
    {
      id: "ORD-007",
      customer: "Rafael Souza",
      date: "15/03/2025",
      status: "delivered" as const,
      total: 349.99,
    },
  ]
}

export async function getTopProducts() {
  // Aqui você implementaria a chamada ao banco de dados para buscar os produtos mais vendidos
  // Retornando dados de exemplo para demonstração
  return [
    {
      id: "1",
      name: "Headphones Pro",
      imageUrl: "/placeholder.svg?height=300&width=300",
      price: 199.99,
      stock: 45,
      sold: 128,
      revenue: 25598.72,
    },
    {
      id: "2",
      name: "Smart Watch Elite",
      imageUrl: "/placeholder.svg?height=300&width=300",
      price: 249.99,
      stock: 32,
      sold: 96,
      revenue: 23999.04,
    },
    {
      id: "3",
      name: "Wireless Earbuds",
      imageUrl: "/placeholder.svg?height=300&width=300",
      price: 129.99,
      stock: 78,
      sold: 87,
      revenue: 11309.13,
    },
    {
      id: "4",
      name: "Smartphone X",
      imageUrl: "/placeholder.svg?height=300&width=300",
      price: 899.99,
      stock: 15,
      sold: 42,
      revenue: 37799.58,
    },
    {
      id: "5",
      name: "Tablet Pro",
      imageUrl: "/placeholder.svg?height=300&width=300",
      price: 499.99,
      stock: 23,
      sold: 35,
      revenue: 17499.65,
    },
    {
      id: "6",
      name: "Bluetooth Speaker",
      imageUrl: "/placeholder.svg?height=300&width=300",
      price: 79.99,
      stock: 56,
      sold: 64,
      revenue: 5119.36,
    },
  ]
}

export async function getAdminProducts(page = 1, limit = 10) {
  // Aqui você implementaria a chamada ao banco de dados para buscar os produtos
  // Retornando dados de exemplo para demonstração
  const products = [
    {
      id: "1",
      name: "Headphones Pro",
      slug: "headphones-pro",
      description: "High quality headphones with noise cancellation",
      price: 199.99,
      discountPercentage: 20,
      imageUrl: "/placeholder.svg?height=300&width=300",
      categoryId: "1",
      category: "Audio",
      stock: 45,
      isNew: false,
      isFeatured: true,
      createdAt: "2025-02-15T10:00:00Z",
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
      category: "Wearables",
      stock: 32,
      isNew: true,
      isFeatured: true,
      createdAt: "2025-02-20T14:30:00Z",
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
      category: "Audio",
      stock: 78,
      isNew: false,
      isFeatured: true,
      createdAt: "2025-02-25T09:15:00Z",
    },
    {
      id: "4",
      name: "Smartphone X",
      slug: "smartphone-x",
      description: "Latest smartphone with advanced camera",
      price: 899.99,
      discountPercentage: 10,
      imageUrl: "/placeholder.svg?height=300&width=300",
      categoryId: "3",
      category: "Smartphones",
      stock: 15,
      isNew: true,
      isFeatured: false,
      createdAt: "2025-03-01T11:45:00Z",
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
      category: "Smartphones",
      stock: 23,
      isNew: true,
      isFeatured: false,
      createdAt: "2025-03-05T16:20:00Z",
    },
  ]

  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  return {
    products: products.slice(startIndex, endIndex),
    total: products.length,
    page,
    limit,
    totalPages: Math.ceil(products.length / limit),
  }
}

export async function getAdminCategories() {
  // Aqui você implementaria a chamada ao banco de dados para buscar as categorias
  // Retornando dados de exemplo para demonstração
  return [
    {
      id: "1",
      name: "Audio",
      slug: "audio",
      imageUrl: "/placeholder.svg?height=300&width=400",
      productsCount: 12,
      createdAt: "2025-01-15T10:00:00Z",
    },
    {
      id: "2",
      name: "Wearables",
      slug: "wearables",
      imageUrl: "/placeholder.svg?height=300&width=400",
      productsCount: 8,
      createdAt: "2025-01-20T14:30:00Z",
    },
    {
      id: "3",
      name: "Smartphones",
      slug: "smartphones",
      imageUrl: "/placeholder.svg?height=300&width=400",
      productsCount: 15,
      createdAt: "2025-01-25T09:15:00Z",
    },
  ]
}

export async function getAdminBanners() {
  // Aqui você implementaria a chamada ao banco de dados para buscar os banners
  // Retornando dados de exemplo para demonstração
  return [
    {
      id: "1",
      title: "Spring Collection",
      description: "Discover our new arrivals with up to 30% off. Limited time offer.",
      imageUrl: "/placeholder.svg?height=300&width=500",
      primaryButtonText: "Shop Now",
      primaryButtonLink: "/shop",
      secondaryButtonText: "Learn More",
      secondaryButtonLink: "/about",
      isActive: true,
      createdAt: "2025-02-15T10:00:00Z",
    },
    {
      id: "2",
      title: "Summer Sale",
      description: "Get ready for summer with our exclusive discounts on selected items.",
      imageUrl: "/placeholder.svg?height=300&width=500",
      primaryButtonText: "View Offers",
      primaryButtonLink: "/sale",
      secondaryButtonText: "See All",
      secondaryButtonLink: "/categories",
      isActive: false,
      createdAt: "2025-02-20T14:30:00Z",
    },
  ]
}

export async function getAdminUsers() {
  // Aqui você implementaria a chamada ao banco de dados para buscar os usuários
  // Retornando dados de exemplo para demonstração
  return [
    {
      id: "1",
      name: "João Silva",
      email: "joao.silva@example.com",
      ordersCount: 5,
      totalSpent: 749.95,
      createdAt: "2025-01-10T08:30:00Z",
    },
    {
      id: "2",
      name: "Maria Oliveira",
      email: "maria.oliveira@example.com",
      ordersCount: 3,
      totalSpent: 329.97,
      createdAt: "2025-01-15T14:45:00Z",
    },
    {
      id: "3",
      name: "Pedro Santos",
      email: "pedro.santos@example.com",
      ordersCount: 7,
      totalSpent: 1249.93,
      createdAt: "2025-01-20T11:15:00Z",
    },
    {
      id: "4",
      name: "Ana Costa",
      email: "ana.costa@example.com",
      ordersCount: 2,
      totalSpent: 179.98,
      createdAt: "2025-01-25T09:30:00Z",
    },
    {
      id: "5",
      name: "Carlos Ferreira",
      email: "carlos.ferreira@example.com",
      ordersCount: 4,
      totalSpent: 599.96,
      createdAt: "2025-01-30T16:20:00Z",
    },
  ]
}

export async function getAdminOrders() {
  // Aqui você implementaria a chamada ao banco de dados para buscar os pedidos
  // Retornando dados de exemplo para demonstração
  return [
    {
      id: "ORD-001",
      customer: {
        id: "1",
        name: "João Silva",
        email: "joao.silva@example.com",
      },
      items: [
        {
          id: "1",
          productId: "1",
          name: "Headphones Pro",
          price: 199.99,
          quantity: 1,
          total: 199.99,
        },
        {
          id: "2",
          productId: "3",
          name: "Wireless Earbuds",
          price: 129.99,
          quantity: 1,
          total: 129.99,
        },
      ],
      status: "delivered",
      total: 329.98,
      createdAt: "2025-03-15T10:30:00Z",
      updatedAt: "2025-03-18T14:45:00Z",
      shippingAddress: {
        street: "Rua das Flores, 123",
        city: "São Paulo",
        state: "SP",
        zipCode: "01001-000",
      },
      paymentMethod: "credit_card",
    },
    {
      id: "ORD-002",
      customer: {
        id: "2",
        name: "Maria Oliveira",
        email: "maria.oliveira@example.com",
      },
      items: [
        {
          id: "3",
          productId: "2",
          name: "Smart Watch Elite",
          price: 249.99,
          quantity: 1,
          total: 249.99,
        },
      ],
      status: "shipped",
      total: 249.99,
      createdAt: "2025-03-16T09:15:00Z",
      updatedAt: "2025-03-17T11:30:00Z",
      shippingAddress: {
        street: "Avenida Paulista, 1000",
        city: "São Paulo",
        state: "SP",
        zipCode: "01310-100",
      },
      paymentMethod: "credit_card",
    },
    {
      id: "ORD-003",
      customer: {
        id: "3",
        name: "Pedro Santos",
        email: "pedro.santos@example.com",
      },
      items: [
        {
          id: "4",
          productId: "4",
          name: "Smartphone X",
          price: 899.99,
          quantity: 1,
          total: 899.99,
        },
      ],
      status: "processing",
      total: 899.99,
      createdAt: "2025-03-17T14:20:00Z",
      updatedAt: "2025-03-17T14:20:00Z",
      shippingAddress: {
        street: "Rua Augusta, 500",
        city: "São Paulo",
        state: "SP",
        zipCode: "01305-000",
      },
      paymentMethod: "pix",
    },
    {
      id: "ORD-004",
      customer: {
        id: "4",
        name: "Ana Costa",
        email: "ana.costa@example.com",
      },
      items: [
        {
          id: "5",
          productId: "6",
          name: "Bluetooth Speaker",
          price: 79.99,
          quantity: 1,
          total: 79.99,
        },
      ],
      status: "pending",
      total: 79.99,
      createdAt: "2025-03-18T11:45:00Z",
      updatedAt: "2025-03-18T11:45:00Z",
      shippingAddress: {
        street: "Rua Oscar Freire, 300",
        city: "São Paulo",
        state: "SP",
        zipCode: "01426-000",
      },
      paymentMethod: "boleto",
    },
    {
      id: "ORD-005",
      customer: {
        id: "5",
        name: "Carlos Ferreira",
        email: "carlos.ferreira@example.com",
      },
      items: [
        {
          id: "6",
          productId: "5",
          name: "Tablet Pro",
          price: 499.99,
          quantity: 1,
          total: 499.99,
        },
      ],
      status: "delivered",
      total: 499.99,
      createdAt: "2025-03-14T16:30:00Z",
      updatedAt: "2025-03-16T09:45:00Z",
      shippingAddress: {
        street: "Rua Consolação, 200",
        city: "São Paulo",
        state: "SP",
        zipCode: "01302-000",
      },
      paymentMethod: "credit_card",
    },
  ]
}

