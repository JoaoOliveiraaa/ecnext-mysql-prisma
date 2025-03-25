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