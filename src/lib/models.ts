// --- Usuários ---
export interface Usuario {
  id: string
  nome: string
  email: string
  role: "nutricionista" | "paciente"
  nutricionista_id?: string
  data_criacao?: string
}

export interface UsuarioCreate {
  nome: string
  email: string
  role: "nutricionista" | "paciente"
  nutricionista_id?: string
  data_criacao?: string
}

export interface UsuarioUpdate {
  nome?: string
  email?: string
  nutricionista_id?: string
  data_criacao?: string
}

// --- Planos Alimentares ---
export interface ItemPlano {
  id: string
  plano_mestre_id: string
  horario: string
  nome_refeicao: string
  descricao: string
}

export interface PlanoMestre {
  id: string
  paciente_id: string
  nutricionista_id: string
  titulo: string
  data_inicio?: string
  data_fim?: string
}

export interface PlanoMestreComItens extends PlanoMestre {
  itens: ItemPlano[]
}

export interface PlanoMestreCreate {
  paciente_id: string
  nutricionista_id: string
  titulo: string
  data_inicio?: string
  data_fim?: string
}

export interface ItemPlanoCreate {
  plano_mestre_id: string
  horario: string
  nome_refeicao: string
  descricao: string
}

// --- Receitas ---
export interface Receita {
  id: string
  nome: string
  categoria: string
  tempoPreparo: number
  ingredientes: string[]
  modoPreparo: string[]
  nutricionistaId: string
  pacienteId: string
  data_criacao?: string
}

export interface ReceitaCreate {
  nome: string
  categoria: string
  tempoPreparo: number
  ingredientes: string[]
  modoPreparo: string[]
  nutricionistaId: string
  pacienteId: string
  data_criacao?: string
}


export interface Receitaupdate {
  id: string
  nome: string
  categoria: string
  tempoPreparo: number
  ingredientes: string[]
  modoPreparo: string[]
  nutricionistaId: string
  pacienteId: string
  data_criacao?: string
}



