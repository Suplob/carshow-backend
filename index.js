require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");

app.use(express.json());
app.use(cors());

app.post("/login", (req, res) => {
  const username = req.body.userName;
  const user = { name: username };

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken: accessToken });
});

function authenticateToken(req, res, next) {}

const uri = `mongodb+srv://Porbo:12345@cluster0.dsdfh.mongodb.net/?retryWrites=true&w=majority`;

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

    const usersCollection = client.db("carshow").collection("users");
    const carsCollection = client.db("carshow").collection("cars");

    await client.db("admin").command({ ping: 1 });

    //get methods

    app.get("/cars", async (req, res) => {
      const result = await carsCollection.find({}).toArray();
      res.json(result);
    });

    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const result = await usersCollection.find({ email: email }).toArray();
      res.json(result);
    });

    //post methods
    app.post("/registerUser", async (req, res) => {
      const result = await usersCollection.insertOne(req.body);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(PORT, () => {
  console.log("listening to", PORT);
});
