const express = require('express');
const { MongoClient } = require('mongodb');
const bodyparser = require('body-parser');
const cors = require('cors');

// 1. Use Environment Variable for MongoDB URL
const url = process.env.MONGO_URI || 'mongodb://localhost:27017'; 
const client = new MongoClient(url);

const dbName = 'safeCredential';
const app = express();
const port = 5000; // Standardized to 5000 for your K8s service

app.use(cors());
app.use(bodyparser.json());

// Basic connection check
client.connect().then(() => console.log("Connected to MongoDB at", url));

// Health Check for Kubernetes Probes
app.get('/health', (req, res) => res.status(200).send("Backend is Healthy"));

// API Routes
app.get('/', async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.find({}).toArray();
    res.json(findResult);
});

app.post('/', async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.insertOne(req.body);
    res.send({ success: true, result: findResult });
});

app.delete('/', async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.deleteOne(req.body);
    res.send({ success: true, result: findResult });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Backend listening on port ${port}`);
});
