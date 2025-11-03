
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
    }
},{timestamps:true})

export default mongoose.model("Job", jobSchema)