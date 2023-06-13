if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
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
const tempelatePath = path.join(__dirname, "../tempelates");
const TextFile = require("../Models/FileModel");
const { User } = require("../Models/Users");
app.use(express.static(path.join(__dirname, "public")));
app.set("views", tempelatePath);
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const expressSession = require("express-session");

const {
  initializingPassport,
  ensureAuthenticated,
  ensureNotAuthenticated,
} = require("./passport-config.js");

initializingPassport(passport);

let months = [
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

app.use(methodOverride("_method"));

const port = process.env.PORT;
app.listen(port || process.env.port, () => {
  console.log(`server running on port ${port}`);
});
const mongodbURL = process.env.mongodbUrl;
const connectDb = async () =>
  await mongoose
    .connect(mongodbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Connected to mongodb");
    })
    .catch((err) => {
      console.log(err.message);
    });

connectDb();

app.get("/about-me", (req, res) => {
  res.render("about-me", { layout: "../tempelates/layout/main" });
});

app.get("/search", ensureAuthenticated, (req, res) => {
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
        const date = new Date(Filenow.createdAt);
        dateDate = date.getDate();
        dateMonth = date.getMonth();
        dateYear = date.getFullYear();
        Filenow.dateDate = dateDate;
        Filenow.dateMonth = months[dateMonth];
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

app.get("/all", ensureAuthenticated, async (req, res) => {
  try {
    const data = await TextFile.find().limit(5);
    let arr = [];
    for (let Filenow of data) {
      console.log(Filenow.createdAt);
      const date = new Date(Filenow.createdAt);
      dateDate = date.getDate();
      dateMonth = date.getMonth();
      dateYear = date.getFullYear();
      Filenow.dateDate = dateDate;
      Filenow.dateMonth = months[dateMonth];
      Filenow.dateYear = dateYear;
      arr.push(Filenow);
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
    // console.log(path.extname(file.originalname));
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    ); // Specify the filename
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
      // console.log(data);
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
        messages: toRender.trim(),
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

app.get("/login", ensureNotAuthenticated, (req, res) => {
  res.render("login", { layout: "../tempelates/layout/main"});
});

app.use(
  expressSession({
    cookie: { maxAge: 60000 },
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
  })
);

app.get("/signup", ensureNotAuthenticated, (req, res) => {
  res.render("signup", { layout: "../tempelates/layout/main" });
});

app.post("/signup", async (req, res) => {
  let { strname, username, password, email } = req.body;
  console.log(req.body);
  bcrypt.hash(password, 10, async function (err, hash) {
    try {
      password = hash;
      const user = await User.create({
        strname,
        username,
        password,
        email,
      });
      console.log(user);
      res.redirect("/login");
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: error.message });
    }
  });
});

// app.get("/logout", ensureNotAuthenticated ,(req, res) => {
//   req.logout();
//   res.redirect("/");
// });

app.get("/profile", ensureAuthenticated, (req, res) => {
  res.render("profile", { layout: "../tempelates/layout/main" });
});

app.get("/", (req, res) => {
  res.render("home-before-login", { layout: "../tempelates/layout/main" });
});

app.get("/home", ensureAuthenticated, (req, res) => {
  res.render("home-after-login", { layout: "../tempelates/layout/main" });
});

app.delete("/logout", ensureNotAuthenticated, (req, res) => {
  req.logout();
  res.redirect("/login");
});

