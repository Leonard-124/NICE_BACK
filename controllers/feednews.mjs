import feedback from "../models/feedback.mjs";
import newsletter from "../models/newsletter.mjs";

// Create Feedback
export const createFeedback = async (req, res) => {
  try {
    const { message, email } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const newFeedback = new feedback({ message, email });
    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Create Newsletter Subscription
export const createNews = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const newSubscription = new newsletter({ email });
    await newSubscription.save();
    res.status(201).json(newSubscription);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get Feedback
export const getFeedback = async (req, res) => {
  try {
    const feedbacks = await feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get Newsletter Subscriptions
export const getNews = async (req, res) => {
  try {
    const subscriptions = await newsletter.find().sort({ createdAt: -1 });
    res.json(subscriptions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete Feedback
export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const feedbackDoc = await feedback.findById(id);

    if (!feedbackDoc) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    await feedbackDoc.deleteOne();
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete Newsletter Subscription
export const deleteEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await newsletter.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Email not found" });
    }

    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
