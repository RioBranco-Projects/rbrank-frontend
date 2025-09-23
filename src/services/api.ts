import axios from "axios";
import { Aluno, Professor, Problema, StatusResponse, Submission } from "../types";

const API_BASE_URL = "https://rbrank-backend.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  getStatus: async (): Promise<StatusResponse> => {
    const response = await api.get("/status");
    return response.data;
  },

  cadastrarAluno: async (data: {
    nomeCompleto: string;
    ra: string;
    semestre: number;
  }): Promise<Aluno> => {
    const response = await api.post("/alunos/cadastrar", data);
    return response.data.aluno;
  },

  buscarAlunoPorRA: async (ra: string): Promise<Aluno> => {
    const response = await api.get(`/alunos/buscar/${ra}`);
    return response.data;
  },

  resolverProblema: async (data: {
    ra: string;
    problemaId: string;
    solucao: string;
  }) => {
    const response = await api.post("/alunos/resolver-problema", data);
    return response.data;
  },

  obterRanking: async (): Promise<Aluno[]> => {
    const response = await api.get("/alunos/ranking");
    return response.data;
  },

  loginProfessor: async (data: {
    nome: string;
    senha: string;
  }): Promise<Professor> => {
    const response = await api.post("/professores/login", data);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },

  cadastrarProfessor: async (data: {
    nome: string;
    senha: string;
  }): Promise<Professor> => {
    const response = await api.post("/professores/cadastrar", data);
    return response.data;
  },

  // Problemas
  listarProblemas: async (): Promise<Problema[]> => {
    const response = await api.get("/problemas");
    return response.data;
  },

  obterProblema: async (id: string): Promise<Problema> => {
    const response = await api.get(`/problemas/${id}`);
    return response.data;
  },

  criarProblema: async (data: {
    titulo: string;
    descricao: string;
    nivel: number;
  }): Promise<Problema> => {
    const response = await api.post("/problemas", data);
    return response.data.problema;
  },

  listarProblemasDoProfesor: async (): Promise<Problema[]> => {
    const response = await api.get("/problemas/professor/meus");
    return response.data;
  },

  atualizarProblema: async (
    id: string,
    data: Partial<Problema>,
  ): Promise<Problema> => {
    const response = await api.put(`/problemas/${id}`, data);
    return response.data.problema;
  },

  deletarProblema: async (id: string): Promise<void> => {
    await api.delete(`/problemas/${id}`);
  },

  criarSubmissao: async (payload: { challengeId: string; code: string; ra?: string }): Promise<Submission> => {
    const response = await api.post(`/submissoes`, payload);
    return (response.data.submission ?? response.data) as Submission;
  },

  listarSubmissoes: async (challengeId: string): Promise<Submission[]> => {
    const response = await api.get(`/submissoes/${challengeId}`);
    return (response.data.submissions ?? response.data) as Submission[];
  },

  avaliarSubmissao: async (
    id: string,
    payload: { status: "approved" | "rejected" | "pending"; feedback?: string }
  ): Promise<Submission> => {
    const response = await api.patch(`/submissoes/${id}`, payload);
    return (response.data.submission ?? response.data) as Submission;
  },
};
