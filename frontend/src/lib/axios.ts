import axios from 'axios';

// Cria a instância base que será usada em todo o projeto
export const api = axios.create({
    // Em produção, isso pode vir de uma variável de ambiente (import.meta.env.VITE_API_URL)
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json'
    }
});
