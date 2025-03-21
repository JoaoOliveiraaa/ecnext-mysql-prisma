export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  discountPercentage: number
  imageUrl: string
  categoryId: string
  isNew: boolean
  isFeatured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  imageUrl: string
  createdAt: Date
  updatedAt: Date
}

export interface Banner {
  id: string
  title: string
  description: string
  imageUrl: string
  primaryButtonText: string
  primaryButtonLink: string
  secondaryButtonText: string
  secondaryButtonLink: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}

