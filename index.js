const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(
  cors({
    origin: true,
    methods: "GET, POST, DELETE",
  })
);

app.get("/", function (req, res) {
  res.send("<h1>hi friend!</h1>");
});

let server = app.listen(3000, function () {
  console.log("start! express server on port 3000");
});

module.exports = server;
