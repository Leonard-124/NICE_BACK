
import mongoose from "mongoose"

const feedbackSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    email: {
        type: String
    }
}, {timestamps: true})

export default mongoose.model("feedback", feedbackSchema);