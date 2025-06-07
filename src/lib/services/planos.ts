import fetchAPI from "../api-client"
import type { PlanoMestre, PlanoMestreCreate, PlanoMestreComItens, ItemPlano, ItemPlanoCreate } from "../models"

const serviceName = "planos"
const endpointBase = "/planos"

// === Funções para Plano Mestre ===

export const getAllPlanosMestre = async (): Promise<PlanoMestre[]> => {
  const result = await fetchAPI<PlanoMestre[]>(serviceName, endpointBase)
  return result || []
}

export const getPlanoMestreComItens = async (id: string): Promise<PlanoMestreComItens | null> => {
  return await fetchAPI<PlanoMestreComItens>(serviceName, `${endpointBase}/${id}`)
}

export const createPlanoMestre = async (data: PlanoMestreCreate): Promise<PlanoMestre | null> => {
  return await fetchAPI<PlanoMestre>(serviceName, endpointBase, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export const updatePlanoMestre = async (id: string, data: Partial<PlanoMestreCreate>): Promise<PlanoMestre | null> => {
  return await fetchAPI<PlanoMestre>(serviceName, `${endpointBase}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export const deletePlanoMestre = async (id: string): Promise<boolean> => {
  const result = await fetchAPI<null>(serviceName, `${endpointBase}/${id}`, { method: "DELETE" })
  return result !== null
}

// === Funções para Itens de Plano ===

export const getItensDoPlano = async (planoMestreId: string): Promise<ItemPlano[]> => {
  const result = await fetchAPI<ItemPlano[]>(serviceName, `${endpointBase}/${planoMestreId}/itens`)
  return result || []
}

export const getItemPlanoById = async (itemId: string): Promise<ItemPlano | null> => {
  return await fetchAPI<ItemPlano>(serviceName, `${endpointBase}/itens/${itemId}`)
}

export const createItemPlano = async (data: ItemPlanoCreate): Promise<ItemPlano | null> => {
  return await fetchAPI<ItemPlano>(serviceName, `${endpointBase}/itens/`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export const updateItemPlano = async (itemId: string, data: Partial<ItemPlanoCreate>): Promise<ItemPlano | null> => {
  return await fetchAPI<ItemPlano>(serviceName, `${endpointBase}/itens/${itemId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export const deleteItemPlano = async (itemId: string): Promise<boolean> => {
  const result = await fetchAPI<null>(serviceName, `${endpointBase}/itens/${itemId}`, { method: "DELETE" })
  return result !== null
}
