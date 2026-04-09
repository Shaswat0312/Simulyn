import Simulation from "../models/simulation.model.js"
import { broadcast } from "../websocket/socketManager.js"
import generateReport from "../ai/reportGenerator.js"

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
    const batchSize = 10
    let successCount = 0
    let failureCount = 0
    const start = Date.now()
   
    for (let i = 0; i < config.concurrentUsers; i += batchSize) {
            let requests = Array.from({length : batchSize},() => simulateRequest(config.apiUrl,config.failureRate,config.latency))
        let results = await Promise.allSettled(requests)
         results.forEach(res =>
         {
        if(res.status=='fulfilled')
            successCount++
        else 
            failureCount++

    })
    broadcast({ successCount, failureCount, status: 'running' }) 
    }


    const end = Date.now()
    const totalDuration = end - start
   
    const currentFailureRate = failureCount / (successCount + failureCount) * 100
    const avgResTime = config.latency
    let circuitBreakerEnabled = config.circuitBreakerEnabled
    const threshold = config.circuitBreakerThreshold
    let circuitBreaker = false
    if(circuitBreakerEnabled===true&&currentFailureRate>threshold){
        circuitBreaker = true
    }
   const updated =  await Simulation.findByIdAndUpdate(
       data._id,
       {successCount,failureCount,circuitBreakerTripped:circuitBreaker,averageResponseTime:avgResTime,status: "completed",totalDuration},{ new: true }
    )
    const report = await generateReport(updated)
    await Simulation.findByIdAndUpdate(
    data._id,
        { aiReport: report }
        )
    broadcast({ status: 'completed', successCount, failureCount, totalDuration, aiReport: report })
    console.log(`Updated Successfully ${updated._id}` )
    const finalResult = await Simulation.findById(data._id);
    return finalResult;
   
}
export default processSimulation