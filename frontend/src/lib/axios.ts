import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '';

export const api = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
    try {
        const raw = localStorage.getItem('hs_auth');
        if (raw) {
            const { accessToken } = JSON.parse(raw) as { accessToken: string };
            if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
        }
    } catch {
        // ignora se o storage estiver corrompido
    }
    return config;
});
