
import express from "express"
import upload from "../config/multer.js"
import cloudinary from "../config/cloudinary.js"
import Application from "../models/Application.js"
import router from "./jobRoutes.js"
import fs from "fs"

router.post("/apply", upload.single("resume"), async (req, res) => {
    try{
        const {jobType, fullName, email, linkedin, portfolio, message} = req.body
        if(!jobType || !fullName || !email || !req.file) {
            return res.status(400).json({message: "Missing required fields"})
        }
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            folder: "resume"
        })
        fs.unlinkSync(req.file.path);

        const application = new Application({
            jobType,
            fullName,
            email,
            linkedin,
            portfolio,
            message,
            resumeUrl: uploadResult.secure_url,
        });

        const saved = await application.save();
        res.status(201).json({message: "Application submitted successfully", data: saved})
    } catch (err) {
        res.status(500).json({error: err.message});
    }
})


router.get("/applications", async(req, res) => {
    try{
        const applications = await Application.find().sort({createdAt: -1})
    res.status(200).json(applications)
    } catch (err) {
        res.status(500).json({error: err.message});
    }
    
})

router.get("/applications/:id", async (req, res)=> {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found" });
    res.status(200).json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/applications/:id", upload.single("resume"), async(req, res) => {
    try{
        const {jobType, fullName, email, linkedin, portfolio, message} = req.body;

        let updatedFields = {jobType, fullName, email, linkedin, portfolio, message};

        if(req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: "resume",
            });
            fs.unlinkSync(req.file.path);
            updatedFields.resumeUrl = uploadResult.secure_url;
        }

        const updated = await Application.findByIdAndUpdate(req.params.id, updatedFields, {new: true, runValidators: true})

        if(!updated) return res.status(404).json({message: "Application not found"})
    } catch (err) {
        res.status(500).json({error: err.message})
    }
});


router.delete("/applications/:id", async (req, res) => {
  try {
    const deleted = await Application.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Application not found" });

    res.status(200).json({ message: "Application deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;