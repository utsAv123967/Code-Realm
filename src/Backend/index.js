import express from "express";
import cors from "cors";
import { Buffer } from "buffer"; 
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check endpoint for Docker
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Backend is running" });
});

const RAPID_API_HOST = process.env.RAPID_API_HOST;
const RAPID_API_KEY = process.env.RAPID_API_KEY;

console.log("API Host:", RAPID_API_HOST);
console.log("API Key:", RAPID_API_KEY ? "Loaded" : "Not loaded");

app.post("/api/compile", async (req, res) => {
  const { language_id, source_code } = req.body;

  try {
    const encodedSourceCode = Buffer.from(source_code).toString("base64");

    const submissionResponse = await fetch(
      `https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=false&fields=*`,
      {
        method: "POST",
        body: JSON.stringify({
          language_id,
          source_code: encodedSourceCode,
          stdin: Buffer.from("1").toString("base64"), // encode stdin too
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
