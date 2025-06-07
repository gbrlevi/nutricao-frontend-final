// src/components/PlanoFormModal.tsx

"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { PlanoForm } from "./PlanoForm"
import type { PlanoMestre, PlanoMestreCreate } from "@/lib/models"
import { createPlanoMestre, updatePlanoMestre } from "@/lib/services/planos"

interface PlanoFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void // Função para ser chamada após o sucesso (ex: recarregar a lista)
  planoToEdit?: PlanoMestre | null
}

export function PlanoFormModal({ isOpen, onClose, onSuccess, planoToEdit }: PlanoFormModalProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const isEditing = !!planoToEdit

  const handleSubmit = async (data: PlanoMestreCreate | Partial<PlanoMestreCreate>) => {
    setIsLoading(true)
    setError(null)
    
    try {
      if (isEditing && planoToEdit) {
        // Se estiver editando, chama a função de update
        await updatePlanoMestre(planoToEdit.id, data)
      } else {
        // Se estiver criando, chama a função de create
        await createPlanoMestre(data as PlanoMestreCreate)
      }
      onSuccess() // Chama a função de sucesso (ex: recarregar a lista de planos)
      onClose()   // Fecha o modal
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro desconhecido.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Plano" : "Criar Novo Plano"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Faça as alterações necessárias e clique em salvar." : "Preencha os dados para criar um novo plano."}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <PlanoForm
            planoInicial={planoToEdit}
            onFormSubmit={handleSubmit}
            isLoading={isLoading}
          />
          {error && <p className="mt-4 text-sm font-medium text-center text-red-600">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  )
}