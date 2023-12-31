const express = require("express");
const { MongoClient, ServerApiVersion,ObjectId } = require("mongodb");
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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Database connected".yellow.italic);
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
  }
}
run().catch(console.dir);

const database = client.db("foodPanda");
const Product = database.collection("products");
const User = database.collection("users");

//endpoint
app.post("/product", async (req, res) => {
  try {
    const result = await Product.insertOne(req.body);

    if (result.insertedId) {
      res.send({
        success: true,
        message: `Successfully created the ${req.body.name} with id ${result.insertedId}`,
      });
    } else {
      res.send({
        success: false,
        error: "Couldn't create the product",
      });
    }
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.get("/product", async (req, res) => {
  try {
    const cursor = Product.find({});
    const products = await cursor.toArray();
    res.send({
      success: true,
      message: "Successfully got the data",
      data: products,
    });
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.delete("/product/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findOne({ _id: new ObjectId(id) });

    if (!product?._id) {
      res.send({
        success: false,
        error: "Product doesn't exist",
      });
      return;
    }

    const result = await Product.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount) {
      res.send({
        success: true,
        message: `Successfully deleted the ${product.name}`,
      });
    } else {
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.get("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ _id: new ObjectId(id) });

    res.send({
      success: true,
      data: product,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.patch("/product/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Product.updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );

    if (result.matchedCount) {
      res.send({
        success: true,
        message: `successfully updated ${req.body.name}`,
      });
    } else {
      res.send({
        success: false,
        error: "Couldn't update  the product",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.send("Now Server is running");
});

app.listen(port, () => {
  console.log("server is running", port);
});
