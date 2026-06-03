import { resolve } from "node:dns";
import feedback from "../models/feedback.mjs";
import newsletter from "../models/newsletter.mjs";
import mongoose from "mongoose";


export const createfeedback = async(req, res) => {
    try{
        if(!message) {
            return res.status(403).json({error: "Message is required"})
        }
        const {message, email} = req.body;
        const create = new feedback({message, email})
        await create.save();
        res.status(201).json(create)

    } catch (err) {
        console.error(err)
    }
}

export const createnews = async(req, res) => {
    const create = await new Promise(resolve, reject);
    create.then(() => {
        const {email} = req.body
        const email = new newsletter({email})
        await email.save()
    }).catch(() => {
        console.error
    })
}


export const getFeedback = async(req, res) => {
    const get = await feedback.find().sort({createdAt: -1})
    res.json(get)
}

const getnews = async( req, res) => {
    const get = (await newsletter.find()).sort({createdAt: -1})
    res.json(get)
}

export const deleteFeedback = async(req, res) => {
    const { id } = req.params;
    const getId = await feedback.findById(id)
    await getId.deleteOne()
    res.status(201).json({message: "deleted successfully"})
}

export const deleteemail = async(req, res) => {
    const { id } = req.params;
    const erase = await newsletter.findByIdAndDelete(id)

}