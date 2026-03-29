
const runSimulation = async (req,res) => {
    try {
        const {apiUrl,failureRate,latency,concurrentUsers} = req.body
        return res.status(200).json({
            message:"Success",
            success : true
        })
    } catch (error) {
          return res.status(500).json({ success: false, message: error.message })

    }
}

export default runSimulation