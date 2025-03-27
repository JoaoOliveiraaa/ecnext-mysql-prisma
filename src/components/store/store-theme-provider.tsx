"use client"

import { useEffect } from "react"
import type { ReactNode } from "react"

interface StoreThemeProviderProps {
  children: ReactNode
  settings: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    fontFamily: string
  }
}

export default function StoreThemeProvider({ children, settings }: StoreThemeProviderProps) {
  useEffect(() => {
    // Aplicar cores CSS para serem usadas em todo o site
    document.documentElement.style.setProperty("--primary-color", settings.primaryColor)
    document.documentElement.style.setProperty("--secondary-color", settings.secondaryColor)
    document.documentElement.style.setProperty("--accent-color", settings.accentColor)
    
    // Aplicar a família de fonte
    document.documentElement.style.setProperty("--font-family", settings.fontFamily)
    
    // Carregar a fonte do Google Fonts se necessário
    if (settings.fontFamily !== "Inter" && !document.getElementById("custom-font")) {
      const fontLink = document.createElement("link")
      fontLink.id = "custom-font"
      fontLink.rel = "stylesheet"
      fontLink.href = `https://fonts.googleapis.com/css2?family=${settings.fontFamily.replace(' ', '+')}&display=swap`
      document.head.appendChild(fontLink)
    }

    // Limpar ao desmontar
    return () => {
      const fontLink = document.getElementById("custom-font")
      if (fontLink) {
        document.head.removeChild(fontLink)
      }
    }
  }, [settings])

  return <>{children}</>
} 