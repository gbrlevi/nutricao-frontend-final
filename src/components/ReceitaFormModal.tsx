"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ReceitaForm } from "@/components/ReceitaForm"
import type { Receita } from "@/lib/models"
import { createReceita, updateReceita} from "@/lib/services/receitas"

type ReceitaFormData = Omit<Receita, "id">

interface ReceitaFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void 
  receitaToEdit?: Receita | null
}

export function ReceitaFormModal({ isOpen, onClose, onSuccess, receitaToEdit }: ReceitaFormModalProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const isEditing = !!receitaToEdit

  const handleSubmit = async (data: Partial<ReceitaFormData>) => {
    setIsLoading(true)
    setError(null)

    try {
      if (isEditing && receitaToEdit) {
       
        await updateReceita(receitaToEdit.id, { ...receitaToEdit, ...data } as Receita)
      } else {
        
        await createReceita(data as ReceitaFormData)
      }
      onSuccess() 
      onClose() 
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Ocorreu um erro desconhecido.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Receita" : "Criar Nova Receita"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Faça as alterações necessárias e clique em salvar."
              : "Preencha os dados para criar uma nova receita."}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ReceitaForm receitaInicial={receitaToEdit} onFormSubmit={handleSubmit} isLoading={isLoading} />
          {error && <p className="mt-4 text-sm font-medium text-center text-red-600">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  )
}
