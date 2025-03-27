"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react"

interface StoreFooterProps {
  footerText: string
  storeSlug: string
  contactInfo: {
    email: string
    phone: string
    address: string
  }
  socialLinks: {
    facebook: string
    instagram: string
    twitter: string
    youtube: string
  }
}

export function StoreFooter({ 
  footerText, 
  storeSlug, 
  contactInfo, 
  socialLinks 
}: StoreFooterProps) {
  return (
    <footer className="bg-background border-t">
      <div className="container px-4 py-10 mx-auto">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 md:grid-cols-2">
          <div>
            <h2 className="mb-6 text-sm font-semibold text-foreground uppercase">Navegação</h2>
            <ul className="text-muted-foreground">
              <li className="mb-4">
                <Link href={`/store/${storeSlug}`} className="hover:underline">
                  Início
                </Link>
              </li>
              <li className="mb-4">
                <Link href={`/store/${storeSlug}/products`} className="hover:underline">
                  Produtos
                </Link>
              </li>
              <li className="mb-4">
                <Link href={`/store/${storeSlug}/about`} className="hover:underline">
                  Sobre
                </Link>
              </li>
              <li className="mb-4">
                <Link href={`/store/${storeSlug}/help`} className="hover:underline">
                  Ajuda
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h2 className="mb-6 text-sm font-semibold text-foreground uppercase">Legal</h2>
            <ul className="text-muted-foreground">
              <li className="mb-4">
                <Link href={`/store/${storeSlug}/privacy`} className="hover:underline">
                  Política de Privacidade
                </Link>
              </li>
              <li className="mb-4">
                <Link href={`/store/${storeSlug}/terms`} className="hover:underline">
                  Termos de Serviço
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h2 className="mb-6 text-sm font-semibold text-foreground uppercase">Contato</h2>
            <ul className="text-muted-foreground">
              {contactInfo.email && (
                <li className="mb-4 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${contactInfo.email}`} className="hover:underline">
                    {contactInfo.email}
                  </a>
                </li>
              )}
              {contactInfo.phone && (
                <li className="mb-4 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${contactInfo.phone.replace(/\D/g, '')}`} className="hover:underline">
                    {contactInfo.phone}
                  </a>
                </li>
              )}
              {contactInfo.address && (
                <li className="mb-4 flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-1" />
                  <span>{contactInfo.address}</span>
                </li>
              )}
            </ul>
          </div>
          
          <div>
            <h2 className="mb-6 text-sm font-semibold text-foreground uppercase">Redes Sociais</h2>
            <div className="flex mt-4 space-x-4">
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </a>
              )}
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </a>
              )}
              {socialLinks.youtube && (
                <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                  <Youtube className="h-5 w-5" />
                  <span className="sr-only">YouTube</span>
                </a>
              )}
            </div>
          </div>
        </div>
        
        <div className="pt-8 mt-8 border-t border-gray-200 text-center text-muted-foreground text-sm">
          <p>{footerText}</p>
        </div>
      </div>
    </footer>
  )
} 