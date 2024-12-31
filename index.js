const express = require('express');
const cors = require('cors');
const { extractLatestEmail } = require('./emailExtractor');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.post('/api/extract-email', (req, res) => {
  try {
    const { html } = req.body;
    
    if (!html) {
      return res.status(400).json({ 
        error: 'Missing required field: html' 
      });
    }

    const extractedContent = extractLatestEmail(html);
    res.json({ content: extractedContent });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to process email content',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});