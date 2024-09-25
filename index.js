var dgram = require('dgram');
var port = 44044;

// creating a client socket
const client = dgram.createSocket('udp4')

//buffer msg
const data = Buffer.from('#01\r')

//sending msg
client.send(data, 1025, '127.0.0.1', error => {
  if (error) {
      console.log(error)
      client.close()
  } else {
      console.log('Data sent !!!')
  }
})


socket = dgram.createSocket('udp4');

socket.on('message', function (msg, info){
    console.log(msg.toString());
 });

socket.on('listening', function(){
    var address = socket.address();
    console.log("listening on :" + address.address + ":" + address.port);
});

socket.bind(port);