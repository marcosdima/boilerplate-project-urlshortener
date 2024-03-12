require('dotenv').config();
const express = require('express');
const cors = require('cors');
let bodyParser = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// Code
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let counter = 0;
let arrayOfResults = []

app.post("/api/shorturl", (req, res) => {
  const original = req.body.url;

  if (!valid_url(original))
    return res.json({ error: 'invalid url' });
  counter++;

  const data = {
    "original_url": original,
    "short_url": counter
  }

  arrayOfResults.push(data);
  res.json(data);
});

app.get("/api/shorturl/:short_url", (req, res) => {
  let id = req.params.short_url;

  if ((Number.isInteger(Number(id)))) id = parseInt(id);
  else return res.json({ error: 'invalid url' });

  let index = id - 1;

  if (index < arrayOfResults.length) res.redirect(arrayOfResults[index].original_url);
  else return res.json({ error: 'invalid id' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

function valid_url(url) {
  const endings = ['.com', '.org', ".io"];
  const start_ok = url.startsWith("https://");
  let ends_ok = false;
  
  for (let ending of endings) if (url.includes(ending)) ends_ok = true;

  return start_ok && ends_ok;
}