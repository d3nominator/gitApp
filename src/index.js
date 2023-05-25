const express = require("express");
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

const hbs = require("hbs");

const tempelatePath = path.join(__dirname, "../tempelates");
const partialsPath = path.join(__dirname, "../tempelates/partials");
const TextFile = require("../Models/FileModel");
app.set("views", tempelatePath);
require("dotenv").config();
hbs.registerPartials(partialsPath);

const port = process.env.PORT;

const mongodbURL = process.env.mongodbUrl;
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
  res.render("home", { layout: "../tempelates/layout/main" });
});

app.get("/home", (req, res) => {
  const messages = "<pre>Hellow\n Rishahbh </pre>";
  res.render("home", {
    layout: "../tempelates/layout/main",
  });
});

app.get("/about-me", (req, res) => {
  res.render("about-me");
});

app.get("/all", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await TextFile.find();
    let tempdata = "";
    for (Filenow of data) {
      tempdata += filenow;
      console.log(Filenow.content);
    }
    
    res.status(200).json({ Hi: "hi" });
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

app.get("/show", async (req, res) => {
  try {
    const codeFiles = await TextFile.find({});
    console.log(codeFiles.content);
    let all = "";
    for (dataField of codeFiles) {
      // console.log(dataField.content);
      if (dataField.content !== undefined) all += dataField.content;
    }
    const toRender = "<div><pre><code>" + all + "</code></pre></div>";
    res.render("home", {
      layout: "../tempelates/layout/main",
      messages: toRender,
    });
    // res.status(200).json({ message: "found data successfully" });
  } catch (error) {
    res.status(500).json({ messages: error.message });
  }
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

app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    res.status(400).send("No file Upload");
    return;
  }
  const originalFileName = req.file.originalname;
  const savedFilename = req.file.filename;
  const filepath = req.file.path;
  let Filedata = "";
  console.log(originalFileName, savedFilename, filepath);

  fs.readFile(filepath, "utf8", async (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to read file" });
    } else {
      const writeFile = await TextFile.create({ content: data });
      console.log("Data inserted successfully:", writeFile.insertedId);
      Filedata += data;
      const toRender = "<pre>" + data + "</pre>";
      res.render("uploaded", {
        layout: "../tempelates/layout/main",
        messages: toRender,
        Filename: req.file.originalname,
      });
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
    res.status(400).json({ message: error.message });
  }
});

app.get("/newFile", (req, res) => {
  res.render("newFile");
});
