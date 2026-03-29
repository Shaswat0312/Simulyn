import express from "express"
import logger from "./middlewares/logger.js"


const app = express()
app.use(express.json())
app.use(logger)

app.listen(8000,() => {
    console.log("Server Has Started Listening")
})