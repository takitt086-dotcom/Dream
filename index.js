import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(bodyParser.json());

// API لتفسير الأحلام
app.post("/api/interpret", async (req, res) => {
  const { dream } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "أنت مفسر أحلام خبير. أعطي تفسيرا مبسطا وواضحا." },
          { role: "user", content: dream }
        ],
      }),
    });

    const data = await response.json();
    res.json({ interpretation: data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "فشل في تفسير الحلم" });
  }
});

// ضروري لـ Vercel
export default app;
