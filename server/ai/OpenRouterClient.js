import fetch from "node-fetch";
import dotenv from "dotenv"
dotenv.config({})
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY missing");
}

const MODELS = [
  "openchat/openchat-3.5-0106:free",
  "meta-llama/llama-3-8b-instruct:free",
  "deepseek/deepseek-chat:free",
  "nousresearch/nous-capybara-7b:free",
  "mistralai/mistral-7b-instruct:free"
];

export const generateAIResponse = async (prompt) => {
  let lastError = null;

  for (let model of MODELS) {
    try {
      console.log(`Trying model: ${model}`);

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:8000",
          "X-Title": "Simulyn"
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: "You are an API resilience expert." },
            { role: "user", content: prompt }
          ]
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Model failed");
      }

      console.log(`✅ Success with model: ${model}`);
      return data.choices[0].message.content;

    } catch (err) {
      console.log(`❌ Model failed: ${model}`);
      lastError = err;
    }
  }

  throw new Error(`All models failed. Last error: ${lastError?.message}`);
};