"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Clock, Plus, Search, Eye, Edit, Trash2, Heart, AlertCircle } from "lucide-react"
import Link from "next/link"
import { getAllReceitas } from "@/lib/services/receitas"
import type { Receita } from "@/lib/models"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ReceitasPage() {
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [serviceUnavailable, setServiceUnavailable] = useState(false)

  useEffect(() => {
    loadReceitas()
  }, [])

  const loadReceitas = async () => {
    try {
      const data = await getAllReceitas()
      setReceitas(data)
      setServiceUnavailable(false)
    } catch (error) {
      console.error("Erro ao carregar receitas:", error)
      setServiceUnavailable(true)
    } finally {
      setLoading(false)
    }
  }

  const categories = Array.from(new Set(receitas.map((r) => r.categoria)))

  const filteredReceitas = receitas.filter((receita) => {
    const matchesSearch = receita.nome.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || receita.categoria === selectedCategory
    return matchesSearch && matchesCategory
  })

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
          <Link href="/dashboard/receitas" className="text-sm font-medium text-green-600">
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
              <h1 className="text-3xl font-bold text-gray-900">Biblioteca de Receitas</h1>
              <p className="text-gray-600 mt-1">Explore e gerencie receitas saudáveis para seus pacientes</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Nova Receita
              </Button>
            </div>
          </div>

          {/* Service Status Alert */}
          {serviceUnavailable && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                O serviço de receitas está temporariamente indisponível. Exibindo receitas de exemplo.
              </AlertDescription>
            </Alert>
          )}

          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar receitas por nome..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Receitas</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{receitas.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categorias</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{categories.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {receitas.length > 0
                    ? Math.round(receitas.reduce((acc, r) => acc + r.tempoPreparo, 0) / receitas.length)
                    : 0}{" "}
                  min
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Receitas Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-600">Carregando receitas...</p>
              </div>
            ) : filteredReceitas.length === 0 ? (
              <div className="col-span-full">
                <Card>
                  <CardContent className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {searchTerm || selectedCategory !== "all"
                        ? "Nenhuma receita encontrada"
                        : "Nenhuma receita disponível"}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm || selectedCategory !== "all"
                        ? "Tente ajustar os filtros de busca"
                        : "Comece criando sua primeira receita"}
                    </p>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Receita
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              filteredReceitas.map((receita) => (
                <Card key={receita.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{receita.nome}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{receita.categoria}</Badge>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock className="h-3 w-3" />
                            {receita.tempoPreparo} min
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm text-gray-900 mb-1">Ingredientes:</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {receita.ingredientes.slice(0, 3).join(", ")}
                          {receita.ingredientes.length > 3 && "..."}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Receita
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
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
