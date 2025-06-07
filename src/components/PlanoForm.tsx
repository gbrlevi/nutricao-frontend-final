"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { PlanoMestre, PlanoMestreCreate } from "@/lib/models"

interface PlanoFormProps {
  planoInicial?: PlanoMestre | null
  onFormSubmit: (data: Partial<PlanoMestreCreate>) => Promise<void>
  isLoading: boolean
}

export function PlanoForm({ planoInicial, onFormSubmit, isLoading }: PlanoFormProps) {
  // Estados para controlar os campos do formulário
  const [titulo, setTitulo] = useState("")
  const [pacienteId, setPacienteId] = useState("")
  const [nutricionistaId, setNutricionistaId] = useState("")
  // --- ADICIONADO: Estados para as datas ---
  const [dataInicio, setDataInicio] = useState("")
  const [dataFim, setDataFim] = useState("")

  const isEditing = !!planoInicial

  // useEffect preenche o formulário quando um plano é passado para edição
  useEffect(() => {
    if (planoInicial) {
      setTitulo(planoInicial.titulo)
      setPacienteId(planoInicial.paciente_id)
      setNutricionistaId(planoInicial.nutricionista_id)
      // --- ADICIONADO: Preenche as datas se existirem (formato AAAA-MM-DD) ---
      setDataInicio(planoInicial.data_inicio ? planoInicial.data_inicio.split('T')[0] : "")
      setDataFim(planoInicial.data_fim ? planoInicial.data_fim.split('T')[0] : "")
    } else {
      // Limpa o formulário para criação
      setTitulo("")
      setPacienteId("")
      setNutricionistaId("")
      setDataInicio("")
      setDataFim("")
    }
  }, [planoInicial])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    // --- ADICIONADO: Inclui as datas no objeto enviado para a API ---
    const data: Partial<PlanoMestreCreate> = {
      titulo,
      paciente_id: pacienteId,
      nutricionista_id: nutricionistaId,
    }

    // Inclui as datas apenas se elas tiverem sido preenchidas
    if (dataInicio) data.data_inicio = dataInicio
    if (dataFim) data.data_fim = dataFim
    
    await onFormSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="titulo">Título do Plano</Label>
        <Input
          id="titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ex: Plano de Hipertrofia - Fase 1"
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pacienteId">ID do Paciente</Label>
        <Input
          id="pacienteId"
          value={pacienteId}
          onChange={(e) => setPacienteId(e.target.value)}
          placeholder="Cole o ID do paciente aqui"
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
          placeholder="Cole o ID do nutricionista aqui"
          required
          disabled={isLoading}
        />
      </div>

      {/* --- ADICIONADO: Campos de Data no Formulário --- */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="data_inicio">Data de Início</Label>
          <Input 
            id="data_inicio" 
            type="date" 
            value={dataInicio} 
            onChange={(e) => setDataInicio(e.target.value)} 
            disabled={isLoading} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="data_fim">Data de Fim</Label>
          <Input 
            id="data_fim" 
            type="date" 
            value={dataFim} 
            onChange={(e) => setDataFim(e.target.value)} 
            disabled={isLoading} 
          />
        </div>
      </div>
      
      <Button type="submit" disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700">
        {isLoading ? "Salvando..." : (isEditing ? "Salvar Alterações" : "Criar Plano")}
      </Button>
    </form>
  )
}