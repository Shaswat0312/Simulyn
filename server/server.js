import express from "express"
import logger from "./middlewares/logger.js"
import simulationRouter from "./routes/simulation.route.js"
import dotenv from "dotenv"
import connectDB from "./db/db.js"
dotenv.config({})

const app = express()
app.use(express.json())
app.use(logger)
const PORT = 8000
app.use("/api/v1",simulationRouter)

connectDB().then(() => {
app.listen(PORT,() => {
    console.log(`Server Has Started Listening at ${PORT}` )
})
})




