"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ItemPlanoForm } from "./ItemPlanoForm"
import type { ItemPlano, ItemPlanoCreate } from "@/lib/models"
import { createItemPlano, updateItemPlano } from "@/lib/services/planos"

type ItemFormData = Omit<ItemPlanoCreate, "plano_mestre_id">

interface ItemPlanoFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  planoMestreId: string // Precisa saber a qual plano o item pertence
  itemToEdit?: ItemPlano | null
}

export function ItemPlanoFormModal({ isOpen, onClose, onSuccess, planoMestreId, itemToEdit }: ItemPlanoFormModalProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const isEditing = !!itemToEdit

  const handleSubmit = async (formData: ItemFormData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      if (isEditing && itemToEdit) {
        // Para editar, passamos o ID do item e os dados do formulário
        await updateItemPlano(itemToEdit.id, formData)
      } else {
        // Para criar, combinamos os dados do formulário com o ID do plano mestre
        const newItemData: ItemPlanoCreate = {
          ...formData,
          plano_mestre_id: planoMestreId,
        }
        await createItemPlano(newItemData)
      }
      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro desconhecido.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!isOpen) setError(null)
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Item do Plano" : "Adicionar Novo Item"}</DialogTitle>
          <DialogDescription>
            Preencha os detalhes da refeição abaixo.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ItemPlanoForm
            itemInicial={itemToEdit}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
          {error && <p className="mt-4 text-sm font-medium text-center text-red-600">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  )
}