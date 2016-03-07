var keyboard = new THREEx.KeyboardState();
var socket = io();

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var light = new THREE.DirectionalLight(0xffffff);
light.position.set(0.5, 1, 1).normalize();
scene.add(light);

var renderer = new THREE.WebGLRenderer();
/*renderer.setSize(window.innerWidth / 2 + (window.innerWidth / 4),
    window.innerHeight / 2 + (window.innerHeight / 4));*/
renderer.setSize(window.innerWidth - (window.innerWidth/100), window.innerHeight - (window.innerHeight/50));
document.body.appendChild(renderer.domElement);

socket.on('new', function (msg) {

    console.log("beléptem!!!");
    if (thisSocket == undefined) { //sajat kocka

        var R = Math.floor(Math.random() * 256);
        var G = Math.floor(Math.random() * 256);
        var B = Math.floor(Math.random() * 256);

        socket.room = msg.room;
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

    if (socket.id != undefined) { // elkï¿½ldï¿½m a kockï¿½mat az ï¿½jnak
        console.log("aaaa Ez vagyok ï¿½n: ", thisSocket);
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
    };
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

var PI = 3.14;

var line_geo = new THREE.BoxGeometry(1000, 0.1, 0.1);
var line_geo2 = new THREE.BoxGeometry(0.1, 1000, 0.1);
var line_geo3 = new THREE.BoxGeometry(0.1, 0.1, 1000);
var line_material = new THREE.MeshBasicMaterial({color: 0x00006633}); //zold
var line2_material = new THREE.MeshBasicMaterial({color: 0x00990000}); //piros
var line3_material = new THREE.MeshBasicMaterial({color: 0x00003399}); //kek
var x_line = new THREE.Mesh(line_geo, line_material);
var y_line = new THREE.Mesh(line_geo2, line2_material);
var z_line = new THREE.Mesh(line_geo3, line3_material);

// load a texture, set wrap mode to repeat
var texture = new THREE.TextureLoader().load("pics/sand.jpg");
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(256, 256);

var ground_geo = new THREE.BoxGeometry(1000, 0.0001, 1000);
//var cube_material = new THREE.MeshPhongMaterial( { ambient: 0x050505, color: 0x0033ff, specular: 0x555555, shininess: 30 } );
var ground_material = new THREE.MeshPhongMaterial({map: texture});
var ground = new THREE.Mesh(ground_geo, ground_material);
ground.position.x = 0;
ground.position.y = 0;
ground.position.z = 0;
scene.add(ground);

var cubes = {};
var pause = false;

var thisSocket = undefined;
var thisColor = undefined;
var thisRoom = undefined;

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
    socketCube: {
        x: 0.0,
        y: 1.0,
        z: 1.0,
        rotY: 0.0
    }
};

var changeScene = function () {
    camera.position.x = obj.camera.x;
    camera.position.y = obj.camera.y;
    camera.position.z = obj.camera.z;

    if (socket.id !== undefined && socket.id !== null) {

        socket.emit('move', {
            sid: '/#' + socket.id,
            pos: obj.socketCube,
            rotY: obj.socketCube.rotY,
            room: thisRoom
        });

    }

};

scene.add(x_line); //zold
scene.add(y_line); //piros
scene.add(z_line); //kek




var render = function () {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
};

render();

