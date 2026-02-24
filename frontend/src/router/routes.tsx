// src/router/routes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Home from "../pages/Home";
import ModuleHub from "../pages/ModuleHub";           // ← continua existindo
import Notes from "../features/notes/Notes";
import NoteView from "../features/notes/NoteView";
import ResourceHub from "../pages/hubs/ResourceHub";
import ResourcePage from "../pages/resources/ResourcePage"; // ← substitui ModuleResource

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<AppLayout />}>
                <Route index element={<Home />} />

                <Route path="modules" element={<Navigate to="/#modules" replace />} />

                {/* ✅ ModuleHub continua aqui, intocado */}
                <Route path="modules/:slug" element={<ModuleHub />} />
                <Route path="modules/:slug/notes/:noteSlug" element={<NoteView />} />

                {/* ✅ Hubs (listagem + filtro) */}
                <Route path="formularies"  element={<ResourceHub type="formulary" />} />
                <Route path="solvers"      element={<ResourceHub type="solver" />} />
                <Route path="calculations" element={<ResourceHub type="calculation" />} />
                <Route path="case-studies" element={<ResourceHub type="case-study" />} />
                <Route path="all" element={<ResourceHub type="all" />} />

                {/* ✅ Páginas de detalhe (substituem ModuleResource + Shortcut) */}
                <Route path="formularies/:resourceSlug"  element={<ResourcePage type="formulary" />} />
                <Route path="solvers/:resourceSlug"      element={<ResourcePage type="solver" />} />
                <Route path="calculations/:resourceSlug" element={<ResourcePage type="calculation" />} />
                <Route path="case-studies/:resourceSlug" element={<ResourcePage type="case-study" />} />

                <Route path="my-notes" element={<Notes />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
}
