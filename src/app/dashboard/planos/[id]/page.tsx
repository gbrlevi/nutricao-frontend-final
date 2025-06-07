"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, Edit, Trash2, Clock, Utensils } from "lucide-react"
import type { PlanoMestreComItens, ItemPlano } from "@/lib/models"
import { getPlanoMestreComItens, deleteItemPlano } from "@/lib/services/planos"
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog"
import { ItemPlanoFormModal } from "@/components/ItemPlanoFormModal"

export default function DetalhePlanoPage() {
  const router = useRouter()
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id // Garante que id seja string

  const [plano, setPlano] = useState<PlanoMestreComItens | null>(null)
  const [loading, setLoading] = useState(true)

  // --- Estados para os modais de ITENS ---
  const [isItemModalOpen, setIsItemModalOpen] = useState(false)
  const [itemToEdit, setItemToEdit] = useState<ItemPlano | null>(null)
  const [itemToDelete, setItemToDelete] = useState<ItemPlano | null>(null)
  const [isDeletingItem, setIsDeletingItem] = useState(false)

  useEffect(() => {
    if (id) {
      loadPlanoDetalhes(id)
    }
  }, [id])

  const loadPlanoDetalhes = async (planoId: string) => {
    setLoading(true)
    try {
      const data = await getPlanoMestreComItens(planoId)
      setPlano(data)
    } catch (error) {
      console.error("Erro ao carregar detalhes do plano:", error)
      setPlano(null)
    } finally {
      setLoading(false)
    }
  }

  // --- Funções para controlar os modais de ITENS ---
  const handleOpenCreateItemModal = () => {
    setItemToEdit(null)
    setIsItemModalOpen(true)
  }

  const handleOpenEditItemModal = (item: ItemPlano) => {
    setItemToEdit(item)
    setIsItemModalOpen(true)
  }

  const handleOpenDeleteItemDialog = (item: ItemPlano) => {
    setItemToDelete(item)
  }

  const handleConfirmItemDelete = async () => {
    if (!itemToDelete) return
    setIsDeletingItem(true)
    try {
      await deleteItemPlano(itemToDelete.id)
        const id = Array.isArray(params.id) ? params.id[0] : params.id

        if (id) {
            loadPlanoDetalhes(id);
        }

      setItemToDelete(null)
    } catch (error) {
      console.error("Erro ao deletar item:", error)
    } finally {
      setIsDeletingItem(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Não definido"
    const date = new Date(dateString)
    const userTimezoneOffset = date.getTimezoneOffset() * 60000
    return new Date(date.getTime() + userTimezoneOffset).toLocaleDateString("pt-BR")
  }

  if (loading) return <div className="p-6">Carregando detalhes do plano...</div>
  if (!plano) return <div className="p-6">Plano não encontrado.</div>

  return (
    <>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para todos os planos
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{plano.titulo}</CardTitle>
            <CardDescription>
              Paciente ID: {plano.paciente_id} | Nutricionista ID: {plano.nutricionista_id}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div><h4 className="font-semibold">Data de Início</h4><p>{formatDate(plano.data_inicio)}</p></div>
            <div><h4 className="font-semibold">Data de Fim</h4><p>{formatDate(plano.data_fim)}</p></div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Itens do Plano</h2>
            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={handleOpenCreateItemModal}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Item
            </Button>
          </div>

          {plano.itens.length > 0 ? (
            plano.itens.map((item) => (
              <Card key={item.id} className="bg-white">
                <CardContent className="p-4 flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-semibold flex items-center gap-2"><Utensils className="h-4 w-4 text-gray-500" />{item.nome_refeicao}</p>
                    <p className="text-sm text-gray-700">{item.descricao}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1"><Clock className="h-3 w-3" />Horário: {item.horario}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleOpenEditItemModal(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="text-red-600 hover:text-red-700" onClick={() => handleOpenDeleteItemDialog(item)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">Nenhum item cadastrado para este plano.</p>
          )}
        </div>
      </div>

      {/* --- Modais para os ITENS --- */}
      <ItemPlanoFormModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSuccess={() => id && loadPlanoDetalhes(id)}
        planoMestreId={id || ""}
        itemToEdit={itemToEdit}
      />
      <DeleteConfirmationDialog
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmItemDelete}
        itemName={`o item "${itemToDelete?.nome_refeicao}"`}
        isLoading={isDeletingItem}
      />
    </>
  )
}