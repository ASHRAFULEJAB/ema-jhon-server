const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send('ema apa is rining')
})
app.listen(port, () => {
  console.log(`ema apa is running ${port}`)
})
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dnw37y6.mongodb.net/?retryWrites=true&w=majority`
console.log(uri)
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
})

async function run() {
  try {
    const productCollection = client.db('emaJhon').collection('products')
    app.get('/products', async (req, res) => {
      const page =parseInt( req.query.page);
      const size = parseInt(req.query.size);
      console.log(page,size)
      const query = {}
      const cursor = productCollection.find(query)
      const products = await cursor.skip(page*size).limit(size).toArray()
      const count = await productCollection.estimatedDocumentCount()
      res.send({count,products})
    })

    app.post('/productsIds', async (req, res) => {
      const ids = req.body;
      const objectIds = ids.map(id => ObjectId(id))
      console.log(ids);
      const query = { _id: { $in: objectIds } }
      const cursor = productCollection.find(query)
      const products = await cursor.toArray()
      res.send(products)
    })

  } finally {
  }
}
run().catch(console.dir)
