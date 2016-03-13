/*x = cx + r * cos(a)
 y = cy + r * sin(a)
 * */



/*
 if (map[37] && map[38]) { // left + up
 if (!pause
 && (obj.socketCube.x - movingSpeed) > -gameWidth / 2 + cubeHalf
 && (obj.socketCube.z - movingSpeed) > -gameWidth / 2 + cubeHalf) {
 obj.socketCube.x -= movingSpeed;
 obj.socketCube.z -= movingSpeed;
 obj.camera.lookX -= movingSpeed;
 obj.camera.lookZ -= movingSpeed;
 changeScene();
 }
 return;
 }
 else if (map[38] && map[39]) { // up + right
 if (!pause
 && (obj.socketCube.x + movingSpeed) < gameWidth / 2 - cubeHalf
 && (obj.socketCube.z - movingSpeed) > -gameWidth / 2 + cubeHalf) {

 obj.socketCube.z -= movingSpeed;
 obj.socketCube.x += movingSpeed;

 obj.camera.lookX += movingSpeed;
 obj.camera.lookZ -= movingSpeed;
 changeScene();
 }
 return;
 }
 else if (map[37] && map[40]) { // left + down
 if (!pause
 && (obj.socketCube.x - movingSpeed) > -gameWidth / 2 + cubeHalf
 && (obj.socketCube.z + movingSpeed) < gameWidth / 2 - cubeHalf) {

 obj.socketCube.x -= movingSpeed;
 obj.socketCube.z += movingSpeed;
 obj.camera.lookX -= movingSpeed;
 obj.camera.lookZ += movingSpeed;
 changeScene();
 }
 return;
 }
 else if (map[39] && map[40]) { // left + right
 if (!pause
 && (obj.socketCube.x + movingSpeed) < gameWidth / 2 - cubeHalf
 && (obj.socketCube.z + movingSpeed) < gameWidth / 2 - cubeHalf) {

 obj.socketCube.x += movingSpeed;
 obj.socketCube.z += movingSpeed;
 obj.camera.lookX += movingSpeed;
 obj.camera.lookZ += movingSpeed;
 changeScene();
 }
 return;
 }*/
/*
 else if (map[87] && map[65]) { // W + A
 if (!pause) {

 if ((obj.socketCube.z - movingSpeed) > -gameWidth / 2 + cubeHalf) {
 obj.camera.z -= movingSpeed;
 obj.socketCube.z -= movingSpeed;
 obj.camera.lookZ -= movingSpeed;
 }

 if ((obj.socketCube.x - movingSpeed) > -gameWidth / 2 + cubeHalf) {
 obj.camera.x -= movingSpeed;
 obj.socketCube.x -= movingSpeed;
 obj.camera.lookX -= movingSpeed;
 }
 changeScene();
 }
 return;
 }*/
/*
 else if (map[87] && map[68]) { // W + D
 if (!pause) {
 if ((obj.socketCube.z - movingSpeed) > -gameWidth / 2 + cubeHalf) {
 obj.camera.z -= movingSpeed;
 obj.socketCube.z -= movingSpeed;
 obj.camera.lookZ -= movingSpeed;
 }

 if ((obj.socketCube.x + movingSpeed) < gameWidth / 2 - cubeHalf) {
 obj.camera.x += movingSpeed;
 obj.socketCube.x += movingSpeed;
 obj.camera.lookX += movingSpeed;
 }

 changeScene();
 }
 return;
 }
 */
/*
 else if (map[83] && map[65]) { // S + A
 if (!pause) {

 if ((obj.socketCube.z + movingSpeed) < gameWidth / 2 - cubeHalf) {
 obj.camera.z += movingSpeed;
 obj.socketCube.z += movingSpeed;
 obj.camera.lookZ += movingSpeed;
 }

 if ((obj.socketCube.x - movingSpeed) > -gameWidth / 2 + cubeHalf) {
 obj.camera.x -= movingSpeed;
 obj.socketCube.x -= movingSpeed;
 obj.camera.lookX -= movingSpeed;
 }
 changeScene();
 }
 return;
 }
 */
/*
 else if (map[83] && map[68]) { // S + D
 if (!pause) {
 if ((obj.socketCube.z + movingSpeed) < gameWidth / 2 - cubeHalf) {
 obj.camera.z += movingSpeed;
 obj.socketCube.z += movingSpeed;
 obj.camera.lookZ += movingSpeed;
 }

 if ((obj.socketCube.x + movingSpeed) < gameWidth / 2 - cubeHalf) {
 obj.camera.x += movingSpeed;
 obj.socketCube.x += movingSpeed;
 obj.camera.lookX += movingSpeed;
 }
 changeScene();
 }
 return;
 }
 */

