socket.on('new', function (msg) {

    if (thisSocket == undefined) {

        var R = Math.floor(Math.random() * 256);
        var G = Math.floor(Math.random() * 256);
        var B = Math.floor(Math.random() * 256);

        thisSocket = msg;
        thisColor = "rgb(" + R + "," + G + "," + B + ")";

        var socketCubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        //var socketCubeMaterial = new THREE.MeshBasicMaterial({color: thisColor});
        var socketCubeMaterial = new THREE.MeshPhongMaterial( { ambient: 0x050505, color: thisColor, specular: 0x555555, shininess: 30 } );

        cubes[msg] = new THREE.Mesh(socketCubeGeometry, socketCubeMaterial);
        cubes[msg].position.x = 0.0;
        cubes[msg].position.y = 1.0;
        cubes[msg].position.z = 1.0;

        scene.add(cubes[msg]);
    }

    if (socket.id != undefined) {
        console.log("aaaa Ez vagyok én: ", thisSocket);
        try {
            socket.emit('update', {
                sid: thisSocket,
                x: cubes[thisSocket].position.x,
                y: cubes[thisSocket].position.y,
                z: cubes[thisSocket].position.z,
                rotationY: cubes[thisSocket].rotation.y,
                color: thisColor
            });

        } catch (e) {
            console.log(e);
        }
    }
});


socket.on('move', function (obj) {
    cubes[obj.sid].position.x = obj.pos.x;
    cubes[obj.sid].position.y = obj.pos.y;
    cubes[obj.sid].position.z = obj.pos.z;
});

socket.on('rotation', function (msg){
    cubes[msg.sid].rotation.y += msg.rotY;
});

socket.on('disconnect', function (msg) {
    console.log("user disconnected: ", msg);
    scene.remove(cubes[msg]);
});


socket.on('update', function (msg) {

    console.log("aaaaa Ezt kaptam: ", msg);

    if (cubes[msg.sid] == undefined) {

        var socketCubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        //var socketCubeMaterial = new THREE.MeshBasicMaterial({color: msg.color});
        var socketCubeMaterial = new THREE.MeshPhongMaterial( { ambient: 0x050505, color: msg.color, specular: 0x555555, shininess: 30 } );
        cubes[msg.sid] = new THREE.Mesh(socketCubeGeometry, socketCubeMaterial);
        cubes[msg.sid].position.x = msg.x;
        cubes[msg.sid].position.y = msg.y;
        cubes[msg.sid].position.z = msg.z;
        cubes[msg.sid].rotation.y = msg.rotationY;

        scene.add(cubes[msg.sid]);
    }
});
socket.on('chat message', function (msg) {
    $('#messages').append($('<li>').text(msg));
});