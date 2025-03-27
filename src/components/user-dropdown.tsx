"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { User, Package, Settings, CreditCard, LogOut, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { usePathname } from "next/navigation"

export default function UserDropdown() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)
  
  // Verificar se estamos em uma página de loja específica
  const isStoreSpecificPage = pathname.includes("/store/") && pathname.split("/").length > 2
  const storeSlug = isStoreSpecificPage ? pathname.split("/")[2] : null

  // Verificar se o usuário é um administrador
  useEffect(() => {
    if (session?.user?.role === "ADMIN") {
      setIsAdmin(true)
    } else {
      setIsAdmin(false)
    }
  }, [session])

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    })
    setIsOpen(false)
  }

  if (!session) {
    return (
      <Button variant="ghost" size="icon" asChild>
        <Link href={isStoreSpecificPage ? `/store/${storeSlug}/login` : "/login"}>
          <User className="h-5 w-5" />
          <span className="sr-only">Login</span>
        </Link>
      </Button>
    )
  }

  // Base URLs para as páginas de conta
  const accountBaseUrl = isStoreSpecificPage ? `/store/${storeSlug}/account` : "/account"

  return (
    <>
      {isAdmin && isStoreSpecificPage && (
        <Alert variant="warning" className="fixed top-0 left-0 right-0 z-50 py-1 px-4 rounded-none">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Você está navegando como administrador. Para ter uma experiência como cliente, faça logout e crie uma conta separada de usuário.
          </AlertDescription>
        </Alert>
      )}

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className={`flex items-center gap-1 px-3 ${isAdmin && isStoreSpecificPage ? "text-yellow-600" : ""}`}
          >
            <User className="h-5 w-5" />
            <span className="sr-only md:not-sr-only md:ml-2 md:text-sm">
              {isAdmin && isStoreSpecificPage ? "Admin" : "Conta"}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {isAdmin && isStoreSpecificPage ? `${session.user?.name} (Admin)` : session.user?.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">{session.user?.email}</p>
            </div>
          </DropdownMenuLabel>
          {isAdmin && isStoreSpecificPage && (
            <>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5">
                <p className="text-xs text-yellow-600">
                  Você está navegando como administrador. Para usar a loja como cliente, faça logout e crie uma conta separada.
                </p>
              </div>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href={`${accountBaseUrl}/profile`} className="w-full cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Meu Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`${accountBaseUrl}/orders`} className="w-full cursor-pointer">
                <Package className="mr-2 h-4 w-4" />
                <span>Meus Pedidos</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`${accountBaseUrl}/payment`} className="w-full cursor-pointer">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Métodos de Pagamento</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`${accountBaseUrl}/settings`} className="w-full cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

