export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  discountPercentage: number
  imageUrl?: string
  category?: {
    id?: string
    name: string
    slug?: string
  }
  isFeatured?: boolean
  isNew?: boolean
  inStock?: boolean
  createdAt?: Date
  updatedAt?: Date
  storeId?: string
}

export interface User {
  id: string
  name: string
  email: string
  role: string
  image?: string
  storeId?: string
}

export interface Store {
  id: string
  name: string
  slug: string
  description?: string
  logoUrl?: string
  ownerId?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  storeId: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  name: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  customerId?: string
  status: string
  totalAmount: number
  createdAt: Date
  updatedAt: Date
  items: OrderItem[]
} 