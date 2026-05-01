import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import axios from 'axios'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export default function Compare() {
  const [searchParams] = useSearchParams()
  const a = searchParams.get('a')
  const b = searchParams.get('b')

  const [simA, setSimA] = useState(null)
  const [simB, setSimB] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API}/simulations/compare?a=${a}&b=${b}`)
      .then(res => {
        setSimA(res.data.result.simA)
        setSimB(res.data.result.simB)
      })
      .finally(() => setLoading(false))
  }, [a, b])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-zinc-500">Loading...</div>
  }

  const successRateA = ((simA.successCount / (simA.successCount + simA.failureCount)) * 100).toFixed(1)
  const successRateB = ((simB.successCount / (simB.successCount + simB.failureCount)) * 100).toFixed(1)

  const chartData = [
    { name: 'Success', A: simA.successCount, B: simB.successCount },
    { name: 'Failures', A: simA.failureCount, B: simB.failureCount }
  ]

  return (
    <div className="min-h-screen bg-[#09090b] text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">


        <Link to="/" className="text-sm text-zinc-500 hover:text-orange-400">
          ← Back
        </Link>

        <h1 className="text-2xl font-semibold mt-4 mb-6">
          Simulation Comparison
        </h1>


        <div className="grid grid-cols-2 gap-4 mb-6">

          <SummaryCard title="Run A" sim={simA} successRate={successRateA} />
          <SummaryCard title="Run B" sim={simB} successRate={successRateB} />

        </div>


        <div className="border border-zinc-800 rounded-xl overflow-hidden mb-6">

          <table className="w-full text-sm">
            <thead className="bg-zinc-900">
              <tr className="text-zinc-400">
                <th className="p-3 text-left">Metric</th>
                <th className="p-3 text-center">Run A</th>
                <th className="p-3 text-center">Run B</th>
              </tr>
            </thead>

            <tbody>
              <Row label="Users" a={simA.concurrentUsers} b={simB.concurrentUsers} />
              <Row label="Failure %" a={`${simA.failureRate}%`} b={`${simB.failureRate}%`} />
              <Row label="Latency" a={`${simA.latency}ms`} b={`${simB.latency}ms`} />
              <Row label="Success" a={simA.successCount} b={simB.successCount} highlight />
              <Row label="Failures" a={simA.failureCount} b={simB.failureCount} />
              <Row label="Success Rate" a={`${successRateA}%`} b={`${successRateB}%`} highlight />
              <Row label="Duration" a={`${simA.totalDuration}ms`} b={`${simB.totalDuration}ms`} />
            </tbody>
          </table>
        </div>

        <div className="border border-zinc-800 rounded-xl p-5">
          <p className="text-xs text-zinc-500 mb-3 uppercase">
            Visual Comparison
          </p>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />

              <Line type="monotone" dataKey="A" stroke="#4ade80" />
              <Line type="monotone" dataKey="B" stroke="#f87171" />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  )
}


function SummaryCard({ title, sim, successRate }) {
  return (
    <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-900/40">
      <p className="text-xs text-zinc-500">{title}</p>

      <p className="text-sm truncate mt-1">{sim.apiUrl}</p>

      <div className="mt-3 flex justify-between text-sm">
        <span className="text-green-400">{sim.successCount}</span>
        <span className="text-red-400">{sim.failureCount}</span>
      </div>

      <p className="text-orange-400 mt-2 text-sm">
        {successRate}%
      </p>
    </div>
  )
}

function Row({ label, a, b, highlight }) {
  return (
    <tr className="border-t border-zinc-800">
      <td className="p-3 text-zinc-500">{label}</td>
      <td className={`p-3 text-center ${highlight && 'text-green-400'}`}>{a}</td>
      <td className={`p-3 text-center ${highlight && 'text-red-400'}`}>{b}</td>
    </tr>
  )
}