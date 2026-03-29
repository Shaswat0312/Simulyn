import express from "express"
import runSimulation from "../controllers/simulation.controller.js"
const router = express.Router()

router.route("/simulate").post(runSimulation)


export default router