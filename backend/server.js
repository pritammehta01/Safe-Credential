const express = require('express')
const dotenv=require('dotenv').config()
const bodyparser = require('body-parser');
const { MongoClient } = require('mongodb');
const cors = require('cors')

//const url = 'mongodb://root:password123@mongo-service:27017';  //this is for kubernetes
const url = 'mongodb://mongodb:27017'; //this for docker-compose
const client = new MongoClient(url);

console.log(process.env.Mongo_URI) 
//data base
const dbName='safeCredential'
const app = express()
const port = 3000
app.use(cors())
app.use(bodyparser.json())
client.connect()

app.get('/',async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection('passwords');
  const findResult = await collection.find({}).toArray();
  res.json(findResult)
})
app.post('/',async (req, res) => {
    const password=req.body
  const db = client.db(dbName);
  const collection = db.collection('passwords');
  const findResult = await collection.insertOne(password);
  res.send({success:true, result:findResult})
})
app.delete('/',async (req, res) => {
    const password=req.body
  const db = client.db(dbName);
  const collection = db.collection('passwords');
  const findResult = await collection.deleteOne(password);
  res.send({success:true, result:findResult})
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}/`)
})
