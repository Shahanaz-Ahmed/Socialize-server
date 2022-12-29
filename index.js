const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    // const likeCollection = client.db("Socialize").collection("likes");

    // app.post("/likes/:id", async (req, res) => {
    //   const post = req.body;
    //   const result = await likeCollection.insertOne(post);
    //   res.send(result);
    // });

    // app.get("/likes/:id", async (req, res) => {
    //   const query = {};
    //   const posts = await likeCollection.find(query).toArray();
    //   res.send(posts);
    // });

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

    app.get("/allposts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await allPostCollection.findOne(query);
      res.send(result);
    });

    //allpost count update
    app.put("/allposts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const post = req.body;
      const option = { upsert: true };
      const updatedDoc = {
        $set: {
          totalCount: post.count,
        },
      };
      const result = await allPostCollection.updateOne(
        query,
        updatedDoc,
        option
      );
      res.send(result);
      // console.log(post);
    });

    //about section
    app.get("/about/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await aboutCollection.findOne(query);
      res.send(result);
    });

    //about section update
    app.put("/about/:id", async (req, res) => {
      const id = req.params.id;
      const name = req.body.name;
      const email = req.body.email;
      const university = req.body.university;
      const address = req.body.address;
      const query = { _id: ObjectId(id) };
      const updatedDoc = {
        $set: {
          name: name,
          email: email,
          university: university,
          address: address,
        },
      };
      const result = await aboutCollection.updateOne(query, updatedDoc);
      res.send(result);
    });

    //sorting post get 3top liked post
    app.get("/allposts", async (req, res) => {
      // console.log(req.query.totalCount);
      let query = {};
      if (req.query.totalCount) {
        query = {
          count: req.query.count,
        };
      }
      const cursor = allPostCollection.find(query).sort({ _id: -1 });
      const posts = await cursor.toArray();
      console.log(posts);
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
