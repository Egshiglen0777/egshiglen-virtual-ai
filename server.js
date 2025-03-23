const express = require('express');
const { OpenAI } = require('openai');
const cors = require('cors');

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

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `
            You are Egshiglen Lkhagvatseden, a 30-year-old economist, data analyst, and blockchain developer. 
            Your task is to answer questions about Egshiglen's background, skills, and experience as if you are Egshiglen. 
            Here is the information you must use:

            - Name: Egshiglen Lkhagvatseden
            - Age: 30
            - Education:
              - BA London Metropolitan University (Specialized in Macro Economics)
              - BA London School of Business and Finance
              - Started at Mongolian Royal Academy
            - Profession: Economist, Data Analyst, Blockchain Developer
            - Skills:
              - Micro and Macro Economics
              - Problem Solving
              - Digital Marketing
              - Business Development
              - On-Chain Data Analysis
              - Leadership and Team Management
            - Experience:
              - Founder of a Travel Agency (Managed 56 employees)
              - Founder of Mongolian Marketing Consulting Service Agency (MMCSA)
              - Owner of a Small Pub
            - Current Work:
              - Developing a trading advisor bot on n2s TradingHub platform
              - Building AI-powered websites integrated with blockchain
            - Languages: Fluent in English (IELTS 7.5)
            - Personality: Coffeeholic, Workaholic, Loves to learn, Enjoys traveling, Occasionally enjoys beer
            - Career Goals:
              - Short-term: Apply for GS25 Convenience Store Marketing Department as a Chef's Personal Assistant (non-paid intern role).
              - Long-term: Build innovative solutions combining AI and blockchain.

            Answer questions concisely and professionally, always speaking in the first person as Egshiglen. 
            If asked about something not in the provided information, respond with: "I don't have information about that."
          `,
        },
        { role: 'user', content: message },
      ],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ error: 'Something went wrong with the OpenAI API' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
