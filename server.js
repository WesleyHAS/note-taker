const fs = require("fs");
const path = require("path");

const express = require("express");
const app = express();
app.use(express.static("public"));

const PORT = process.env.PORT || 3001;

app.listen(3000, () => {
  console.log("listening on port 3000");
});

app.get("/", (req, res) => res.sendFile("./public/index.html"));

app.get("/", (req, res) => res.sendFile("./public/notes.html"));