"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, BookOpen, Calendar, Star, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"


// Importando as funções de todos os serviços
import { getUsuarios } from "@/lib/services/usuarios"
import { getAllPlanosMestre } from "@/lib/services/planos"
import { getAllReceitas } from "@/lib/services/receitas"


export default function HomePage() {
  // Estados para armazenar os dados dos contadores
  const [pacientesCount, setPacientesCount] = useState<number>(0)
  const [planosCount, setPlanosCount] = useState<number>(0)
  const [receitasCount, setReceitasCount] = useState<number>(0)

  // useEffect para buscar os dados quando a página carrega
  useEffect(() => {
    const fetchCounts = async () => {
      // Usamos Promise.all para buscar tudo em paralelo
      const [pacientesResult, planosResult, receitasResult] = await Promise.allSettled([
        getUsuarios("paciente"),
        getAllPlanosMestre(),
        getAllReceitas(),
      ])

      if (pacientesResult.status === 'fulfilled' && pacientesResult.value) {
        setPacientesCount(pacientesResult.value.length)
      } else {
        // Fallback para o número estático se a API falhar
        setPacientesCount(500) 
        console.error("Falha ao buscar pacientes:", (pacientesResult as PromiseRejectedResult).reason)
      }

      if (planosResult.status === 'fulfilled' && planosResult.value) {
        setPlanosCount(planosResult.value.length)
      } else {
        setPlanosCount(1000)
        console.error("Falha ao buscar planos:", (planosResult as PromiseRejectedResult).reason)
      }

      if (receitasResult.status === 'fulfilled' && receitasResult.value) {
        setReceitasCount(receitasResult.value.length)
      } else {
        setReceitasCount(200)
        console.error("Falha ao buscar receitas:", (receitasResult as PromiseRejectedResult).reason)
      }
    }

    fetchCounts()
  }, [])


  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <Link href="/" className="flex items-center justify-center">
          <Heart className="h-8 w-8 text-green-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">NutriPlan</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="#servicos" className="text-sm font-medium hover:text-green-600 transition-colors">Serviços</Link>
          <Link href="#depoimentos" className="text-sm font-medium hover:text-green-600 transition-colors">Depoimentos</Link>
          <Link href="#contato" className="text-sm font-medium hover:text-green-600 transition-colors">Contato</Link>
          <Link href="/dashboard">
            <Button size="sm" className="bg-green-600 hover:bg-green-700">Dashboard</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">Nutrição Personalizada</Badge>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-gray-900">
                    Transforme sua saúde com <span className="text-green-600">planos alimentares</span> personalizados
                  </h1>
                  <p className="max-w-[600px] text-gray-600 md:text-xl">
                    Conecte-se com nutricionistas especializados e receba planos alimentares sob medida, receitas saudáveis e acompanhamento profissional para alcançar seus objetivos.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700">
                      Começar Agora
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg">Saiba Mais</Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Serviços */}
        <section id="servicos" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-900">Nossos Serviços</h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Oferecemos uma plataforma completa para nutricionistas e pacientes, com ferramentas modernas para um acompanhamento eficaz.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card className="border-green-200 hover:shadow-lg transition-shadow h-full flex flex-col">
                <CardHeader><Calendar className="h-10 w-10 text-green-600" /><CardTitle className="text-gray-900 mt-4">Planos Alimentares</CardTitle><CardDescription>Crie e gerencie planos alimentares personalizados para cada paciente, com horários e refeições detalhadas.</CardDescription></CardHeader>
                <CardContent className="mt-auto"><ul className="space-y-2 text-sm text-gray-600"><li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-600" />Planos personalizados</li><li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-600" />Controle de horários</li><li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-600" />Acompanhamento em tempo real</li></ul></CardContent>
              </Card>
              <Card className="border-green-200 hover:shadow-lg transition-shadow h-full flex flex-col">
                <CardHeader><BookOpen className="h-10 w-10 text-green-600" /><CardTitle className="text-gray-900 mt-4">Receitas Saudáveis</CardTitle><CardDescription>Biblioteca completa de receitas saudáveis com instruções detalhadas e informações nutricionais.</CardDescription></CardHeader>
                <CardContent className="mt-auto"><ul className="space-y-2 text-sm text-gray-600"><li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-600" />Receitas categorizadas</li><li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-600" />Tempo de preparo</li><li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-600" />Ingredientes detalhados</li></ul></CardContent>
              </Card>
              <Card className="border-green-200 hover:shadow-lg transition-shadow h-full flex flex-col">
                <CardHeader><Users className="h-10 w-10 text-green-600" /><CardTitle className="text-gray-900 mt-4">Gestão de Pacientes</CardTitle><CardDescription>Gerencie todos os seus pacientes em um só lugar, com histórico completo e acompanhamento personalizado.</CardDescription></CardHeader>
                <CardContent className="mt-auto"><ul className="space-y-2 text-sm text-gray-600"><li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-600" />Perfis detalhados</li><li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-600" />Histórico de consultas</li><li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-600" />Comunicação direta</li></ul></CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Estatísticas Dinâmicas */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-4 lg:gap-12">
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="text-4xl font-bold text-green-600">{pacientesCount}+</div>
                <div className="text-sm text-gray-600">Pacientes Atendidos</div>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="text-4xl font-bold text-green-600">{planosCount}+</div>
                <div className="text-sm text-gray-600">Planos Criados</div>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="text-4xl font-bold text-green-600">{receitasCount}+</div>
                <div className="text-sm text-gray-600">Receitas Disponíveis</div>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="text-4xl font-bold text-green-600">98%</div>
                <div className="text-sm text-gray-600">Satisfação dos Clientes</div>
              </div>
            </div>
          </div>
        </section>

        {/* Depoimentos */}
        <section id="depoimentos" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-900">O que nossos clientes dizem</h2>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              {/* Card de Depoimento 1 */}
              <Card><CardHeader><div className="flex">{[...Array(5)].map((_, i) => (<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />))}</div></CardHeader><CardContent><p className="text-gray-600 mb-4">A plataforma revolucionou minha prática. Consigo criar planos personalizados rapidamente e meus pacientes adoram a facilidade de acesso.</p><div className="flex items-center gap-2"><div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"><span className="text-sm font-medium text-green-600">DR</span></div><div><p className="font-medium text-gray-900">Dra. Maria Silva</p><p className="text-sm text-gray-600">Nutricionista</p></div></div></CardContent></Card>
              {/* Card de Depoimento 2 */}
              <Card><CardHeader><div className="flex">{[...Array(5)].map((_, i) => (<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />))}</div></CardHeader><CardContent><p className="text-gray-600 mb-4">Perdi 15kg seguindo os planos alimentares personalizados. As receitas são deliciosas e fáceis de preparar!</p><div className="flex items-center gap-2"><div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"><span className="text-sm font-medium text-green-600">JS</span></div><div><p className="font-medium text-gray-900">João Santos</p><p className="text-sm text-gray-600">Paciente</p></div></div></CardContent></Card>
              {/* Card de Depoimento 3 */}
              <Card><CardHeader><div className="flex">{[...Array(5)].map((_, i) => (<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />))}</div></CardHeader><CardContent><p className="text-gray-600 mb-4">Interface intuitiva e funcionalidades completas. Recomendo para todos os colegas nutricionistas.</p><div className="flex items-center gap-2"><div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"><span className="text-sm font-medium text-green-600">AC</span></div><div><p className="font-medium text-gray-900">Ana Costa</p><p className="text-sm text-gray-600">Nutricionista</p></div></div></CardContent></Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="contato" className="w-full py-12 md:py-24 lg:py-32 bg-green-600">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">Pronto para transformar sua prática?</h2>
                <p className="max-w-[600px] text-green-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Junte-se a centenas de nutricionistas que já estão usando nossa plataforma para oferecer o melhor cuidado aos seus pacientes.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/dashboard">
                  <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
                    Começar Gratuitamente<ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-600">© 2025 NutriPlan. Todos os direitos reservados.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-gray-600">Termos de Uso</Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-gray-600">Privacidade</Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-gray-600">Contato</Link>
        </nav>
      </footer>
    </div>
  )
}