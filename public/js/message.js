    var socket = io();
    console.log(socket.id);
    $('form').submit(function () {
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });
    socket.on('chat message', function (msg) {
        $('#messages').append($('<li>').text(msg));
    });

    document.querySelector('.chat').style.marginLeft = $(window).width() - 300 + "px";


socket.on('move', function(msg) {
    console.log('Kapott:', msg)
    cubes[msg.sid].position.x = msg.pos.x;
    cubes[msg.sid].position.y = msg.pos.y;
    cubes[msg.sid].position.z = msg.pos.z;
})

socket.on('new', function(msg) {
    var cubeGeometry = new THREE.BoxGeometry(1, 0.5, 0.5);
    var cubeMaterial = new THREE.MeshBasicMaterial({color:  0x00990000});
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(cube);
    cubes[msg] = cube;
})