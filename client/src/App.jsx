import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import NewSimulation from './pages/NewSimulation'
import SimulationDetail from './pages/SimulationDetail'
import Compare from './pages/Compare'
import Navbar from './components/Navbar'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#09090b] text-zinc-100 antialiased selection:bg-orange-500/20 selection:text-orange-300">
        <Navbar />
        <main className="relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/simulate" element={<NewSimulation />} />
            <Route path="/simulation/:id" element={<SimulationDetail />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}