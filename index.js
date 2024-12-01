// Import required libraries
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();

// MongoDB schema for storing code
const codeSchema = new mongoose.Schema({
  topic: String,
  code: String,
});
const Code = mongoose.model('Code', codeSchema);

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(bodyParser.json()); // Parse incoming request bodies as JSON

// Connect to MongoDB (replace with your MongoDB URI)
mongoose.connect('mongodb://localhost:27017/code-sharing', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected!');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Route to get all codes
app.get('/codes', async (req, res) => {
  try {
    const codes = await Code.find();
    res.json(codes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching codes' });
  }
});

// Route to add a new code
app.post('/codes', async (req, res) => {
  const { topic, code } = req.body;
  try {
    const newCode = new Code({ topic, code });
    await newCode.save();
    res.status(201).json(newCode);
  } catch (error) {
    res.status(500).json({ message: 'Error saving code' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
