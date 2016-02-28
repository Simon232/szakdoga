var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;


app.use(express.static('public'));


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('hi', function(obj){
    console.log('aaaaaaa' + obj);
});

io.on('connection', function (socket) {

    console.log('a user connected ', socket.id);
    io.emit('new', socket.id  );

    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
    });

    socket.on('move', function(msg){
        io.emit('move', msg);
    });

    socket.on('update', function(msg){
        //console.log(msg);
        socket.broadcast.emit('update', msg);
    });

    socket.on('disconnect', function () {
        io.emit('disconnect', socket.id);
        console.log('user disconnect' + socket.id);
    });

});

http.listen(port, function () {
    console.log('listening on *:3000');
});



