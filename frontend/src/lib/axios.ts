import axios from 'axios';

export const api = axios.create({
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
