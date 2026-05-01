import Simulation from "../models/simulation.model.js"
import { broadcast } from "../websocket/socketManager.js"

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const simulateRequest = async (url, failureRate, latency) => {
  await sleep(latency)
  const shouldFail = Math.random() < failureRate / 100

  if (shouldFail) throw new Error("Simulated failure")

  return { success: true, responseTime: latency }
}

const processSimulation = async (simulation, config) => {

  await Simulation.findByIdAndUpdate(
    simulation._id,
    { status: "running" },
    { returnDocument: "after" }
  )

  const batchSize = 10
  let successCount = 0
  let failureCount = 0
  let totalResponseTime = 0
  let totalRequests = 0
  let batch = 0

  const start = Date.now()

  try {
    for (let i = 0; i < config.concurrentUsers; i += batchSize) {
      batch++

      const currentBatchSize = Math.min(
        batchSize,
        config.concurrentUsers - i
      )

      const requests = Array.from(
        { length: currentBatchSize },
        () =>
          simulateRequest(
            config.apiUrl,
            config.failureRate,
            config.latency
          )
      )

      const results = await Promise.allSettled(requests)

     results.forEach(res => {
  if (res.status === "fulfilled") successCount++
  else failureCount++
})

await Simulation.findByIdAndUpdate(
  simulation._id,
  {
    $push: {
      history: {
        batch,
        successCount,
        failureCount
      }
    }
  }
)

broadcast({
  simulationId: simulation._id.toString(),
  batch,
  successCount,
  failureCount,
  status: "running"
})
    }

    const end = Date.now()
    const totalDuration = end - start

    const currentFailureRate =
      (failureCount / (successCount + failureCount)) * 100

    const circuitBreaker =
      config.circuitBreakerEnabled &&
      currentFailureRate > config.circuitBreakerThreshold

    const averageResponseTime =
      totalRequests > 0 ? totalResponseTime / totalRequests : 0

    const updated = await Simulation.findByIdAndUpdate(
      simulation._id,
      {
        successCount,
        failureCount,
        circuitBreakerTripped: circuitBreaker,
        averageResponseTime,
        status: "completed",
        totalDuration
      },
      { returnDocument: "after" }
    )

    broadcast({
      simulationId: simulation._id.toString(),
      batch,
      successCount,
      failureCount,
      status: "completed",
      totalDuration
    })

    return updated

  } catch (err) {

    await Simulation.findByIdAndUpdate(
      simulation._id,
      { status: "failed" }
    )

    broadcast({
      simulationId: simulation._id.toString(),
      batch,
      successCount,
      failureCount,
      status: "failed"
    })

    throw err
  }
}

export default processSimulation