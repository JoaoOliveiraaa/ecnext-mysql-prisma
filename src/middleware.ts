import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Verificar se o usuário está tentando visitar a loja como convidado
  const isVisitingAsGuest = request.cookies.has('visit_store_as_guest')

  // Se o usuário estiver visitando como convidado e a URL for da loja
  if (isVisitingAsGuest && request.nextUrl.pathname.startsWith('/store/')) {
    // Cria uma resposta usando a URL atual
    const response = NextResponse.next()
    
    // Remove qualquer cookie de autenticação para tornar o usuário anônimo na loja
    // mas apenas para esta requisição, para não afetar outras partes do site
    response.cookies.delete('next-auth.session-token')
    response.cookies.delete('next-auth.callback-url')
    response.cookies.delete('next-auth.csrf-token')
    
    // Obter o slug da loja a partir da URL
    const storeSlug = request.nextUrl.pathname.split('/')[2]
    
    // Limpar cookies específicos de usuário para garantir que não haja 
    // compartilhamento de dados entre admin e cliente
    if (storeSlug) {
      // Remover cookies de endereços e métodos de pagamento
      response.cookies.delete(`user-addresses-${storeSlug}`)
      response.cookies.delete(`user-payment-methods-${storeSlug}`)
    }
    
    // Definir um header personalizado para indicar que o usuário está em modo convidado
    response.headers.set('x-guest-mode', 'true')
    
    // Retorna a resposta modificada
    return response
  }
  
  // Se não está visitando como convidado, apenas continua normalmente
  return NextResponse.next()
}

export const config = {
  // Aplicar este middleware apenas em páginas da loja e na API de autenticação
  matcher: ['/store/:path*', '/api/auth/:path*'],
} 