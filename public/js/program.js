var keyboard = new THREEx.KeyboardState();

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

var cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
var cubeMaterial = new THREE.MeshBasicMaterial({color: 0x00FFFF33});
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

var cubes = {};



var x = 0;
var y = -25;
var z = 0;

var moveX = 0;
var moveZ = 3;

camera.position.x = 0;
camera.position.y = 6;
camera.position.z = 15;

cube.position.x = 0.0;
cube.position.y = 1.0;
cube.position.z = 1.0;


camera.lookAt(new THREE.Vector3(x, y, z));

var def_cam_x = camera.position.x;
var def_cam_y = camera.position.y;
var def_cam_z = camera.position.z;

var buttonPressed = function () {
    if (keyboard.pressed("q")) {
        cube.position.z += 0.1;
    }
    if (keyboard.pressed("e")) {
        cube.position.z -= 0.1;
    }


    if (keyboard.pressed("a")) {
        moveX -= 0.1;
        cube.position.x -= 0.1;
    }
    if (keyboard.pressed("d")) {
        moveX += 0.1;
        cube.position.x += 0.1;
    }

    if (keyboard.pressed("w" || "keyup")) {
        moveZ -= 0.1;
        cube.position.z -= 0.1;
    }
    if (keyboard.pressed("s")) {
        moveZ += 0.1;
        cube.position.z += 0.1;
    }


    if (keyboard.pressed("t")) {
        cube.position.y += 0.1;
    }
    if (keyboard.pressed("g")) {
        cube.position.y -= 0.1;
    }

    if (keyboard.pressed("escape")) {
        x = 0;
        y = -25;
        z = 0;

        camera.position.x = 0;
        camera.position.y = 6;
        camera.position.z = 15;

        cube.position.x = 0.0;
        cube.position.y = 1.0;
        cube.position.z = 1.0;

        moveX = 0;
        moveZ = 3;
        camera.lookAt(new THREE.Vector3(x, y, z))
    }
    //camera.lookAt(new THREE.Vector3(x, y, z))
    camera.position.x = moveX;
    camera.position.z = moveZ;

    if (socket !== undefined) {
        //console.log(socket)
        cubes[socket.id] = cube;
        socket.emit('move', {
            sid: socket.id,
            pos: cube.position
        });
    }

};


scene.add(cube);
scene.add(x_line); //z�ld
scene.add(y_line); //piros
scene.add(z_line); //k�k

var render = function () {
    requestAnimationFrame(render);
    buttonPressed();


    cube.rotation.y += 0.01;
    //cube2.rotation.x += 0.1;

    //floor.rotation.z += 0.1;

    renderer.render(scene, camera);
};

render();
