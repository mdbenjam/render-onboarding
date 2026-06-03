const express = require('express')
const redis = require('redis');
const fs = require('fs');
const os = require('os');
const path = require('path');

const app = express()
app.set('view engine', 'ejs');
const port = 3000;

// Fill the temp disk with ~20GB of data on startup.
const fillTmpDisk = () => {
    const targetBytes = 20 * 1024 * 1024 * 1024;
    const chunkBytes = 64 * 1024 * 1024;
    const chunk = Buffer.alloc(chunkBytes, 0);
    const filePath = path.join(os.tmpdir(), 'render-onboarding-fill.bin');
    const fd = fs.openSync(filePath, 'w');
    let written = 0;
    while (written < targetBytes) {
        fs.writeSync(fd, chunk);
        written += chunkBytes;
    }
    fs.fsyncSync(fd);
    fs.closeSync(fd);
    console.log(`Wrote ${written} bytes to ${filePath}`);
};

fillTmpDisk();


app.get('/', async (req, res) => {
    const data = {
        // Data provided by your application
        // Make your changes here!
        author: "Mark 5",
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

app.listen(port, () => {
    console.log(`Render onboarding app listening on port ${port}`)
})
