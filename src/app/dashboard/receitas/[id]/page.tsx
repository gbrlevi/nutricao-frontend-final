"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Trash2, Clock, ChefHat, User } from "lucide-react"
import type { Receita } from "@/lib/models"
import { deleteReceita, getReceitaById } from "@/lib/services/receitas"
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog"
import { Badge } from "@/components/ui/badge"
import { ReceitaFormModal } from "@/components/ReceitaFormModal"


export default function DetalheReceitaPage() {
  const router = useRouter()
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id

  const [receita, setReceita] = useState<Receita | null>(null)
  const [loading, setLoading] = useState(true)
  const [receitaToDelete, setReceitaToDelete] = useState<Receita | null>(null)
  const [isDeletingReceita, setIsDeletingReceita] = useState(false)
  const [IsReceitaFormPropModal, setIsEditingReceita] = useState(false)
   const [ReceitaToEdit, setReceitaToEdit] = useState<Receita | null>(null)
  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    const fetchReceita = async () => {
      try {
        const data = await getReceitaById(id)
        setReceita(data)
      } catch (error) {
        console.error("Erro ao buscar receita:", error)
        setReceita(null)
      } finally {
        setLoading(false)
      }
    }

    fetchReceita()
  }, [id])

  const handleOpenDeleteReceitaDialog = (receita: Receita) => {
    setReceitaToDelete(receita)
  }

  const handleConfirmReceitaDelete = async () => {
    if (!receitaToDelete) return
    setIsDeletingReceita(true)
    try {
      await deleteReceita(receitaToDelete.id)
      router.push("/dashboard/receitas")
    } catch (error) {
      console.error("Erro ao deletar receita:", error)
    } finally {
      setIsDeletingReceita(false)
      setReceitaToDelete(null)
    }
  }

  

  const handleEditReceita = (item: Receita) => {
    setReceitaToEdit(item)
    setIsEditingReceita(true)
  }

  if (loading) return <div className="p-6">Carregando detalhes da receita...</div>
  if (!receita) return <div className="p-6">Receita não encontrada.</div>

  return (
    <>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para todas as receitas
        </Button>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{receita.nome}</CardTitle>
                <CardDescription>
                  Paciente ID: {receita.pacienteId} | Nutricionista ID: {receita.nutricionistaId}
                </CardDescription>
              </div>
              <Badge variant="secondary">{receita.categoria}</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                Tempo de Preparo
              </h4>
              <p>{receita.tempoPreparo} minutos</p>
            </div>
            <div>
              <h4 className="font-semibold flex items-center gap-2">
                <ChefHat className="h-4 w-4 text-gray-500" />
                Ingredientes
              </h4>
              <p>{receita.ingredientes?.length || 0} itens</p>
            </div>
            <div>
              <h4 className="font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                Passos
              </h4>
              <p>{receita.modoPreparo?.length || 0} etapas</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button onClick={() => handleEditReceita(receita)} className="bg-blue-600 hover:bg-blue-700">
            <Edit className="h-4 w-4 mr-2" />
            Editar Receita
          </Button>
          <Button
            variant="outline"
            className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
            onClick={() => handleOpenDeleteReceitaDialog(receita)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir Receita
          </Button>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Ingredientes</h2>
          {receita.ingredientes && receita.ingredientes.length > 0 ? (
            <Card className="bg-white">
              <CardContent className="p-4">
                <ul className="space-y-2">
                  {receita.ingredientes.map((ingrediente, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span>{ingrediente}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : (
            <p className="text-center text-gray-500 py-4">Nenhum ingrediente cadastrado para esta receita.</p>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Modo de Preparo</h2>
          {receita.modoPreparo && receita.modoPreparo.length > 0 ? (
            <div className="space-y-3">
              {receita.modoPreparo.map((passo, index) => (
                <Card key={index} className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                        {index + 1}
                      </span>
                      <p className="text-gray-700 leading-relaxed">{passo}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">Nenhum passo de preparo cadastrado para esta receita.</p>
          )}
        </div>
      </div>


      {/* Substitua ReceitaFormModalProps pelo componente correto, provavelmente ReceitaFormModal */}
      {/* Certifique-se de importar ReceitaFormModal no topo do arquivo */}
      {/* Exemplo: import { ReceitaFormModal } from "@/components/ReceitaFormModal" */}
      <ReceitaFormModal
        isOpen={IsReceitaFormPropModal}
        onClose={() => setIsEditingReceita(false)}
        onSuccess={() => id && router.refresh()}
        receitaToEdit={ReceitaToEdit}
      />

      <DeleteConfirmationDialog
        isOpen={!!receitaToDelete}
        onClose={() => setReceitaToDelete(null)}
        onConfirm={handleConfirmReceitaDelete}
        itemName={`a receita "${receitaToDelete?.nome}"`}
        isLoading={isDeletingReceita}
      />
    </>



  )
}
