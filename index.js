const express = require("express");
const _ = require("underscore");
const path = require("path");
const app = express();
const port = 3000;
const fs = require('fs').promises;

app.get("/", async (request, response) => {
  let txt = await fs.readFile("dialog1.json", 'utf8');
  const xs = JSON.parse(txt)
  const html = xs.join('<BR/>');
  response.send(html);
});

app.listen(port, (err) => {
  if (err) {
    return console.log("something bad happened", err);
  }
  console.log(`server is listening on ${port}`);
});
