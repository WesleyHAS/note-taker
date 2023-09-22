const fs = require("fs");
const path = require("path");

const express = require("express");
const app = express();
app.use(express.static("public"));

const { v4: uuidv4 } = require("uuid");

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* app.use((req, res, next) => {
  console.log("new request made: ");
  console.log("host: ", req.hostname);
  console.log("path: ", req.path);
  console.log("method: ", req.method);
  next();
}); */

app.get("/notes", (req, res) =>
  res.sendFile("./public/notes.html", { root: __dirname })
);

app.get("/api/notes", (req, res) =>
  res.sendFile("./db/db.json", { root: __dirname })
);

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
