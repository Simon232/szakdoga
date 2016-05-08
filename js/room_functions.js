var gameVars = require("./globals");

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

module.exports = {
    addPlayerToRoom: addPlayerToRoom,
    addRoom: addRoom,
    findOnePlayerRoom: findOnePlayerRoom,
    getEnemyPlayerName: getEnemyPlayerName
};
