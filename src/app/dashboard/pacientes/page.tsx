"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, Plus, Search, Eye, Edit, Trash2, Heart, AlertCircle, Mail } from "lucide-react"
import Link from "next/link"
import { getUsuarios } from "@/lib/services/usuarios"
import type { Usuario } from "@/lib/models"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [serviceUnavailable, setServiceUnavailable] = useState(false)

  useEffect(() => {
    loadPacientes()
  }, [])

  const loadPacientes = async () => {
    try {
      const data = await getUsuarios("paciente")
      setPacientes(data)
      setServiceUnavailable(false)
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error)
      setServiceUnavailable(true)
    } finally {
      setLoading(false)
    }
  }

  const filteredPacientes = pacientes.filter(
    (paciente) =>
      paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paciente.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
          <Link href="/dashboard/planos" className="text-sm font-medium hover:text-green-600 transition-colors">
            Planos
          </Link>
          <Link href="/dashboard/receitas" className="text-sm font-medium hover:text-green-600 transition-colors">
            Receitas
          </Link>
          <Link href="/dashboard/pacientes" className="text-sm font-medium text-green-600">
            Pacientes
          </Link>
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
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo Paciente
              </Button>
            </div>
          </div>

          {/* Service Status Alert */}
          {serviceUnavailable && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                O serviço de usuários está temporariamente indisponível. Exibindo pacientes de exemplo.
              </AlertDescription>
            </Alert>
          )}

          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar pacientes por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pacientes.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Novos Este Mês</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Com Planos Ativos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.floor(pacientes.length * 0.8)}</div>
              </CardContent>
            </Card>
          </div>

          {/* Pacientes List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Carregando pacientes...</p>
              </div>
            ) : filteredPacientes.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm ? "Nenhum paciente encontrado" : "Nenhum paciente cadastrado"}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm ? "Tente ajustar os termos de busca" : "Comece cadastrando seu primeiro paciente"}
                  </p>
                  {!searchTerm && (
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Cadastrar Primeiro Paciente
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredPacientes.map((paciente) => (
                  <Card key={paciente.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{paciente.nome}</CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {paciente.email}
                          </CardDescription>
                        </div>
                        <Badge variant="default">Ativo</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="text-sm text-gray-600">
                          <p>
                            <span className="font-medium">ID:</span> {paciente.id}
                          </p>
                          {paciente.nutricionista_id && (
                            <p>
                              <span className="font-medium">Nutricionista:</span> {paciente.nutricionista_id}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Perfil
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
  )
}
