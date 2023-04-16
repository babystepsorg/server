import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to the rest api from 4000");
});

app.listen(4000, () => console.log(`Listning on port 3000`));
