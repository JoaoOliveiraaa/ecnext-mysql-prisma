import { NextResponse } from "next/server"

// Esta rota temporariamente marca um cookie especial que a aplicação verificará
// para forçar a navegação como anônimo na loja, sem afetar a sessão do admin
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const storeSlug = searchParams.get("slug")
  
  if (!storeSlug) {
    return NextResponse.json(
      { error: "Slug da loja não fornecido" },
      { status: 400 }
    )
  }

  // Criar resposta com redirecionamento para a loja
  const response = NextResponse.json({ success: true, storeSlug })
  
  // Definir cookie na resposta
  response.cookies.set("visit_store_as_guest", "true", {
    httpOnly: false, // Precisa ser acessível pelo JavaScript
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60, // 1 hora
    path: "/",
  })

  return response
} 