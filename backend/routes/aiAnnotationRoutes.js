import express from "express";
import Groq from "groq-sdk";
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post("/ai-annotation", async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });
    res.json({ annotation: chatCompletion.choices[0]?.message?.content || "" });
  } catch (err) {
    res.status(500).json({ error: "Failed to get AI annotation" });
  }
});

export default router;