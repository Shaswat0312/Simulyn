import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SimulationForm from '../components/SimulationForm'
import { runSimulation } from '../hooks/useSimulation'
 
export default function NewSimulation() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
 
  const handleSubmit = async (config) => {
    setLoading(true)
    setError(null)
    try {
      const res = await runSimulation(config)
      const id = res.data.result?._id || res.data._id
      navigate(`/simulation/${id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.')
      setLoading(false)
    }
  }
 
  return (
    <div className="relative isolate min-h-screen bg-[#09090b] px-6 py-12 overflow-hidden">

      <div className="absolute inset-0 pointer-events-none -z-10
        bg-[radial-gradient(ellipse_at_50%_0%,rgba(251,146,60,0.10),transparent_55%),
             radial-gradient(ellipse_at_80%_100%,rgba(251,146,60,0.05),transparent_50%)]" />
 
      <div className="absolute inset-0 pointer-events-none -z-10 opacity-[0.035]
        bg-[linear-gradient(to_right,rgba(251,146,60,0.3)_1px,transparent_1px),
             linear-gradient(to_bottom,rgba(251,146,60,0.3)_1px,transparent_1px)]
        bg-[size:72px_72px]" />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[220px] pointer-events-none -z-10 opacity-20 blur-3xl
        bg-gradient-to-b from-orange-500/40 to-transparent" />
 
      <div className="relative max-w-2xl mx-auto">
 

        <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-orange-500/60 mb-6">
          Simulyn / New Run
        </p>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
            Launch Simulation
          </h1>
          <p className="text-xs text-zinc-500 mt-1.5 font-mono">
            Configure parameters and stress-test your API under controlled chaos.
          </p>
          <div className="mt-4 h-px bg-gradient-to-r from-orange-500/40 via-zinc-700/30 to-transparent" />
        </div>
 
<div className="relative rounded-2xl border border-zinc-200 bg-white p-7 shadow-xl">

          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent pointer-events-none" />

          <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none overflow-hidden rounded-tl-2xl">
            <div className="absolute top-0 left-0 w-px h-8 bg-gradient-to-b from-orange-500/50 to-transparent" />
            <div className="absolute top-0 left-0 h-px w-8 bg-gradient-to-r from-orange-500/50 to-transparent" />
          </div>
          <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden rounded-tr-2xl">
            <div className="absolute top-0 right-0 w-px h-8 bg-gradient-to-b from-orange-500/30 to-transparent" />
            <div className="absolute top-0 right-0 h-px w-8 bg-gradient-to-l from-orange-500/30 to-transparent" />
          </div>
 
          <SimulationForm onSubmit={handleSubmit} loading={loading} />

          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-orange-500/[0.03] to-transparent rounded-b-2xl pointer-events-none" />
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-500/25 bg-red-500/[0.06] px-4 py-3">
            <span className="text-red-500 text-xs mt-0.5 font-mono">✕</span>
            <p className="text-xs text-red-400 font-mono">{error}</p>
          </div>
        )}

        {loading && (
          <div className="mt-4 flex items-center gap-2.5">
            <span className="flex gap-1">
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="w-1 h-1 rounded-full bg-orange-500 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </span>
            <p className="text-[11px] font-mono text-orange-400/80 tracking-widest uppercase">
              Running simulation...
            </p>
          </div>
        )}
 
      </div>
    </div>
  )
}