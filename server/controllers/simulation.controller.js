import Simulation from "../models/simulation.model.js"
import processSimulation from "../services/simulation.service.js"

const runSimulation = async (req, res) => {
  try {
    const {
      apiUrl,
      failureRate,
      latency,
      concurrentUsers,
      circuitBreakerEnabled,
      circuitBreakerThreshold
    } = req.body

    const simulation = await Simulation.create({
      apiUrl,
      failureRate,
      latency,
      concurrentUsers,
      circuitBreakerEnabled,
      circuitBreakerThreshold,
      status: "pending"
    })

    processSimulation(simulation, req.body).catch(async (err) => {
      await Simulation.findByIdAndUpdate(simulation._id, {
        status: "failed"
      })
      console.error("Simulation process error:", err.message)
    })

    return res.status(202).json({
      success: true,
      message: "Simulation started",
      result: simulation
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const getSimulations = async (req, res) => {
  try {
    const sims = await Simulation.find().sort({ createdAt: -1 })
    res.json({ result: sims })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const getSimulationById = async (req, res) => {
  try {
    const sim = await Simulation.findById(req.params.id)
    if (!sim) return res.status(404).json({ message: "Simulation not found" })
    res.json(sim)
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const compareSimulations = async (req, res) => {
  try {
    const { a, b } = req.query

    if (!a || !b) {
      return res.status(400).json({
        success: false,
        message: "Two simulation IDs required as query params: ?a=id1&b=id2"
      })
    }

    const [simA, simB] = await Promise.all([
      Simulation.findById(a),
      Simulation.findById(b)
    ])

    if (!simA || !simB) {
      return res.status(404).json({
        success: false,
        message: "One or both simulations not found"
      })
    }

    return res.json({
      success: true,
      result: { simA, simB }
    })

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

export { runSimulation, getSimulations, getSimulationById, compareSimulations }