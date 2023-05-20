const express = require("express");
const date = require("date-and-time");
const bodyParser = require("body-parser");
const env = require("dotenv");
const app = express();
app.use("/static", express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const { default: mongoose, mongo } = require("mongoose");
const Product = require("../Models/ProductModels");
app.use(express.json());
require("dotenv").config();

const port = process.env.PORT;
const mongodbURL = process.env.mongodbUrl;

// mongoose.set("strictQuery",false);
mongoose
  .connect(mongodbURL)
  .then(() => {
    console.log("Connected to mongodb");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.listen(port || process.env.port, () => {
  console.log(`server running on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.post("/product", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    console.log(req.body);
    res.status(200).json(product);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
});

app.get("/products", async (req, res) => {
  try {
    const product = await Product.find({});
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/show", (req, res) => {
  res.status(200);
  res.send("Showing All the file uploaded to the databse");
});

app.get("/upload", (req, res) => {
  res.status(404).json({ message: "Not found" });
  // res.send("Hello");
});
