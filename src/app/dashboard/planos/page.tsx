"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Users, Plus, Search, Edit, Trash2, Eye, Heart } from "lucide-react"
import Link from "next/link"
import { getAllPlanosMestre } from "@/lib/services/planos"
import type { PlanoMestre } from "@/lib/models"

export default function PlanosPage() {
  const [planos, setPlanos] = useState<PlanoMestre[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadPlanos()
  }, [])

  const loadPlanos = async () => {
    try {
      const data = await getAllPlanosMestre()
      setPlanos(data)
    } catch (error) {
      console.error("Erro ao carregar planos:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPlanos = planos.filter((plano) => plano.titulo.toLowerCase().includes(searchTerm.toLowerCase()))

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Não definido"
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  return (
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
              <Link href="/dashboard/planos/novo">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Plano
                </Button>
              </Link>
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
                  {planos.filter((p) => !p.data_fim || new Date(p.data_fim) > new Date()).length}
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
                    <Link href="/dashboard/planos/novo">
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Criar Primeiro Plano
                      </Button>
                    </Link>
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
                          variant={!plano.data_fim || new Date(plano.data_fim) > new Date() ? "default" : "secondary"}
                        >
                          {!plano.data_fim || new Date(plano.data_fim) > new Date() ? "Ativo" : "Finalizado"}
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
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/planos/${plano.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Visualizar
                        </Button>
                      </Link>
                      <Link href={`/dashboard/planos/${plano.id}/editar`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
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
  )
}
