const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");

// middlewares
const corsOption = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://green-link-website.netlify.app",
  ],
  credentials: true,
};
app.use(cors(corsOption));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("green link server is running");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jxshq.mongodb.net/?appName=Cluster0`;

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
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
    const userCollection = client.db("green-link-db").collection("users");

    //// storing user to db

    // getting single  user data

    app.get("/user/:email", async (req, res) => {
      const email = req?.params?.email;
      const query = { email };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    app.post("/store-user-info", async (req, res) => {
      const newUser = req.body;
      const email = newUser?.email;
      const query = { email };
      const isExist = await userCollection.findOne(query);
      if (isExist) {
        return res.send({ message: "This user already exist" });
      }
      if (req?.query?.role) {
        newUser.role = "volunteer";
      }
      newUser.createdAt = new Date().toISOString();
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Green-Link server is running on port ${port}`);
});
