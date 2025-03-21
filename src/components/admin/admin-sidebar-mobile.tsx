"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  Tag,
  Image,
  Users,
  ShoppingCart,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface SidebarItem {
  title: string
  href: string
  icon: React.ReactNode
  submenu?: { title: string; href: string }[]
}

export default function AdminSidebarMobile({ closeMenu }: { closeMenu: () => void }) {
  const pathname = usePathname()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

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
      submenu: [
        { title: "Todos os Produtos", href: "/admin/products" },
        { title: "Adicionar Produto", href: "/admin/products/new" },
      ],
    },
    {
      title: "Categorias",
      href: "/admin/categories",
      icon: <Tag className="h-5 w-5" />,
      submenu: [
        { title: "Todas as Categorias", href: "/admin/categories" },
        { title: "Adicionar Categoria", href: "/admin/categories/new" },
      ],
    },
    {
      title: "Banners",
      href: "/admin/banners",
      icon: <Image className="h-5 w-5" />,
      submenu: [
        { title: "Todos os Banners", href: "/admin/banners" },
        { title: "Adicionar Banner", href: "/admin/banners/new" },
      ],
    },
    {
      title: "Usuários",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
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

  const toggleSubmenu = (title: string) => {
    if (openSubmenu === title) {
      setOpenSubmenu(null)
    } else {
      setOpenSubmenu(title)
    }
  }

  const handleNavigation = () => {
    closeMenu()
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-center h-16 border-b px-4">
        <Link href="/admin" className="text-xl font-bold" onClick={handleNavigation}>
          MINISHOP ADMIN
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            const isSubmenuOpen = openSubmenu === item.title

            return (
              <div key={item.title}>
                {item.submenu ? (
                  <div>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-between px-3 py-2 text-sm font-medium rounded-md",
                        isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      )}
                      onClick={() => toggleSubmenu(item.title)}
                    >
                      <div className="flex items-center">
                        {item.icon}
                        <span className="ml-3">{item.title}</span>
                      </div>
                      {isSubmenuOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>

                    {isSubmenuOpen && (
                      <div className="mt-1 pl-4 space-y-1">
                        {item.submenu.map((subitem) => {
                          const isSubActive = pathname === subitem.href

                          return (
                            <Link
                              key={subitem.title}
                              href={subitem.href}
                              className={cn(
                                "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                                isSubActive
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                              )}
                              onClick={handleNavigation}
                            >
                              <span className="truncate">{subitem.title}</span>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                      isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    )}
                    onClick={handleNavigation}
                  >
                    {item.icon}
                    <span className="ml-3 truncate">{item.title}</span>
                  </Link>
                )}
              </div>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

