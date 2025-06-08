// Configuração das URLs base dos microserviços
const API_BASE_URLS = {
    usuarios: process.env.NEXT_PUBLIC_USUARIOS_API_URL || 'http://localhost:3001',
    planos: process.env.NEXT_PUBLIC_PLANOS_API_URL || 'https://python-microservice-production-33dc.up.railway.app',
    receitas: process.env.NEXT_PUBLIC_RECEITAS_API_URL || 'https://receitamicroservice.onrender.com',
};

type ServiceName = keyof typeof API_BASE_URLS

/**
 * Função genérica para fazer chamadas de API com tratamento de erro robusto.
 * @param service O nome do microserviço a ser chamado ('usuarios', 'planos', 'receitas').
 * @param endpoint O caminho do endpoint (ex: '/{id}' ou '/nutricionistas/{id}/pacientes').
 * @param options Opções do fetch, como method, body, etc.
 * @returns A resposta da API em formato JSON ou null se o serviço estiver indisponível.
 */
async function fetchAPI<T>(service: ServiceName, endpoint: string, options: RequestInit = {}): Promise<T | null> {
  const baseURL = API_BASE_URLS[service]
  const url = `${baseURL}${endpoint}`

  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage =
        errorData.detail || errorData.message || `HTTP Error: ${response.status} ${response.statusText}`
      throw new Error(errorMessage)
    }

    if (response.status === 204) {
      return null as T
    }

    return (await response.json()) as T
  } catch (error) {
    console.error(`API Error calling ${url}:`, error)

    // Retorna null em caso de erro para permitir fallbacks
    return null
  }
}

/**
 * Verifica se um serviço está disponível
 */
export async function checkServiceHealth(service: ServiceName): Promise<boolean> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`${API_BASE_URLS[service]}/health`, {
      method: "GET",
      signal: controller.signal,
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
}

export default fetchAPI
