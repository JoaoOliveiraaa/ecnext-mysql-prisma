"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/cart-provider"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"

export default function CheckoutPage({
  params,
}: {
  params: { slug: string }
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [storeExists, setStoreExists] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [storeSlug, setStoreSlug] = useState("");
  
  // Verificar status do usuário e da loja no lado do cliente
  useEffect(() => {
    const checkUserAndStore = async () => {
      try {
        // Obter o slug da loja
        const resolvedParams = await Promise.resolve(params);
        const slug = resolvedParams.slug;
        setStoreSlug(slug);
        
        // Verificar se o usuário está logado
        const sessionRes = await fetch('/api/auth/session');
        const session = await sessionRes.json();
        
        if (!session || !session.user) {
          router.push(`/store/${slug}/login?redirect=/store/${slug}/checkout`);
          return;
        }
        
        setIsLoggedIn(true);
        
        // Verificar se a loja existe
        const storeRes = await fetch(`/api/stores/${slug}`);
        if (!storeRes.ok) {
          router.push('/404');
          return;
        }
        
        setStoreExists(true);
      } catch (error) {
        console.error("Erro ao verificar usuário ou loja:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUserAndStore();
  }, [params, router]);
  
  if (isLoading) {
    return (
      <div className="container py-20 text-center">
        <p>Carregando...</p>
      </div>
    );
  }
  
  if (!isLoggedIn || !storeExists) {
    return null; // Redirecionamento já foi iniciado
  }
  
  return <CheckoutClient storeSlug={storeSlug} />;
}

// Componente cliente para renderizar o conteúdo do checkout
function CheckoutClient({ storeSlug }: { storeSlug: string }) {
  return (
    <div className="container mx-auto max-w-7xl py-10">
      <div className="flex flex-col items-start gap-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Finalizar compra</h1>
        <p className="text-muted-foreground">
          Preencha os detalhes abaixo para concluir seu pedido
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <CheckoutForm storeSlug={storeSlug} />
        <OrderSummary storeSlug={storeSlug} />
      </div>
    </div>
  )
}

// Formulário para dados de envio e pagamento
function CheckoutForm({ storeSlug }: { storeSlug: string }) {
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("stripe")
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  })

  // Acessar o carrinho
  const { items, totalPrice, clearCart } = useCart()
  
  useEffect(() => {
    // Preencher informações do perfil do usuário logado (se disponível)
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/user/profile')
        // Se a API não existir ou retornar erro, apenas continuar sem preencher os dados
        if (response.ok) {
          const userData = await response.json()
          if (userData) {
            setShippingInfo(prev => ({
              ...prev,
              name: userData.name || prev.name,
              email: userData.email || prev.email,
              // Usar endereço salvo se disponível
              phone: userData.phone || prev.phone,
              address: userData.address?.street || prev.address,
              city: userData.address?.city || prev.city,
              state: userData.address?.state || prev.state,
              zipCode: userData.address?.zipCode || prev.zipCode,
            }))
          }
        } else {
          // Se a API retornar erro 404, tentar obter pelo menos o email da sessão
          const sessionRes = await fetch('/api/auth/session');
          if (sessionRes.ok) {
            const session = await sessionRes.json();
            if (session && session.user) {
              setShippingInfo(prev => ({
                ...prev,
                name: session.user.name || prev.name,
                email: session.user.email || prev.email,
              }));
            }
          }
        }
      } catch (error) {
        console.error('Erro ao buscar perfil:', error)
        // Continuar sem preencher os dados
      }
    }
    
    fetchUserProfile()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setShippingInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value)
  }

  const validateForm = () => {
    const requiredFields = [
      "name", 
      "email", 
      "address", 
      "city", 
      "state", 
      "zipCode"
    ]
    
    for (const field of requiredFields) {
      if (!shippingInfo[field as keyof typeof shippingInfo]) {
        toast.error(`O campo ${field} é obrigatório`)
        return false
      }
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    if (items.length === 0) {
      toast.error("Seu carrinho está vazio")
      return
    }
    
    setLoading(true)
    
    try {
      // Preparar os itens do carrinho para envio
      const cartItems = items.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.discountPercentage > 0
          ? item.product.price - (item.product.price * item.product.discountPercentage) / 100
          : item.product.price,
        quantity: item.quantity,
        imageUrl: item.product.imageUrl,
        variations: item.product.selectedVariations || {},
      }))
      
      // Enviar os dados para a API
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems,
          shippingInfo,
          totalPrice,
          storeSlug,
          paymentMethod,
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Ocorreu um erro ao processar o pagamento")
      }
      
      // Limpar o carrinho após o pedido bem-sucedido
      clearCart()
      
      // Redirecionar com base no método de pagamento
      if (paymentMethod === "stripe" && data.paymentUrl) {
        // Redirecionar para o Stripe
        window.location.href = data.paymentUrl
      } else {
        // Redirecionar para página de confirmação
        window.location.href = `/store/${storeSlug}/order-confirmation/${data.orderId}`
      }
    } catch (error) {
      console.error("Erro ao processar o checkout:", error)
      toast.error("Erro ao processar o pagamento. Por favor, tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Informações de envio</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  name="name"
                  value={shippingInfo.name}
                  onChange={handleChange}
                  placeholder="Digite seu nome completo"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={shippingInfo.email}
                  onChange={handleChange}
                  placeholder="Digite seu email"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                />
              </div>
              
              <div>
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleChange}
                  placeholder="Rua, número, complemento"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleChange}
                    placeholder="Sua cidade"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleChange}
                    placeholder="UF"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="zipCode">CEP</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={shippingInfo.zipCode}
                  onChange={handleChange}
                  placeholder="00000-000"
                  required
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Método de pagamento</h2>
            <RadioGroup 
              value={paymentMethod} 
              onValueChange={handlePaymentMethodChange}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="stripe" id="stripe" />
                <Label htmlFor="stripe">Cartão de crédito</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pix" id="pix" />
                <Label htmlFor="pix">Pix</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={loading}
            >
              {loading ? "Processando..." : "Finalizar compra"}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  )
}

