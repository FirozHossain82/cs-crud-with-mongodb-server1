const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("colors");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.Port || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yezzss9.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("foodPanda");
    const Product = database.collection("products");
    const User = database.collection("users");

    //endpoint
    app.get("/product", async (req, res) => {
      const result = await Product.insertOne(req.body);
      if (result.insertedId) {
        res.send({
          success: true,
          message: `Successfully created the ${req.body.name} with id ${result.insertedId}`,
        });
      }else{
        res.send({
            success:false,
            error:"Couldn't create the product"
        })
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Database connected".yellow.italic);
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Now Server is running");
});

app.listen(port, () => {
  console.log("server is running", port);
});
