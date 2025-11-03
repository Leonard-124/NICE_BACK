import mongoose from "mongoose"
import Job from "../models/Job.js"


export const getjobs = async(req, res) =>{
    try{
        const jobs = await Job.find().sort({createdAt: -1});
        if(!jobs) {
            return res.status(404).json({message: "Jobs not found"})
        }
        res.status(200).json(jobs)

    } catch (err) {
        res.status(500).json({err: err.message})
    }
}

export const getOneJob = async(req, res) => {
    try{
        const {id} = req.params
        
         if(!mongoose.isValidObjectId(id)) {
            return res.status(400).json({message: "Incorrect job ID"})
        }
        const job = await Job.findById(id)
        if(!job) return res.status(404).json({message: "Job not found"})
        res.status(200).json(job)
        
    } catch (err) {
        res.status(500).json({err: err.message})
    }
}

export const createJob = async (req, res) => {
  try {
    const { title, description, available } = req.body;

    // Validate input
    if (!title || !description || available === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create and save job
    const job = new Job({ title, description, available });
    const savedJob = await job.save();

    // Success response
    res.status(201).json({ message: "Job created successfully", job: savedJob });
  } catch (err) {
    console.error("Error creating job:", err.message);
    res.status(500).json({ error: err.message });
  }
};


export const updateJob = async(req, res) => {
    try{
        const  {id} = req.params;
        if(!mongoose.isValidObjectId(id)) {
            return res.status(400).json({message: "ID is invalid"})
        }
        const updated = await Job.findByIdAndUpdate(id,req.body, {new:true, runValidators:true})
        if(!updated) {
            return res.status(404).json({message:"Jobs not updated"})
        }
        res.status(201).json({message:"Successful update", updated:updated})
        
    } catch(err) {
        res.status(500).json({err: err.message})
    }
}

export const deleteJob = async (req, res) => {
    try{
        
        if(!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({message:"Invalid Id format"})
        }
        const deleted = await Job.findByIdAndDelete(req.params.id)
        if(!deleted) return res.status(404).json({message:"Job to delete not found"})
        res.status(201).json({message:"Successfully deleted", deleted:deleted})

    } catch (err) {
        res.status(500).json({err: err.message})
    }
}



