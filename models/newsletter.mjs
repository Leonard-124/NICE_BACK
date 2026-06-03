import mongoose from "mongoose"
import { stringify } from "node:querystring"

const newsletterSchema = new mongoose.Schema({
    email: {
        type: string,
        required: true
    }
},{timestamps: true})

export default mongoose.model("newsletter", newsletterSchema);