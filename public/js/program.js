var keyboard = new THREEx.KeyboardState();
var socket = io();

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var light = new THREE.DirectionalLight(0xffffff);
light.position.set(0.5, 1, 1).normalize();
scene.add(light);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth / 2 + (window.innerWidth / 4),
    window.innerHeight / 2 + (window.innerHeight / 4));
document.body.appendChild(renderer.domElement);

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
            rotY: obj.socketCube.rotY
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

