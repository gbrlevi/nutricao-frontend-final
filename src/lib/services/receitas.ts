import fetchAPI from "../api-client"
import type { Receita, ReceitaCreate, Receitaupdate } from "../models"

const serviceName = "receitas"
const endpointBase = "/api/receitas"

export const getAllReceitas = async (): Promise<Receita[]> => {
  const result = await fetchAPI<Receita[]>(serviceName, endpointBase)

  if (!result) {
    return getMockReceitas()
  }

  return result
}

export const getReceitaById = async (id: string): Promise<Receita | null> => {
  const result = await fetchAPI<Receita>(serviceName, `${endpointBase}${id}`)

  if (!result) {
    return getMockReceitaById(id)
  }

  return result
}

export const createReceita = async (data: ReceitaCreate): Promise<Receita | null> => {
  return await fetchAPI<Receita>(serviceName, endpointBase, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export const updateReceita = async (id: string, data: Partial<Receitaupdate>): Promise<Receita | null> => {
  return await fetchAPI<Receita>(serviceName, `${endpointBase}${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export const deleteReceita = async (id: string): Promise<boolean> => {
  const result = await fetchAPI<null>(serviceName, `${endpointBase}${id}`, { method: "DELETE" })
  return result !== null
}

export const getReceitasDoPaciente = async (pacienteId: string): Promise<Receita[]> => {
  const result = await fetchAPI<Receita[]>(serviceName, `${endpointBase}paciente/${pacienteId}`)

  if (!result) {
    return getMockReceitasPorPaciente(pacienteId)
  }

  return result
}

export const getReceitasDoNutricionista = async (nutricionistaId: string): Promise<Receita[]> => {
  const result = await fetchAPI<Receita[]>(serviceName, `${endpointBase}nutricionista/${nutricionistaId}`)

  if (!result) {
    return getMockReceitasPorNutricionista(nutricionistaId)
  }

  return result
}

// Dados mock para fallback
function getMockReceitas(): Receita[] {
  return [
    {
      id: "1",
      nome: "Salada de Quinoa com Legumes",
      categoria: "Almoço",
      tempoPreparo: 20,
      ingredientes: [
        "1 xícara de quinoa",
        "2 tomates picados",
        "1 pepino picado",
        "1/2 cebola roxa",
        "Azeite extra virgem",
        "Limão",
        "Sal e pimenta",
      ],
      modoPreparo: [
        "Cozinhe a quinoa conforme instruções da embalagem",
        "Pique todos os vegetais em cubos pequenos",
        "Misture a quinoa fria com os vegetais",
        "Tempere com azeite, limão, sal e pimenta",
        "Deixe descansar por 10 minutos antes de servir",
      ],
      nutricionistaId: "1",
      pacienteId: "2",
    },
    {
      id: "2",
      nome: "Smoothie Verde Detox",
      categoria: "Café da Manhã",
      tempoPreparo: 5,
      ingredientes: [
        "1 banana",
        "1 xícara de espinafre",
        "1/2 abacate",
        "1 xícara de água de coco",
        "1 colher de sopa de chia",
        "Gengibre a gosto",
      ],
      modoPreparo: [
        "Adicione todos os ingredientes no liquidificador",
        "Bata até obter consistência homogênea",
        "Sirva imediatamente",
        "Decore com sementes de chia se desejar",
      ],
      nutricionistaId: "1",
      pacienteId: "2",
    },
    {
      id: "3",
      nome: "Salmão Grelhado com Aspargos",
      categoria: "Jantar",
      tempoPreparo: 25,
      ingredientes: [
        "200g de filé de salmão",
        "200g de aspargos",
        "2 colheres de sopa de azeite",
        "1 limão",
        "Alho picado",
        "Ervas finas",
        "Sal e pimenta",
      ],
      modoPreparo: [
        "Tempere o salmão com sal, pimenta e ervas",
        "Aqueça uma frigideira antiaderente",
        "Grelhe o salmão por 4-5 minutos de cada lado",
        "Refogue os aspargos com alho e azeite",
        "Sirva com limão",
      ],
      nutricionistaId: "1",
      pacienteId: "3",
    },
  ]
}

function getMockReceitaById(id: string): Receita | null {
  const mockData = getMockReceitas()
  return mockData.find((r) => r.id === id) || null
}

function getMockReceitasPorPaciente(pacienteId: string): Receita[] {
  return getMockReceitas().filter((r) => r.pacienteId === pacienteId)
}

function getMockReceitasPorNutricionista(nutricionistaId: string): Receita[] {
  return getMockReceitas().filter((r) => r.nutricionistaId === nutricionistaId)
}