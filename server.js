const express = require('express');
const { OpenAI } = require('openai');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Initialize OpenAI with error handling
if (!process.env.OPENAI_API_KEY) {
  console.error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors({
  origin: ['https://egshiglen.xyz', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'Server is running!',
    message: 'Egshiglen AI Backend is live'
  });
});

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    console.log('Processing message:', message);
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `[Your existing system prompt here]`
        },
        { role: 'user', content: message },
      ],
    });

    console.log('OpenAI response received');
    res.json({ reply: response.choices[0].message.content });
    
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ 
      error: 'API Error',
      message: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
