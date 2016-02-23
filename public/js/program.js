var keyboard = new THREEx.KeyboardState();
var socket = io();
var cubes = {};

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

//var cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
//var cubeMaterial = new THREE.MeshBasicMaterial({color: 0x00FFFF33});
//var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);




var x = 0;
var y = 0;
var z = 0;

var moveX = 0;
var moveZ = 3;

camera.position.x = 0;
camera.position.y = 6;
camera.position.z = 5;

//cube.position.x = 0.0;
//cube.position.y = 1.0;
//cube.position.z = 1.0;


camera.lookAt(new THREE.Vector3(x, y, z));

//var def_cam_x = camera.position.x;
//var def_cam_y = camera.position.y;
//var def_cam_z = camera.position.z;

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

jQuery(document).keydown(function (e) {
    var prevent = true;
    // Update the state of the attached control to "true"
    switch (e.keyCode) {
        case 37:
            obj.socketCube.x -= 0.1;
            //pressed arrow left
            changeScene();
            break;
        case 38:
            //pressed arrow up
            obj.socketCube.z += 0.1;
            changeScene();
            break;
        case 39:
            //pressed arrow right
            obj.socketCube.x += 0.1;
            changeScene();
            break;
        case 40:
            //pressed arrow down
            obj.socketCube.z -= 0.1;
            changeScene();
            break;
        case 87:
            //pressed 'W'
            obj.camera.z -= 0.1;
            obj.cube.z -= 0.1;
            obj.socketCube.z -= 0.1;
            changeScene();
            break;
        case 83:
            //pressed 'S'
            obj.camera.z += 0.1;
            obj.cube.z += 0.1;
            obj.socketCube.z += 0.1;
            changeScene();
            break;
        case 65:
            //pressed 'A'
            obj.camera.x -= 0.1;
            obj.cube.x -= 0.1;
            obj.socketCube.x -= 0.1;
            changeScene();
            break;
        case 68:
            //pressed 'D'
            obj.camera.x += 0.1;
            obj.cube.x += 0.1;
            obj.socketCube.x += 0.1;
            changeScene();
            break;
        case 27:
            //pressed 'esc'
            //x = 0;
            //y = -25;
            //z = 0;

            obj.camera.x = 0;
            obj.camera.y = 6;
            obj.camera.z = 5;

            obj.cube.x = 0.0;
            obj.cube.y = 1.0;
            obj.cube.z = 1.0;

            obj.socketCube.x = 0.0;
            obj.socketCube.y = 1.0;
            obj.socketCube.z = 1.0;
            //camera.lookAt(new THREE.Vector3(x, y, z));
            changeScene();
            break;
        default:
            prevent = false;
    }
    // Avoid the browser to react unexpectedly
    if (prevent) {
        e.preventDefault();
    } else {
        return;
    }
});




var changeScene = function () {
    camera.position.x = obj.camera.x;
    camera.position.y = obj.camera.y;
    camera.position.z = obj.camera.z;

    //cube.position.x = obj.cube.x;
    //cube.position.y = obj.cube.y;
    //cube.position.z = obj.cube.z;

    if(socket.id !== undefined && socket.id !== null) {
        cubes['/#' + socket.id].position.x = obj.socketCube.x;
        cubes['/#' + socket.id].position.y = obj.socketCube.y;
        cubes['/#' + socket.id].position.z = obj.socketCube.z;
    }
};
//scene.add(cube);
scene.add(x_line); //z�ld
scene.add(y_line); //piros
scene.add(z_line); //k�k

var render = function () {
    requestAnimationFrame(render);
    changeScene();

    renderer.render(scene, camera);
};

render();
//renderer.render(scene, camera);
