"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, Plus, Search, Eye, Edit, Trash2, Heart, Mail, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Importamos todas as funções e tipos necessários
import { getUsuarios, deleteUsuario } from "@/lib/services/usuarios"
import { getAllPlanosMestre } from "@/lib/services/planos"
import type { Usuario, PlanoMestre } from "@/lib/models"
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog"
import { UsuarioFormModal } from "@/components/UsuarioFormModal"

// Dados estáticos para usar como fallback em caso de falha da API
const MOCK_PACIENTES: Usuario[] = [
  { id: "mock1", nome: "Carlos Silva (Exemplo)", email: "carlos.exemplo@email.com", role: "paciente", nutricionista_id: "nutri1", data_criacao: new Date().toISOString() },
  { id: "mock2", nome: "Mariana Costa (Exemplo)", email: "mariana.exemplo@email.com", role: "paciente", nutricionista_id: "nutri1", data_criacao: new Date().toISOString() },
];

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Usuario[]>([])
  const [planos, setPlanos] = useState<PlanoMestre[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [serviceUnavailable, setServiceUnavailable] = useState(false)

  // --- Estados para gerenciar os modais ---
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [usuarioToEdit, setUsuarioToEdit] = useState<Usuario | null>(null)
  const [usuarioToDelete, setUsuarioToDelete] = useState<Usuario | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    loadPageData()
  }, [])

  const loadPageData = async () => {
    setLoading(true)
    setServiceUnavailable(false)
    try {
      // Buscamos pacientes e planos em paralelo
      const [pacientesResult, planosResult] = await Promise.all([
        getUsuarios("paciente"),
        getAllPlanosMestre()
      ])
      
      setPacientes(pacientesResult || [])
      setPlanos(planosResult || [])

    } catch (error) {
      console.error("Erro ao carregar dados da página:", error)
      setServiceUnavailable(true)
      setPacientes(MOCK_PACIENTES) // Carrega dados mock em caso de falha
      setPlanos([])
    } finally {
      setLoading(false)
    }
  }

  // --- Lógica para os Cards de Estatísticas ---
  const stats = useMemo(() => {
    const agora = new Date()
    const inicioDoMes = new Date(agora.getFullYear(), agora.getMonth(), 1)

    const novosPacientesMes = pacientes.filter(p => 
      p.data_criacao && new Date(p.data_criacao) >= inicioDoMes
    ).length

    const pacientesComPlanoAtivo = new Set(
      planos
        .filter(p => !p.data_fim || new Date(p.data_fim) >= agora)
        .map(p => p.paciente_id)
    )

    return {
      totalPacientes: pacientes.length,
      novosPacientesMes,
      comPlanosAtivos: pacientesComPlanoAtivo.size
    }
  }, [pacientes, planos])


  // --- Funções para controlar os modais ---
  const handleOpenCreateModal = () => {
    setUsuarioToEdit(null)
    setIsFormModalOpen(true)
  }

  const handleOpenEditModal = (usuario: Usuario) => {
    setUsuarioToEdit(usuario)
    setIsFormModalOpen(true)
  }

  const handleOpenDeleteDialog = (usuario: Usuario) => {
    setUsuarioToDelete(usuario)
  }

  const handleConfirmDelete = async () => {
    if (!usuarioToDelete) return
    setIsDeleting(true)
    try {
      await deleteUsuario(usuarioToDelete.id)
      loadPageData() // Recarrega todos os dados para manter os stats consistentes
      setUsuarioToDelete(null)
    } catch (error) {
      console.error("Erro ao deletar paciente:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredPacientes = pacientes.filter(
    (paciente) =>
      paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (paciente.email && paciente.email.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando pacientes...</div>
  }

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Header */}
        <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white">
            <Link href="/" className="flex items-center justify-center"><Heart className="h-8 w-8 text-green-600" /><span className="ml-2 text-xl font-bold text-gray-900">NutriPlan</span></Link>
            <nav className="ml-auto flex gap-4 sm:gap-6">
                <Link href="/dashboard" className="text-sm font-medium hover:text-green-600">Dashboard</Link>
                <Link href="/dashboard/planos" className="text-sm font-medium hover:text-green-600">Planos</Link>
                <Link href="/dashboard/receitas" className="text-sm font-medium hover:text-green-600">Receitas</Link>
                <Link href="/dashboard/pacientes" className="text-sm font-medium text-green-600">Pacientes</Link>
            </nav>
        </header>

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Meus Pacientes</h1>
                <p className="text-gray-600 mt-1">Gerencie informações e histórico dos seus pacientes</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleOpenCreateModal}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Paciente
                </Button>
              </div>
            </div>

            {/* Alerta de Fallback */}
            {serviceUnavailable && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Um ou mais serviços estão indisponíveis. Exibindo dados de exemplo.</AlertDescription>
                </Alert>
            )}

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input placeholder="Buscar pacientes por nome ou email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                    </div>
                </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader>
                <CardContent><div className="text-2xl font-bold">{stats.totalPacientes}</div></CardContent>
              </Card>
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Novos Este Mês</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader>
                  <CardContent><div className="text-2xl font-bold">{stats.novosPacientesMes}</div></CardContent>
              </Card>
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Com Planos Ativos</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader>
                  <CardContent><div className="text-2xl font-bold">{stats.comPlanosAtivos}</div></CardContent>
              </Card>
            </div>

            {/* Pacientes List */}
            <div className="space-y-4">
              {filteredPacientes.length === 0 && !loading ? (
                <Card>
                    <CardContent className="text-center py-8">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{searchTerm ? "Nenhum paciente encontrado" : "Nenhum paciente cadastrado"}</h3>
                        <p className="text-gray-600 mb-4">{searchTerm ? "Tente ajustar os termos de busca" : "Comece cadastrando seu primeiro paciente"}</p>
                        {!searchTerm && (<Button className="bg-green-600 hover:bg-green-700" onClick={handleOpenCreateModal}><Plus className="h-4 w-4 mr-2" />Cadastrar Primeiro Paciente</Button>)}
                    </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredPacientes.map((paciente) => (
                    <Card key={paciente.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1"><CardTitle className="text-lg">{paciente.nome}</CardTitle><CardDescription className="flex items-center gap-1"><Mail className="h-3 w-3" />{paciente.email}</CardDescription></div>
                          <Badge variant="default">Ativo</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                          <div className="text-sm text-gray-600 mb-4">
                              <p><span className="font-medium">ID:</span> {paciente.id}</p>
                              {paciente.nutricionista_id && (<p><span className="font-medium">Nutricionista:</span> {paciente.nutricionista_id}</p>)}
                          </div>
                          <div className="flex items-center gap-2 border-t pt-4">
                              <Link href={`/dashboard/planos?pacienteId=${paciente.id}`} className="flex-1">
                                  <Button variant="outline" size="sm" className="w-full"><Eye className="h-4 w-4 mr-2" />Ver Planos</Button>
                              </Link>
                              <Button variant="outline" size="sm" onClick={() => handleOpenEditModal(paciente)}><Edit className="h-4 w-4" /></Button>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleOpenDeleteDialog(paciente)}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* --- Renderização dos Modais --- */}
      <UsuarioFormModal 
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={loadPageData}
        usuarioToEdit={usuarioToEdit}
      />
      <DeleteConfirmationDialog
        isOpen={!!usuarioToDelete}
        onClose={() => setUsuarioToDelete(null)}
        onConfirm={handleConfirmDelete}
        itemName={usuarioToDelete?.nome || ""}
        isLoading={isDeleting}
      />
    </>
  )
}