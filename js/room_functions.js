var gameVars = require("./globals");
var gameObjects = require("./game_objects");

function addRoom() {
    return {
        id: gameVars.roomSize,
        name: 'room#' + gameVars.roomSize,
        player1: '',
        player2: '',
        ready: {p1: false, p2: false}
    };
}

function addPlayerToRoom(room, player) {
    console.log("dooooooomn " + room + " " + player );
    if (gameVars.roomManager[room].player1 == '') {
        gameVars.roomManager[room].player1 = player;
    }
    else if (gameVars.roomManager[room].player2 == '') {
        gameVars.roomManager[room].player2 = player;
    }
}

function findOnePlayerRoom() {
    for (var room in gameVars.roomManager) {
        if (gameVars.roomManager[room].player1 != '' && gameVars.roomManager[room].player2 == '') {
            return gameVars.roomManager[room].name;
        }
        else if (gameVars.roomManager[room].player1 == '' && gameVars.roomManager[room].player2 != '') {
            return gameVars.roomManager[room].name;
        }
    }
    return "Something went wrong";
}

function getEnemyPlayerName(playerName, playerRoom) {
    var enemyName = '';
    for (var room in gameVars.roomManager) {
        if (gameVars.roomManager[room].name == playerRoom) {
            if (gameVars.roomManager[room].player1 == playerName) {
                enemyName = gameVars.roomManager[room].player2;
            }
            else if (gameVars.roomManager[room].player2 == playerName) {
                enemyName = gameVars.roomManager[room].player1;
            }
        }
    }
    return enemyName;
}

function readyAgain(obj) {
    for (var room in gameVars.roomManager) {
        if (gameVars.roomManager[room].name == obj.room) {
            if (gameVars.roomManager[room].player1 == obj.sid) {
                if (!gameVars.roomManager[room].ready.p1) {
                    gameVars.roomManager[room].ready.p1 = true;
                }
            }
            if (gameVars.roomManager[room].player2 == obj.sid) {
                if (!gameVars.roomManager[room].ready.p2) {
                    gameVars.roomManager[room].ready.p2 = true;
                }
            }
            if (gameVars.roomManager[room].ready.p1 && gameVars.roomManager[room].ready.p2) {
                this.server.to(obj.room).emit("readyAgain");
                gameVars.coinPositions[obj.room] = [];
                gameVars.trapPositions[obj.room] = [];

                gameObjects.generateNewCoinPositions(obj.room);
                gameObjects.generateNewTrapPositions(obj.room);

                this.server.to(obj.room).emit("objectPositions", {
                    coinPositions: gameVars.coinPositions[obj.room],
                    trapPositions: gameVars.trapPositions[obj.room]
                });

                gameVars.roomManager[room].ready.p1 = false;
                gameVars.roomManager[room].ready.p2 = false;
            }
        }
    }
}

module.exports = {
    addPlayerToRoom: addPlayerToRoom,
    addRoom: addRoom,
    findOnePlayerRoom: findOnePlayerRoom,
    getEnemyPlayerName: getEnemyPlayerName,
    readyAgain: readyAgain
};
