const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;


app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vbrru.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri)
async function run() {
      try {
            await client.connect();
            // console.log('i am connected');
            const database = client.db("tour");
            const offerCollection = database.collection("offers");
            const orderCollection = database.collection('orders')

            // get multiple document
            app.get('/offers', async (req, res) => {
                  const cursor = offerCollection.find({});
                  const result = await cursor.toArray();
                  res.send(result)
            })
            // // get single item  
            app.get('/offers/:id', async (req, res) => {
                  const id = req.params.id
                  const query = { _id: ObjectId(id) }
                  const result = await offerCollection.findOne(query);
                  res.send(result)
            })
            // // insert a document 
            app.post('/offers', async (req, res) => {
                  const offer = req.body
                  const result = await offerCollection.insertOne(offer)
                  res.json(result)
            })

            // insert single item 
            app.post('/orders', async (req, res) => {
                  const order = req.body;
                  const result = await orderCollection.insertOne(order)
                  res.json(result)
            })
            //get multiple order
            app.get('/orders', async (req, res) => {
                  const cursor = orderCollection.find({});
                  const result = await cursor.toArray();
                  res.send(result)
            })
            //update
            app.get('/orders/:id', async (req, res) => {
                  const id = req.params.id;
                  const query = { _id: ObjectId(id) };
                  const newQuery = { $set: { status: 'approved' } }
                  const result = await orderCollection.updateOne(query, newQuery);
                  console.log('load user with id :', id)
                  res.json(result)
            })

            //delete
            app.delete('/orders/:id', async (req, res) => {
                  const id = req.params.id;
                  const query = { _id: ObjectId(id) };
                  const result = await orderCollection.deleteOne(query);
                  console.log("deleting user with id", result);
                  res.json(result)
            })
      } finally {
            //   await client.close();
      }
}
run().catch(console.dir);
app.get('/', (req, res) => {
      res.send('i am js')
})
app.listen(port, () => {
      console.log('addressing at the port', port)
})