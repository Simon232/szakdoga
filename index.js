var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
/* codes for me, to better understanding:
 *
 * socket.on - amit a kliens kuld
 * io.emit - amit a kliensnek kuldunk
 * socket.broadcast.to('room' + roomSize).emit("roomIsFull");
 * io.sockets.in('room' + roomSize).emit('roomIsFull');
 * */

var joinedUsers = 0;
var roomManager = [];
var roomSize = -1;
var cubes = {};

io.on('connection', function (socket) {

    // *** connection section ***
    ++joinedUsers;
    if (joinedUsers % 2 != 0) {
        ++roomSize;

        //checking unused roomId-s to avoid id-collision (for example: 0,1,3,4 id's next value: 2, then 5)
        var usedRoomId = false;
        for(var i = 0; i < roomManager.length; i++){
            if( roomManager[i].id == roomSize){
                usedRoomId = true;
            }
        }
        if(usedRoomId){
            //calculate correct id
            for(var i = 0; i < roomManager.length; i++){
                var resultIsBad = false;
                for(var j = 0; j < roomManager.length; j++){
                    if(roomManager[j].id == i){
                        resultIsBad = true;
                    }
                }
                if(!resultIsBad){
                    roomSize = i;
                    i = roomManager.length; //break the cycle
                }
            }
            roomManager.push(addRoom());
            socket.join('room#' + roomSize);
            socket.room = 'room#' + roomSize;
            roomSize = roomManager.length -1; //jump to the last known 'good' value

        }else {
            roomManager.push(addRoom());
            socket.join('room#' + roomSize);
            socket.room = 'room#' + roomSize; //if everything went well, we don't need to jump
        }


    }else{
        var emptyRoom = findOnePlayerRoom(); //enough to find an empty room
        socket.join(emptyRoom);
        socket.room = emptyRoom;
    }
    io.emit('new', {sid: socket.id, room: socket.room});
    //socket.emit("joined");

    addPlayerToRoom(socket.room, socket.id);
    console.log("user: "+ socket.id + ' connected to: ' + socket.room );

    socket.on("joined", function(obj){
        socket.username = obj.userName;
        cubes[socket.id] = obj.cube;
        console.log( socket.id + " joined with this:  [" + cubes[socket.id].x + ", " + cubes[socket.id].y + ", " + cubes[socket.id].z + "]");
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
        if(!isCollision(msg)) {
            cubes[msg.sid] = msg.pos;
            socket.broadcast.to(socket.room).emit('move', msg);
            //io.to(socket.room).emit('move', msg);
        }
        //socket.broadcast.emit('move', msg);
    });

    socket.on("isCollision", function(obj){
        var isCol = isCollision(obj);
        socket.emit("isCollision", {respond: isCol});
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

var getEnemyPlayerName = function(playerName, playerRoom){
    var enemyName = '';
    for(var i = 0; i < roomManager.length; i++){
        if(roomManager[i].name == playerRoom){
            if(roomManager[i].player1 == playerName){
                enemyName = roomManager[i].player2;
            }
            else if(roomManager[i].player2 == playerName){
                enemyName = roomManager[i].player1;
            }
        }
    }
    return enemyName;
};

var isCollision = function(obj){
    var otherPlayer = getEnemyPlayerName(obj.sid, obj.room);
    var thisSocket = obj.sid;
    var newX = obj.pos.x;
    var newZ = obj.pos.z;
    var movingSpeed = 0.05;

    if (otherPlayer !== '') {
        var colX = Math.abs(newX - cubes[otherPlayer].x);
        var colZ = Math.abs(newZ - cubes[otherPlayer].z);
        var originalX = Math.abs(cubes[thisSocket].x - cubes[otherPlayer].x);
        var originalZ = Math.abs(cubes[thisSocket].z - cubes[otherPlayer].z);
        return (colX < 1 && colZ < 1) && (originalX > colX && originalZ > colZ);
        /*if (colX <= 1 && colZ <= 1 && (colX < (1 + 2 * movingSpeed) || colX < (1 + 2 * movingSpeed))) {
            return true;
        }
        return colX <= 1 && colZ <= 1;*/
    }
    return false;
};

http.listen(port, function () {
    console.log('Server is started, listening on port:', port);
});
