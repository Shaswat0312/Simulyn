import Simulation from "../models/simulation.model.js"


const processSimulation = async (config) => {
    const data = await Simulation.create(config)
    return data

} 


export default processSimulation