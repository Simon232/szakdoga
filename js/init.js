var gameVars = require("./globals");
var gameObjects = require("./game_objects");
var roomFunctions = require("./room_functions");

function getRandomPlayerPosition() {
    var pos = 0;
    while (pos <= 1 && pos >= -1) {
        pos = Math.floor(Math.random() * 2) % 2 == 0 ? Math.random() * ((gameVars.gameWidth / 2) - gameVars.cubeHalf - 6) : -1 * Math.random() * ((gameVars.gameWidth / 2) - gameVars.cubeHalf - 2);
    }
    return pos;
}

function init(socket) {
    // *** connection section ***
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    ++gameVars.joinedUsers;
    if (gameVars.joinedUsers % 2 != 0) {
        gameVars.roomSize = Object.keys(gameVars.roomManager).length;

        //checking unused roomId-s to avoid id-collision (for example: 0,1,3,4 id's next value: 2, then 5)
        var usedRoomId = false;
        for (var room in gameVars.roomManager) {
            if (gameVars.roomManager[room].id == gameVars.roomSize) {
                usedRoomId = true;
            }
        }
        if (usedRoomId) {
            //calculate correct id

            var goodId = 0;
            for (var room in gameVars.roomManager) {
                if (gameVars.roomManager[room].id == goodId) {
                    ++goodId;
                } else {
                    var newIdIsGood = true;
                    for (var subroom in gameVars.roomManager) {
                        if (gameVars.roomManager[subroom].id == goodId) {
                            newIdIsGood = false;
                        }
                    }
                    if (newIdIsGood) {
                        gameVars.roomSize = goodId;
                        break; //break the cycle
                    } else {
                        ++goodId;
                    }
                }

            }

            var roomName = 'room#' + gameVars.roomSize;
            gameVars.roomManager[roomName] = roomFunctions.addRoom();
            gameVars.roomMessages[roomName] = [];
            socket.join(roomName);
            socket.room = roomName;
            gameVars.roomSize = Object.keys(gameVars.roomManager).length - 1; //jump to the last known 'good' value

        } else {
            var roomName = 'room#' + gameVars.roomSize;
            gameVars.roomManager[roomName] = roomFunctions.addRoom();
            gameVars.roomMessages[roomName] = [];
            socket.join(roomName);
            socket.room = roomName; //if everything went well, we don't need to jump
        }

    } else {
        var emptyRoom = roomFunctions.findOnePlayerRoom(); //enough to find an empty room
        socket.join(emptyRoom);
        socket.room = emptyRoom;

        gameObjects.generateNewCoinPositions(emptyRoom);
        gameObjects.generateNewTrapPositions(emptyRoom);

        console.log("DEBUG " + gameVars.coinPositions[socket.room].length);
        socket.server.to(socket.room).emit("objectPositions", {
            coinPositions: gameVars.coinPositions[socket.room],
            trapPositions: gameVars.trapPositions[socket.room]
        });

    }
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    socket.server.to(socket.room).emit('new', {
        sid: socket.id,
        room: socket.room,
        positions: {x: getRandomPlayerPosition(), z: getRandomPlayerPosition()}
    });
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    socket.server.to(socket.room).emit("old messages", {sid: socket.id, historyMessage: gameVars.roomMessages[socket.room]});
    //socket.emit("joined");

    console.log("dooom" + socket.room);
    roomFunctions.addPlayerToRoom(socket.room, socket.id);
    console.log("user: " + socket.id + ' connected to: ' + socket.room);
}

module.exports = {
    init: init
};