
import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()


export const connectDB = async()=> {
   try{
    if(!process.env.MONGO_URI) {
        throw new Error("Mongo URI not defined in environment variable");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB connected ${conn.connection.host}/${conn.connection.name}`)
   } catch (err) {
    console.log("Mongoose error", err.message)
    process.exit(1)
   }
}



