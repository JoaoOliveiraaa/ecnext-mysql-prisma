import { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      userType: string
      storeId?: string
    } & DefaultSession["user"]
  }

  interface User {
    role: string
    userType: string
    storeId?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    userType: string
    storeId?: string
  }
}

