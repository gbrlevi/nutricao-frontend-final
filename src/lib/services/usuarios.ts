import fetchAPI from "../api-client"
import type { Usuario, UsuarioCreate } from "../models"

const serviceName = "usuarios"
const endpointBase = "/api/usuarios"

export const getUsuarios = async (role?: "paciente" | "nutricionista"): Promise<Usuario[]> => {
  const query = role ? `?role=${role}` : ""
  const result = await fetchAPI<Usuario[]>(serviceName, `${endpointBase}${query}`)

  // Fallback com dados mock se o serviço estiver indisponível
  if (!result) {
    return getMockUsuarios(role)
  }

  return result
}

export const getUsuarioById = async (id: string): Promise<Usuario | null> => {
  const result = await fetchAPI<Usuario>(serviceName, `${endpointBase}/${id}`)

  if (!result) {
    return getMockUsuarioById(id)
  }

  return result
}

export const createUsuario = async (data: UsuarioCreate): Promise<Usuario | null> => {
  return await fetchAPI<Usuario>(serviceName, endpointBase, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export const updateUsuario = async (id: string, data: Partial<UsuarioCreate>): Promise<Usuario | null> => {
  return await fetchAPI<Usuario>(serviceName, `${endpointBase}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export const deleteUsuario = async (id: string): Promise<boolean> => {
  const result = await fetchAPI<null>(serviceName, `${endpointBase}/${id}`, { method: "DELETE" })
  return result !== null
}

export const getPacientesDoNutricionista = async (nutricionistaId: string): Promise<Usuario[]> => {
  const result = await fetchAPI<Usuario[]>(serviceName, `/api/nutricionistas/${nutricionistaId}/pacientes`)

  if (!result) {
    return getMockPacientes(nutricionistaId)
  }

  return result
}

// Dados mock para fallback
function getMockUsuarios(role?: "paciente" | "nutricionista"): Usuario[] {
  const mockData: Usuario[] = [
    {
      id: "1",
      nome: "Dr. Maria Silva",
      email: "maria@nutriplan.com",
      role: "nutricionista",
    },
    {
      id: "2",
      nome: "João Santos",
      email: "joao@email.com",
      role: "paciente",
      nutricionista_id: "1",
    },
    {
      id: "3",
      nome: "Ana Costa",
      email: "ana@email.com",
      role: "paciente",
      nutricionista_id: "1",
    },
  ]

  return role ? mockData.filter((u) => u.role === role) : mockData
}

function getMockUsuarioById(id: string): Usuario | null {
  const mockData = getMockUsuarios()
  return mockData.find((u) => u.id === id) || null
}

function getMockPacientes(nutricionistaId: string): Usuario[] {
  return getMockUsuarios("paciente").filter((p) => p.nutricionista_id === nutricionistaId)
}
