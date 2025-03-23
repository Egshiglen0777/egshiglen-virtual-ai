const express = require('express');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Check if API key exists
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ Missing OPENAI_API_KEY. Make sure it's set in Railway.");
  process.exit(1);
}

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware to parse JSON
app.use(express.json());

// Chat endpoint
app.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are Egshiglen Lkhagvatseden, a 30-year-old economist, data analyst, and blockchain developer. Answer questions as if you are Egshiglen, using the provided information.',
        },
        { role: 'user', content: message },
      ],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("❌ OpenAI Error:", error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
