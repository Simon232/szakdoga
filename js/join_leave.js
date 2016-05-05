var gameVars = require("./globals");

function onJoined(obj) {
    this.username = obj.userName;
    gameVars.cubes[this.id] = obj.cube;
    console.log(this.id + " joined with this:  [" + gameVars.cubes[this.id].x + ", " + gameVars.cubes[this.id].y + ", " + gameVars.cubes[this.id].z + "]");
    this.to(this.room).broadcast.emit("joined");
}

function onLeave() {
    if (gameVars.joinedUsers % 2 != 0) {
        --gameVars.roomSize;
    }

    console.log("user: " + this.id + ' disconnect from: ' + this.room);

    //removeEmptyRoom
    for (var room in gameVars.roomManager) {
        if (gameVars.roomManager[room].player1 == this.id) {
            gameVars.roomManager[room].player1 = '';
        }
        if (gameVars.roomManager[room].player2 == this.id) {
            gameVars.roomManager[room].player2 = '';
        }
        if (gameVars.roomManager[room].player1 == '' && gameVars.roomManager[room].player2 == '') {
            var roomName = gameVars.roomManager[room].name;
            delete gameVars.roomManager[roomName];
            delete gameVars.roomMessages[roomName];
            //gameVars.roomManager.splice(i, 1);
            delete gameVars.coinPositions[roomName];
            delete gameVars.trapPositions[roomName];

            console.log("Tarolt szoba uzenetek merete torles utan: " + Object.keys(gameVars.roomMessages).length)
        }
    }
    --gameVars.joinedUsers;
    this.server.to(this.room).emit('disconnect', this.id);
    this.leave(this.room);

    console.log("csatlakozott jatekosok szama: " + gameVars.joinedUsers);
    console.log("szobak szama: " + Object.keys(gameVars.roomManager).length);
}

module.exports = {
    onJoined: onJoined,
    onLeave: onLeave
};