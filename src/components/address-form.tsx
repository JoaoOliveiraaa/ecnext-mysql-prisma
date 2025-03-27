"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Trash2, Check } from "lucide-react"
import Cookies from 'js-cookie'

interface Address {
  id: string
  name: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  isDefault: boolean
}

// Inicializa com um array vazio
const initialAddresses: Address[] = []

export default function AddressForm() {
  const params = useParams()
  const { data: session } = useSession()
  const userId = session?.user?.id || 'anonymous'
  const storeSlug = params?.slug as string || 'default'
  const cookieKey = `user-addresses-${storeSlug}-${userId}`
  
  const { toast } = useToast()
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [newAddress, setNewAddress] = useState<Omit<Address, "id">>({
    name: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
    isDefault: false,
  })

  // Carregar endereços do cookie quando o componente monta
  useEffect(() => {
    try {
      console.log('Tentando carregar endereços com slug:', storeSlug, 'e userId:', userId)
      const savedAddresses = Cookies.get(cookieKey)
      if (savedAddresses) {
        console.log('Endereços encontrados:', savedAddresses)
        setAddresses(JSON.parse(savedAddresses))
      } else {
        console.log('Nenhum endereço encontrado para:', cookieKey)
      }
    } catch (error) {
      console.error('Erro ao carregar endereços:', error)
    }
  }, [cookieKey, userId])

  // Salvar endereços no cookie sempre que forem atualizados
  useEffect(() => {
    try {
      console.log('Salvando endereços com slug:', storeSlug, 'e userId:', userId)
      if (addresses.length > 0) {
        console.log('Dados a serem salvos:', JSON.stringify(addresses))
        Cookies.set(cookieKey, JSON.stringify(addresses), { expires: 365 })
      } else {
        console.log('Sem endereços para salvar')
      }
    } catch (error) {
      console.error('Erro ao salvar endereços:', error)
    }
  }, [addresses, cookieKey, userId])

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setNewAddress((prev) => ({
      ...prev,
      isDefault: checked,
    }))
  }

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulando uma adição bem-sucedida
      await new Promise((resolve) => setTimeout(resolve, 300))

      const newId = Math.random().toString(36).substring(2, 9)

      // Se o novo endereço for padrão, remova o padrão dos outros
      let updatedAddresses = addresses.map((addr) => ({
        ...addr,
        isDefault: newAddress.isDefault ? false : addr.isDefault,
      }))

      // Adicione o novo endereço
      updatedAddresses = [
        ...updatedAddresses,
        {
          ...newAddress,
          id: newId,
        },
      ]

      setAddresses(updatedAddresses)
      setIsAddingNew(false)
      setNewAddress({
        name: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        zipCode: "",
        isDefault: false,
      })

      toast({
        title: "Endereço adicionado",
        description: "O endereço foi adicionado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o endereço.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveAddress = async (id: string) => {
    setIsLoading(true)

    try {
      // Simulando uma remoção bem-sucedida
      await new Promise((resolve) => setTimeout(resolve, 300))

      const updatedAddresses = addresses.filter((addr) => addr.id !== id)
      setAddresses(updatedAddresses)

      toast({
        title: "Endereço removido",
        description: "O endereço foi removido com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao remover o endereço.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetDefault = async (id: string) => {
    setIsLoading(true)

    try {
      // Simulando uma atualização bem-sucedida
      await new Promise((resolve) => setTimeout(resolve, 300))

      const updatedAddresses = addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))

      setAddresses(updatedAddresses)

      toast({
        title: "Endereço padrão atualizado",
        description: "O endereço padrão foi atualizado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o endereço padrão.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {addresses.length > 0 && (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address.id} className="rounded-md border p-4 relative">
              {address.isDefault && (
                <span className="absolute top-2 right-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                  Padrão
                </span>
              )}
              <div className="flex flex-col">
                <span className="font-medium">{address.name}</span>
                <span className="text-sm text-muted-foreground">
                  {address.street}, {address.number} {address.complement && `- ${address.complement}`}
                </span>
                <span className="text-sm text-muted-foreground">
                  {address.neighborhood}, {address.city} - {address.state}
                </span>
                <span className="text-sm text-muted-foreground">CEP: {address.zipCode}</span>
              </div>
              <div className="mt-4 flex gap-2">
                {!address.isDefault && (
                  <Button variant="outline" size="sm" onClick={() => handleSetDefault(address.id)} disabled={isLoading}>
                    <Check className="mr-2 h-4 w-4" />
                    Definir como padrão
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveAddress(address.id)}
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
        <form onSubmit={handleAddAddress} className="space-y-4 border rounded-md p-4">
          <h3 className="text-lg font-medium">Novo Endereço</h3>

          <div className="space-y-2">
            <Label htmlFor="name">Nome do endereço</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ex: Casa, Trabalho"
              value={newAddress.name}
              onChange={handleAddressChange}
              disabled={isLoading}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipCode">CEP</Label>
              <Input
                id="zipCode"
                name="zipCode"
                placeholder="00000-000"
                value={newAddress.zipCode}
                onChange={handleAddressChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                name="state"
                placeholder="UF"
                value={newAddress.state}
                onChange={handleAddressChange}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">Cidade</Label>
            <Input
              id="city"
              name="city"
              value={newAddress.city}
              onChange={handleAddressChange}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="neighborhood">Bairro</Label>
            <Input
              id="neighborhood"
              name="neighborhood"
              value={newAddress.neighborhood}
              onChange={handleAddressChange}
              disabled={isLoading}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="street">Rua</Label>
              <Input
                id="street"
                name="street"
                value={newAddress.street}
                onChange={handleAddressChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="number">Número</Label>
              <Input
                id="number"
                name="number"
                value={newAddress.number}
                onChange={handleAddressChange}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="complement">Complemento</Label>
            <Input
              id="complement"
              name="complement"
              placeholder="Apto, Bloco, etc."
              value={newAddress.complement}
              onChange={handleAddressChange}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="isDefault"
              checked={newAddress.isDefault}
              onCheckedChange={handleCheckboxChange}
              disabled={isLoading}
            />
            <Label htmlFor="isDefault" className="text-sm font-normal">
              Definir como endereço padrão
            </Label>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar endereço"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsAddingNew(false)} disabled={isLoading}>
              Cancelar
            </Button>
          </div>
        </form>
      ) : (
        <Button variant="outline" onClick={() => setIsAddingNew(true)} className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar novo endereço
        </Button>
      )}
    </div>
  )
}

