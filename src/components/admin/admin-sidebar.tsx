"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Package, Tag, ImageIcon, ShoppingCart, Settings, PlusCircle } from "lucide-react"

interface SidebarItem {
  title: string
  href: string
  icon: React.ReactNode
}

export default function AdminSidebar() {
  const pathname = usePathname()

  const sidebarItems: SidebarItem[] = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Produtos",
      href: "/admin/products",
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: "Adicionar Produto",
      href: "/admin/products/new",
      icon: <PlusCircle className="h-5 w-5" />,
    },
    {
      title: "Categorias",
      href: "/admin/categories",
      icon: <Tag className="h-5 w-5" />,
    },
    {
      title: "Adicionar Categoria",
      href: "/admin/categories/new",
      icon: <PlusCircle className="h-5 w-5" />,
    },
    {
      title: "Banners",
      href: "/admin/banners",
      icon: <ImageIcon className="h-5 w-5" />,
    },
    {
      title: "Adicionar Banner",
      href: "/admin/banners/new",
      icon: <PlusCircle className="h-5 w-5" />,
    },
    {
      title: "Pedidos",
      href: "/admin/orders",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      title: "Configurações",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow border-r bg-white pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 mb-5">
          <Link href="/admin" className="text-xl font-bold">
            MINISHOP ADMIN
          </Link>
        </div>

        <div className="mt-5 flex-1 flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  {item.icon}
                  <span className="ml-3 truncate">{item.title}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}

