import express from "express"
import Course from "../models/Course.js"

const router = express.Router()

// ✅ GET all courses
router.get("/", async (_req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 })
    res.json(courses)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch courses" })
  }
})

// ✅ POST create new course
router.post("/", async (req, res) => {
  try {
    const { title, videoId, thumbnail, description } = req.body
    if (!title || !videoId || !thumbnail) {
      return res.status(400).json({ error: "Title, videoId, and thumbnail are required" })
    }

    const newCourse = new Course({ title, videoId, thumbnail, description })
    await newCourse.save()
    res.status(201).json(newCourse)
  } catch (err) {
    res.status(500).json({ error: "Failed to create course" })
  }
})

// ✅ PUT update course by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    const updatedCourse = await Course.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })

    if (!updatedCourse) {
      return res.status(404).json({ error: "Course not found" })
    }

    res.json(updatedCourse)
  } catch (err) {
    res.status(500).json({ error: "Failed to update course" })
  }
})

// ✅ DELETE course by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const deletedCourse = await Course.findByIdAndDelete(id)

    if (!deletedCourse) {
      return res.status(404).json({ error: "Course not found" })
    }

    res.json({ message: "Course deleted successfully" })
  } catch (err) {
    res.status(500).json({ error: "Failed to delete course" })
  }
})

export default router