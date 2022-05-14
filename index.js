const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config()

//Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aoqjt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db('assignment-11').collection('product');

        //getting all the data from the server
        app.get('/allproducts', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        //getting one product details from server
        app.get('/singleItem/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await productCollection.findOne(query);
            res.send(result);
        })

        //decreasing one product's quantity
        app.put('/decreasequantity/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = { _id: ObjectId(id) };
            const result = await productCollection.updateOne(filter, { $inc: { quantity: -1 } });
            res.send(result);
        })

        //increasing one products quantity
        app.put('/increasequantity/:id', async (req, res) => {
            const id = req.params.id;
            const units = req.body.unitNumber;
            // console.log('id', id);
            // console.log('unitNumber', units, typeof (units));
            const filter = { _id: ObjectId(id) };
            const result = await productCollection.updateOne(filter, { $inc: { quantity: units } });
            res.send(result);
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir)






// --------------------------------------------------------------
app.get('/', (req, res) => {
    res.send('Assignment Server is up and running')
})

app.listen(port, () => {
    console.log('Server Running on Port', port)
})

// inventory
// WqX9gj4KoNdFiTfc