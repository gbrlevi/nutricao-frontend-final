"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Users, Plus, Search, Edit, Trash2, Eye, Heart } from "lucide-react"
import Link from "next/link"
import { getAllPlanosMestre, deletePlanoMestre } from "@/lib/services/planos"
import type { PlanoMestre } from "@/lib/models"
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog"
import { PlanoFormModal } from "@/components/PlanoFormModal"

export default function PlanosPage() {
  const [planos, setPlanos] = useState<PlanoMestre[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // --- Estados para gerenciar os modais ---
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [planoToEdit, setPlanoToEdit] = useState<PlanoMestre | null>(null)
  const [planoToDelete, setPlanoToDelete] = useState<PlanoMestre | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    loadPlanos()
  }, [])

  const loadPlanos = async () => {
    setLoading(true)
    try {
      const data = await getAllPlanosMestre()
      setPlanos(data || [])
    } catch (error) {
      console.error("Erro ao carregar planos:", error)
    } finally {
      setLoading(false)
    }
  }

  // --- Funções para controlar os modais ---
  const handleOpenCreateModal = () => {
    setPlanoToEdit(null)
    setIsFormModalOpen(true)
  }

  const handleOpenEditModal = (plano: PlanoMestre) => {
    setPlanoToEdit(plano)
    setIsFormModalOpen(true)
  }

  const handleOpenDeleteDialog = (plano: PlanoMestre) => {
    setPlanoToDelete(plano)
  }

  const handleConfirmDelete = async () => {
    if (!planoToDelete) return
    setIsDeleting(true)
    try {
      await deletePlanoMestre(planoToDelete.id)
      setPlanos(prevPlanos => prevPlanos.filter(p => p.id !== planoToDelete.id))
      setPlanoToDelete(null)
    } catch (error) {
      console.error("Erro ao deletar plano:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredPlanos = planos.filter((plano) => plano.titulo.toLowerCase().includes(searchTerm.toLowerCase()))

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Não definido"
    const date = new Date(dateString)
    const userTimezoneOffset = date.getTimezoneOffset() * 60000
    return new Date(date.getTime() + userTimezoneOffset).toLocaleDateString("pt-BR")
  }

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
            <Link href="/dashboard" className="text-sm font-medium hover:text-green-600 transition-colors">
              Dashboard
            </Link>
            <Link href="/dashboard/planos" className="text-sm font-medium text-green-600">
              Planos
            </Link>
            <Link href="/dashboard/receitas" className="text-sm font-medium hover:text-green-600 transition-colors">
              Receitas
            </Link>
            <Link href="/dashboard/pacientes" className="text-sm font-medium hover:text-green-600 transition-colors">
              Pacientes
            </Link>
          </nav>
        </header>

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Planos Alimentares</h1>
                <p className="text-gray-600 mt-1">Gerencie todos os planos alimentares dos seus pacientes</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleOpenCreateModal}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Plano
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
                      placeholder="Buscar planos por título..."
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
                  <CardTitle className="text-sm font-medium">Total de Planos</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{planos.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Planos Ativos</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {planos.filter((p) => !p.data_fim || new Date(p.data_fim) >= new Date()).length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Criados Este Mês</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {
                      planos.filter((p) => {
                        if (!p.data_inicio) return false
                        const inicio = new Date(p.data_inicio)
                        const agora = new Date()
                        return inicio.getMonth() === agora.getMonth() && inicio.getFullYear() === agora.getFullYear()
                      }).length
                    }
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Planos List */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Carregando planos...</p>
                </div>
              ) : filteredPlanos.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {searchTerm ? "Nenhum plano encontrado" : "Nenhum plano criado ainda"}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm ? "Tente ajustar os termos de busca" : "Comece criando seu primeiro plano alimentar"}
                    </p>
                    {!searchTerm && (
                      <Button className="bg-green-600 hover:bg-green-700" onClick={handleOpenCreateModal}>
                        <Plus className="h-4 w-4 mr-2" />
                        Criar Primeiro Plano
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                filteredPlanos.map((plano) => (
                  <Card key={plano.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{plano.titulo}</CardTitle>
                          <CardDescription>Paciente ID: {plano.paciente_id}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={!plano.data_fim || new Date(plano.data_fim) >= new Date() ? "default" : "secondary"}
                          >
                            {!plano.data_fim || new Date(plano.data_fim) >= new Date() ? "Ativo" : "Finalizado"}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                        <div>
                          <span className="font-medium">Data de Início:</span>
                          <br />
                          {formatDate(plano.data_inicio)}
                        </div>
                        <div>
                          <span className="font-medium">Data de Fim:</span>
                          <br />
                          {formatDate(plano.data_fim)}
                        </div>
                      </div>
                    <div className="flex items-center gap-2 border-t pt-4">
                        {/* 1. Removi o className="flex-1" do Link e o w-full do Button */}
                        <Link href={`/dashboard/planos/${plano.id}`}>
                            <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                Visualizar
                            </Button>
                        </Link>

                        {/* 2. Adicionei o texto de volta e o espaçamento (mr-2) nos ícones */}
                        <Button variant="outline" size="sm" onClick={() => handleOpenEditModal(plano)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                        </Button>

                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleOpenDeleteDialog(plano)}>
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

      {/* --- Renderização dos Modais --- */}
      <PlanoFormModal 
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={loadPlanos}
        planoToEdit={planoToEdit}
      />
      
      <DeleteConfirmationDialog
        isOpen={!!planoToDelete}
        onClose={() => setPlanoToDelete(null)}
        onConfirm={handleConfirmDelete}
        itemName={planoToDelete?.titulo || ""}
        isLoading={isDeleting}
      />
    </>
  )
}