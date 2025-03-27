import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ThemeSettings from "@/components/admin/settings/theme-settings"
import LayoutSettings from "@/components/admin/settings/layout-settings"
import LogoSettings from "@/components/admin/settings/logo-settings"
import ContactSettings from "@/components/admin/settings/contact-settings"
import SocialSettings from "@/components/admin/settings/social-settings"
import TextSettings from "@/components/admin/settings/text-settings"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Configurações | Admin MINISHOP",
  description: "Configurações da loja",
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  
  // Verificar se o usuário está logado e tem permissão de admin
  if (!session || !session.user || (session.user.role !== "storeAdmin" && session.user.role !== "superadmin")) {
    redirect("/login?callbackUrl=/admin/settings")
  }

  // Obter o ID da loja do usuário (se for admin de loja)
  const storeId = session.user.role === "storeAdmin" ? session.user.storeId : null

  // Buscar as configurações da loja
  const storeSettings = await db.storeSettings.findFirst({
    where: {
      storeId: storeId || undefined,
    },
  })

  // Valores padrão se não existirem configurações
  const defaultSettings = {
    id: "",
    storeId: storeId || "",
    primaryColor: "#0f766e",
    secondaryColor: "#4f46e5",
    accentColor: "#f97316",
    logoUrl: "/placeholder.svg",
    faviconUrl: "/favicon.ico",
    footerText: "© 2023 MINISHOP. Todos os direitos reservados.",
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
    googleMapsUrl: "",
    facebookUrl: "",
    instagramUrl: "",
    twitterUrl: "",
    youtubeUrl: "",
    aboutText: null,
    helpText: null,
    privacyPolicyText: null,
    termsOfServiceText: null,
    enableWhatsappSupport: false,
    enableNewsletterPopup: false,
    enableReviews: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // Mesclar configurações existentes ou usar padrão
  const settings = storeSettings || defaultSettings

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Configurações</h1>
      </div>

      <Tabs defaultValue="theme" className="space-y-4">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 h-auto gap-2">
          <TabsTrigger value="theme">Tema</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="branding">Marca</TabsTrigger>
          <TabsTrigger value="contact">Contato</TabsTrigger>
          <TabsTrigger value="social">Redes Sociais</TabsTrigger>
          <TabsTrigger value="texts">Textos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="theme" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cores do Tema</CardTitle>
              <CardDescription>
                Personalize as cores da sua loja para refletir sua marca.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <ThemeSettings 
                initialSettings={{
                  primaryColor: settings.primaryColor,
                  secondaryColor: settings.secondaryColor,
                  accentColor: settings.accentColor,
                  fontFamily: settings.fontFamily,
                }} 
                storeId={storeId || ""} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="layout" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Layout da Loja</CardTitle>
              <CardDescription>
                Configure quais seções serão exibidas na página inicial da sua loja.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <LayoutSettings 
                initialSettings={{
                  showHeroSection: settings.showHeroSection,
                  showFeaturedProducts: settings.showFeaturedProducts,
                  showNewArrivals: settings.showNewArrivals,
                  showCategoriesSection: settings.showCategoriesSection,
                  heroTitle: settings.heroTitle,
                  heroDescription: settings.heroDescription,
                  layoutType: settings.layoutType,
                }} 
                storeId={storeId || ""} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logo e Favicons</CardTitle>
              <CardDescription>
                Personalize os elementos visuais da sua marca.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <LogoSettings 
                initialSettings={{
                  logoUrl: settings.logoUrl,
                  faviconUrl: settings.faviconUrl,
                  footerText: settings.footerText,
                }} 
                storeId={storeId || ""} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações de Contato</CardTitle>
              <CardDescription>
                Configure as informações de contato da sua loja.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <ContactSettings 
                initialSettings={{
                  contactEmail: settings.contactEmail,
                  contactPhone: settings.contactPhone,
                  whatsappNumber: settings.whatsappNumber,
                  address: settings.address,
                  googleMapsUrl: settings.googleMapsUrl,
                  enableWhatsappSupport: settings.enableWhatsappSupport,
                }} 
                storeId={storeId || ""} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Redes Sociais</CardTitle>
              <CardDescription>
                Adicione os links para suas redes sociais.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <SocialSettings 
                initialSettings={{
                  facebookUrl: settings.facebookUrl,
                  instagramUrl: settings.instagramUrl,
                  twitterUrl: settings.twitterUrl,
                  youtubeUrl: settings.youtubeUrl,
                }} 
                storeId={storeId || ""} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="texts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Textos Institucionais</CardTitle>
              <CardDescription>
                Configure os textos das páginas institucionais da sua loja.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <TextSettings 
                initialSettings={{
                  aboutText: settings.aboutText,
                  helpText: settings.helpText,
                  privacyPolicyText: settings.privacyPolicyText,
                  termsOfServiceText: settings.termsOfServiceText,
                }} 
                storeId={storeId || ""} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 