// Componente para exibir o resumo do pedido
function OrderSummary({ storeSlug }: { storeSlug: string }) {
  const { items, totalPrice } = useCart()
  
  if (items.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Seu carrinho está vazio</h2>
        <p className="text-muted-foreground mb-4">
          Adicione itens ao seu carrinho antes de finalizar a compra.
        </p>
        <Button asChild className="w-full">
          <Link href={`/store/${storeSlug}`}>Continuar comprando</Link>
        </Button>
      </Card>
    )
  }
  
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Resumo do pedido</h2>
      
      <div className="space-y-4 mb-6">
        {items.map((item) => {
          const price = item.product.discountPercentage > 0
            ? item.product.price - (item.product.price * item.product.discountPercentage) / 100
            : item.product.price
            
          return (
            <div key={item.product.id} className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-md overflow-hidden bg-muted">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="font-medium">{item.product.name}</h3>
                {item.product.selectedVariations && Object.keys(item.product.selectedVariations).length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {Object.entries(item.product.selectedVariations).map(([key, value]) => (
                      `${key}: ${String(value)}`
                    )).join(", ")}
                  </p>
                )}
                <p className="text-sm">
                  Qtd: {item.quantity} x {new Intl.NumberFormat('pt-BR', { 
                    style: 'currency', 
                    currency: 'BRL' 
                  }).format(price)}
                </p>
              </div>
              <div className="font-medium">
                {new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                }).format(price * item.quantity)}
              </div>
            </div>
          )
        })}
      </div>
      
      <Separator className="my-4" />
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>
            {new Intl.NumberFormat('pt-BR', { 
              style: 'currency', 
              currency: 'BRL' 
            }).format(totalPrice)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Frete</span>
          <span>Grátis</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>
            {new Intl.NumberFormat('pt-BR', { 
              style: 'currency', 
              currency: 'BRL' 
            }).format(totalPrice)}
          </span>
        </div>
      </div>
    </Card>
  )
} 