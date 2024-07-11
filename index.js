const express = require('express')

const {Server} = require('net')

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


const server = new Server(socket=> {
  console.log('client connected')

  // Attach listeners for the socket
  socket.on('data', message => {
    console.log('message')

    // Write back to the client
    socket.write('world')     
  })

  // Send the client a message to disconnect from the server after a minute
  setTimeout(() => socket.write('disconnect'), 60000)

  socket.on('end', () => console.log('client disconnected'))
})

server.listen(1337, '0.0.0.0', () => console.log('listening'))