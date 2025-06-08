"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X } from "lucide-react"
import type {  Receita } from "@/lib/models"

type ReceitaFormData = Omit<Receita, "id">

interface ReceitaFormProps {
  receitaInicial?: Receita | null
  onFormSubmit: (data: Partial<ReceitaFormData>) => Promise<void>
  isLoading: boolean
}

export function ReceitaForm({ receitaInicial, onFormSubmit, isLoading }: ReceitaFormProps) {
  //  controlar  form
  const [nome, setNome] = useState("")
  const [categoria, setCategoria] = useState("")
  const [tempoPreparo, setTempoPreparo] = useState(0)
  const [ingredientes, setIngredientes] = useState<string[]>([""])
  const [modoPreparo, setModoPreparo] = useState<string[]>([""])
  const [nutricionistaId, setNutricionistaId] = useState("")
  const [pacienteId, setPacienteId] = useState("")

  const isEditing = !!receitaInicial

  //  preenche o form quando  receita vai para edição
  useEffect(() => {
    if (receitaInicial) {
      setNome(receitaInicial.nome)
      setCategoria(receitaInicial.categoria)
      setTempoPreparo(receitaInicial.tempoPreparo)
      setIngredientes(receitaInicial.ingredientes || [""])
      setModoPreparo(receitaInicial.modoPreparo || [""])
      setNutricionistaId(receitaInicial.nutricionistaId || "")
      setPacienteId(receitaInicial.pacienteId || "")
    }
  }, [receitaInicial])

  const handleIngredienteChange = (index: number, value: string) => {
    const newIngredientes = [...ingredientes]
    newIngredientes[index] = value
    setIngredientes(newIngredientes)
  }

  const handleModoPreparoChange = (index: number, value: string) => {
    const newModoPreparo = [...modoPreparo]
    newModoPreparo[index] = value
    setModoPreparo(newModoPreparo)
  }

  const adicionarIngrediente = () => {
    setIngredientes([...ingredientes, ""])
  }

  const adicionarPassoPreparo = () => {
    setModoPreparo([...modoPreparo, ""])
  }

  const removerIngrediente = (index: number) => {
    const newIngredientes = [...ingredientes]
    newIngredientes.splice(index, 1)
    setIngredientes(newIngredientes)
  }

  const removerPassoPreparo = (index: number) => {
    const newModoPreparo = [...modoPreparo]
    newModoPreparo.splice(index, 1)
    setModoPreparo(newModoPreparo)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    // Filtra ingredientes e passos vazios
    const ingredientesFiltrados = ingredientes.filter((i) => i.trim() !== "")
    const modoPreparoFiltrado = modoPreparo.filter((p) => p.trim() !== "")

    const data: Partial<ReceitaFormData> = {
      nome,
      categoria,
      tempoPreparo,
      ingredientes: ingredientesFiltrados,
      modoPreparo: modoPreparoFiltrado,
      nutricionistaId,
      pacienteId,
    }

    await onFormSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome da Receita</Label>
          <Input
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Salada de Quinoa"
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="categoria">Categoria</Label>
          <Input
            id="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            placeholder="Ex: Almoço"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tempoPreparo">Tempo de Preparo (minutos)</Label>
          <Input
            id="tempoPreparo"
            type="number"
            min="1"
            value={tempoPreparo}
            onChange={(e) => setTempoPreparo(Number.parseInt(e.target.value) || 0)}
            placeholder="30"
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nutricionistaId">ID do Nutricionista</Label>
          <Input
            id="nutricionistaId"
            value={nutricionistaId}
            onChange={(e) => setNutricionistaId(e.target.value)}
            placeholder="Cole o ID do nutricionista"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="pacienteId">ID do Paciente</Label>
        <Input
          id="pacienteId"
          value={pacienteId}
          onChange={(e) => setPacienteId(e.target.value)}
          placeholder="Cole o ID do paciente"
          disabled={isLoading}
        />
      </div>

      {/* Ingredientes */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Ingredientes</Label>
          <Button type="button" variant="outline" size="sm" onClick={adicionarIngrediente} disabled={isLoading}>
            <Plus className="h-4 w-4 mr-2" /> Adicionar
          </Button>
        </div>
        <div className="space-y-2">
          {ingredientes.map((ingrediente, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={ingrediente}
                onChange={(e) => handleIngredienteChange(index, e.target.value)}
                placeholder={`Ingrediente ${index + 1}`}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removerIngrediente(index)}
                disabled={ingredientes.length === 1 || isLoading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Modo de Preparo */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Modo de Preparo</Label>
          <Button type="button" variant="outline" size="sm" onClick={adicionarPassoPreparo} disabled={isLoading}>
            <Plus className="h-4 w-4 mr-2" /> Adicionar
          </Button>
        </div>
        <div className="space-y-2">
          {modoPreparo.map((passo, index) => (
            <div key={index} className="flex items-start gap-2">
              <Textarea
                value={passo}
                onChange={(e) => handleModoPreparoChange(index, e.target.value)}
                placeholder={`Passo ${index + 1}`}
                rows={3}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removerPassoPreparo(index)}
                disabled={modoPreparo.length === 1 || isLoading}
                className="mt-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700">
        {isLoading ? "Salvando..." : isEditing ? "Salvar Alterações" : "Criar Receita"}
      </Button>
    </form>
  )
}