/*
 else if (map[68] && map[69]) { // D + E
 if (!pause
 && (obj.socketCube.x + movingSpeed) < gameWidth / 2 - cubeHalf) {
 obj.camera.x += movingSpeed;
 obj.socketCube.x += movingSpeed;


 obj.camera.lookX += movingSpeed;

 cubes[thisSocket].rotation.y -= rotationSpeed;
 socket.emit('rotation', {
 sid: thisSocket,
 rotY: -rotationSpeed,
 room: thisRoom
 }
 );
 changeScene();
 }
 return;
 }
 */

/*
 else if (map[65] && map[69]) { // A + E
 if (!pause
 && (obj.socketCube.x - movingSpeed) > -gameWidth / 2 + cubeHalf) {
 obj.camera.x -= movingSpeed;
 obj.socketCube.x -= movingSpeed;

 obj.camera.lookX -= movingSpeed;

 cubes[thisSocket].rotation.y -= rotationSpeed;
 socket.emit('rotation', {
 sid: thisSocket,
 rotY: -rotationSpeed,
 room: thisRoom
 }
 );
 changeScene();
 }
 return;
 }
 */

/*
 else if (map[68] && map[81]) { // D + Q
 if (!pause
 && (obj.socketCube.x + movingSpeed) < gameWidth / 2 - cubeHalf) {
 obj.camera.x += movingSpeed;
 obj.socketCube.x += movingSpeed;

 obj.camera.lookX += movingSpeed;

 cubes[thisSocket].rotation.y += rotationSpeed;
 socket.emit('rotation', {
 sid: thisSocket,
 rotY: rotationSpeed,
 room: thisRoom
 }
 );
 changeScene();
 }
 return;
 }*/

/*
 else if (map[65] && map[81]) { // A + Q
 if (!pause
 && (obj.socketCube.x - movingSpeed) > -gameWidth / 2 + cubeHalf) {
 obj.camera.x -= movingSpeed;
 obj.socketCube.x -= movingSpeed;

 obj.camera.lookX -= movingSpeed;

 cubes[thisSocket].rotation.y += rotationSpeed;
 socket.emit('rotation', {
 sid: thisSocket,
 rotY: rotationSpeed,
 room: thisRoom
 }
 );
 changeScene();
 }
 return;
 }
 */
/*
 else if (map[38]) { // UP
 if (!pause
 && (obj.socketCube.z - movingSpeed) > -gameWidth / 2 + cubeHalf) {
 obj.socketCube.z -= movingSpeed;
 obj.camera.lookZ -= movingSpeed;
 changeScene();
 }
 return;
 }
 else if (map[37]) { // LEFT
 if (!pause
 && (obj.socketCube.x - movingSpeed) > -gameWidth / 2 + cubeHalf) {
 obj.socketCube.x -= movingSpeed;

 obj.camera.lookX -= movingSpeed;

 changeScene();
 }
 return;
 }
 else if (map[39]) { // RIGHT
 if (!pause
 && (obj.socketCube.x + movingSpeed) < gameWidth / 2 - cubeHalf) {
 obj.socketCube.x += movingSpeed;

 obj.camera.lookX += movingSpeed;

 changeScene();
 }
 return;
 }
 else if (map[40]) { // DOWN
 if (!pause
 && (obj.socketCube.z + movingSpeed) < gameWidth / 2 - cubeHalf) {
 obj.socketCube.z += movingSpeed;


 obj.camera.lookZ += movingSpeed;
 changeScene();
 }
 return;
 }*/
/*
 else if (map[81]) { // Q
 if (!pause) {
 //cubes[thisSocket].rotateY(movingSpeed);
 //obj.socketCube.rotY += movingSpeed;
 //obj.socketCube.rotY = movingSpeed;
 cubes[thisSocket].rotation.y += rotationSpeed;
 socket.emit('rotation', {
 sid: thisSocket,
 rotY: rotationSpeed,
 room: thisRoom
 }
 );
 changeScene();
 }
 return;
 }
 else if (map[69]) { // E
 if (!pause) {
 //cubes[thisSocket].rotateY(-movingSpeed);
 //obj.socketCube.rotY -= movingSpeed;
 //obj.socketCube.rotY = -movingSpeed;
 cubes[thisSocket].rotation.y -= rotationSpeed;
 socket.emit('rotation', {
 sid: thisSocket,
 rotY: -rotationSpeed,
 room: thisRoom
 }
 );
 changeScene();
 }
 return;


 if (map[82]) { // R
 obj.camera.lookY += movingSpeed;
 changeScene();
 //return;
 }
 if (map[70]) { // F
 obj.camera.lookY -= movingSpeed;
 changeScene();
 //return;
 }s
 }*/