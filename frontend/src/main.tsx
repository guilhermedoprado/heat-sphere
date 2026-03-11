import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './lib/auth'
import './index.css'
import App from './App.tsx'
import './styles/base.css'
import './styles/tokens.css'
import './styles/utilities.css'
import katex from "katex";
import "katex/dist/katex.min.css";

// Desativa strict mode globalmente — nunca quebra por LaTeX inválido
(katex as any).__defaultOptions = {
  ...((katex as any).__defaultOptions ?? {}),
  strict: false,
  throwOnError: false,
};

createRoot(document.getElementById('root')!).render(
  
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
)
