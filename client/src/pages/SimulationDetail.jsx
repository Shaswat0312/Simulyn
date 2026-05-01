import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { getSimulation } from "../hooks/useSimulation"
import { useWebSocket } from "../hooks/useWebSocket"
import MetricsDashboard from "../components/MetricsDashboard"

export default function SimulationDetail() {
  const { id } = useParams()

  const [simulation, setSimulation] = useState(null)
  const [loading, setLoading] = useState(true)

  const { history, connected } = useWebSocket(id)

  useEffect(() => {
    let interval

    const fetchData = async () => {
      try {
        const res = await getSimulation(id)
        setSimulation(res.data)
        setLoading(false)
      } catch (err) {
        console.error(err)
        setLoading(false)
      }
    }

    fetchData()
    interval = setInterval(fetchData, 3000)

    return () => clearInterval(interval)
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gray-400">
        Loading...
      </div>
    )
  }

  if (!simulation) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-red-400">
        Simulation not found
      </div>
    )
  }


  const latest =
    history.length > 0 ? history[history.length - 1] : null

  const success =
    latest?.success ?? simulation.successCount ?? 0

  const failures =
    latest?.failures ?? simulation.failureCount ?? 0

  const total = success + failures

  const successRate =
    total > 0 ? ((success / total) * 100).toFixed(1) : "—"

const chartData =
  history.length > 0
    ? history
    : simulation.history?.map(item => ({
        batch: item.batch,
        success: item.successCount,
        failures: item.failureCount
      })) || []

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">

        <div className="mb-8">
          <Link to="/" className="text-sm text-gray-400 hover:text-orange-400">
            ← Back
          </Link>

          <h1 className="mt-4 text-lg font-semibold break-all">
            {simulation.apiUrl}
          </h1>

          <p className="text-xs text-gray-500 mt-2">
            {simulation.concurrentUsers} users · {simulation.failureRate}% failure · {simulation.latency}ms
          </p>

          {connected && simulation.status === "running" && (
            <p className="text-orange-400 mt-2 animate-pulse">
              ● LIVE
            </p>
          )}
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <Stat label="SUCCESS" value={success} color="text-green-400" />
          <Stat label="FAILURES" value={failures} color="text-red-400" />
          <Stat label="TOTAL" value={total} />
          <Stat label="SUCCESS RATE" value={`${successRate}%`} color="text-orange-400" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">

          <div className="bg-[#0f0f10] border border-[#222] rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">CIRCUIT BREAKER</p>
              <p className={`text-sm font-semibold ${
                simulation.circuitBreakerEnabled ? "text-green-400" : "text-gray-500"
              }`}>
                {simulation.circuitBreakerEnabled ? "ENABLED" : "DISABLED"}
              </p>
            </div>
            <div className={`w-3 h-3 rounded-full ${
              simulation.circuitBreakerEnabled ? "bg-green-400" : "bg-gray-600"
            }`} />
          </div>

          <div className="bg-[#0f0f10] border border-[#222] rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">BREAKER STATE</p>
              <p className={`text-sm font-semibold ${
                simulation.circuitBreakerTripped ? "text-red-400" : "text-green-400"
              }`}>
                {simulation.circuitBreakerTripped ? "TRIPPED" : "CLOSED"}
              </p>
            </div>
            <div className={`w-3 h-3 rounded-full ${
              simulation.circuitBreakerTripped ? "bg-red-400 animate-pulse" : "bg-green-400"
            }`} />
          </div>

        </div>

        <div className="bg-[#0f0f10] border border-[#222] rounded-xl p-5">
          <p className="text-xs text-gray-500 mb-3 uppercase">
            Live Request Stream
          </p>

          <MetricsDashboard history={chartData} />
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, color = "text-white" }) {
  return (
    <div className="bg-[#0f0f10] border border-[#222] rounded-xl p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-xl font-semibold ${color}`}>
        {value}
      </p>
    </div>
  )
}