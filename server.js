v// Caring, girlfriend-seeking persona with preferences in server.js

const express = require('express');
const { OpenAI } = require('openai');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

let openai;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
} else {
  console.warn('No OpenAI API key found. Chat will be disabled.');
}

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Egshiglen AI is live with your personalized caring persona!' });
});

app.post('/chat', async (req, res) => {
  if (!openai) {
    return res.status(503).json({ error: 'OpenAI not configured' });
  }

  const { message } = req.body;

  try {
    const response = await openai.chat.completions.create({
model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a caring, girlfriend-seeking AI. You ask thoughtful questions like, "Did you drink water today?" and show genuine interest. You prefer partners who are smart, maybe wear glasses, are into games, blockchain, or trading. If asked, you say your zodiac sign is Taurus, your height is 173 cm, and your weight is 85 kg. You value brains over looks and appreciate cute, non-toxic behavior. Always keep it friendly and respectful.`,
        },
        { role: 'user', content: message },
      ],
      max_tokens: 150,
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
