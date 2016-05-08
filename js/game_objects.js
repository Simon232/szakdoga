var gameVars = require("./globals");

function generateNewCoinPositions(room) {
    gameVars.coinPositions[room] = [];
    var positions = [];
    for (var i = 0; i < gameVars.coinNumber; i++) {
        var x = Math.random() * gameVars.gameWidth / 2 * (Math.round(Math.random() * 10) % 2 == 0 ? 1 : -1);
        var z = Math.random() * gameVars.gameWidth / 2 * (Math.round(Math.random() * 10) % 2 == 0 ? 1 : -1);
        positions.push({x: x, z: z});
    }
    gameVars.coinPositions[room] = positions;
}

function generateNewTrapPositions(room) {
    gameVars.trapPositions[room] = [];
    var positions = [];
    for (var i = 0; i < gameVars.trapNumber; i++) {
        var x = Math.random() * gameVars.gameWidth / 2 * (Math.round(Math.random() * 10) % 2 == 0 ? 1 : -1);
        var z = Math.random() * gameVars.gameWidth / 2 * (Math.round(Math.random() * 10) % 2 == 0 ? 1 : -1);
        positions.push({x: x, z: z});
    }
    gameVars.trapPositions[room] = positions;
}

function isCollision(obj) {
    var otherPlayer = roomFunctions.getEnemyPlayerName(obj.sid, obj.room);
    var thisSocket = obj.sid;
    var newX = obj.pos.x;
    var newZ = obj.pos.z;
    var movingSpeed = 0.05;

    if (otherPlayer !== '') {
        var colX = Math.abs(newX - gameVars.cubes[otherPlayer].x);
        var colZ = Math.abs(newZ - gameVars.cubes[otherPlayer].z);
        var originalX = Math.abs(gameVars.cubes[thisSocket].x - gameVars.cubes[otherPlayer].x);
        var originalZ = Math.abs(gameVars.cubes[thisSocket].z - gameVars.cubes[otherPlayer].z);
        return (colX < 1 && colZ < 1) && (originalX > colX && originalZ > colZ);
    }
    return false;
}

function giveNewCoin(obj) {
    gameVars.coinPositions[this.room].splice(obj.index, 1);
    var x = Math.random() * gameVars.gameWidth / 2 * (Math.round(Math.random() * 10) % 2 == 0 ? 1 : -1);
    var z = Math.random() * gameVars.gameWidth / 2 * (Math.round(Math.random() * 10) % 2 == 0 ? 1 : -1);
    gameVars.coinPositions[this.room].push({x: x, z: z});
    io.to(this.room).emit("giveNewCoin", {
        sid: this.id,
        socketPoints: obj.socketPoints,
        index: obj.index,
        x: x,
        z: z
    });
}

module.exports = {
    generateNewCoinPositions: generateNewCoinPositions,
    generateNewTrapPositions: generateNewTrapPositions,
    isCollision: isCollision,
    giveNewCoin: giveNewCoin
};