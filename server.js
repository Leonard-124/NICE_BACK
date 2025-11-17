import express from "express"
import { connectDB } from "./config/db.js"
import dotenv from "dotenv"
import cors from "cors"
import morgan from "morgan"
import jobRoute from "./routes/jobRoutes.js"
import applicationRoute from "./routes/applicationRoute.js"
import courseRoute from "./routes/CourseRoute.js"
import profileRoutes from "./routes/profileRoute.js"
import authRouter from "./routes/authRoutes.js"


dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use("/api/v1", jobRoute)
app.use("/api", applicationRoute)
app.use("/api/auth", authRouter)
app.use("/api/courses", courseRoute)
app.use("/api", profileRoutes);
console.log(profileRoutes)





const PORT = process.env.PORT || 3000

app.get("/", (req, res) =>{
    res.send("Hello this is NICETEA you can apply for jobs learn courses and get certified")
})

app.listen(PORT, () =>{
    connectDB()
    console.log(`Server running on http://localhost:${PORT}`)
})