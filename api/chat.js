import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export default async function (req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: "Missing message" });
  try {
    const prompt = `Você é um assistente empático e acolhedor. Responda com empatia e sugira 1 exercício prático curto. Usuário disse: ${message}`;
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: "Você é um assistente de saúde mental empático." }, { role: "user", content: prompt }],
      max_tokens: 500,
    });
    const reply = completion.choices?.[0]?.message?.content || "Desculpe, não consigo responder agora.";
    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OpenAI error", detail: String(err) });
  }
}
