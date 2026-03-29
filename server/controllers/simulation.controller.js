    import processSimulation from "../services/simulation.service.js"


    const runSimulation = async (req,res) => {
        try {
            const {apiUrl,failureRate,latency,concurrentUsers} = req.body
            const result = await processSimulation({apiUrl,failureRate,latency,concurrentUsers})
            return res.status(200).json({
                message:"Success",
                result,
                success : true
            })
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message })

        }
    }

    export default runSimulation