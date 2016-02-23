/**
 * Created by Andris on 2016. 02. 23..
 */
// W

/*
 var buttonPressed = function () {
 //console.log("cubes length: "+ cubes[socket.id].position.x + " my id: " + socket.id);
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
 */