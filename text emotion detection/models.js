import express from "express";
import cors from "cors";
import { VertexAI } from "@google-cloud/vertexai";
import language from "@google-cloud/language";
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

// Initialize Google Cloud clients
const vertexAI = new VertexAI({
  project: process.env.PROJECT_ID,
  location: process.env.LOCATION,
});

const nlp = new language.LanguageServiceClient();

// ⚡ Replace with a Gemini model your project has access to
const model = vertexAI.preview.getGenerativeModel({
  model: "text-bison@001", // stable public chat model
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // 1️⃣ Sentiment analysis
    const [result] = await nlp.analyzeSentiment({
      document: { content: message, type: "PLAIN_TEXT" },
    });
    const sentiment = result.documentSentiment?.score || 0;

    // 2️⃣ Crisis detection
    const crisis = sentiment < -0.6 || /suicide|kill myself|end it/i.test(message);

    // 3️⃣ Gemini chat response
    const response = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: message }] }],
      systemInstruction: {
        role: "system",
        parts: [{
          text: `You are Saathi, a supportive mental wellness companion. Be empathetic, positive, and culturally sensitive. User sentiment: ${sentiment > 0 ? "positive" : sentiment < 0 ? "negative" : "neutral"}.`
        }],
      },
    });

    res.json({
      reply: response.response.candidates[0].content.parts[0].text,
      sentiment,
      crisis,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Something went wrong", details: err.message });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Saathi chatbot running on http://localhost:${PORT}`));
