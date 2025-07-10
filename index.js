const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors"); // 👈 NEW LINE
const app = express();

require("dotenv").config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.use(express.json());

app.post("/chatgpt", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "No prompt provided" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }]
      })
    });

const data = await response.json();
console.log("OpenAI raw response:", data); // 👈 This will show us exactly what OpenAI said

if (data.choices && data.choices[0]) {
  res.json({ reply: data.choices[0].message.content });
} else {
  res.status(500).json({ error: data.error || "No response from OpenAI" });
}
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch from OpenAI" });
  }
});

app.get("/", (req, res) => {
  res.send("ChatGPT backend is running.");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
