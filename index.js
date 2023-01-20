const express = require("express");
const redis = require("redis");

const app = express();
app.set("view engine", "ejs");
const port = 3000;

var count = 0;

setInterval(() => {
  count = count + 1;
  for (var i = 0; i < 10; i++) {
    console.log(
      `${new Date().toUTCString()} - Log count ${count}.${i} Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`
    );
  }
}, 1);

app.get("/", async (req, res) => {
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
  };

  res.render("index", data);
});

const getHitCount = async () => {
  try {
    const client = await redis.createClient({
      url: process.env.REDIS_URL,
      retry_strategy: (o) => {
        return undefined;
      },
    });
    client.on("error", (err) => {
      console.log(err);
      throw new Error(err);
    });
    await client.connect();
    return client.incr("hits");
  } catch (e) {
    return "(Couldn't connect to datastore)";
  }
};

app.listen(port, () => {
  console.log(`Render onboarding app listening on port ${port}`);
});
