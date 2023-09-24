const fs = require("fs");
const path = require("path");

const express = require("express");
const app = express();
app.use(express.static("public"));

const { v4: uuidv4 } = require("uuid");

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/notes", (req, res) =>
  res.sendFile("./public/notes.html", { root: __dirname })
);

app.get("/api/notes", (req, res) =>
  res.sendFile("./db/db.json", { root: __dirname })
);

app.delete("/api/notes/:id", (req, res) => {
  console.log(req.body);
  const noteId = req.params.id;
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to read the data file." });
    } else {
      const parsedData = JSON.parse(data);
      const result = parsedData.filter((note) => note.id !== noteId);
      fs.writeFile("./db/db.json", JSON.stringify(result), (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Failed to write data file." });
        } else {
          res.json(result);
        }
      });
    }
  });
});

app.post("/api/notes", (req, res) => {
  console.log(req.body);
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      req.body.id = uuidv4();
      const parsedData = JSON.parse(data);
      parsedData.push(req.body);
      console.log(parsedData);
      fs.writeFile("./db/db.json", JSON.stringify(parsedData), (err) =>
        err ? console.error(err) : res.json(parsedData)
      );
    }
  });
});

app.get("*", (req, res) =>
  res.sendFile("./public/index.html", { root: __dirname })
);

app.listen(PORT, () => {
  console.log("listening on port 3001");
});
