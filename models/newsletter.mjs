import mongoose from "mongoose"
import { stringify } from "node:querystring"

const newsletterSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    }
},{timestamps: true})

export default mongoose.model("newsletter", newsletterSchema);