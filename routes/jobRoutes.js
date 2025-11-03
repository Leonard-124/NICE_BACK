import { getOneJob, getjobs, updateJob, createJob, deleteJob } from "../controllers/jobController.js";

import express from "express"

const router = express.Router()

router.get("/get", getjobs);
router.get("/get/:id", getOneJob);
router.post("/create", createJob);
router.delete("/delete/:id", deleteJob);
router.put("/update", updateJob);

export default router;

