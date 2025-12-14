import mongoose from "mongoose"

const refreshtokenSchema = new mongoose.Schema({
    token:{
        type: String,
        required: true
    }
}, {timestamps: true})

export default mongoose.model("refreshtoken", refreshtokenSchema)