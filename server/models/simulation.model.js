import mongoose from "mongoose";

const simulationSchema = new mongoose.Schema({
    apiUrl:{
        type:String,
        required:true
    },
    failureRate:{
        type:Number,
        required:true
    },
    latency:{
        type:Number,
        required:true
    },
    concurrentUsers : {
        type:Number,
        required:true
    } ,
    status : {
        type:String,
        enum:["pending","running","completed","failed"],
        default:"pending"
    },
    successCount : {
        type:Number,
        default:0
    },
    failureCount : {
        type:Number,
        default:0
    },
    totalDuration : {
        type:Number,
        default:0
    },
    averageResponseTime : {
        type:Number,
        default:0
    },
    aiReport : {
        type:String,
        default:null
    }
    


},{timestamps:true})

const simulation = mongoose.model("simulation",simulationSchema)

export default simulation