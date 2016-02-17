var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
/*var socket = new WebSocket('ws://localhost');
socket.binaryType = 'arraybuffer';
socket.send(new ArrayBuffer);*/

app.use(express.static('public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    socket.broadcast.emit('hi');
    console.log('a user connected');
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
    socket.on('disconnect', function(){
        console.log('user disconnect');
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});



