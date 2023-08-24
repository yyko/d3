const express = require("express");
const app = express();
const port = 7777;
const Db = require('./db.js')
let db;

app.get("/", async (request, response) => {
  try {
    db = new Db({user:'root', password: 'virio0215', dbName: 'aics'});
    db.connect()
    const html = '<html><body>local aics</body></html>';
    response.send(html);
  } catch (error) {
    console.error("Error:", error);
    response.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
