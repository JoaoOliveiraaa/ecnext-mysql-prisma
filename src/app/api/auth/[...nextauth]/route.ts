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
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email e senha são obrigatórios")
        }

        // Verificar se é o usuário admin
        if (credentials.email === "admin@jondev.com") {
          if (credentials.password === "mariacecilia456!") {
            return {
              id: "admin",
              email: "admin@jondev.com",
              name: "Administrador",
              role: "admin",
            }
          } else {
            throw new Error("Email ou senha inválidos")
          }
        }

        // Para usuários normais, verificar no banco de dados
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
          role: "user",
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
        token.role = user.role
      }
      return token
    },
    session: async ({ session, token }) => {
      if (token && session.user) {
        session.user.role = token.role as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

