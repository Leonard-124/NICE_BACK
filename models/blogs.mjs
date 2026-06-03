import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js"


const blogschema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: new Date
    },
    author: {
        type: String,
        required: true,
    },
    paragraph1: {
        type: String,
        required: true
    },
    paragraph2: {
        type: String,
        required: true
    },
    image1Url: {
        type: String,
        required: true
    },
    image1publicId: {
        type: String,
        required: true
    }
}, {timestamps: true})

export default mongoose.model("blogs", blogschema)