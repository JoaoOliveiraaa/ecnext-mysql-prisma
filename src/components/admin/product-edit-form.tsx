"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, X } from "lucide-react"
import ImageUpload from "@/components/admin/image-upload"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Category {
  id: string
  name: string
}

interface Variation {
  id?: string
  type: string
  value: string
  price: number
  stock: number
  colorCode?: string
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  discountPercentage: number
  imageUrl: string
  categoryId: string
  stock: number
  isNew: boolean
  isFeatured: boolean
  category?: {
    id: string
    name: string
  }
  variations?: Variation[]
}

interface ProductEditFormProps {
  product: Product
}

export default function ProductEditForm({ product }: ProductEditFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price.toString(),
    discountPercentage: product.discountPercentage.toString(),
    imageUrl: product.imageUrl,
    categoryId: product.categoryId,
    stock: product.stock.toString(),
    isNew: product.isNew,
    isFeatured: product.isFeatured,
  })

  const [variations, setVariations] = useState<Variation[]>(product.variations || [])

  const [newVariation, setNewVariation] = useState<Variation>({
    type: "",
    value: "",
    price: 0,
    stock: 0,
    colorCode: "",
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/categories")
        if (response.ok) {
          const data = await response.json()
          setCategories(data.categories || [])
        } else {
          // Fallback para dados de exemplo se a API falhar
          setCategories([
            { id: "1", name: "Eletrônicos" },
            { id: "2", name: "Roupas" },
            { id: "3", name: "Acessórios" },
          ])
        }
      } catch (error) {
        console.error("Erro ao carregar categorias:", error)
        // Fallback para dados de exemplo
        setCategories([
          { id: "1", name: "Eletrônicos" },
          { id: "2", name: "Roupas" },
          { id: "3", name: "Acessórios" },
        ])
      }
    }

    fetchCategories()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // Gerar slug automaticamente a partir do nome
    if (name === "name") {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")

      setFormData((prev) => ({
        ...prev,
        name: value,
        slug,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: url,
    }))
  }

  const handleVariationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setNewVariation((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }))
  }

  // Modificar a função addVariation para tratar cores corretamente
  const addVariation = () => {
    if (!newVariation.type || !newVariation.value) {
      toast({
        title: "Campos obrigatórios",
        description: "Tipo e valor são obrigatórios para adicionar uma variação.",
        variant: "destructive",
      })
      return
    }

    // Para variações de cor, adicionar o código hexadecimal ao valor
    const variationToAdd = { ...newVariation }

    if (variationToAdd.type === "cor" && variationToAdd.colorCode) {
      // Formatar o valor como "Nome da cor #HEXCODE"
      variationToAdd.value = `${variationToAdd.value} (${variationToAdd.colorCode})`

      // Para cores, definir o preço como 0
      variationToAdd.price = 0
    }

    setVariations((prev) => [...prev, variationToAdd])
    setNewVariation({
      type: "",
      value: "",
      price: 0,
      stock: 0,
      colorCode: "",
    })
  }

  const removeVariation = (index: number) => {
    setVariations((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Converter valores numéricos
      const productData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        discountPercentage: Number.parseFloat(formData.discountPercentage),
        stock: Number.parseInt(formData.stock, 10),
        variations,
      }

      // Enviar para a API
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erro ao atualizar produto")
      }

      toast({
        title: "Produto atualizado",
        description: "O produto foi atualizado com sucesso.",
      })

      router.push("/admin/products")
      router.refresh()
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao atualizar o produto.",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic">
        <TabsList>
          <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
          <TabsTrigger value="variations">Variações</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Produto</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
              <p className="text-xs text-muted-foreground">Identificador único para URLs (gerado automaticamente)</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={isLoading}
              required
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountPercentage">Desconto (%)</Label>
              <Input
                id="discountPercentage"
                name="discountPercentage"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.discountPercentage}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Estoque</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <ImageUpload onChange={handleImageChange} value={formData.imageUrl} label="Imagem do Produto" />

          <div className="space-y-2">
            <Label htmlFor="categoryId">Categoria</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => handleSelectChange("categoryId", value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="isNew"
                checked={formData.isNew}
                onCheckedChange={(checked) => handleSwitchChange("isNew", checked)}
                disabled={isLoading}
              />
              <Label htmlFor="isNew">Marcar como novo</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) => handleSwitchChange("isFeatured", checked)}
                disabled={isLoading}
              />
              <Label htmlFor="isFeatured">Destacar na página inicial</Label>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="variations" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Variações do Produto</CardTitle>
              <CardDescription>Adicione variações como cor, tamanho, etc. para este produto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select
                    value={newVariation.type}
                    onValueChange={(value) => setNewVariation((prev) => ({ ...prev, type: value }))}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cor">Cor</SelectItem>
                      <SelectItem value="tamanho">Tamanho</SelectItem>
                      <SelectItem value="material">Material</SelectItem>
                      <SelectItem value="estilo">Estilo</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value">Valor</Label>
                  {newVariation.type === "cor" ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <Input
                          id="value"
                          name="value"
                          value={newVariation.value}
                          onChange={handleVariationChange}
                          disabled={isLoading}
                          placeholder="Nome da cor (ex: Vermelho)"
                          className="flex-1"
                        />
                        <div className="relative w-12">
                          <Input
                            id="colorCode"
                            name="colorCode"
                            type="color"
                            value={newVariation.colorCode || "#000000"}
                            onChange={(e) => {
                              const colorCode = e.target.value
                              setNewVariation((prev) => ({
                                ...prev,
                                colorCode,
                              }))
                            }}
                            className="w-full h-10 p-1 cursor-pointer"
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">Código: {newVariation.colorCode || "#000000"}</p>
                    </div>
                  ) : (
                    <Input
                      id="value"
                      name="value"
                      value={newVariation.value}
                      onChange={handleVariationChange}
                      disabled={isLoading}
                      placeholder="Ex: P, Algodão, etc."
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="variationPrice">Preço (R$)</Label>
                  <Input
                    id="variationPrice"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newVariation.price}
                    onChange={handleVariationChange}
                    disabled={isLoading || newVariation.type === "cor"}
                    placeholder="Preço específico"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="variationStock">Estoque</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="variationStock"
                      name="stock"
                      type="number"
                      min="0"
                      value={newVariation.stock}
                      onChange={handleVariationChange}
                      disabled={isLoading}
                      placeholder="Quantidade"
                    />
                    <Button type="button" onClick={addVariation} disabled={isLoading} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {variations.length > 0 ? (
                <div className="border rounded-md">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left">Tipo</th>
                        <th className="px-4 py-2 text-left">Valor</th>
                        <th className="px-4 py-2 text-left">Preço</th>
                        <th className="px-4 py-2 text-left">Estoque</th>
                        <th className="px-4 py-2 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variations.map((variation, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-2 capitalize">{variation.type}</td>
                          <td className="px-4 py-2">{variation.value}</td>
                          <td className="px-4 py-2">R$ {variation.price.toFixed(2)}</td>
                          <td className="px-4 py-2">{variation.stock}</td>
                          <td className="px-4 py-2 text-right">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeVariation(index)}
                              disabled={isLoading}
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Remover</span>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">Nenhuma variação adicionada</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  )
}

