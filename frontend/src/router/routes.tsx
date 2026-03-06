import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Home from "../pages/Home";
import ModuleHub from "../pages/ModuleHub";
import Notes from "../features/notes/Notes";
import NoteView from "../features/notes/NoteView";
import ResourceHub from "../pages/hubs/ResourceHub";
import ResourcePage from "../pages/resources/ResourcePage";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import LoginPage from "../components/auth/LoginPage";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route path="/" element={<AppLayout />}>
                <Route index element={<Home />} />

                <Route path="modules" element={<Navigate to="/#modules" replace />} />
                <Route path="modules/:slug" element={<ModuleHub />} />
                <Route path="modules/:slug/notes/:noteSlug" element={<NoteView />} />

                <Route path="formularies"  element={<ResourceHub type="formulary" />} />
                <Route path="solvers"      element={<ResourceHub type="solver" />} />
                <Route path="calculations" element={<ResourceHub type="calculation" />} />
                <Route path="case-studies" element={<ResourceHub type="case-study" />} />
                <Route path="all"          element={<ResourceHub type="all" />} />

                <Route path="formularies/:resourceSlug"  element={<ResourcePage type="formulary" />} />
                <Route path="solvers/:resourceSlug"      element={<ResourcePage type="solver" />} />
                <Route path="calculations/:resourceSlug" element={<ResourcePage type="calculation" />} />
                <Route path="case-studies/:resourceSlug" element={<ResourcePage type="case-study" />} />

                <Route
                    path="my-notes"
                    element={
                        <ProtectedRoute>
                            <Notes />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
}
