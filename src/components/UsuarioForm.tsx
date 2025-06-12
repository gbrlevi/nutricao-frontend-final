"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Usuario, UsuarioCreate, UsuarioUpdate } from "@/lib/models"

interface UsuarioFormProps {
  usuarioInicial?: Usuario | null
  onSubmit: (data: UsuarioCreate | UsuarioUpdate) => Promise<void>
  isLoading: boolean
}

export function UsuarioForm({ usuarioInicial, onSubmit, isLoading }: UsuarioFormProps) {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<'paciente' | 'nutricionista'>('paciente')
  const [nutricionistaId, setNutricionistaId] = useState("")

  const isEditing = !!usuarioInicial

  useEffect(() => {
    if (usuarioInicial) {
      setNome(usuarioInicial.nome)
      setEmail(usuarioInicial.email)
      setRole(usuarioInicial.role)
      setNutricionistaId(usuarioInicial.nutricionista_id || "")
    } else {
      // Limpa o formulário para criação
      setNome("")
      setEmail("")
      setRole("paciente")
      setNutricionistaId("")
    }
  }, [usuarioInicial])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    // Monta o objeto de dados com base nos campos do formulário
    const data: UsuarioCreate | UsuarioUpdate = {
      nome,
      email,
      role,
      // Só envie o nutricionista_id se o role for 'paciente'
      nutricionista_id: role === 'paciente' ? nutricionistaId : undefined,
    }
    
    await onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome Completo</Label>
        <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required disabled={isLoading} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Tipo de Usuário</Label>
        <Select value={role} onValueChange={(value) => setRole(value as any)} required disabled={isLoading || isEditing}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paciente">Paciente</SelectItem>
            <SelectItem value="nutricionista">Nutricionista</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {role === 'paciente' && (
        <div className="space-y-2">
          <Label htmlFor="nutricionistaId">ID do Nutricionista Responsável</Label>
          <Input id="nutricionistaId" value={nutricionistaId} onChange={(e) => setNutricionistaId(e.target.value)} required={role === 'paciente'} disabled={isLoading} />
        </div>
      )}
      
      <Button type="submit" disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700">
        {isLoading ? "Salvando..." : (isEditing ? "Salvar Alterações" : "Criar Usuário")}
      </Button>
    </form>
  )
}