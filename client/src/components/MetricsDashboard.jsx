import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null

  return (
    <div
      style={{
        background: "#111",
        border: "1px solid #333",
        borderRadius: "8px",
        padding: "10px",
        fontSize: "12px",
        color: "#fff"
      }}
    >
      {payload.map((p) => (
        <div key={p.dataKey} style={{ color: p.stroke }}>
          {p.dataKey}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  )
}

export default function MetricsDashboard({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        Waiting for live data...
      </div>
    )
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={history}>
          <CartesianGrid stroke="#222" strokeDasharray="3 3" />

          <XAxis
            dataKey="batch"
            tick={{ fill: "#aaa", fontSize: 10 }}
          />

          <YAxis
            tick={{ fill: "#aaa", fontSize: 10 }}
          />

          <Tooltip content={<CustomTooltip />} />

          <Line
            type="monotone"
            dataKey="success"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />

          <Line
            type="monotone"
            dataKey="failures"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}