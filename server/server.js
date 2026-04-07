import express from "express"
import logger from "./middlewares/logger.js"
import simulationRouter from "./routes/simulation.route.js"
import dotenv from "dotenv"
import connectDB from "./db/db.js"
import http from 'http'
import { initSocket } from "./websocket/socketManager.js"
dotenv.config({})

const app = express()
const server = http.createServer(app)
app.use(express.json())
app.use(logger)
const PORT = 8000
app.use("/api/v1",simulationRouter)

initSocket(server)

connectDB().then(() => {
server.listen(PORT,() => {
    console.log("Server Connected SuccessFully")
})
})