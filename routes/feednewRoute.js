import express from "express"
import { 
    createFeedback,
    createNews, 
    getFeedback, 
    getNews, 
    deleteFeedback, 
    deleteEmail } from "../controllers/feednews.mjs"
const router = express.Router();


router.get("/news", getNews);
router.get("/feedback", getFeedback);
router.post("/news", createNews);
router.post("/feedback", createFeedback);
router.delete("/feedback", deleteFeedback);
router.delete("/news", deleteEmail);

export default router;