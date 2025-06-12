"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChefHat, Clock, Plus, Search, Edit, Trash2, Eye, Heart } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

import type { Receita } from "@/lib/models"
import { getAllReceitas, deleteReceita } from "@/lib/services/receitas"
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog"

export default function ReceitasPage() {
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const [receitaToDelete, setReceitaToDelete] = useState<Receita | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    loadReceitas()
  }, [])

  const loadReceitas = async () => {
    setLoading(true)
    try {
      const data = await getAllReceitas()
      setReceitas(data || [])
    } catch (error) {
      console.error("Erro ao carregar receitas:", error)
    } finally {
      setLoading(false)
    }
  }

  // --- Funções para controlar os modais ---
  const handleOpenCreateModal = () => {
    router.push("/dashboard/receitas/nova")
  }

  const handleOpenEditModal = (receita: Receita) => {
    router.push(`/dashboard/receitas/editar/${receita.id}`)
  }

  const handleOpenDeleteDialog = (receita: Receita) => {
    setReceitaToDelete(receita)
  }

  const handleConfirmDelete = async () => {
    if (!receitaToDelete) return
    setIsDeleting(true)
    try {
      await deleteReceita(receitaToDelete.id)
      setReceitas((prevReceitas) =>
        prevReceitas.filter((r) => r.id !== receitaToDelete.id)
      )
      setReceitaToDelete(null)
    } catch (error) {
      console.error("Erro ao deletar receita:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredReceitas = receitas.filter(
    (receita) =>
      receita.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receita.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Estatísticas das receitas
  const receitasRapidas = receitas.filter(
    (r) => typeof r.tempoPreparo === "number" && r.tempoPreparo <= 30
  ).length
  const categorias = [...new Set(receitas.map((r) => r.categoria))].length

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Header */}
        <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white">
          <Link href="/" className="flex items-center justify-center">
            <Heart className="h-8 w-8 text-green-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">NutriPlan</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link
              href="/dashboard"
              className="text-sm font-medium hover:text-green-600 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/planos"
              className="text-sm font-medium hover:text-green-600 transition-colors"
            >
              Planos
            </Link>
            <Link
              href="/dashboard/receitas"
              className="text-sm font-medium text-green-600"
            >
              Receitas
            </Link>
            <Link
              href="/dashboard/pacientes"
              className="text-sm font-medium hover:text-green-600 transition-colors"
            >
              Pacientes
            </Link>
          </nav>
        </header>

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Receitas Nutricionais</h1>
                <p className="text-gray-600 mt-1">
                  Gerencie todas as receitas dos seus pacientes
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleOpenCreateModal}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Receita
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar receitas por nome ou categoria..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Receitas</CardTitle>
                  <ChefHat className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{receitas.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Receitas Rápidas</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{receitasRapidas}</div>
                  <p className="text-xs text-muted-foreground">≤ 30 minutos</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Categorias</CardTitle>
                  <ChefHat className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{categorias}</div>
                </CardContent>
              </Card>
            </div>

            {/* Receitas List */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Carregando receitas...</p>
                </div>
              ) : filteredReceitas.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {searchTerm ? "Nenhuma receita encontrada" : "Nenhuma receita criada ainda"}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm
                        ? "Tente ajustar os termos de busca"
                        : "Comece criando sua primeira receita nutricional"}
                    </p>
                    {!searchTerm && (
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={handleOpenCreateModal}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Criar Primeira Receita
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                filteredReceitas.map((receita) => (
                  <Card key={receita.id ?? receita.nome} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{receita.nome}</CardTitle>
                          <CardDescription>
                            {receita.pacienteId && `Paciente ID: ${receita.pacienteId}`}
                            {receita.nutricionistaId && ` | Nutricionista ID: ${receita.nutricionistaId}`}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{receita.categoria}</Badge>
                          {typeof receita.tempoPreparo === "number" && receita.tempoPreparo <= 30 && (
                            <Badge variant="outline" className="text-green-600 border-green-200">
                              Rápida
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                        <div>
                          <span className="font-medium flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Tempo:
                          </span>
                          <br />
                          {receita.tempoPreparo ?? "-"} min
                        </div>
                        <div>
                          <span className="font-medium flex items-center gap-1">
                            <ChefHat className="h-3 w-3" />
                            Ingredientes:
                          </span>
                          <br />
                          {receita.ingredientes?.length ?? 0} itens
                        </div>
                        <div>
                          <span className="font-medium">Passos:</span>
                          <br />
                          {receita.modoPreparo?.length ?? 0} etapas
                        </div>
                      </div>
                      <div className="flex items-center gap-2 border-t pt-4">
                        <Link href={`/dashboard/receitas/${receita.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar
                          </Button>
                        </Link>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEditModal(receita)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleOpenDeleteDialog(receita)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      {/* --- Modal de confirmação de exclusão --- */}
      <DeleteConfirmationDialog
        isOpen={!!receitaToDelete}
        onClose={() => setReceitaToDelete(null)}
        onConfirm={handleConfirmDelete}
        itemName={receitaToDelete?.nome || ""}
        isLoading={isDeleting}
      />
    </>
  )
}
