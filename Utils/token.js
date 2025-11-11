import dotenv from "dotenv"
import jwt from "jsonwebtoken"

dotenv.config()

const ACCESS_TOKEN = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN = process.env.REFRESH_TOKEN_SECRET


export const generateAccessToken = (user) => {
    return jwt.sign({id:user.id, username:user.username}, ACCESS_TOKEN, {expiresIn:"45s"})
}

export const generateRefreshToken = (user) => {
    return jwt.sign({id:user.id}, REFRESH_TOKEN, {expiresIn:"20m"})
}

export const verifyAccessToken = (token) => {
    return jwt.verify(token, ACCESS_TOKEN)
}

export const verifyRefreshToken = (token) => {
    return jwt.verify(token, REFRESH_TOKEN)
}