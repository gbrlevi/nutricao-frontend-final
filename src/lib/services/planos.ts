// /src/lib/services/planos.service.ts

import fetchAPI from '../api-client';
import type { 
    PlanoMestre, 
    PlanoMestreCreate, 
    PlanoMestreComItens, 
    ItemPlano, 
    ItemPlanoCreate 
} from '../models';

const serviceName = 'planos';
const endpointBase = '/planos/';

// --- Função auxiliar para mapear _id para id ---
// Ela pode ser usada para um objeto ou para cada objeto em um array
const mapId = (item: any) => {
    if (!item) return null;
    const { _id, ...rest } = item;
    return { id: _id, ...rest };
};


// === Funções para Plano Mestre ===

export const getAllPlanosMestre = async (): Promise<PlanoMestre[]> => {
    const rawData = await fetchAPI<any[]>(serviceName, endpointBase);
    if (!rawData) return [];
    // Mapeia cada item da lista para o formato correto
    return rawData.map(mapId);
};

// DEPOIS (CORRETO)
export const getPlanoMestreComItens = async (id: string): Promise<PlanoMestreComItens | null> => {
    const rawData = await fetchAPI<any>(serviceName, `${endpointBase}${id}`);
    
    if (!rawData) return null; 

    const planoMapeado = mapId(rawData);
    if (planoMapeado.itens && Array.isArray(planoMapeado.itens)) {
        planoMapeado.itens = planoMapeado.itens.map(mapId);
    }
    return planoMapeado;
};

export const createPlanoMestre = async (data: PlanoMestreCreate): Promise<PlanoMestre> => {
    const rawData = await fetchAPI<any>(serviceName, endpointBase, { 
        method: 'POST', 
        body: JSON.stringify(data) 
    });
    return mapId(rawData);
};

export const updatePlanoMestre = async (id: string, data: Partial<PlanoMestreCreate>): Promise<PlanoMestre> => {
    const rawData = await fetchAPI<any>(serviceName, `${endpointBase}${id}`, { 
        method: 'PUT', 
        body: JSON.stringify(data) 
    });
    return mapId(rawData);
};

export const deletePlanoMestre = (id: string): Promise<null> => {
    return fetchAPI<null>(serviceName, `${endpointBase}${id}`, { method: 'DELETE' });
};


// === Funções para Itens de Plano ===

export const getItensDoPlano = async (planoMestreId: string): Promise<ItemPlano[]> => {
    const rawData = await fetchAPI<any[]>(serviceName, `${endpointBase}${planoMestreId}/itens`);
    if (!rawData) return [];
    return rawData.map(mapId);
};

export const getItemPlanoById = async (itemId: string): Promise<ItemPlano> => {
    const rawData = await fetchAPI<any>(serviceName, `${endpointBase}itens/${itemId}`);
    return mapId(rawData);
};

export const createItemPlano = async (data: ItemPlanoCreate): Promise<ItemPlano> => {
    const rawData = await fetchAPI<any>(serviceName, `${endpointBase}itens/`, { 
        method: 'POST', 
        body: JSON.stringify(data) 
    });
    return mapId(rawData);
};

export const updateItemPlano = async (itemId: string, data: Partial<ItemPlanoCreate>): Promise<ItemPlano> => {
    const rawData = await fetchAPI<any>(serviceName, `${endpointBase}itens/${itemId}`, { 
        method: 'PUT', 
        body: JSON.stringify(data) 
    });
    return mapId(rawData);
};

export const deleteItemPlano = (itemId: string): Promise<null> => {
    return fetchAPI<null>(serviceName, `${endpointBase}itens/${itemId}`, { method: 'DELETE' });
};