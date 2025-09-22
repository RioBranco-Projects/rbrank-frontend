export interface Aluno {
  _id: string;
  nomeCompleto: string;
  ra: string;
  semestre: number;
  pontuacao: number;
  problemasResolvidos: {
    problema: string;
    dataResolucao: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface Professor {
  _id: string;
  nome: string;
  token?: string;
}

export interface Problema {
  _id: string;
  titulo: string;
  descricao: string;
  nivel: 1 | 2 | 3;
  pontos: number;
  professor: {
    _id: string;
    nome: string;
  };
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StatusResponse {
  isAvailable: boolean;
  currentHour: number;
  nextAvailableTime?: string;
  message: string;
}

export interface ApiResponse<T> {
  message: string;
  data?: T;
  error?: string;
}

export interface Submission {
  _id: string;
  challengeId: { _id: string; titulo: string; nivel: number } | string;
  studentId: { _id: string; nomeCompleto: string; ra: string } | string;
  code: string;
  status: "pending" | "approved" | "rejected";
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}
