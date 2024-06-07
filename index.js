var dgram = require('dgram');
var port = 44044;

socket = dgram.createSocket('udp4');

socket.on('message', function (msg, info){
    console.log(msg.toString());
 });

socket.on('listening', function(){
    var address = socket.address();
    console.log("listening on :" + address.address + ":" + address.port);
});

socket.bind(port);