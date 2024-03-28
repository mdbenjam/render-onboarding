const express = require('express')
const redis = require('redis');

const app = express()
app.set('view engine', 'ejs');

const port = process.env.INTERNAL_PORT || 3000;
console.log(`Listening on port ${port}`)

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

app.listen(port, () => {
    console.log(`Render onboarding app listening on port ${port}`)
})


const app3 = express()
app2.set('view engine', 'ejs');

const port2 = port + 1;
console.log(`Listening on port ${port2}`)

app2.get('/', async (req, res) => {
    console.log(`Request received on port ${port2}`)

    res.json({foo: "bar"});
})


app2.listen(port2, () => {
    console.log(`Render onboarding app INTERNAL listening on port ${port2}`)
})

setTimeout(() => {
  const app3 = express()
  app3.set('view engine', 'ejs');
  
  const port3 = port + 2;
  console.log(`Listening on port ${port3}`)
  
  app3.get('/', async (req, res) => {
      console.log(`Request received on port ${port3}`)
  
      res.json({foo: "bar"});
  })
  
  
  app3.listen(port3, () => {
      console.log(`Render onboarding app INTERNAL listening on port ${port3}`)
  })
}, 45000);
