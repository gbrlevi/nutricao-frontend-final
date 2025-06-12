"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { UsuarioForm } from "./UsuarioForm"
import type { Usuario, UsuarioCreate, UsuarioUpdate } from "@/lib/models"
import { createUsuario, updateUsuario } from "@/lib/services/usuarios"

interface UsuarioFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  usuarioToEdit?: Usuario | null
}

export function UsuarioFormModal({ isOpen, onClose, onSuccess, usuarioToEdit }: UsuarioFormModalProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const isEditing = !!usuarioToEdit

  const handleSubmit = async (data: UsuarioCreate | UsuarioUpdate) => {
    setIsLoading(true)
    setError(null)
    
    try {
      if (isEditing && usuarioToEdit) {
        // Para editar, passamos o ID do usuário e os novos dados
        await updateUsuario(usuarioToEdit.id, data)
      } else {
        // Para criar, passamos os dados do novo usuário
        await createUsuario(data as UsuarioCreate)
      }
      onSuccess() // Chama a função de sucesso (ex: recarregar a lista)
      onClose()   // Fecha o modal
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro desconhecido.")
    } finally {
      setIsLoading(false)
    }
  }

  // Reseta o erro quando o modal é fechado ou reaberto
  useEffect(() => {
    if (!isOpen) {
      setError(null)
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Usuário" : "Criar Novo Usuário"}</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para {isEditing ? "editar o perfil." : "criar um novo perfil."}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <UsuarioForm
            usuarioInicial={usuarioToEdit}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
          {error && <p className="mt-4 text-sm font-medium text-center text-red-600">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  )
}