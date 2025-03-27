import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params)
    const { slug } = resolvedParams
    
    // Buscar a loja pelo slug
    const store = await db.store.findUnique({
      where: { slug },
    })

    if (!store) {
      return NextResponse.json({ error: "Loja não encontrada" }, { status: 404 })
    }

    // Buscar as configurações da loja
    const settings = await db.storeSettings.findFirst({
      where: {
        storeId: store.id,
      },
    })

    // Se não existirem configurações, retornar valores padrão
    if (!settings) {
      return NextResponse.json({
        primaryColor: "#0f766e",
        secondaryColor: "#4f46e5",
        accentColor: "#f97316",
        logoUrl: "/placeholder.svg",
        faviconUrl: "/favicon.ico",
        footerText: `© ${new Date().getFullYear()} ${store.name}. Todos os direitos reservados.`,
        showHeroSection: true,
        showFeaturedProducts: true,
        showNewArrivals: true,
        showCategoriesSection: true,
        heroTitle: "Bem-vindo à nossa loja",
        heroDescription: "Encontre os melhores produtos com os melhores preços",
        layoutType: "modern",
        fontFamily: "Inter",
        contactEmail: "contato@exemplo.com",
        contactPhone: "(00) 00000-0000",
        whatsappNumber: "",
        address: "Rua Exemplo, 123 - Cidade - Estado",
        physicalAddress: "Rua Exemplo, 123 - Cidade - Estado",
        googleMapsUrl: "",
        facebookUrl: "",
        instagramUrl: "",
        twitterUrl: "",
        youtubeUrl: "",
        socialFacebook: "",
        socialInstagram: "",
        socialTwitter: "",
        socialYoutube: "",
        aboutText: "Somos uma loja comprometida com a qualidade e satisfação dos nossos clientes.",
        helpText: "Entre em contato conosco para obter ajuda com seus pedidos ou dúvidas sobre nossos produtos.",
        privacyPolicyText: "Política de privacidade da loja.",
        termsOfServiceText: "Termos de serviço da loja.",
        enableWhatsappSupport: false,
        enableNewsletterPopup: false,
        enableReviews: true,
      })
    }

    return NextResponse.json({
      ...settings,
      // Garantir valores padrão para campos de texto que podem ser nulos
      aboutText: settings.aboutText || "Somos uma loja comprometida com a qualidade e satisfação dos nossos clientes.",
      helpText: settings.helpText || "Entre em contato conosco para obter ajuda com seus pedidos ou dúvidas sobre nossos produtos.",
      privacyPolicyText: settings.privacyPolicyText || "Política de privacidade da loja.",
      termsOfServiceText: settings.termsOfServiceText || "Termos de serviço da loja.",
      // Campos adicionais compatíveis com o que está sendo usado na aplicação
      physicalAddress: settings.address || "Rua Exemplo, 123 - Cidade - Estado",
      socialFacebook: settings.facebookUrl || "",
      socialInstagram: settings.instagramUrl || "",
      socialTwitter: settings.twitterUrl || "",
      socialYoutube: settings.youtubeUrl || ""
    })
  } catch (error) {
    console.error("Erro ao buscar configurações da loja:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
} 