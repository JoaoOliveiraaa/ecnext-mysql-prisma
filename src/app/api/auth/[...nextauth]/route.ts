import { PrismaAdapter } from "@auth/prisma-adapter"
import { compare } from "bcrypt"
import NextAuth, { type AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import { db } from "@/lib/db"

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        userType: { label: "UserType", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email e senha são obrigatórios")
        }

        const userType = credentials.userType || "customer"

        if (credentials.email === "admin@jondev.com") {
          if (credentials.password === "mariacecilia456!") {
            return {
              id: "admin",
              email: "admin@jondev.com",
              name: "Administrador",
              role: "superadmin",
              userType: "superadmin",
            }
          } else {
            throw new Error("Email ou senha inválidos")
          }
        }

        if (userType === "storeAdmin") {
          const storeAdmin = await db.storeAdmin.findUnique({
            where: {
              email: credentials.email,
            },
            include: {
              store: true,
            },
          })

          if (!storeAdmin || !storeAdmin.password) {
            throw new Error("Email ou senha inválidos")
          }

          const isCorrectPassword = await compare(credentials.password, storeAdmin.password)

          if (!isCorrectPassword) {
            throw new Error("Email ou senha inválidos")
          }

          return {
            id: storeAdmin.id,
            email: storeAdmin.email,
            name: storeAdmin.name,
            role: "storeAdmin",
            userType: "storeAdmin",
            storeId: storeAdmin.store?.id,
          }
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user || !user.password) {
          throw new Error("Email ou senha inválidos")
        }

        const isCorrectPassword = await compare(credentials.password, user.password)

        if (!isCorrectPassword) {
          throw new Error("Email ou senha inválidos")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          userType: "customer",
        }
      },
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role as string
        token.userType = user.userType as string
        if (user.storeId) {
          token.storeId = user.storeId as string
        }
      }
      return token
    },
    session: async ({ session, token }) => {
      if (token && session.user) {
        session.user.role = token.role as string
        session.user.userType = token.userType as string
        if (token.storeId) {
          session.user.storeId = token.storeId as string
        }
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login",
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

