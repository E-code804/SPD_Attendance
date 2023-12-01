const path = require("path");
const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const { log } = require("console");
require("dotenv").config({
  path: path.resolve(__dirname, ".env"),
});

const app = express();
const port = 7002;
const uri = process.env.MONGO_CONNECTION_STRING;
const databaseAndCollection = {
  db: "SPD_Attendence",
  collection1: "attended",
  collection2: "missed",
};

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "templates"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const executeMongoOperation = async (name, attending, excuse) => {
  const client = new MongoClient(uri, {
    serverApi: ServerApiVersion.v1,
  });
  try {
    await client.connect();

    if (attending === "yes") {
      const brother = {
        name,
      };
      const result = await client
        .db(databaseAndCollection.db)
        .collection(databaseAndCollection.collection1)
        .insertOne(brother);
      // console.log(`Applicant entry created with id ${result.insertedId} in the ${databaseAndCollection.collection1} collection.`);
      return result;
    } else {
      const brother = {
        name,
        excuse,
      };
      const result = await client
        .db(databaseAndCollection.db)
        .collection(databaseAndCollection.collection2)
        .insertOne(brother);
      // console.log(`Applicant entry created with id ${result.insertedId} in the ${databaseAndCollection.collection2} collection.`);
      return result;
    }
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
};

app.get("/", (req, res) => {
  // console.log("HOME");
  res.render("index", { port });
});

app.post("/", async (req, res) => {
  const { name, attending, excuse } = req.body;
  // console.log("POST" + attending);
  await executeMongoOperation(name, attending, excuse);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Listen on port: ${port}`);
});
