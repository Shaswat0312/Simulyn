import dotenv from "dotenv"
dotenv.config({})

import express from "express"
import logger from "./middlewares/logger.js"
import simulationRouter from "./routes/simulation.route.js"
import connectDB from "./db/db.js"
import http from "http"
import { initSocket } from "./websocket/socketManager.js"
import cors from "cors"

const app = express()
const server = http.createServer(app)

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}))

app.use(express.json())
app.use(logger)

const PORT = process.env.PORT || 8000

app.use("/api/v1", simulationRouter)

connectDB().then(() => {

  initSocket(server)

  server.listen(PORT, () => {
    console.log(`Server Connected Successfully on port ${PORT}`)
  })

}).catch((err) => {
  console.error("DB Connection Failed:", err.message)
  process.exit(1)
})