import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY not found in .env");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function listModels() {
    try {
        console.log("Listing available models...");
        // Not all models are listed via this simple method in SDK sometimes, but let's try assuming standard API.
        // Actually, the SDK doesn't expose listModels directly on the main class easily in some versions, 
        // but let's try to just check if `gemini-pro` works or `gemini-1.5-flash` works by running a small generation.

        // But wait, the error message literally said "Call ListModels to see the list of available models".
        // The REST API has a list models endpoint. The SDK uses it internally or I might need to make a raw request.
        
        // Let's try to just run a raw fetch to list models to be sure what the API sees as valid.
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`);
        const data = await response.json();
        
        if (data.models) {
            console.log("Available models:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                     console.log(`- ${m.name} (${m.displayName})`);
                }
            });
        } else {
            console.log("No models found or error:", data);
        }

    } catch (e) {
        console.error("Error listing models:", e);
    }
}

listModels();
