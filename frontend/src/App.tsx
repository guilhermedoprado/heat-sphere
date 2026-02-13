import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Modules from './pages/Modules'
import ModuleHub from './pages/ModuleHub'
import Notes from './features/notes/Notes'
import NoteView from './features/notes/NoteView'
import { ShellTubeRating } from './features/heat-exchangers/tools/ShellTubeRating'
import { CylinderFlowCalculator } from './features/external-flow/tools/CylinderFlow'
import ToolHub from './pages/ToolHub'  // Solvers / cases 
import ToolPage from './pages/ToolPage'  // Specific tool page (e.g. /internal-flow/tool/solvers)

function App() {
  return (
    <Routes>
      {/* --- HOMEPAGE --- */}
      <Route path="/" element={<Home />} />

      {/* --- MODULES (catalog) --- */}
      <Route path="/modules" element={<Modules />} />
      
      {/* MODULE HUB */}
      <Route path="/modules/:slug" element={<ModuleHub />} />

      {/* --- SPECIFIC TOOLS --- */}
      <Route path="/modules/heat-exchangers/tools/case-studies/shell-tube-rating" element={<ShellTubeRating />} />
      <Route path="/modules/external-flow/tools/case-studies/cilinder-cross-flow" element={<CylinderFlowCalculator />} />

      {/* --- TOOL HUB (NEW: /internal-flow/tool) --- */}
      <Route path="/modules/:slug/tools" element={<ToolHub />} />
      <Route path="/modules/:slug/tools/:toolsSlug" element={<ToolPage />} /> 

      {/* --- NOTES --- */}
      <Route path="/modules/:slug/:category" element={<NoteView />} />

      {/* MY NOTES */}
      <Route path="/my-notes" element={<Notes />} />
    </Routes>
  )
}

export default App
