var keyboard = new THREEx.KeyboardState();
var socket = io();


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth / 2 + (window.innerWidth / 4),
    window.innerHeight / 2 + (window.innerHeight / 4));
document.body.appendChild(renderer.domElement);


var PI = 3.14;

var line_geo = new THREE.BoxGeometry(1000, 0.1, 0.1);
var line_geo2 = new THREE.BoxGeometry(0.1, 1000, 0.1);
var line_geo3 = new THREE.BoxGeometry(0.1, 0.1, 1000);
var line_material = new THREE.MeshBasicMaterial({color: 0x00006633}); //z�ld
var line2_material = new THREE.MeshBasicMaterial({color: 0x00990000}); //piros
var line3_material = new THREE.MeshBasicMaterial({color: 0x00003399}); //k�k
var x_line = new THREE.Mesh(line_geo, line_material);
var y_line = new THREE.Mesh(line_geo2, line2_material);
var z_line = new THREE.Mesh(line_geo3, line3_material);

var cubes = {};

var thisSocket = undefined;
var thisColor = undefined;


socket.on('new', function (msg) {

    if (thisSocket == undefined) {

        var R = Math.floor(Math.random() * 256);
        var G = Math.floor(Math.random() * 256);
        var B = Math.floor(Math.random() * 256);
        //var color = '#' + rgbToHex(R, G, B);

        thisSocket = msg;
        thisColor = color;

        var socketCubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        var socketCubeMaterial = new THREE.MeshBasicMaterial({color: "rgb(" + R + "," + G + "," + B + ")"});

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
                color: thisColor
            });

        } catch (e) {
            console.log(e);
        }
    }
});
/*
var rgbToHex = function (R, G, B) {
    return toHex(R) + toHex(G) + toHex(B)
};
var toHex = function (n) {
    n = parseInt(n, 10);
    if (isNaN(n)) {
        return "00";
    }
    n = Math.max(0, Math.min(n, 255));
    return "0123456789ABCDEF".charAt((n - n % 16) / 16)
        + "0123456789ABCDEF".charAt(n % 16);
};
*/

socket.on('disconnect', function (msg) {
    console.log("user disconnected: ", msg);
    scene.remove(cubes[msg]);
});

socket.on('update', function (msg) {

    console.log("aaaaa Ezt kaptam: ", msg);

    if (cubes[msg.sid] == undefined) {

        var socketCubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        var socketCubeMaterial = new THREE.MeshBasicMaterial({color: msg.color});
        cubes[msg.sid] = new THREE.Mesh(socketCubeGeometry, socketCubeMaterial);
        cubes[msg.sid].position.x = msg.x;
        cubes[msg.sid].position.y = msg.y;
        cubes[msg.sid].position.z = msg.z;

        scene.add(cubes[msg.sid]);
    }
});


var x = 0;
var y = 0;
var z = 0;

camera.position.x = 0;
camera.position.y = 6;
camera.position.z = 5;

camera.lookAt(new THREE.Vector3(x, y, z));

var obj = {
    camera: {
        x: 0,
        y: 6,
        z: 5
    },
    cube: {
        x: 0.0,
        y: 1.0,
        z: 1.0
    },
    socketCube: {
        x: 0.0,
        y: 1.0,
        z: 1.0
    }
};

var map = {
    37: false, // left
    38: false, // up
    39: false, // right
    40: false, // down
    87: false, // W
    83: false, // S
    65: false, // A
    68: false, // D
    27: false  // ESC
};
jQuery(document).keydown(function (e) {
    var prevent = true;
    // Update the state of the attached control to "true"

    if (e.keyCode in map) {
        map[e.keyCode] = true;
        if (map[37] && map[38]) { // left + up
            obj.socketCube.x -= 0.1;
            obj.socketCube.z -= 0.1;
            changeScene();
        }
        else if (map[38] && map[39]) { // up + right
            obj.socketCube.z -= 0.1;
            obj.socketCube.x += 0.1;
            changeScene();
        }
        else if (map[37] && map[40]) { // left + down
            obj.socketCube.x -= 0.1;
            obj.socketCube.z += 0.1;
            changeScene();
        }
        else if (map[39] && map[40]) { // left + right
            obj.socketCube.x += 0.1;
            obj.socketCube.z += 0.1;
            changeScene();
        }
        else if (map[87] && map[65]) { // W + A
            obj.camera.z -= 0.1;
            obj.socketCube.z -= 0.1;

            obj.camera.x -= 0.1;
            obj.socketCube.x -= 0.1;
            changeScene();
        }
        else if (map[87] && map[68]) { // W + D
            obj.camera.z -= 0.1;
            obj.socketCube.z -= 0.1;

            obj.camera.x += 0.1;
            obj.socketCube.x += 0.1;
            changeScene();
        }
        else if (map[83] && map[65]) { // S + A
            obj.camera.z += 0.1;
            obj.socketCube.z += 0.1;

            obj.camera.x -= 0.1;
            obj.socketCube.x -= 0.1;
            changeScene();
        }
        else if (map[83] && map[68]) { // S + D
            obj.camera.z += 0.1;
            obj.socketCube.z += 0.1;

            obj.camera.x += 0.1;
            obj.socketCube.x += 0.1;
            changeScene();
        }
        else if (map[38]) {
            obj.socketCube.z -= 0.1;
            changeScene();
        }
        else if (map[37]) {
            obj.socketCube.x -= 0.1;
            changeScene();
        }
        else if (map[39]) {
            obj.socketCube.x += 0.1;
            changeScene();
        }
        else if (map[40]) {
            obj.socketCube.z += 0.1;
            changeScene();
        }
        else if (map[87]) {
            obj.camera.z -= 0.1;
            obj.socketCube.z -= 0.1;
            changeScene();
        }
        else if (map[83]) {
            obj.camera.z += 0.1;
            obj.socketCube.z += 0.1;
            changeScene();
        }
        else if (map[65]) {
            obj.camera.x -= 0.1;
            obj.socketCube.x -= 0.1;
            changeScene();
        }
        else if (map[68]) {
            obj.camera.x += 0.1;
            obj.socketCube.x += 0.1;
            changeScene();
        }
        else if (map[27]) {
            obj.camera.x = 0;
            obj.camera.y = 6;
            obj.camera.z = 5;


            obj.socketCube.x = 0.0;
            obj.socketCube.y = 1.0;
            obj.socketCube.z = 1.0;
            changeScene();
        } else {
            prevent = false;
        }

    }

    if (prevent) {
        e.preventDefault();
    } else {
        return;
    }
}).keyup(function (e) {
    if (e.keyCode in map) {
        map[e.keyCode] = false;
    }
});


var changeScene = function () {
    camera.position.x = obj.camera.x;
    camera.position.y = obj.camera.y;
    camera.position.z = obj.camera.z;

    if (socket.id !== undefined && socket.id !== null) {

        socket.emit('move', {
            sid: '/#' + socket.id,
            pos: obj.socketCube
        });

    }

    socket.on('move', function (obj) {
        cubes[obj.sid].position.x = obj.pos.x;
        cubes[obj.sid].position.y = obj.pos.y;
        cubes[obj.sid].position.z = obj.pos.z;
    });


};

//scene.add(cube);
scene.add(x_line); //zold
scene.add(y_line); //piros
scene.add(z_line); //kek

var render = function () {
    requestAnimationFrame(render);

    renderer.render(scene, camera);
};

render();

