const express = require('express');
const path = require('path');
const { clog } = require('./middleware/clog');
const api = require('./routes/index.js');
const { error } = require('console');
const {uuid} = require("uuidv4");
const diagnostic = require("./db/diagnostics.json")
const fs = require("fs")

const PORT = process.env.port || 3001;

const app = express();

// Import custom middleware, "cLog"
app.use(clog);

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for feedback page
app.get('/feedback', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/pages/feedback.html'))
);

app.get("*", (req,res)=>{
  res.sendFile(path.join(__dirname, '/public/pages/404.html'))
  console.error(error)
}
);

app.post("/api/diagnostics", (req,res) => {
  const {time, error_id, errors:{tip, topic, username}}= req.body;

const newDiagnostic = {
  time: Date.now(),
  error_id: uuid(),
  errors: {
    tip,
    topic,
    username
  }
};

diagnostic.push(newDiagnostic);
fs.writeFile(diagnostic, JSON.stringify(diagnostic), (err) => 
err
  ? console.error(error)
  : console.log("new diagnostic written"));

});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

console.log(error)