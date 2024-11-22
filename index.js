const express = require('express')
const redis = require('redis');

const app = express()
app.set('view engine', 'ejs');
const port = 3000;


app.get('/', async (req, res) => {
    res.send("")
})

app.get('/header', async (req, res) => {
  res.set('foo', 'bar');
  res.send("")
})

app.listen(port, () => {
    console.log(`Render onboarding app listening on port ${port}`)
})