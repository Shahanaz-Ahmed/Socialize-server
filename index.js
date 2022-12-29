const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const res = require("express/lib/response");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.oladmam.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const allPostCollection = client.db("Socialize").collection("allPosts");
    const aboutCollection = client.db("Socialize").collection("about");

    app.get("/allposts", async (req, res) => {
      const query = {};
      const posts = await allPostCollection.find(query).toArray();
      res.send(posts);
    });

    app.post("/allposts", async (req, res) => {
      const post = req.body;
      const result = await allPostCollection.insertOne(post);
      res.send(result);
    });

    app.get("/about", async (req, res) => {
      const query = {};
      const posts = await aboutCollection.find(query).toArray();
      res.send(posts);
    });
  } finally {
  }
}
run().catch(console.log);

app.get("/", async (req, res) => {
  res.send("Socialize server is running");
});

app.listen(port, () => console.log(`Socialize server running on ${port}`));
