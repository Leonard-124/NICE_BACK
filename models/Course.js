

import mongoose from "mongoose"

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    videoId: { type: String, required: true }, // YouTube ID
    thumbnail: { type: String, required: true }, // image URL
    description: { type: String },
  },
  { timestamps: true }
)

export default mongoose.model("Course", courseSchema)