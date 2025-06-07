"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea" // Usaremos Textarea para a descrição
import type { ItemPlano, ItemPlanoCreate } from "@/lib/models"

// Apenas os campos que o usuário pode editar
type ItemFormData = Omit<ItemPlanoCreate, "plano_mestre_id">

interface ItemPlanoFormProps {
  itemInicial?: ItemPlano | null
  onSubmit: (data: ItemFormData) => Promise<void>
  isLoading: boolean
}

export function ItemPlanoForm({ itemInicial, onSubmit, isLoading }: ItemPlanoFormProps) {
  const [horario, setHorario] = useState("")
  const [nomeRefeicao, setNomeRefeicao] = useState("")
  const [descricao, setDescricao] = useState("")

  const isEditing = !!itemInicial

  useEffect(() => {
    if (itemInicial) {
      setHorario(itemInicial.horario)
      setNomeRefeicao(itemInicial.nome_refeicao)
      setDescricao(itemInicial.descricao)
    } else {
      setHorario("")
      setNomeRefeicao("")
      setDescricao("")
    }
  }, [itemInicial])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const data: ItemFormData = { horario, nome_refeicao: nomeRefeicao, descricao }
    await onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nome_refeicao">Refeição</Label>
          <Input id="nome_refeicao" value={nomeRefeicao} onChange={(e) => setNomeRefeicao(e.target.value)} required disabled={isLoading} placeholder="Ex: Almoço" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="horario">Horário</Label>
          <Input id="horario" value={horario} onChange={(e) => setHorario(e.target.value)} required disabled={isLoading} placeholder="Ex: 12:30" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição do Item</Label>
        <Textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} required disabled={isLoading} placeholder="Ex: 150g de frango grelhado..." />
      </div>
      <Button type="submit" disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700">
        {isLoading ? "Salvando..." : (isEditing ? "Salvar Item" : "Adicionar Item")}
      </Button>
    </form>
  )
}