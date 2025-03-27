"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

export default function Footer() {
  const pathname = usePathname()
  const [storeName, setStoreName] = useState("MINISHOP")
  const [storeData, setStoreData] = useState({
    email: "contato@exemplo.com",
    phone: "(00) 00000-0000",
    address: "Rua Exemplo, 123 - Cidade - Estado",
    facebook: "",
    instagram: "",
    twitter: "",
    footerText: ""
  })
  
  // Verificar se estamos em uma página de loja específica
  const isStoreSpecificPage = pathname.includes("/store/") && pathname.split("/").length > 2
  const storeSlug = isStoreSpecificPage ? pathname.split("/")[2] : null

  // Obter o nome da loja e as configurações se estiver em uma página de loja específica
  useEffect(() => {
    if (isStoreSpecificPage && storeSlug) {
      // Buscar informações básicas da loja
      fetch(`/api/stores/${storeSlug}`)
        .then(res => res.json())
        .then(data => {
          if (data.name) {
            setStoreName(data.name)
          }
          
          // Buscar configurações adicionais da loja
          return fetch(`/api/stores/${storeSlug}/settings`)
            .then(res => res.json())
            .catch(error => {
              console.error("Erro ao buscar configurações da loja:", error)
              return {}
            })
        })
        .then(settings => {
          if (settings) {
            setStoreData({
              email: settings.contactEmail || "contato@exemplo.com",
              phone: settings.contactPhone || "(00) 00000-0000",
              address: settings.physicalAddress || settings.address || "Rua Exemplo, 123 - Cidade - Estado",
              facebook: settings.socialFacebook || settings.facebookUrl || "",
              instagram: settings.socialInstagram || settings.instagramUrl || "",
              twitter: settings.socialTwitter || settings.twitterUrl || "",
              footerText: settings.footerText || ""
            })
          }
        })
        .catch(error => {
          console.error("Erro ao buscar informações da loja:", error)
        })
    } else {
      setStoreName("MINISHOP")
    }
  }, [isStoreSpecificPage, storeSlug])
  
  return (
    <footer className="w-full border-t py-6">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="col-span-1">
            <div className="flex flex-col gap-1">
              <Link className="font-bold" href={isStoreSpecificPage ? `/store/${storeSlug}` : "/"}>
                {storeName}
              </Link>
              <p className="text-md text-muted-foreground">
                Sua loja online para produtos de qualidade.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <h3 className="text-md font-medium uppercase">Navegação</h3>
            <Link className="text-sm text-muted-foreground hover:text-foreground" href={isStoreSpecificPage ? `/store/${storeSlug}` : "/"}>
              Início
            </Link>
            <Link className="text-sm text-muted-foreground hover:text-foreground" href={isStoreSpecificPage ? `/store/${storeSlug}/shop` : "/shop"}>
              Produtos
            </Link>
            <Link className="text-sm text-muted-foreground hover:text-foreground" href={isStoreSpecificPage ? `/store/${storeSlug}/about` : "/about"}>
              Sobre
            </Link>
            <Link className="text-sm text-muted-foreground hover:text-foreground" href={isStoreSpecificPage ? `/store/${storeSlug}/help` : "/help"}>
              Ajuda
            </Link>
          </div>
          
          <div className="flex flex-col gap-1">
            <h3 className="text-md font-medium uppercase">Contato</h3>
            {storeData.email && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${storeData.email}`} className="text-sm hover:text-foreground">
                  {storeData.email}
                </a>
              </div>
            )}
            {storeData.phone && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <a href={`tel:${storeData.phone.replace(/\D/g, '')}`} className="text-sm hover:text-foreground">
                  {storeData.phone}
                </a>
              </div>
            )}
            {storeData.address && (
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-1" />
                <span className="text-sm">{storeData.address}</span>
              </div>
            )}
            <div className="mt-2 flex gap-3">
              {storeData.facebook && (
                <a href={storeData.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-muted-foreground hover:text-primary">
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {storeData.twitter && (
                <a href={storeData.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-muted-foreground hover:text-primary">
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {storeData.instagram && (
                <a href={storeData.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-primary">
                  <Instagram className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <h3 className="text-md font-medium uppercase">Legal</h3>
            <Link className="text-sm text-muted-foreground hover:text-foreground" href={isStoreSpecificPage ? `/store/${storeSlug}/privacy` : "/privacy"}>
              Política de Privacidade
            </Link>
            <Link className="text-sm text-muted-foreground hover:text-foreground" href={isStoreSpecificPage ? `/store/${storeSlug}/terms` : "/terms"}>
              Termos de Serviço
            </Link>
          </div>
        </div>
        
        <div className="mt-4 border-t pt-4">
          <p className="text-xs text-center text-muted-foreground">
            {storeData.footerText || `© ${new Date().getFullYear()} ${storeName}. Todos os direitos reservados.`}
          </p>
        </div>
      </div>
    </footer>
  )
}

