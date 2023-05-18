const express = require("express");
const date = require("date-and-time");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();
// app.use(express)
app.use("/static", express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = 3000;
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

app.use((req, res, next) => {
  const now = new Date();
  const timeNow = date.format(now, "ZZ, hh:mm:ss, ddd, MMM DD YYYY");
  console.log(timeNow);
  next();
});

app.get("/", morgan("tiny"), (req, res) => {
  const reqBody = req.body;
  console.log(reqBody);
  res.send("Hello world");
});

app.get("/show", morgan("tiny"), (req, res) => {
  res.send("Showing All the file uploaded to the databse");
});

app.get("/upload", morgan("tiny"), (req, res) => {
  console.log(req.body);
  res.send("Hello");
});
