var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
/*
 * socket.on - amit a kliens k�ld
 * io.emit - amit a kliensnek k�ld�nk
 * */

var joinedUsers = 0;
var roomManager = [];
var chosenRoom = "";
var roomSize = -1;

io.on('connection', function (socket) {

    // *** connection section ***
    ++joinedUsers;
    if (joinedUsers % 2 != 0) {
        ++roomSize;

        var usedRoomId = false;
        for(var i = 0; i < roomManager.length; i++){
            if( roomManager[i].id == roomSize){
                usedRoomId = true;
            }
        }
        if(usedRoomId){
            for(var i = 0; i < roomManager.length; i++){
                var resultIsBad = false;
                for(var j = 0; j < roomManager.length; j++){
                    if(roomManager[j].id == i){
                        resultIsBad = true;
                    }
                }
                if(!resultIsBad){
                    roomSize = i;
                    i = roomManager.length;
                }
            }
            roomManager.push(addRoom());
            socket.join('room#' + roomSize);
            socket.room = 'room#' + roomSize;
            roomSize = roomManager.length -1;

        }else {
            roomManager.push(addRoom());
            socket.join('room#' + roomSize);
            socket.room = 'room#' + roomSize;
        }


    }else{
        var emptyRoom = findOnePlayerRoom();
        socket.join(emptyRoom);
        socket.room = emptyRoom;
    }
    socket.emit("joined", {room: roomSize});
    //socket.broadcast.to('room' + roomSize).emit("roomIsFull");
    //io.sockets.in('room' + roomSize).emit('roomIsFull');
    addPlayerToRoom(socket.room, socket.id);
    console.log("user: "+ socket.id + ' connected to: ' + socket.room );


    io.emit('new', {sid: socket.id, room: socket.room});


    socket.on("joined", function(obj){
        socket.username = obj.userName;
    });

    socket.on('disconnect', function () {
        if (joinedUsers % 2 != 0) {
            --roomSize;
        }

        console.log("user: "+ socket.id + ' disconnect from: ' + socket.room);

        //removeEmptyRoom
        for (var i = 0; i < roomManager.length; i++) {
            if (roomManager[i].player1 == socket.id) {
                roomManager[i].player1 = '';
            }
            if (roomManager[i].player2 == socket.id) {
                roomManager[i].player2 = '';
            }
            if (roomManager[i].player1 == '' && roomManager[i].player2 == '') {
                roomManager.splice(i, 1);
            }
        }
        --joinedUsers;
        io.emit('disconnect', socket.id);
        socket.leave(socket.room);
    });

    // *** movements section ***
    socket.on('move', function (msg) {
        socket.broadcast.to(socket.room).emit('move', msg);
        //socket.broadcast.emit('move', msg);
    });

    socket.on('update', function (msg) {
        socket.broadcast.to(socket.room).emit('update', msg);
    });

    socket.on('rotation', function (msg) {
        socket.broadcast.to(socket.room).emit('rotation', msg);
    });

    // *** page functions section ***
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
    });

    socket.on('reset', function (msg) {
        io.emit('reset', msg);
    });

});

var addPlayerToRoom = function (room, player) {
    var id = 0;
    for (var i = 0; i < roomManager.length; i++) {
        if (roomManager[i].name == room) {
            id = i;
        }
    }

    if (roomManager[id].player1 == '') {
        roomManager[id].player1 = player;
    }
    else if (roomManager[id].player2 == '') {
        roomManager[id].player2 = player;
    }
};

var addRoom = function () {
    return {
        id: roomSize,
        name: 'room#' + roomSize,
        player1: '',
        player2: ''
    };
};

var findOnePlayerRoom = function(){
    for(var i = 0; i < roomManager.length; i++){
        if(roomManager[i].player1 == ''){
            return roomManager[i].name;
        }
        if(roomManager[i].player2 == ''){
            return roomManager[i].name;
        }
    }
    return "HAHAHAHA";
};

http.listen(port, function () {
    console.log('Server is started, listening on port:', port);
});
