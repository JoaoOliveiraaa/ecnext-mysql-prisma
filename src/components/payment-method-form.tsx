"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Trash2, Check, CreditCard } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PaymentMethod {
  id: string
  cardNumber: string
  cardHolder: string
  expiryMonth: string
  expiryYear: string
  isDefault: boolean
  cardType: string
}

// Cartão de exemplo para demonstração
const samplePaymentMethods: PaymentMethod[] = [
  {
    id: "1",
    cardNumber: "•••• •••• •••• 4242",
    cardHolder: "João Silva",
    expiryMonth: "12",
    expiryYear: "2025",
    isDefault: true,
    cardType: "visa",
  },
]

export default function PaymentMethodForm() {
  const { toast } = useToast()
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(samplePaymentMethods)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [newPaymentMethod, setNewPaymentMethod] = useState<Omit<PaymentMethod, "id" | "cardType">>({
    cardNumber: "",
    cardHolder: "",
    expiryMonth: "",
    expiryYear: "",
    isDefault: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === "cardNumber") {
      // Formatar número do cartão: 0000 0000 0000 0000
      const formatted = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19)

      setNewPaymentMethod((prev) => ({
        ...prev,
        [name]: formatted,
      }))
    } else {
      setNewPaymentMethod((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewPaymentMethod((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setNewPaymentMethod((prev) => ({
      ...prev,
      isDefault: checked,
    }))
  }

  const handleAddPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Aqui você implementaria a chamada à API para adicionar o método de pagamento
      // const response = await fetch("/api/account/payment-methods", {...})

      // Simulando uma adição bem-sucedida
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newId = Math.random().toString(36).substring(2, 9)

      // Se o novo método for padrão, remova o padrão dos outros
      let updatedPaymentMethods = paymentMethods.map((method) => ({
        ...method,
        isDefault: newPaymentMethod.isDefault ? false : method.isDefault,
      }))

      // Adicione o novo método de pagamento
      updatedPaymentMethods = [
        ...updatedPaymentMethods,
        {
          ...newPaymentMethod,
          id: newId,
          cardNumber: `•••• •••• •••• ${newPaymentMethod.cardNumber.slice(-4)}`,
          cardType: detectCardType(newPaymentMethod.cardNumber),
        },
      ]

      setPaymentMethods(updatedPaymentMethods)
      setIsAddingNew(false)
      setNewPaymentMethod({
        cardNumber: "",
        cardHolder: "",
        expiryMonth: "",
        expiryYear: "",
        isDefault: false,
      })

      toast({
        title: "Cartão adicionado",
        description: "O cartão foi adicionado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o cartão.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemovePaymentMethod = async (id: string) => {
    setIsLoading(true)

    try {
      // Aqui você implementaria a chamada à API para remover o método de pagamento
      // const response = await fetch(`/api/account/payment-methods/${id}`, { method: 'DELETE' })

      // Simulando uma remoção bem-sucedida
      await new Promise((resolve) => setTimeout(resolve, 500))

      const updatedPaymentMethods = paymentMethods.filter((method) => method.id !== id)
      setPaymentMethods(updatedPaymentMethods)

      toast({
        title: "Cartão removido",
        description: "O cartão foi removido com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao remover o cartão.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetDefault = async (id: string) => {
    setIsLoading(true)

    try {
      // Aqui você implementaria a chamada à API para definir o método de pagamento padrão
      // const response = await fetch(`/api/account/payment-methods/${id}/default`, { method: 'PUT' })

      // Simulando uma atualização bem-sucedida
      await new Promise((resolve) => setTimeout(resolve, 500))

      const updatedPaymentMethods = paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))

      setPaymentMethods(updatedPaymentMethods)

      toast({
        title: "Cartão padrão atualizado",
        description: "O cartão padrão foi atualizado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o cartão padrão.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const detectCardType = (cardNumber: string): string => {
    const cleanNumber = cardNumber.replace(/\s+/g, "")

    if (/^4/.test(cleanNumber)) return "visa"
    if (/^5[1-5]/.test(cleanNumber)) return "mastercard"
    if (/^3[47]/.test(cleanNumber)) return "amex"

    return "generic"
  }

  const getCardIcon = (cardType: string) => {
    return <CreditCard className="h-5 w-5" />
  }

  // Gerar anos para o select
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => (currentYear + i).toString())

  return (
    <div className="space-y-6">
      {paymentMethods.length > 0 && (
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="rounded-md border p-4 relative">
              {method.isDefault && (
                <span className="absolute top-2 right-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                  Padrão
                </span>
              )}
              <div className="flex items-center gap-3">
                {getCardIcon(method.cardType)}
                <div className="flex flex-col">
                  <span className="font-medium">{method.cardNumber}</span>
                  <span className="text-sm text-muted-foreground">
                    {method.cardHolder} • Expira em {method.expiryMonth}/{method.expiryYear}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                {!method.isDefault && (
                  <Button variant="outline" size="sm" onClick={() => handleSetDefault(method.id)} disabled={isLoading}>
                    <Check className="mr-2 h-4 w-4" />
                    Definir como padrão
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemovePaymentMethod(method.id)}
                  disabled={isLoading}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remover
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isAddingNew ? (
        <form onSubmit={handleAddPaymentMethod} className="space-y-4 border rounded-md p-4">
          <h3 className="text-lg font-medium">Novo Cartão</h3>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">Número do Cartão</Label>
            <Input
              id="cardNumber"
              name="cardNumber"
              placeholder="0000 0000 0000 0000"
              value={newPaymentMethod.cardNumber}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardHolder">Nome no Cartão</Label>
            <Input
              id="cardHolder"
              name="cardHolder"
              placeholder="Como aparece no cartão"
              value={newPaymentMethod.cardHolder}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryMonth">Mês</Label>
              <Select
                value={newPaymentMethod.expiryMonth}
                onValueChange={(value) => handleSelectChange("expiryMonth", value)}
                disabled={isLoading}
              >
                <SelectTrigger id="expiryMonth">
                  <SelectValue placeholder="Mês" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = (i + 1).toString().padStart(2, "0")
                    return (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryYear">Ano</Label>
              <Select
                value={newPaymentMethod.expiryYear}
                onValueChange={(value) => handleSelectChange("expiryYear", value)}
                disabled={isLoading}
              >
                <SelectTrigger id="expiryYear">
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="isDefault"
              checked={newPaymentMethod.isDefault}
              onCheckedChange={handleCheckboxChange}
              disabled={isLoading}
            />
            <Label htmlFor="isDefault" className="text-sm font-normal">
              Definir como cartão padrão
            </Label>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar cartão"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsAddingNew(false)} disabled={isLoading}>
              Cancelar
            </Button>
          </div>
        </form>
      ) : (
        <Button variant="outline" onClick={() => setIsAddingNew(true)} className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar novo cartão
        </Button>
      )}
    </div>
  )
}

