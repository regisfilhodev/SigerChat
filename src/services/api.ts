import axios from 'axios';

// Criando instância do axios com configurações
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  // Aumenta o timeout para 10 segundos
  timeout: 10000,
});

// Interceptor para log de requisições (para depuração)
api.interceptors.request.use(
  (config) => {
    console.log(`Fazendo requisição para: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para log de respostas (para depuração)
api.interceptors.response.use(
  (response) => {
    console.log(`Resposta de ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('Erro na resposta:', error);
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/users/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Erro no serviço de login:', error);
      throw error;
    }
  },
  
  register: async (name: string, email: string, password: string) => {
    try {
      const response = await api.post('/users', { name, email, password });
      return response.data;
    } catch (error) {
      console.error('Erro no serviço de registro:', error);
      throw error;
    }
  },
  
  getUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  }
};

export default api; 