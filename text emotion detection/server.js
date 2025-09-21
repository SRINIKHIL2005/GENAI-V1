import express from "express";
import cors from "cors";
import { VertexAI } from "@google-cloud/vertexai";
import dotenv from "dotenv";
import path from "path";

// Load .env
dotenv.config({ path: path.resolve("../.env") });

console.log("Loaded Project ID:", process.env.PROJECT_ID);
console.log("Loaded Location:", process.env.LOCATION);
console.log("Using Service Account:", process.env.GOOGLE_APPLICATION_CREDENTIALS);

const app = express();
app.use(cors());
app.use(express.json());

// Vertex AI client
const vertexAI = new VertexAI({
  project: process.env.PROJECT_ID,
  location: process.env.LOCATION,
});

// Generative chat model
const model = vertexAI.preview.getGenerativeModel({
  model: "chat-bison@001",
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: message }] }],
      systemInstruction: {
        role: "system",
        parts: [{
          text: "You are Saathi, a supportive mental wellness companion. Be empathetic, positive, and culturally sensitive."
        }],
      },
    });

    res.json({
      reply: response.response.candidates[0].content.parts[0].text,
    });
  } catch (err) {
    console.error("Vertex AI Error:", err);
    res.status(500).json({ error: "Something went wrong", details: err.message });
  }
});

// Start server
app.listen(5000, () => console.log("🚀 Saathi chatbot running on http://localhost:5000"));
