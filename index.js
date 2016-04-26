var express = require('express');
var router = express.Router();
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var joinedUsers = 0;
var roomManager = {};
var roomSize = -1;
var cubes = {};
var roomMessages = {};
var gameWidth = 100;
var coinPositions = {};
var trapPositions = {};
var coinNumber = 10;
var trapNumber = 4;
var cubeHalf = 0.49;

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.get('/game', function (req, res) {
    res.sendFile(__dirname + '/public/html/game.html');
});
app.get('/registration', function(req, res){
    res.sendFile(__dirname + '/public/html/registration.html') ;
});

/* codes for me, to better understanding:
 *
 * socket.on - amit a kliens kuld
 * io.emit - amit a kliensnek kuldunk
 * socket.broadcast.to('room' + roomSize).emit("roomIsFull");
 * io.sockets.in('room' + roomSize).emit('roomIsFull');
 * */

io.on('connection', function (socket) {

    init(socket);

    socket.on("joined", onJoined.bind(socket));
    socket.on('disconnect', onLeave.bind(socket));

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
    socket.on('chat message', chatMessages);

    socket.on("giveNewCoin", giveNewCoin.bind(socket));

    socket.on("getDamage", function(obj){
        socket.to(obj.room).broadcast.emit("getDamage", obj);
    });

    socket.on("readyAgain", readyAgain.bind(socket));

});

//******************************
//********** functions *********
//******************************

function addPlayerToRoom(room, player) {
    if (roomManager[room].player1 == '') {
        roomManager[room].player1 = player;
    }
    else if (roomManager[room].player2 == '') {
        roomManager[room].player2 = player;
    }
}

function addRoom(){
    return {
        id: roomSize,
        name: 'room#' + roomSize,
        player1: '',
        player2: '',
        ready: {p1: false, p2: false}
    };
}

function findOnePlayerRoom() {
    for (var room in roomManager) {
        if (roomManager[room].player1 != '' && roomManager[room].player2 == '') {
            return roomManager[room].name;
        }
        else if (roomManager[room].player1 == '' && roomManager[room].player2 != '') {
            return roomManager[room].name;
        }
    }
    return "Something went wrong";
}

function getEnemyPlayerName(playerName, playerRoom) {
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
}

function generateNewCoinPositions(room){
    coinPositions[room] = [];
    var positions = [];
    for (var i = 0; i < coinNumber; i++) {
        var x = Math.random() * gameWidth / 2 * (Math.round(Math.random() * 10) % 2 == 0 ? 1 : -1);
        var z = Math.random() * gameWidth / 2 * (Math.round(Math.random() * 10) % 2 == 0 ? 1 : -1);
        positions.push({x: x, z: z});
    }
    coinPositions[room] = positions;
}

function generateNewTrapPositions(room){
    trapPositions[room] = [];
    var positions = [];
    for (var i = 0; i < trapNumber; i++) {
        var x = getRandomPosition();
        var z = getRandomPosition();
        positions.push({x: x, z: z});
    }
    trapPositions[room] = positions;
}

function isCollision(obj) {
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
    }
    return false;
}

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

        generateNewCoinPositions(emptyRoom);
        generateNewTrapPositions(emptyRoom);

        console.log("DEBUG " + coinPositions[socket.room].length);
        io.to(socket.room).emit("objectPositions", { coinPositions: coinPositions[socket.room], trapPositions: trapPositions[socket.room]});

    }
    io.to(socket.room).emit('new', {sid: socket.id, room: socket.room, positions: {x: getRandomPosition(), z: getRandomPosition()}});
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

function onLeave(){
    if (joinedUsers % 2 != 0) {
        --roomSize;
    }

    console.log("user: " + this.id + ' disconnect from: ' + this.room);

    //removeEmptyRoom
    for (var room in roomManager) {
        if (roomManager[room].player1 == this.id) {
            roomManager[room].player1 = '';
        }
        if (roomManager[room].player2 == this.id) {
            roomManager[room].player2 = '';
        }
        if (roomManager[room].player1 == '' && roomManager[room].player2 == '') {
            var roomName = roomManager[room].name;
            delete roomManager[roomName];
            delete roomMessages[roomName];
            //roomManager.splice(i, 1);
            delete coinPositions[roomName];
            delete trapPositions[roomName];

            console.log("Tarolt szoba uzenetek merete torles utan: " + Object.keys(roomMessages).length)
        }
    }
    --joinedUsers;
    io.to(this.room).emit('disconnect', this.id);
    this.leave(this.room);

    console.log("csatlakozott jatekosok szama: " + joinedUsers);
    console.log("szobak szama: " + Object.keys(roomManager).length);
}

function getRandomPosition() {
    var pos = 0;
    while (pos <= 1 && pos >= -1) {
        pos = Math.floor(Math.random() * 2) % 2 == 0 ? Math.random() * ((gameWidth / 2) - cubeHalf -6) : -1 * Math.random() * ((gameWidth / 2) - cubeHalf - 2);
    }
    return pos;
}

function giveNewCoin(obj){
    coinPositions[this.room].splice(obj.index, 1);
    var x = Math.random() * gameWidth / 2 * (Math.round(Math.random() * 10) % 2 == 0 ? 1 : -1);
    var z = Math.random() * gameWidth / 2 * (Math.round(Math.random() * 10) % 2 == 0 ? 1 : -1);
    coinPositions[this.room].push({x: x, z: z});
    io.to(this.room).emit("giveNewCoin", {
        sid: this.id,
        socketPoints: obj.socketPoints,
        index: obj.index,
        x: x,
        z: z
    });
}

function readyAgain(obj){
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
                coinPositions[this.room] = [];
                trapPositions[this.room] = [];

                generateNewCoinPositions(this.room);
                generateNewTrapPositions(this.room);

                io.to(this.room).emit("objectPositions", { coinPositions: coinPositions[this.room], trapPositions: trapPositions[this.room]});
                io.to(this.room).emit("objectPositions", { coinPositions: coinPositions[this.room], trapPositions: trapPositions[this.room]});

                roomManager[room].ready.p1 = false;
                roomManager[room].ready.p2 = false;
            }
        }
    }
}

function chatMessages(obj){
    if (roomMessages[obj.room].length == 5) {
        roomMessages[obj.room].shift();
    }
    roomMessages[obj.room].push(obj.msg);

    io.to(obj.room).emit('chat message', obj);
}

//*****************************
//***** server start **********
//*****************************

http.listen(port, function () {
    console.log('Server is started, listening on port:', port);
});