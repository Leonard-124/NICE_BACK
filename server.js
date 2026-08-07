import express from "express"
import { connectDB } from "./config/db.js"
import dotenv from "dotenv"
import cors from "cors"
import morgan from "morgan"
import helmet from "helmet"
import session from "express-session"
import jobRoute from "./routes/jobRoutes.js"
import applicationRoute from "./routes/applicationRoute.js"
import courseRoute from "./routes/CourseRoute.js"
import profileRoutes from "./routes/profileRoute.js"
import authRouter from "./routes/authRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import resend from "./routes/resend.js"
import feednewRoute from "./routes/feednewRoute.js"

import passport from "./config/passport.js"
import aouthRoute from "./routes/oauth20Route.cjs"
import errorHandler from "./middlewares/errorhandler.js"

import "./instrument.js"
import * as Sentry from "@sentry/node"
import { rateLimit } from "express-rate-limit";


dotenv.config()

const app = express()
Sentry.setupExpressErrorHandler(app)//

const isProduction = process.env.NODE_ENV === 'production'

app.use(helmet())

app.use(cors())
app.use(morgan(isProduction ? 'combined' : 'dev'))
app.use(express.json())

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false
  })
)

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: isProduction,
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 14 * 24 * 60 * 60 * 1000,
    },
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.use("/auth", aouthRoute)
app.use(errorHandler)

app.use("/api/v1", jobRoute)
app.use("/api", applicationRoute)
app.use("/api/auth", authRouter)
app.use("/api/courses", courseRoute)
app.use("/api", profileRoutes);
app.use("/api/admin", adminRoutes); // NEW: Admin routes
app.use("/", resend)
app.use("/api", feednewRoute);


const PORT = process.env.PORT || 3000



app.get("/", function rootHandler(req, res) {
  res.end("Welcome to Ibonnis company server!");
});



app.get("/debug-sentry", function mainHandler(req, res) { //sentry error-handler
  throw new Error("My first Sentry error!");
});

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

app.listen(PORT, () =>{
    connectDB()
    console.log(`Server running on http://localhost:${PORT}`)
})