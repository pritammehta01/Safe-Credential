const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

// Environment variables
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const PORT = 5000;
const DB_NAME = 'safeCredential';

const app = express();
const client = new MongoClient(MONGO_URI);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB once
client.connect()
  .then(() => console.log('Connected to MongoDB at', MONGO_URI))
  .catch(err => {
    console.error('MongoDB connection failed', err);
    process.exit(1);
  });

// Root endpoint for GKE LB health check
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

// Health check (for GKE probes)
app.get('/health', (req, res) => {
  res.status(200).send('Backend is Healthy');
});

// ---------------- API ROUTES ----------------

// GET all passwords
app.get('/api', async (req, res) => {
  try {
    const db = client.db(DB_NAME);
    const collection = db.collection('passwords');
    const passwords = await collection.find({}).toArray();
    res.json(passwords);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch passwords' });
  }
});

// CREATE password
app.post('/api', async (req, res) => {
  try {
    const db = client.db(DB_NAME);
    const collection = db.collection('passwords');
    const result = await collection.insertOne(req.body);
    res.json({ success: true, result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save password' });
  }
});

// DELETE password
app.delete('/api', async (req, res) => {
  try {
    const { id } = req.body;
    const db = client.db(DB_NAME);
    const collection = db.collection('passwords');
    const result = await collection.deleteOne({ id });
    res.json({ success: true, result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete password' });
  }
});

// ------------------------------------------------

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on port ${PORT}`);
});
