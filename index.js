var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});


var joinedUsers = 0;
var roomManager = [];
var chosenRoom = "";

io.on('connection', function (socket) {
/*
* socket.on - amit a kliens k�ld
* io.emit - amit a kliensnek k�ld�nk
* */

    // *** connection section ***
    console.log('a user connected ', socket.id);

    ++joinedUsers;
    if (joinedUsers % 2 == 0 || joinedUsers == 1) {
        roomManager.push(addRoom(false));
        console.log("rooms new size: ", roomManager.length)
    }
    addPlayerToRoom(('room#'+ (joinedUsers - roomManager.length )), socket.id);

    
    for(var i = 0; i < roomManager.length; i++){
        if(roomManager[i].player1 == socket.id || roomManager[i].player2 == socket.id){
            chosenRoom = roomManager[i].name;
        }
    }
    if(chosenRoom == ""){
        chosenRoom = 'room#'+ (joinedUsers - roomManager.length );        
    }
    console.log("miagec "+ chosenRoom);
    io.emit('new', {sid: socket.id, room: chosenRoom });


    socket.on('disconnect', function () {
        console.log('user disconnect', socket.id);

        console.log("debug: ", roomManager.length);
        for (var i = 0; i < roomManager.length; i++) {
            if (roomManager[i].player1 == socket.id) {
                //roomManager.splice(i, 1);
                roomManager[i].player1 = '';
            }
            if (roomManager[i].player2 == socket.id) {
                roomManager[i].player2 = '';
            }
            if(roomManager[i].player1 == '' && roomManager[i].player2 == ''){
                roomManager.splice(i, 1);
            }
        }
        --joinedUsers;
        console.log("debug ut�n: ", roomManager.length);
        io.emit('disconnect', socket.id);
    });

    // *** movements section ***
    socket.on('move', function (msg) {
        io.emit('move', msg);
    });

    socket.on('update', function (msg) {
        socket.broadcast.emit('update', msg);
    });

    socket.on('rotation', function (msg) {
        socket.broadcast.emit('rotation', msg);
    });

    // *** page functions section ***
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
    });

});

var addPlayerToRoom = function(room, player){
    console.log("wat " + room + " " +player);
    
    
    var id = 0;
    for(var i = 0; i < roomManager.length; i++){
        if(roomManager[i].name == room){
            id = i;
        }
    }
    
    if(roomManager[id].player1 != '' && roomManager[id].player2 != '')
    {
        console.log("nemüres");
        for(var i = 0; i < roomManager.length; i++){
            if(roomManager[i].player1 == '' || roomManager[i].player2 == ''){
                id = i;   
                break;
            }
        }
        console.log("kiwi vagyok", id);
    }
    if(roomManager[id].player1 == ''){
        roomManager[id].player1 = player;
    }
    else if(roomManager[id].player2 == ''){
        roomManager[id].player2 = player;
    }
    console.log("A csávót ide tettem: " + id + " pl1: " + roomManager[id].player1 + " pl2: " + roomManager[id].player2);
    console.log("ROOM: player 1: "+roomManager[id].player1 + " player2: " + roomManager[id].player2);
};

var addRoom = function (private) {
    var conflict = false;
    var ids = [];
    for (var i = 0; i < roomManager.length; ++i) {
        ids.push(roomManager[i].id);
    }
    for (var i = 0; i < ids.length; ++i) {
        if (roomManager.length == ids[i]) {
            conflict = true;
        }
    }
    var createId = -1;
    if (conflict) {
        while (conflict) {
            ++createId;
            conflict = false;
            for (var i = 0; i < ids.length; ++i) {
                if (createId == ids[i]) {
                    conflict = true;
                }
            }
        }

    }

    return {
        id: createId,
        name: 'room#' + createId,
        player1: '',
        player2: '',
        private: private
    };
};
/*
 var roomIsEmpty = function (roomId) {
 return roomManager[roomID].player1 == '' && roomManager[roomID].player2 == '';
 };

 var roomIsFull = function (roomId) {
 return roomManager[roomID].player1 != '' && roomManager[roomID].player2 != '';
 };

 var roomGetPlayer = function (player) {
 for (var i = 0; i < roomManager.length; i++) {
 if (roomManager[i].player1 == player || roomManager[i].player2 == player) {
 return roomManager[i].id;
 }
 }
 };

 var roomIsEmpty = function () {
 var empty = false;
 var id = 0;
 for (var i = 0; i < roomManager.length; i++) {
 if (roomManager[i].player1 == '' || roomManager[i].player2 == '') {
 empty = true;
 id = i;
 }
 i = roomManager.length + 1;
 }
 if (empty) {
 return {
 empty: empty,
 id: id
 };
 }
 return {empty: false, id: -1};
 };

 var joinRoom = function (player, id) {

 };
 */
http.listen(port, function () {
    console.log('listening on port:', port);
});



