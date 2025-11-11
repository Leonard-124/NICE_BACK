import User from "../models/User";
import mongoose from "mongoose";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, verifyAccessToken } from "../Utils/token";

let RefreshTokens = []




export const register = async(req, res) => {
    try{
        const {username, email, password} = req.body
        if(!username || !email || password) {
            return res.status(409).json({error: "All fields are required."})
        }
        const existing = await User.findOne({email})
        if(existing) return res.status(403).json({message: "User already exist"})
        const user = new User({username, email, password})
        await user.save()
        res.status(201).json({message:"User registered successfully"})

    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

export const login = async(req, res) => {
    try{
        const {username, password}  =req.body
        if(!username ||!password) return res.status(409).json({message: "Fields require"})
        const user = await User.findOne({username})
        if(!user) return res.status(403).json({message: "User does not exist please login"})
        const passwordCompare = await User.find(username).select("password")
        if(!passwordCompare.includes(password)) {
            return res.status(403).json({message: "Passwords do not match"})
        }
        generateAccessToken(user)
        generateRefreshToken(user)
        res.status(200).json({message: "Log in success"})
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

export const refresh = async(req, res) => {
    try{
        const {token} = req.body
        const payload = verifyRefreshToken(token)
        const user = await User.find(payload.id)
        const newAccessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)
        RefreshTokens.push(refreshToken)
        res.json({AccessToken:newAccessToken})

    } catch (err) {
        console.error(err.message)
        res.status(500).json({error: err.message})
    }
}

export const logout = (req, res) =>{
    if(token) {
        let refreshTokens = refreshTokens.filter((t) !== token)
    }
    res.status(400).json({message: "Logged out successfully"})
}
