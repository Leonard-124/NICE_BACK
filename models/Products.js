import mongoose from "mongoose"


const productSchema = new mongoose.Schema({
    name:{type: String, required: true},
    description:{type: String, required: true},
    category:{type: String, required: true},
    quantity:{type: Number, required: true},
    oldPrice:{type: Number, required: true},
    newPrice:{type: Number, required: true},
    imageUrl:{type: String, required: true},
    publicId:{type: String, required: true}
},{timestamps: true})

export default mongoose.model("Product", productSchema)