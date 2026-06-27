
import mongoose from "mongoose"

const jobSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
   description:{
        type:String,
        required: true
    },
    available:{
        type:Boolean,
        required: true
    },
    contractType: {
        type:String,
        enum: ["remote" || "onSite" || "Hybrid"],
        required: true
    },
    salary: {
        type: String
    },
    period: {
        type: String
    }
},{timestamps:true})

export default mongoose.model("Job", jobSchema)