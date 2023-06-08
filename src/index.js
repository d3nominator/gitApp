const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use("/static", express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const { default: mongoose, mongo } = require("mongoose");
const fs = require("fs");
app.use(express.json());
const multer = require("multer");
app.set("view engine", "hbs");
const path = require("path");
const hbs = require("hbs");
const tempelatePath = path.join(__dirname, "../tempelates");
const TextFile = require("../Models/FileModel");
app.use(express.static(path.join(__dirname, "public")));
app.set("views", tempelatePath);
require("dotenv").config();

(function (d) {
  var mL = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var mS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  d.prototype.getLongMonth = d.getLongMonth = function getLongMonth(inMonth) {
    return gM.call(this, inMonth, mL);
  };

  d.prototype.getShortMonth = d.getShortMonth = function getShortMonth(
    inMonth
  ) {
    return gM.call(this, inMonth, mS);
  };

  function gM(inMonth, arr) {
    var m;

    if (this instanceof d) {
      m = this.getMonth();
    } else if (typeof inMonth !== "undefined") {
      m = parseInt(inMonth, 10) - 1; // Subtract 1 to start January at zero
    }

    return arr[m];
  }
})(Date);

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

app.get("/about-me", (req, res) => {
  res.render("about-me", { layout: "../tempelates/layout/main" });
});

app.get("/search", (req, res) => {
  res.render("search", { layout: "../tempelates/layout/main" });
});

app.post("/search", async (req, res) => {
  try {
    const searchElements = req.body.search.split(",");
    let arr = [];
    for (let i = 0; i < searchElements.length; i++) {
      searchElements[i] = searchElements[i].trim();
      const data = await TextFile.find({
        FileTags: { $in: [searchElements[i]] },
      }).limit(10);
      for (let Filenow of data) {
        if (Filenow.content != undefined) {
          const timestamp = Filenow.createdAt;
          const date = new Date(timestamp);
          const monthId = date.getShortMonth(); // Month is zero-based, so we add 1 to get the correct value
          const month = date.getShortMonth(monthId); // Month is zero-based, so we add 1 to get the correct value
          const day = date.getDate();
          const year = date.getFullYear();
          Filenow.dateMonth = month;
          Filenow.dateDate = day;
          Filenow.dateYear = year;
          arr.push(Filenow);
        }
      }
    }
    res.render("all", {
      layout: "../tempelates/layout/main",
      arr: arr,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/all", async (req, res) => {
  try {
    const data = await TextFile.find().limit(5);
    let arr = [];
    let dateDate = "";
    let dateMonth = "";
    let dateYear = "";
    for (let Filenow of data) {
      const date = new Date(Filenow.createdAt);
      dateDate = date.getDate();
      dateMonth = date.getShortMonth();
      dateYear = date.getFullYear();
      if (Filenow.content != undefined) {
        Filenow.dateDate = dateDate;
        Filenow.dateMonth = dateMonth;
        Filenow.dateYear = dateYear;
        arr.push(Filenow);
      }
    }
    res.render("all", {
      layout: "../tempelates/layout/main",
      arr: arr,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
  let tagData = req.body.tags;
  let tagArray = tagData.split(",");
  const fileExtension = req.file.filename.split(".").pop();
  tagArray.push(fileExtension);
  console.log(originalFileName, savedFilename, filepath);

  fs.readFile(filepath, "utf8", async (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to read file" });
    } else {
      console.log(data);
      await TextFile.create({
        content: data,
        UploadedFileName: originalFileName,
        FileTags: tagArray,
      });
      let Filedata = "";
      Filedata += data;
      const toRender = data;
      res.render("uploaded", {
        layout: "../tempelates/layout/main",
        messages: toRender,
        Filename: req.file.originalname,
      });
    }
  });

  fs.unlink(filepath, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
});

app.get("/login", (req, res) => {
  res.render("login", { layout: "../tempelates/layout/main" });
});

app.get("/signup", (req, res) => {
  res.render("signup", { layout: "../tempelates/layout/main" });
});
