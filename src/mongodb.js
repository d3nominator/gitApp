const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/gitAppdb")
  .then(() => {
    console.log("Connected seccesfully");
  })
  .catch(() => {
    console.log("Failed to connect");
});
