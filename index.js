var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.get('/game', function (req, res) {
    res.sendFile(__dirname + '/public/html/game.html');
});

/* codes for me, to better understanding:
 *
 * socket.on - amit a kliens kuld
 * io.emit - amit a kliensnek kuldunk
 * socket.broadcast.to('room' + roomSize).emit("roomIsFull");
 * io.sockets.in('room' + roomSize).emit('roomIsFull');
 * */

var joinedUsers = 0;
var roomManager = {};
var roomSize = -1;
var cubes = {};
var roomMessages = {};
var gameWidth = 100;
var coinPositions = {};
var coinNumber = 10;


io.on('connection', function (socket) {

    init(socket);

    socket.on("joined", onJoined.bind(socket));

    socket.on('disconnect', function () {
        if (joinedUsers % 2 != 0) {
            --roomSize;
        }

        console.log("user: " + socket.id + ' disconnect from: ' + socket.room);

        //removeEmptyRoom
        for (var room in roomManager) {
            if (roomManager[room].player1 == socket.id) {
                roomManager[room].player1 = '';
            }
            if (roomManager[room].player2 == socket.id) {
                roomManager[room].player2 = '';
            }
            if (roomManager[room].player1 == '' && roomManager[room].player2 == '') {
                var roomName = roomManager[room].name;
                delete roomManager[roomName];
                delete roomMessages[roomName];
                //roomManager.splice(i, 1);
                delete coinPositions[roomName];

                console.log("Tarolt szoba uzenetek merete torles utan: " + Object.keys(roomMessages).length)
            }
        }
        --joinedUsers;
        io.to(socket.room).emit('disconnect', socket.id);
        socket.leave(socket.room);


        console.log("csatlakozott jatekosok szama: " + joinedUsers);
        console.log("szobak szama: " + Object.keys(roomManager).length);
    });

    // *** movements section ***
    socket.on('move', function (msg) {
        cubes[msg.sid] = msg.pos;
        socket.broadcast.to(socket.room).emit('move', msg);
    });

    socket.on("isCollision", function (obj) {
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
    socket.on('chat message', function (obj) {
        if (roomMessages[obj.room].length == 5) {
            roomMessages[obj.room].shift();
        }
        roomMessages[obj.room].push(obj.msg);


        io.to(obj.room).emit('chat message', obj);
    });

    socket.on("giveNewCoin", function (obj) {
        console.log("debuuug " + socket.room);
        console.log("debuuug " + coinPositions[socket.room]);

        coinPositions[socket.room].splice(obj.index, 1);
        var x = Math.random() * gameWidth / 2 * (Math.round(Math.random() * 10) % 2 == 0 ? 1 : -1);
        var z = Math.random() * gameWidth / 2 * (Math.round(Math.random() * 10) % 2 == 0 ? 1 : -1);
        coinPositions[socket.room].push({x: x, z: z});
        io.to(socket.room).emit("giveNewCoin", {
            sid: socket.id,
            socketPoints: obj.socketPoints,
            index: obj.index,
            x: x,
            z: z
        });
    });

    socket.on("readyAgain", function(obj){
        for(var room in roomManager){
            if(roomManager[room].name == obj.room){
                if(roomManager[room].player1 == obj.sid){
                    if(!roomManager[room].ready.p1){
                        roomManager[room].ready.p1 = true;
                    }
                }
                if(roomManager[room].player2 == obj.sid){
                    if(!roomManager[room].ready.p2){
                        roomManager[room].ready.p2 = true;
                    }
                }
                if(roomManager[room].ready.p1 && roomManager[room].ready.p2){
                    io.to(obj.room).emit("readyAgain");
                    roomManager[room].ready.p1 = false;
                    roomManager[room].ready.p2 = false;
                }
            }
        }

    });

});

var addPlayerToRoom = function (room, player) {
    console.log("DOOM " + room);
    console.log("DOOM " + roomManager[room].player1);
    console.log("DOOM " + roomManager[room].player2);

    if (roomManager[room].player1 == '') {
        roomManager[room].player1 = player;
    }
    else if (roomManager[room].player2 == '') {
        roomManager[room].player2 = player;
    }
};

var addRoom = function () {
    return {
        id: roomSize,
        name: 'room#' + roomSize,
        player1: '',
        player2: '',
        ready: {p1: false, p2: false}
    };
};

var findOnePlayerRoom = function () {
    for (var room in roomManager) {
        if (roomManager[room].player1 != '' && roomManager[room].player2 == '') {
            return roomManager[room].name;
        }
        else if (roomManager[room].player1 == '' && roomManager[room].player2 != '') {
            return roomManager[room].name;
        }
    }
    return "Something went wrong";
};

var getEnemyPlayerName = function (playerName, playerRoom) {
    var enemyName = '';
    for (var room in roomManager) {
        if (roomManager[room].name == playerRoom) {
            if (roomManager[room].player1 == playerName) {
                enemyName = roomManager[room].player2;
            }
            else if (roomManager[room].player2 == playerName) {
                enemyName = roomManager[room].player1;
            }
        }
    }
    return enemyName;
};

var isCollision = function (obj) {
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


function init(socket) {
    // *** connection section ***
    ++joinedUsers;
    if (joinedUsers % 2 != 0) {
        roomSize = Object.keys(roomManager).length;

        //checking unused roomId-s to avoid id-collision (for example: 0,1,3,4 id's next value: 2, then 5)
        var usedRoomId = false;
        for (var room in roomManager) {
            if (roomManager[room].id == roomSize) {
                usedRoomId = true;
            }
        }
        if (usedRoomId) {
            //calculate correct id

            var goodId = 0;
            for (var room in roomManager) {
                if(roomManager[room].id == goodId){
                    ++goodId;
                }else{
                    var newIdIsGood = true;
                    for(var subroom in roomManager){
                        if(roomManager[subroom].id == goodId){
                            newIdIsGood = false;
                        }
                    }
                    if(newIdIsGood) {
                        roomSize = goodId;
                        break; //break the cycle
                    }else{
                        ++goodId;
                    }
                }

            }

            var roomName = 'room#' + roomSize;
            console.log("DOOM " + roomName);
            roomManager[roomName] = addRoom();
            roomMessages[roomName] = [];
            socket.join(roomName);
            socket.room = roomName;
            roomSize = Object.keys(roomManager).length - 1; //jump to the last known 'good' value

        } else {
            var roomName = 'room#' + roomSize;
            roomManager[roomName] = addRoom();
            roomMessages[roomName] = [];
            socket.join(roomName);
            socket.room = roomName; //if everything went well, we don't need to jump
        }

    } else {
        var emptyRoom = findOnePlayerRoom(); //enough to find an empty room
        socket.join(emptyRoom);
        socket.room = emptyRoom;

        coinPositions[socket.room] = [];
        var positions = [];
        for (var i = 0; i < coinNumber; i++) {
            var x = Math.random() * gameWidth / 2 * (Math.round(Math.random() * 10) % 2 == 0 ? 1 : -1);
            var z = Math.random() * gameWidth / 2 * (Math.round(Math.random() * 10) % 2 == 0 ? 1 : -1);
            positions.push({x: x, z: z});
        }
        coinPositions[socket.room] = positions;

        console.log("DEBUG " + coinPositions[socket.room].length);
        io.to(socket.room).emit("coinPositions", coinPositions[socket.room]);

    }
    io.to(socket.room).emit('new', {sid: socket.id, room: socket.room});
    io.to(socket.room).emit("old messages", {sid: socket.id, historyMessage: roomMessages[socket.room]});
    //socket.emit("joined");

    addPlayerToRoom(socket.room, socket.id);
    console.log("user: " + socket.id + ' connected to: ' + socket.room);
}

function onJoined(obj) {
    this.username = obj.userName;
    cubes[this.id] = obj.cube;
    console.log(this.id + " joined with this:  [" + cubes[this.id].x + ", " + cubes[this.id].y + ", " + cubes[this.id].z + "]");
    this.to(this.room).broadcast.emit("joined");
}