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
const fs = require("fs");
app.use(express.json());
const multer = require("multer");
app.set("view engine", "hbs");
const path = require("path");
const tempelatePath = path.join(__dirname, "../tempelates");
const TextFile = require("../Models/FileModel");
app.set("views", tempelatePath);
require("dotenv").config();
const hbs = require("hbs");

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
  // res.send("Home Page");
  const message = "Rishabh Kumar Pandey";
  res.render("home", { message });
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the destination folder
  },
  filename: (req, file, cb) => {
    console.log(req.method);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".cpp"); // Specify the filename
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("file") , async (req, res) => {
  if (!req.file) {
    res.status(400).send("No file Upload");
    return;
  }

  const originalFileName = req.file.originalname;
  const savedFilename = req.file.filename;
  const filepath = req.file.path;
  let Filedata = "";

  fs.readFile(filepath, "utf8", async (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to read file" });
    } else {
      // Send the file contents as the response
      // console.log(Filedata);
      const writeFile = await TextFile.create({ content: data });
      // console.log(writeFile);
      console.log("Data inserted successfully:", writeFile.insertedId);
      Filedata += data;
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Content-Disposition", 'attachment; filename="data.txt"');
      res.status(200).send(data);
      console.log(data);
    }
  });
});

app.get("/upload/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const FileText = await TextFile.findById(id);
    res.send("Hellow");
    console.log("Found successfully");
    console.log(FileText.content);
  } catch (error) {
    res.status(400).json({message : error.message});
  }
});

app.get("/file/:id", async (req, res) => {});
