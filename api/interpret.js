import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { dream } = req.body;

    if (!dream) {
      return res.status(400).json({ error: "Please provide a dream text" });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "أنت مفسر أحلام. استقبل حلم المستخدم وأعطه تفسيراً مختصراً وواضحاً بالعربية.",
        },
        { role: "user", content: dream },
      ],
    });

    const interpretation =
      completion.choices[0]?.message?.content ||
      "لم أتمكن من تفسير هذا الحلم.";

    return res.status(200).json({ interpretation });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
