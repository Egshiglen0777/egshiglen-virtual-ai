const express = require('express');
const { OpenAI } = require('openai');
const cors = require('cors'); // Add this line

const app = express();
const port = process.env.PORT || 3000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Enable CORS
app.use(cors({
  origin: 'https://egshiglen.xyz', // Allow requests from your frontend
  methods: ['GET', 'POST'], // Allow only GET and POST requests
  credentials: true, // Allow cookies and credentials
}));

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
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
