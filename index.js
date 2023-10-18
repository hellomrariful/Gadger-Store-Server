const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())


// mongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c6bvskv.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const productsCollection = client.db('productsDB').collection('products')


    // read data
    app.get('/products', async (req, res) => {
      const cursor = productsCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })


    // Get a product by ID
    app.get('/products/id/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });

    // Get products by brand
    app.get('/products/brand/:brand', async (req, res) => {
      const brand = req.params.brand;
      const filter = { brand: brand };
      const result = await productsCollection.find(filter).toArray();
      res.send(result);
    });



    // Create Product data
    app.post('/products', async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product)
      res.send(result)
    })




    // carts database
    const cartProductsCollection = client.db('productsDB').collection('carts')


    // post
    app.post('/cartProducts', async(req, res) =>{
      const product = req.body;
      const result = await cartProductsCollection.insertOne(product)
      res.send(result)
    })

     // get
     app.get('/cartProducts', async (req, res) => {
      const cursor = cartProductsCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



// testing
app.get('/', (req, res) => {
  res.send('Server is running')
})

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
})