import express from "express";
import cors from "cors";
import { Buffer } from "buffer"; 
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const RAPID_API_HOST = process.env.RAPID_API_HOST;
const RAPID_API_KEY = process.env.RAPID_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

console.log("API Host:", RAPID_API_HOST);
console.log("API Key:", RAPID_API_KEY ? "Loaded" : "Not loaded");
console.log("Gemini API Key:", GEMINI_API_KEY ? "Loaded" : "Not loaded");

// Initialize Gemini Client
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// Debug: List available models on startup
if (GEMINI_API_KEY) {
  (async () => {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`);
      const data = await response.json();
      const models = data.models?.map(m => m.name.replace('models/', '')) || [];
      console.log("Available Gemini Models:", models.join(", "));
    } catch (error) {
      console.error("Failed to list models:", error.message);
    }
  })();
}

app.post("/api/compile", async (req, res) => {
  const { language_id, source_code, stdin } = req.body;

  try {
    const encodedSourceCode = Buffer.from(source_code).toString("base64");
    const encodedStdin = stdin ? Buffer.from(stdin).toString("base64") : "";

    const submissionResponse = await fetch(
      `https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=false&fields=*`,
      {
        method: "POST",
        body: JSON.stringify({
          language_id,
          source_code: encodedSourceCode,
          stdin: encodedStdin,
        }),
        headers: {
          "content-type": "application/json",
          "x-rapidapi-host": RAPID_API_HOST,
          "x-rapidapi-key": RAPID_API_KEY,
        },
      }
    );

    const submissionData = await submissionResponse.json();
    const token = submissionData.token;
    console.log("Submission Token:", token);

    
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const resultURL = `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=true`;
    const outputResponse = await fetch(resultURL, {
      method: "GET",
      headers: {
        "x-rapidapi-host": RAPID_API_HOST,
        "x-rapidapi-key": RAPID_API_KEY,
      },
    });

    const outputData = await outputResponse.json();

    // Decode base64 outputs if present
    const decode = (str) => str ? Buffer.from(str, "base64").toString("utf-8") : null;

    res.json({
      stdout: decode(outputData.stdout),
      stderr: decode(outputData.stderr),
      compile_output: decode(outputData.compile_output),
      status: outputData.status,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Compilation failed." });
  }
});

// Gemini AI Chat Endpoint
app.post("/api/chat", async (req, res) => {
  const { message, includeCode, code, language } = req.body;

  if (!genAI) {
    return res.status(500).json({ error: "Gemini API key not configured" });
  }

  try {
    // Attempt to use the requested model, fallback to a generally available one if needed
    // Using gemini-2.0-flash as it is more stable than experimental previews
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let prompt = message;
    
    // If code context is included, add it to the prompt in a natural way
    if (includeCode && code) {
      prompt = `I'm working on a ${language || "programming"} project. Here is my current code:

--- START OF CODE ---
${code}
--- END OF CODE ---

My question: ${message}

Please provide your response with code suggestions formatted using triple backticks with the language identifier (e.g., \`\`\`javascript) when including code examples.`;
    } else {
      // For regular questions without code, add instruction for code formatting
      prompt = `${message}

If you include any code examples in your response, please format them using triple backticks with the language identifier (e.g., \`\`\`javascript).`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = response.text();

    console.log("✅ AI Response generated successfully");

    res.json({
      response: aiResponse,
      timestamp: new Date().toISOString(),
    });

  } catch (err) {
    console.error("❌ Chat error:", err.message);
    console.error("Stack:", err.stack);
    // Handle blocked content or other specific API errors
    if (err.message.includes("SAFETY")) {
        return res.status(400).json({ error: "Response blocked due to safety settings." });
    }
    res.status(500).json({ error: "Failed to process chat request: " + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
