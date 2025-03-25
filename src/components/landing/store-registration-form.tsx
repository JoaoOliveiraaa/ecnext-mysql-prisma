"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"

const formSchema = z
  .object({
    storeName: z.string().min(3, {
      message: "O nome da loja deve ter pelo menos 3 caracteres.",
    }),
    storeSlug: z.string().min(3, {
      message: "O slug da loja deve ter pelo menos 3 caracteres.",
    }).regex(/^[a-z0-9-]+$/, {
      message: "O slug deve conter apenas letras minúsculas, números e hífens.",
    }),
    adminName: z.string().min(3, {
      message: "Seu nome deve ter pelo menos 3 caracteres.",
    }),
    email: z.string().email({
      message: "Por favor, insira um email válido.",
    }),
    password: z.string().min(8, {
      message: "A senha deve ter pelo menos 8 caracteres.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  })

export default function StoreRegistrationForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      storeName: "",
      storeSlug: "",
      adminName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      // Chamada para a API de registro de loja
      const response = await fetch('/api/stores/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeName: values.storeName,
          storeSlug: values.storeSlug,
          adminName: values.adminName,
          email: values.email,
          password: values.password
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Falha ao criar loja');
      }

      const result = await response.json();

      toast({
        title: "Loja criada com sucesso!",
        description: "Agora você pode fazer login para acessar o painel administrativo.",
      })

      // Redirecionar para a página de login após o registro
      setTimeout(() => {
        router.push("/admin/login")
      }, 1500)
    } catch (error: any) {
      toast({
        title: "Erro ao criar loja",
        description: error.message || "Ocorreu um erro ao criar sua loja. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Informações da Loja</h3>
          
          <FormField
            control={form.control}
            name="storeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Loja</FormLabel>
                <FormControl>
                  <Input placeholder="Minha Loja Online" {...field} />
                </FormControl>
                <FormDescription>Este será o nome público da sua loja.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="storeSlug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug da Loja</FormLabel>
                <FormControl>
                  <Input placeholder="minha-loja" {...field} />
                </FormControl>
                <FormDescription>Será usado na URL da sua loja: minishop.com/loja/{'{slug}'}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Informações do Administrador</h3>
          
          <FormField
            control={form.control}
            name="adminName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seu Nome</FormLabel>
                <FormControl>
                  <Input placeholder="João Silva" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="seu@email.com" {...field} />
                </FormControl>
                <FormDescription>Você usará este email para fazer login.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormDescription>Use pelo menos 8 caracteres com letras e números.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando sua loja...
            </>
          ) : (
            "Criar Minha Loja"
          )}
        </Button>
      </form>
    </Form>
  )
}

