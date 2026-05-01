import express from "express"
import {
  runSimulation,
  getSimulations,
  getSimulationById,
  compareSimulations
} from "../controllers/simulation.controller.js"

const router = express.Router()

router.post("/simulate", runSimulation)

router.get("/simulations", getSimulations)
router.get("/simulations/compare", compareSimulations)
router.get("/simulations/:id", getSimulationById)

export default router