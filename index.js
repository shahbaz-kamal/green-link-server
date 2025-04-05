const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("green link server is running");
});
app.listen(port, () => {
  console.log(`Green-Link server is running on port ${port}`);
});
