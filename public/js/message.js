//console.log(socket.id);
$('form').submit(function () {
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
});
socket.on('chat message', function (msg) {
    $('#messages').append($('<li>').text(msg));
});

document.querySelector('.chat').style.marginLeft = $(window).width() - 300 + "px";

/*
socket.on('move', function (msg) {
    //console.log('Kapott:', msg)
    cubes[msg.sid].position.x = msg.pos.x;
    cubes[msg.sid].position.y = msg.pos.y;
    cubes[msg.sid].position.z = msg.pos.z;
});*/

socket.on('new', function (msg) {
    var socketCubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    var socketCubeMaterial = new THREE.MeshBasicMaterial({color:  0x00FFFF33});
    var socketCube = new THREE.Mesh(socketCubeGeometry, socketCubeMaterial);

    cubes[msg] = socketCube;
    cubes[msg].position.x = 0.0;
    cubes[msg].position.y = 1.0;
    cubes[msg].position.z = 1.0;
    scene.add(cubes[msg]);
});