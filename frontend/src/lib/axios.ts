import axios from 'axios';

// baseURL injetado via VITE_API_URL no build (--build-arg no Dockerfile)
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json'
    }
});
