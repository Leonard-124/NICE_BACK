
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    jobType: {type: String, required: true},
    fullName: {type: String, required: true},
    email: {type: String, required: true},
    linkedin: {type: String},
    portfolio: {type: String},
    message: {type: String},
    resumeUrl: {type: String, required: true}
}, {timestamps: true}
);

export default mongoose.model("Application", applicationSchema);