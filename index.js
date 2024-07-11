const express = require('express')
var net = require('net');

const app = express()
app.set('view engine', 'ejs');

const port = process.env.INTERNAL_PORT || 3000;
console.log(`Listening on port ${port}`)

app.get('/', async (req, res) => {
    const data = {
        // Data provided by your application
        // Make your changes here!
        author: "Mark 7",
        hits: 0,

        // Data that your configure via Render: how to connect to managed datastores
        REDIS_URL: process.env.REDIS_URL,

        // Data provided by Render automatically about your code
        RENDER_GIT_COMMIT: process.env.RENDER_GIT_COMMIT,
        RENDER_SERVICE_NAME: process.env.RENDER_SERVICE_NAME,
        RENDER_EXTERNAL_HOSTNAME: process.env.RENDER_EXTERNAL_HOSTNAME,
    }

    res.render('index', data);
})

app.listen(port, () => {
    console.log(`Render onboarding app listening on port ${port}`)
})


var server = net.createServer(function(socket) {
	socket.write('Echo server\r\n');
	socket.pipe(socket);
});

server.listen(1337, '0.0.0.0');