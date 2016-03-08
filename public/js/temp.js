/**
 * Created by Andris on 2016. 02. 23..
 */
// W

//programs

//var keyboard = new THREEx.KeyboardState();
//var light = new THREE.DirectionalLight(0xffffff);
//light.position.set(0.5, 1, 1).normalize();
//scene.add(light);



/*renderer.setSize(window.innerWidth / 2 + (window.innerWidth / 4),
 window.innerHeight / 2 + (window.innerHeight / 4));*/

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
