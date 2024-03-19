const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors());

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, { useNewUrlParser: true });

const products = [
  { name: 'productA', price: 20 },
  { name: 'productB', price: 30 },
  { name: 'productC', price: 25 },
  { name: 'productD', price: 40 },
  { name: 'productE', price: 15 }
];

async function createCollection() {
  try {
    await client.connect();
    const db = client.db();
    const collectionExists = await db.listCollections({ name: 'products' }).hasNext();

    if (!collectionExists) {
      const result = await db.collection('products').insertMany(products);
      console.log('Collection created:', result);
    } else {
      console.log('Collection already exists, skipping creation.');
    }
  } catch (err) {
    console.error('Error creating collection:', err);
  } finally {
    await client.close();
  }
}

createCollection();

app.get('/products', (req, res) => {
  res.json(products);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

