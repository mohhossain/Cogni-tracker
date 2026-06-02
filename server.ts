import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

app.use(express.json());

app.post("/api/insights", async (req, res) => {
  try {
    const { logs, profile } = req.body;
    
    if (!logs || !Array.isArray(logs) || logs.length === 0) {
      return res.status(400).json({ error: "No logs provided for analysis." });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `You are a psychological habit tracker and cognitive behavior specialist. 
      Analyze the following user logs which include positive/negative actions, roadblocks, and feelings.
      You also have access to the user's foundational profile, which outlines their macro goals and friction points.

      --- THE CONTRACT (USER PROFILE) ---
      ${profile ? JSON.stringify(profile, null, 2) : "No profile provided."}
      
      --- THE LOGS (DAILY ACTIVITY) ---
      ${JSON.stringify(logs)}

      Identify correlations between their daily actions and their foundational profile. Are they successfully building the habits they wanted? Are they falling prey to the friction points they identified? 
      Base your insights precisely on how their recent behavior moves them closer to or further from "The Mission".
      Provide 2-3 personalized, actionable insights that anticipate friction and offer preemptive guidance specifically aligned with destroying their negative habits and building their target habits.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A punchy, 1-sentence summary of current progress. Max 15 words."
            },
            correlations: {
              type: Type.ARRAY,
              description: "Identified patterns linking feelings/roadblocks to actions.",
              items: {
                type: Type.OBJECT,
                properties: {
                  factorA: { type: Type.STRING, description: "Trigger (e.g. 'Late Night')" },
                  factorB: { type: Type.STRING, description: "Action (e.g. 'Doomscrolling')" },
                  insight: { type: Type.STRING, description: "A highly concise 1-sentence explanation. Max 10 words." }
                },
                required: ["factorA", "factorB", "insight"]
              }
            },
            preemptiveGuidance: {
              type: Type.ARRAY,
              description: "Actionable, psychological strategies.",
              items: {
                type: Type.STRING,
                description: "Short, punchy directive. Max 10 words."
              }
            }
          },
          required: ["summary", "correlations", "preemptiveGuidance"]
        }
      }
    });

    const text = response.text;
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Gemini API Error:", error.message);
    res.status(500).json({ error: error.message || "Failed to generate insights" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
