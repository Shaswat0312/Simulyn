import { useEffect, useState } from "react"

export const useWebSocket = (simulationId) => {
  const [history, setHistory] = useState([])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!simulationId) return

    let socket
    let retryTimeout

    const connect = () => {
      socket = new WebSocket("ws://localhost:8000")

      socket.onopen = () => {
        console.log("WS Connected")
        setConnected(true)
      }

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data)

        if (data.simulationId !== simulationId) return

        setHistory(prev => {
          const lastBatch = prev[prev.length - 1]?.batch

          if (lastBatch === data.batch) return prev

          return [
            ...prev,
            {
              batch: data.batch,
              success: data.successCount,
              failures: data.failureCount
            }
          ]
        })
      }

      socket.onclose = () => {
        console.log("WS Closed")
        setConnected(false)

        retryTimeout = setTimeout(() => {
          connect()
        }, 2000)
      }

      socket.onerror = (err) => {
        console.error("WS Error", err)
      }
    }

    connect()

    return () => {
      if (socket) socket.close()
      if (retryTimeout) clearTimeout(retryTimeout)
    }
  }, [simulationId])

  return { history, connected }
}