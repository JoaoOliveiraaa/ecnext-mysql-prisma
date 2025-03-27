"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  ImageIcon, 
  ShoppingCart, 
  Settings, 
  PlusCircle,
  ChevronDown,
  Store,
  Palette
} from "lucide-react"
import { useState } from "react"

interface SidebarItemGroup {
  title: string;
  icon: React.ReactNode;
  items: {
    title: string;
    href: string;
    icon?: React.ReactNode;
  }[];
}

export default function AdminSidebar() {
  const pathname = usePathname()
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "Produtos & Categorias": true,
    "Marketing": true
  })

  const toggleGroup = (groupTitle: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupTitle]: !prev[groupTitle]
    }))
  }

  const sidebarItemGroups: SidebarItemGroup[] = [
    {
      title: "Principal",
      icon: <Store className="h-5 w-5" />,
      items: [
        {
          title: "Dashboard",
          href: "/admin",
          icon: <LayoutDashboard className="h-5 w-5" />,
        },
        {
          title: "Pedidos",
          href: "/admin/orders",
          icon: <ShoppingCart className="h-5 w-5" />,
        },
      ]
    },
    {
      title: "Produtos & Categorias",
      icon: <Package className="h-5 w-5" />,
      items: [
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
          icon: <Tags className="h-5 w-5" />,
        },
        {
          title: "Adicionar Categoria",
          href: "/admin/categories/new",
          icon: <PlusCircle className="h-5 w-5" />,
        },
      ]
    },
    {
      title: "Marketing",
      icon: <ImageIcon className="h-5 w-5" />,
      items: [
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
      ]
    },
    {
      title: "Personalização",
      icon: <Palette className="h-5 w-5" />,
      items: [
        {
          title: "Configurações",
          href: "/admin/settings",
          icon: <Settings className="h-5 w-5" />,
        },
      ]
    }
  ]

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow border-r bg-white pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 mb-5">
          <Link href="/admin" className="flex items-center gap-2">
            <Store className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">MINISHOP</span>
          </Link>
        </div>

        <div className="mt-2 flex-1 flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {sidebarItemGroups.map((group) => (
              <div key={group.title} className="mb-2">
                <button
                  onClick={() => toggleGroup(group.title)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-gray-700 rounded-md hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    {group.icon}
                    <span className="ml-3">{group.title}</span>
                  </div>
                  <ChevronDown 
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      openGroups[group.title] ? "transform rotate-180" : ""
                    )}
                  />
                </button>
                
                {openGroups[group.title] && (
                  <div className="ml-4 mt-1 space-y-1">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href
                      
                      return (
                        <Link
                          key={item.title}
                          href={item.href}
                          className={cn(
                            "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                            isActive 
                              ? "bg-primary/10 text-primary" 
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                          )}
                        >
                          {item.icon}
                          <span className="ml-3 truncate">{item.title}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}

