import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"

// Rota para obter configurações
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Verificar permissão
    if (!session || !session.user || (session.user.role !== "storeAdmin" && session.user.role !== "superadmin")) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Obter o storeId do usuário (exceto para superadmin)
    const storeId = session.user.role === "storeAdmin" ? session.user.storeId : null
    
    if (session.user.role === "storeAdmin" && !storeId) {
      return NextResponse.json({ error: "Loja não encontrada" }, { status: 400 })
    }

    // Buscar configurações
    const settings = await db.storeSettings.findFirst({
      where: {
        storeId: storeId || undefined,
      },
    })

    return NextResponse.json(settings || {})
  } catch (error) {
    console.error("ERRO_OBTER_CONFIGURAÇÕES", error)
    return NextResponse.json({ error: "Erro interno ao obter configurações" }, { status: 500 })
  }
}

// Rota para criar/atualizar configurações
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Verificar permissão
    if (!session || !session.user || (session.user.role !== "storeAdmin" && session.user.role !== "superadmin")) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Obter o storeId do usuário (exceto para superadmin)
    const storeId = session.user.role === "storeAdmin" ? session.user.storeId : null
    
    if (session.user.role === "storeAdmin" && !storeId) {
      return NextResponse.json({ error: "Loja não encontrada" }, { status: 400 })
    }

    // Obter dados da requisição
    const data = await req.json()
    
    // Verificar se as configurações já existem
    const existingSettings = await db.storeSettings.findFirst({
      where: {
        storeId: storeId || data.storeId,
      },
    })

    let settings

    // Dependendo do tipo de configuração, atualizar apenas os campos específicos
    const updateFields = getUpdateFields(data)

    if (existingSettings) {
      // Atualizar configurações existentes
      settings = await db.storeSettings.update({
        where: {
          id: existingSettings.id,
        },
        data: updateFields,
      })
    } else {
      // Criar novas configurações
      settings = await db.storeSettings.create({
        data: {
          ...updateFields,
          storeId: storeId || data.storeId,
        },
      })
    }

    return NextResponse.json({
      message: "Configurações salvas com sucesso",
      settings,
    })
  } catch (error) {
    console.error("ERRO_SALVAR_CONFIGURAÇÕES", error)
    return NextResponse.json({ error: "Erro interno ao salvar configurações" }, { status: 500 })
  }
}

// Função auxiliar para obter apenas os campos relevantes para cada tipo de configuração
function getUpdateFields(data: any) {
  const { type, ...rest } = data
  
  switch (type) {
    case "theme":
      return {
        primaryColor: rest.primaryColor,
        secondaryColor: rest.secondaryColor,
        accentColor: rest.accentColor,
        fontFamily: rest.fontFamily,
      }
    case "layout":
      return {
        showHeroSection: rest.showHeroSection,
        showFeaturedProducts: rest.showFeaturedProducts,
        showNewArrivals: rest.showNewArrivals,
        showCategoriesSection: rest.showCategoriesSection,
        heroTitle: rest.heroTitle,
        heroDescription: rest.heroDescription,
        layoutType: rest.layoutType,
      }
    case "branding":
      return {
        logoUrl: rest.logoUrl,
        faviconUrl: rest.faviconUrl,
        footerText: rest.footerText,
      }
    case "contact":
      return {
        contactEmail: rest.contactEmail,
        contactPhone: rest.contactPhone,
        whatsappNumber: rest.whatsappNumber,
        address: rest.address,
        googleMapsUrl: rest.googleMapsUrl,
        enableWhatsappSupport: rest.enableWhatsappSupport,
      }
    case "social":
      return {
        facebookUrl: rest.facebookUrl,
        instagramUrl: rest.instagramUrl,
        twitterUrl: rest.twitterUrl,
        youtubeUrl: rest.youtubeUrl,
      }
    case "texts":
      return {
        aboutText: rest.aboutText,
        helpText: rest.helpText,
        privacyPolicyText: rest.privacyPolicyText,
        termsOfServiceText: rest.termsOfServiceText,
      }
    case "features":
      return {
        enableNewsletterPopup: rest.enableNewsletterPopup,
        enableReviews: rest.enableReviews,
      }
    default:
      return rest
  }
} 