var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;



app.use(express.static('public'));


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {

    console.log('a user connected ', socket.id);
    io.emit('new', socket.id);

    socket.broadcast.emit('hi');

    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
    });

    socket.on('move', function(msg){
        io.emit('move', msg);
    });

    socket.on('disconnect', function () {
        console.log('user disconnect');
    });



    //io.emit('move', msg);

    /*
    socket.on('move', function(msg) {
       //console.log(msg);
        console.log("wtf " + cubes[msg.sid].position + " " + msg);
       //io.emit('move', msg);

    });*/

});

http.listen(port, function () {
    console.log('listening on *:3000');
});



