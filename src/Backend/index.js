import express from "express";
import cors from "cors";
import { Buffer } from "buffer"; 
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const RAPID_API_HOST = process.env.RAPID_API_HOST;
const RAPID_API_KEY = process.env.RAPID_API_KEY;

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
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        "x-rapidapi-key": "9b27719d4cmsh5915198cc606d84p1c8390jsn5f177d1582dc",
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
