const express = require("express");
const PORT = 5005;
require("dotenv").config();

const app = express();

app.get("/", (req, res) => {
  res.send("All good here!");
});

app.listen(PORT, () => {
  console.log(`
    Server is running on port \x1b[33m${PORT}\x1b[0m
    Try a GET request to:
    \x1b[36mhttp://localhost:${PORT}/\x1b[0m
    `);
});
