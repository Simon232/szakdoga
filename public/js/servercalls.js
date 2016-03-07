socket.on('new', function (msg) {

    socket.room = msg.room;
    if (thisSocket == undefined) { //sajat kocka

        var R = Math.floor(Math.random() * 256);
        var G = Math.floor(Math.random() * 256);
        var B = Math.floor(Math.random() * 256);

        thisRoom = msg.room;
        thisSocket = msg.sid;
        thisColor = "rgb(" + R + "," + G + "," + B + ")";

        var socketCubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        //var socketCubeMaterial = new THREE.MeshBasicMaterial({color: thisColor});
        var socketCubeMaterial = new THREE.MeshPhongMaterial({
            ambient: 0x050505,
            color: thisColor,
            specular: 0x555555,
            shininess: 30
        });

        cubes[thisSocket] = new THREE.Mesh(socketCubeGeometry, socketCubeMaterial);
        cubes[thisSocket].position.x = 0.0;
        cubes[thisSocket].position.y = 1.0;
        cubes[thisSocket].position.z = 1.0;


        scene.add(cubes[thisSocket]);

    }

    if (socket.id != undefined) { // elk�ld�m a kock�mat az �jnak
        console.log("aaaa Ez vagyok �n: ", thisSocket);
        try {

            socket.emit('update', {
                sid: thisSocket,
                x: cubes[thisSocket].position.x,
                y: cubes[thisSocket].position.y,
                z: cubes[thisSocket].position.z,
                rotationY: cubes[thisSocket].rotation.y,
                color: thisColor,
                room: thisRoom
            });

        } catch (e) {
            console.log(e);
        }
    }
});


socket.on('move', function (obj) {
    if(obj.room == thisRoom){
        cubes[obj.sid].position.x = obj.pos.x;
        cubes[obj.sid].position.y = obj.pos.y;
        cubes[obj.sid].position.z = obj.pos.z;
    }
});

socket.on('rotation', function (msg) {
    if(msg.room == thisRoom){
        cubes[msg.sid].rotation.y += msg.rotY;
    }
});

socket.on('disconnect', function (msg) {
    console.log("user disconnected: ", msg);
    scene.remove(cubes[msg]);
});

socket.on('update', function (msg) {

    console.log("aaaaa Ezt kaptam: ", msg);
    if (msg.room == thisRoom) {
        if (cubes[msg.sid] == undefined) {

            var socketCubeGeometry = new THREE.BoxGeometry(1, 1, 1);
            //var socketCubeMaterial = new THREE.MeshBasicMaterial({color: msg.color});
            var socketCubeMaterial = new THREE.MeshPhongMaterial({
                ambient: 0x050505,
                color: msg.color,
                specular: 0x555555,
                shininess: 30
            });
            cubes[msg.sid] = new THREE.Mesh(socketCubeGeometry, socketCubeMaterial);
            cubes[msg.sid].position.x = msg.x;
            cubes[msg.sid].position.y = msg.y;
            cubes[msg.sid].position.z = msg.z;
            cubes[msg.sid].rotation.y = msg.rotationY;

            scene.add(cubes[msg.sid]);
        }
    }
});

socket.on('chat message', function (msg) {
    $('#messages').append($('<li>').text(msg));
});