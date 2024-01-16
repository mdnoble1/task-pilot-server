const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.crviidq.mongodb.net/?retryWrites=true&w=majority`;

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

    
    
    
    // database collection
    const taskCollection = client.db("taskPilotDb").collection("tasks");

    
    
    
    // get all tasks from database
    app.get("/tasks", async ( req, res ) => {
      const email = req.query.user_email;

      // Creating an empty query object
      let query = {};

      // Checking for "user_email"
      if (email) {
        query.user_email = email;
      }

      const result = await taskCollection.find(query).toArray();
      res.send(result);
    });



    // adding a new task in database 
    app.post("/tasks", async ( req, res ) => {
      const task = req.body;
      const result = await taskCollection.insertOne(task);
      res.send(result);
    })  


    // updating task status using patch method 
    app.patch('/tasks/:id', async(req, res) => {
      const id = req.params.id;
      const status = req.body;
      console.log(id, status)
      const filter = {_id: new ObjectId(id)};
      
      const updateDoc = {
        $set: {
          status: `${status}`
        }
      }
      const result = await taskCollection.updateOne(filter, updateDoc);
      res.send(result);
    })

    // deleting a task from database 
    app.delete("/tasks/:id", async ( req, res ) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    })







    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Task Pilot Server Is Running");
});

app.listen(port, () => {
  console.log(`Task Pilot Is Running On Port: ${port}`);
});
