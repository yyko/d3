const express = require("express");
const app = express();
const port = 7777;
const { Db } = require('./db.js').default
let db;

// Create and connect to the database when the server starts
(async () => {
  try {
    db = new Db('root', 'virio0215', 'aics'); // Create db instance
    await db.connect();
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
})();

app.get("/create", async (request, response) => {
  try {
    await db.createNotesTable();
    response.send("Notes table created!");
  } catch (error) {
    console.error("Error:", error);
    response.status(500).send("Internal Server Error");
  }
});

app.get("/", (request, response) => {
  const html = '<html><body>local aics</body></html>';
  response.send(html);
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
