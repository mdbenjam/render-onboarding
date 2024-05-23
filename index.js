const express = require('express')
const redis = require('redis');
const { networkInterfaces } = require('os');

const app = express()
app.set('view engine', 'ejs');
const port = 3000;


const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
        if (net.family === familyV4Value && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}

app.get('/', async (req, res) => {
    const data = {
        // Data provided by your application
        // Make your changes here!
        author: "Adam",
        hits: await getHitCount(),

        // Data that your configure via Render: how to connect to managed datastores
        REDIS_URL: process.env.REDIS_URL,

        // Data provided by Render automatically about your code
        RENDER_GIT_COMMIT: process.env.RENDER_GIT_COMMIT,
        RENDER_SERVICE_NAME: process.env.RENDER_SERVICE_NAME,
        RENDER_EXTERNAL_HOSTNAME: process.env.RENDER_EXTERNAL_HOSTNAME,
    }

    res.render('index', data);
})



const getHitCount = async () => {
    try {
        const client = await redis.createClient({ url: process.env.REDIS_URL, retry_strategy: (o) => { return undefined } });
        client.on('error', (err) => { console.log(err); throw new Error(err) });
        await client.connect();
        return client.incr("hits")
    } catch (e) {
        return "(Couldn't connect to datastore)";
    }
}

console.log("results", results)

app.listen(port, "0.0.0.0", () => {
    console.log(`Render onboarding app listening on address 0.0.0.0 port ${port}`)
})

app.listen(port, "::", () => {
  console.log(`Render onboarding app listening on address :: port ${port}`)
})