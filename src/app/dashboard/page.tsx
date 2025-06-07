"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, BookOpen, Plus, TrendingUp, Clock, Heart, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Importando as funções de todos os serviços
import { getUsuarios } from "@/lib/services/usuarios"
import { getAllPlanosMestre } from "@/lib/services/planos"
import { getAllReceitas } from "@/lib/services/receitas"
import type { Usuario, PlanoMestre, Receita } from "@/lib/models"

// Interface unificada para a lista de atividades
interface ActivityItem {
  type: 'plano' | 'receita' | 'paciente'
  text: string
  date: Date
}

export default function DashboardPage() {
  // Estados para armazenar os dados de cada serviço
  const [pacientes, setPacientes] = useState<Usuario[]>([])
  const [planos, setPlanos] = useState<PlanoMestre[]>([])
  const [receitas, setReceitas] = useState<Receita[]>([])

  // Estados de controle
  const [loading, setLoading] = useState(true)
  const [failedServices, setFailedServices] = useState<string[]>([])

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true)
      const failures: string[] = []

      const results = await Promise.allSettled([
        getUsuarios("paciente"),
        getAllPlanosMestre(),
        getAllReceitas(),
      ])

      if (results[0].status === 'fulfilled') {
        setPacientes(results[0].value || [])
      } else {
        console.error("Falha ao buscar pacientes:", results[0].reason)
        failures.push("Usuários")
      }

      if (results[1].status === 'fulfilled') {
        setPlanos(results[1].value || [])
      } else {
        console.error("Falha ao buscar planos:", results[1].reason)
        failures.push("Planos")
      }

      if (results[2].status === 'fulfilled') {
        setReceitas(results[2].value || [])
      } else {
        console.error("Falha ao buscar receitas:", results[2].reason)
        failures.push("Receitas")
      }
      
      setFailedServices(failures)
      setLoading(false)
    }

    fetchAllData()
  }, [])

  // --- Cálculos para os Cards de Estatísticas ---
  const stats = useMemo(() => {
    const agora = new Date();
    const umaSemanaAtras = new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000);
    const inicioDoMes = new Date(agora.getFullYear(), agora.getMonth(), 1);

    return {
      totalPacientes: pacientes.length,
      novosPacientesMes: pacientes.filter(p => new Date(p.data_criacao || 0) >= inicioDoMes).length,
      planosAtivos: planos.filter(p => !p.data_fim || new Date(p.data_fim) >= agora).length,
      planosNovosSemana: planos.filter(p => new Date(p.data_inicio || 0) >= umaSemanaAtras).length,
      totalReceitas: receitas.length,
      novasReceitas: receitas.filter(r => new Date(r.data_criacao || 0) >= umaSemanaAtras).length,
    }
  }, [pacientes, planos, receitas])


  // --- Lógica para Atividade Recente ---
  const recentActivity = useMemo(() => {
    // Se algum serviço falhou, a lista de atividades ficará vazia
    if (failedServices.length > 0) {
        return [];
    }

    const atividades: ActivityItem[] = [
      ...pacientes.map(p => ({ type: 'paciente' as const, text: `Paciente cadastrado: ${p.nome}`, date: new Date(p.data_criacao || 0) })),
      ...planos.map(p => ({ type: 'plano' as const, text: `Plano criado: ${p.titulo}`, date: new Date(p.data_inicio || 0) })),
      ...receitas.map(r => ({ type: 'receita' as const, text: `Receita criada: ${r.nome}`, date: new Date(r.data_criacao || 0) })),
    ];

    return atividades
      .filter(a => a.date.getTime() > 0)
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 3);
  }, [pacientes, planos, receitas, failedServices]);

  const getIconForActivity = (type: ActivityItem['type']) => {
    switch (type) {
      case 'plano': return <div className="w-2 h-2 bg-green-600 rounded-full shrink-0"></div>
      case 'receita': return <div className="w-2 h-2 bg-blue-600 rounded-full shrink-0"></div>
      case 'paciente': return <div className="w-2 h-2 bg-yellow-600 rounded-full shrink-0"></div>
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando Dashboard...</div>
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white shrink-0">
        <Link href="/" className="flex items-center justify-center">
          <Heart className="h-8 w-8 text-green-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">NutriPlan</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/dashboard" className="text-sm font-medium text-green-600">Dashboard</Link>
          <Link href="/dashboard/planos" className="text-sm font-medium hover:text-green-600">Planos</Link>
          <Link href="/dashboard/receitas" className="text-sm font-medium hover:text-green-600">Receitas</Link>
          <Link href="/dashboard/pacientes" className="text-sm font-medium hover:text-green-600">Pacientes</Link>
        </nav>
      </header>

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Bem-vindo de volta! Aqui está um resumo da sua prática.</p>
          </div>
          
          {failedServices.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Falha ao conectar com o(s) serviço(s) de: **{failedServices.join(', ')}**. Alguns dados não puderam ser carregados.
              </AlertDescription>
            </Alert>
          )}

          {/* Stats Cards com Fallback para 0 */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{failedServices.includes('Usuários') ? 0 : stats.totalPacientes}</div>
                <p className="text-xs text-muted-foreground">{failedServices.includes('Usuários') ? "+0 novos este mês" : `+${stats.novosPacientesMes} novos este mês`}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Planos Ativos</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{failedServices.includes('Planos') ? 0 : stats.planosAtivos}</div>
                <p className="text-xs text-muted-foreground">{failedServices.includes('Planos') ? "+0 novos esta semana" : `+${stats.planosNovosSemana} novos esta semana`}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receitas Criadas</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{failedServices.includes('Receitas') ? 0 : stats.totalReceitas}</div>
                <p className="text-xs text-muted-foreground">{failedServices.includes('Receitas') ? "+0 novas esta semana" : `+${stats.novasReceitas} novas esta semana`}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground">+5% vs mês anterior</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 grid gap-6 md:grid-cols-2">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer"><Link href="/dashboard/planos"><CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-green-600" />Gerenciar Planos</CardTitle><CardDescription>Visualize e edite os planos alimentares</CardDescription></CardHeader></Link></Card>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer"><Link href="/dashboard/receitas"><CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-green-600" />Biblioteca de Receitas</CardTitle><CardDescription>Acesse e crie receitas saudáveis</CardDescription></CardHeader></Link></Card>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer col-span-1 md:col-span-2"><Link href="/dashboard/pacientes"><CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-green-600" />Meus Pacientes</CardTitle><CardDescription>Gerencie informações e histórico dos seus pacientes</CardDescription></CardHeader></Link></Card>
            </div>
            
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
                <CardDescription>Últimas ações na plataforma</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {getIconForActivity(activity.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.text}</p>
                      <p className="text-xs text-muted-foreground">{activity.date.toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground">Nenhuma atividade recente para exibir.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}