const express = require('express');
const { OpenAI } = require('openai');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Initialize OpenAI with better error handling
let openai;
try {
  if (!process.env.OPENAI_API_KEY) {
    console.warn('OPENAI_API_KEY not found, server will start but chat will fail');
  }
  
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} catch (error) {
  console.warn('OpenAI initialization warning:', error.message);
}

// Enhanced CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://egshiglen.xyz',
      'http://egshiglen.xyz',
      'https://www.egshiglen.xyz',
      'http://www.egshiglen.xyz',
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Also allow Railway domains dynamically
      if (origin.includes('.up.railway.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight requests
app.options('*', cors());

// Middleware to parse JSON
app.use(express.json());

// Enhanced root endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: '🚀 Egshiglen AI Server is running!',
    message: 'Welcome to Egshiglen virtual AI assistant',
    timestamp: new Date().toISOString(),
    domain: req.get('host'),
    openai_configured: !!process.env.OPENAI_API_KEY
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    server: 'Egshiglen AI Backend',
    time: new Date().toISOString()
  });
});

// Chat endpoint with enhanced error handling
app.post('/chat', async (req, res) => {
  // Check if OpenAI is configured
  if (!process.env.OPENAI_API_KEY || !openai) {
    return res.status(503).json({ 
      error: 'Service temporarily unavailable',
      message: 'OpenAI API key is not configured. Please add OPENAI_API_KEY environment variable.'
    });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ 
      error: 'Message is required',
      message: 'Please provide a message in the request body'
    });
  }

  if (typeof message !== 'string') {
    return res.status(400).json({ 
      error: 'Invalid message format',
      message: 'Message must be a string'
    });
  }

  try {
    console.log('🤖 Processing message:', message.substring(0, 100));
    
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
      max_tokens: 500,
      temperature: 0.7,
    });

    console.log('✅ OpenAI response received');
    
    res.json({ 
      reply: response.choices[0].message.content,
      usage: response.usage
    });
    
  } catch (error) {
    console.error('❌ OpenAI API Error:', error);
    
    // More specific error handling
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({ 
        error: 'API quota exceeded',
        message: 'OpenAI API quota has been exceeded. Please check your billing.'
      });
    } else if (error.code === 'invalid_api_key') {
      return res.status(401).json({ 
        error: 'Invalid API key',
        message: 'The provided OpenAI API key is invalid.'
      });
    }
    
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message || 'Something went wrong with the OpenAI API'
    });
  }
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The route ${req.originalUrl} does not exist on this server`
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('🔥 Global error handler:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred'
  });
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`📍 Health check: http://localhost:${port}/health`);
  console.log(`🤖 Chat endpoint: http://localhost:${port}/chat`);
  console.log(`🔑 OpenAI configured: ${!!process.env.OPENAI_API_KEY}`);
});

module.exports = app;
