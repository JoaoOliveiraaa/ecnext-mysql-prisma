"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { Menu, Bell, User, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import AdminSidebarMobile from "@/components/admin/admin-sidebar-mobile"

export default function AdminHeader() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Extrair o título da página atual do pathname
  const getPageTitle = () => {
    const path = pathname.split("/").filter(Boolean)

    if (path.length === 1 && path[0] === "admin") {
      return "Dashboard"
    }

    if (path.length > 1) {
      const section = path[1]
      const action = path.length > 2 ? path[2] : null

      if (action === "new") {
        return `Adicionar ${section.charAt(0).toUpperCase() + section.slice(1, -1)}`
      }

      if (action === "edit") {
        return `Editar ${section.charAt(0).toUpperCase() + section.slice(1, -1)}`
      }

      return section.charAt(0).toUpperCase() + section.slice(1)
    }

    return "Admin"
  }

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/admin/login" })
  }

  return (
    <header className="bg-white border-b">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <AdminSidebarMobile closeMenu={() => setIsMobileMenuOpen(false)} />
              </SheetContent>
            </Sheet>

            <h1 className="text-xl font-semibold ml-2 md:ml-0">{getPageTitle()}</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/" target="_blank">
                <span className="sr-only">Visitar loja</span>
                <span className="hidden sm:inline-block text-sm mr-2">Visitar loja</span>
              </Link>
            </Button>

            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notificações</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Perfil</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Administrador</p>
                    <p className="text-xs leading-none text-muted-foreground">{session?.user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}

