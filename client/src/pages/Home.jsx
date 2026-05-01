import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getSimulations } from '../hooks/useSimulation'

const Badge = ({ status }) => {
  const styles = {
    pending:   'bg-zinc-800/80 text-zinc-400 border border-zinc-700/60',
    running:   'bg-orange-500/10 text-orange-400 border border-orange-500/30',
    completed: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    failed:    'bg-red-500/10 text-red-400 border border-red-500/30',
  }

  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-md font-mono uppercase ${styles[status]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}

const StatPill = ({ label, value, highlight }) => (
  <span className={`text-[11px] px-2 py-0.5 rounded font-mono ${highlight ? 'text-orange-400 bg-orange-500/10 border border-orange-500/20' : 'text-zinc-500 bg-zinc-800/50 border border-zinc-800'}`}>
    {value} <span className="opacity-60">{label}</span>
  </span>
)

export default function Home() {
  const [simulations, setSimulations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    getSimulations()
      .then(res => setSimulations(res.data.result))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const toggleSelect = (id) => {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(s => s !== id)
      if (prev.length === 2) return prev
      return [...prev, id]
    })
  }

  const handleCompare = () => {
    if (selected.length === 2) {
      navigate(`/compare?a=${selected[0]}&b=${selected[1]}`)
    }
  }

  return (
    <div className="relative min-h-screen text-zinc-100 px-6 py-12 bg-[#09090b]">

      <div className="relative max-w-5xl mx-auto">

        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-orange-500/70 mb-2">
              Simulyn / History
            </p>
            <h1 className="text-2xl font-semibold text-zinc-100">
              Simulation Runs
            </h1>
            <p className="text-xs text-zinc-600 mt-1 font-mono">
              {simulations.length} runs recorded
            </p>
          </div>

          <div className="flex items-center gap-3">
            {selected.length === 2 && (
              <button
                onClick={handleCompare}
                className="border border-orange-500/40 text-orange-400 px-4 py-2 rounded-lg text-sm hover:bg-orange-500/10"
              >
                Compare →
              </button>
            )}

            <Link to="/simulate">
              <button className="bg-orange-500 text-black px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-orange-400">
                + New Simulation
              </button>
            </Link>
          </div>
        </div>

        {!loading && (
          <div className="space-y-3">
            {simulations.map((sim, i) => {
              const isSelected = selected.includes(sim._id)
              const isDisabled = selected.length === 2 && !isSelected

              return (
                <div
                  key={sim._id}
                  className={`border rounded-xl p-4 transition-all
                    ${isSelected ? 'border-orange-500/50' : 'border-zinc-800'}
                    ${isDisabled ? 'opacity-40' : ''}`}
                >
                  <div className="flex justify-between items-center">


                    <div className="flex-1">
                      <p className="text-sm text-zinc-200 truncate">
                        {sim.apiUrl}
                      </p>

                      <div className="flex gap-2 mt-2">
                        <StatPill value={sim.concurrentUsers} label="users" />
                        <StatPill value={`${sim.failureRate}%`} label="failure" />
                        <StatPill value={`${sim.latency}ms`} label="latency" />
                      </div>
                    </div>

                    <div className="flex items-center gap-3">

                      <Badge status={sim.status} />

                      <button
                        onClick={() => !isDisabled && toggleSelect(sim._id)}
                        className={`text-xs px-3 py-1 border rounded
                          ${isSelected
                            ? 'border-orange-500 text-orange-400'
                            : 'border-zinc-700 text-zinc-500'
                          }`}
                      >
                        {isSelected ? 'Selected' : 'Select'}
                      </button>

                      <Link to={`/simulation/${sim._id}`}>
                        <button className="text-xs border border-zinc-700 px-3 py-1 rounded">
                          View
                        </button>
                      </Link>

                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}