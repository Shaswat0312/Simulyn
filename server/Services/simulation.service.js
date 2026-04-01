import Simulation from "../models/simulation.model.js"
const sleep = (ms) => new Promise(resolve => setTimeout(resolve,ms))

const simulateRequest = async (url, failureRate, latency) => {
  await sleep(latency)
  const shouldFail = Math.random() < failureRate / 100
  if (shouldFail)
     throw new Error("Simulated failure")

  return { success: true, responseTime: latency }
}

const processSimulation = async (config) => 
{
    const data = await Simulation.create(config)
   let updatedmid = await Simulation.findByIdAndUpdate(
       data._id,
       {status: "running"},{ new: true }
    )
    const start = Date.now()
    // console.log(updatedmid)
    const promise = Array.from({length:config.concurrentUsers},() => simulateRequest(config.apiUrl,config.failureRate,config.latency))
    const result = await Promise.allSettled(promise)
    const end = Date.now()
    let successCount = 0
    let failureCount = 0
    const totalDuration = end - start
    result.forEach(res =>
         {
        if(res.status=='fulfilled')
            successCount++
        else 
            failureCount++

    })

    const avgResTime = config.latency

   const updated =  await Simulation.findByIdAndUpdate(
       data._id,
       {successCount,failureCount,averageResponseTime:avgResTime,status: "completed",totalDuration},{ new: true }
    )

    console.log(`Updated Successfully ${updated._id}` )
    return updated

}
export default processSimulation