import { useState } from 'react'

const defaults = {
  apiUrl: '',
  failureRate: 30,
  latency: 500,
  concurrentUsers: 50,
  circuitBreakerEnabled: false,
  circuitBreakerThreshold: 50,
}

export default function SimulationForm({ onSubmit, loading }) {
  const [config, setConfig] = useState(defaults)
  
  const set = (key, val) => setConfig(prev => ({ ...prev, [key]: val }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!config.apiUrl) return
    onSubmit(config)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">


      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
          Target API URL
        </label>
        <input
          placeholder="https://api.example.com/endpoint"
          value={config.apiUrl}
          onChange={e => set('apiUrl', e.target.value)}
          required
          className="bg-white border border-zinc-300 text-zinc-900 px-3.5 py-2.5 rounded-md outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-zinc-400 font-mono text-sm shadow-sm"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Failure Rate (%)', key: 'failureRate', min: 0, max: 100 },
          { label: 'Latency (ms)',     key: 'latency',     min: 0 },
          { label: 'Concurrent Users', key: 'concurrentUsers', min: 1, max: 1000 },
        ].map(({ label, key, min, max }) => (
          <div key={key} className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
              {label}
            </label>
            <input
              type="number" 
              min={min} 
              max={max}
              value={config[key]}
              onChange={e => set(key, Number(e.target.value))}
              className="bg-white border border-zinc-300 text-zinc-900 px-3.5 py-2.5 rounded-md outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-mono text-sm shadow-sm"
            />
          </div>
        ))}
      </div>

 
      <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 flex flex-col gap-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-zinc-900">Circuit Breaker</p>
            <p className="text-xs text-zinc-500 mt-0.5 font-medium">Auto-halt when failure rate exceeds threshold</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={config.circuitBreakerEnabled}
              onChange={e => set('circuitBreakerEnabled', e.target.checked)}
            />
            <div className="w-11 h-6 bg-zinc-300 rounded-full peer
              peer-checked:bg-orange-500
              after:content-[''] after:absolute after:top-[3px] after:left-[3px]
              after:bg-white after:rounded-full after:h-[18px] after:w-[18px]
              after:shadow-sm after:transition-all peer-checked:after:translate-x-5" />
          </label>
        </div>

        {config.circuitBreakerEnabled && (
          <div className="flex flex-col gap-1.5 animate-fade-in pt-2 border-t border-zinc-200 mt-1">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
              Trip Threshold (%)
            </label>
            <input
              type="number" 
              min={1} 
              max={100}
              value={config.circuitBreakerThreshold}
              onChange={e => set('circuitBreakerThreshold', Number(e.target.value))}
              className="bg-white border border-zinc-300 text-zinc-900 px-3.5 py-2.5 rounded-md outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-mono text-sm shadow-sm w-full"
            />
          </div>
        )}
      </div>


      <button
        type="submit"
        disabled={loading}
        className="self-start bg-zinc-900 text-white font-bold text-sm px-8 py-3.5 rounded-lg transition-all hover:-translate-y-0.5 hover:bg-orange-500 hover:shadow-lg disabled:opacity-50 disabled:translate-y-0 disabled:cursor-not-allowed cursor-pointer mt-2"
      >
        {loading ? 'Running...' : '▶  Run Simulation'}
      </button>
      
    </form>
  )
}