module.exports = function(roomSize){
    return {
        id: roomSize,
        name: 'room#' + roomSize,
        player1: '',
        player2: '',
        ready: {p1: false, p2: false}
    };
};