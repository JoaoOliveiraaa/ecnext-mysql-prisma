import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Adicionar o URL atual aos headers para uso nas páginas
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-url", request.url)
  requestHeaders.set("x-pathname", pathname)

  // Verificar se é uma rota administrativa (exceto a página de login)
  if (pathname.startsWith("/admin") && !pathname.includes("/admin/login")) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    // Se não estiver autenticado ou não for admin, redirecionar para login
    if (!token || token.email !== "admin@jondev.com") {
      const url = new URL("/admin/login", request.url)
      return NextResponse.redirect(url)
    }
  }

  // Continuar com a requisição, mas com os headers atualizados
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ["/admin/:path*"],
}

