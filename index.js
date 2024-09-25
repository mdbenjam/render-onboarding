var dgram = require('dgram');
var port = 44044;
var dns = require('dns');

dns.promises.setServers([
  "1.1.1.1",
]);

dns.promises.resolve('www.google.com').then((address) => {
    console.log('Address: ', address);
}).catch((err) => {
    console.log('Error: ', err);
});


socket = dgram.createSocket('udp4');

socket.on('message', function (msg, info){
    console.log(msg.toString());
 });

socket.on('listening', function(){
    var address = socket.address();
    console.log("listening on :" + address.address + ":" + address.port);
});

socket.bind(port);