var PI = Math.PI;
var movingSpeed = 0.1;
var rotationSpeed = PI / 32;
var cubeHalf = 0.49;

var map = {
    37: false, // left
    38: false, // up
    39: false, // right
    40: false, // down
    87: false, // W
    83: false, // S
    65: false, // A
    68: false, // D
    27: false, // ESC
    81: false, // Q
    69: false, // E
    80: false, // P
    82: false, // R
    70: false  // F
};
jQuery(document).keydown(function (e) {
    var prevent = true;
    // Update the state of the attached control to "true"

    if (e.keyCode in map) {
        map[e.keyCode] = true;

        if (map[87] && map[68]) { //  W + D
            if (!pause
                && (obj.socketCube.z - movingSpeed) > -gameWidth / 2 + cubeHalf) {

                cubes[thisSocket].rotation.y -= rotationSpeed;
                socket.emit('rotation', {
                        sid: thisSocket,
                        rotY: -rotationSpeed,
                        room: thisRoom
                    }
                );

                obj.camera.z -= Math.cos(cubes[thisSocket].rotation.y) * movingSpeed;
                obj.camera.x -= Math.sin(cubes[thisSocket].rotation.y) * movingSpeed;


                obj.socketCube.z -= Math.cos(cubes[thisSocket].rotation.y) * movingSpeed;
                obj.socketCube.x -= Math.sin(cubes[thisSocket].rotation.y) * movingSpeed;


                changeScene();
            }
            //return;
        }

        if (map[83] && map[68]) { // S + D
            if (!pause
                && (obj.socketCube.z + movingSpeed) < gameWidth / 2 - cubeHalf) {

                cubes[thisSocket].rotation.y += rotationSpeed;
                socket.emit('rotation', {
                        sid: thisSocket,
                        rotY: rotationSpeed,
                        room: thisRoom
                    }
                );

                obj.camera.z += Math.cos(cubes[thisSocket].rotation.y) * movingSpeed;
                obj.camera.x += Math.sin(cubes[thisSocket].rotation.y) * movingSpeed;


                obj.socketCube.z += Math.cos(cubes[thisSocket].rotation.y) * movingSpeed;
                obj.socketCube.x += Math.sin(cubes[thisSocket].rotation.y) * movingSpeed;
                changeScene();
            }
            //return;
        }

        if (map[87] && map[65]) { // W + A
            if (!pause
                && (obj.socketCube.z - movingSpeed) > -gameWidth / 2 + cubeHalf) {
                cubes[thisSocket].rotation.y += rotationSpeed;
                socket.emit('rotation', {
                        sid: thisSocket,
                        rotY: rotationSpeed,
                        room: thisRoom
                    }
                );

                obj.camera.z -= Math.cos(cubes[thisSocket].rotation.y) * movingSpeed;
                obj.camera.x -= Math.sin(cubes[thisSocket].rotation.y) * movingSpeed;


                obj.socketCube.z -= Math.cos(cubes[thisSocket].rotation.y) * movingSpeed;
                obj.socketCube.x -= Math.sin(cubes[thisSocket].rotation.y) * movingSpeed;
                changeScene();
            }
            //return;
        }

        if (map[83] && map[65]) { // S + A
            if (!pause
                && (obj.socketCube.z + movingSpeed) < gameWidth / 2 - cubeHalf) {
                cubes[thisSocket].rotation.y -= rotationSpeed;
                socket.emit('rotation', {
                        sid: thisSocket,
                        rotY: -rotationSpeed,
                        room: thisRoom
                    }
                );

                obj.camera.z += Math.cos(cubes[thisSocket].rotation.y) * movingSpeed;
                obj.camera.x += Math.sin(cubes[thisSocket].rotation.y) * movingSpeed;


                obj.socketCube.z += Math.cos(cubes[thisSocket].rotation.y) * movingSpeed;
                obj.socketCube.x += Math.sin(cubes[thisSocket].rotation.y) * movingSpeed;

                changeScene();
            }
            //return;
        }

        if (map[82]) { // R
            obj.camera.lookY += movingSpeed;
            changeScene();
            //return;
        }
        if (map[70]) { // F
            obj.camera.lookY -= movingSpeed;
            changeScene();
            //return;
        }
        if (map[87]) { // W
            if (!pause &&
                (obj.socketCube.z - movingSpeed) > (-1 * gameWidth) / 2 + cubeHalf) {

                obj.camera.z -= Math.cos(cubes[thisSocket].rotation.y) * movingSpeed;
                obj.camera.x -= Math.sin(cubes[thisSocket].rotation.y) * movingSpeed;


                obj.socketCube.z -= Math.cos(cubes[thisSocket].rotation.y) * movingSpeed;
                obj.socketCube.x -= Math.sin(cubes[thisSocket].rotation.y) * movingSpeed;

                changeScene();
            } else {
                console.log(gameWidth);
            }
            //return;
        }
        if (map[83]) { // S
            if (!pause
                && (obj.socketCube.z + movingSpeed) < gameWidth / 2 - cubeHalf) {

                obj.camera.z += Math.cos(cubes[thisSocket].rotation.y) * movingSpeed;
                obj.camera.x += Math.sin(cubes[thisSocket].rotation.y) * movingSpeed;


                obj.socketCube.z += Math.cos(cubes[thisSocket].rotation.y) * movingSpeed;
                obj.socketCube.x += Math.sin(cubes[thisSocket].rotation.y) * movingSpeed;

                changeScene();
            }
            //return;
        }
        if (map[65]) { // A
            if (!pause
                && (obj.socketCube.x - movingSpeed) > -gameWidth / 2 + cubeHalf) {
                obj.camera.z += Math.sin(cubes[thisSocket].rotation.y) * movingSpeed;
                obj.camera.x -= Math.cos(cubes[thisSocket].rotation.y) * movingSpeed;


                obj.socketCube.z += Math.sin(cubes[thisSocket].rotation.y) * movingSpeed;
                obj.socketCube.x -= Math.cos(cubes[thisSocket].rotation.y) * movingSpeed;

                changeScene();
            }
            //return;
        }
        if (map[68]) { // D
            if (!pause
                && (obj.socketCube.x + movingSpeed) < gameWidth / 2 - cubeHalf) {
                obj.camera.z -= Math.sin(cubes[thisSocket].rotation.y) * movingSpeed;
                obj.camera.x += Math.cos(cubes[thisSocket].rotation.y) * movingSpeed;


                obj.socketCube.z -= Math.sin(cubes[thisSocket].rotation.y) * movingSpeed;
                obj.socketCube.x += Math.cos(cubes[thisSocket].rotation.y) * movingSpeed;

                changeScene();
            }
            //return;
        }

        if (map[27]) { // ESC
            if (!pause) {
                obj.camera.x = 0;
                obj.camera.y = 4;
                obj.camera.z = 6;
                obj.camera.lookX = 0;
                obj.camera.lookY = 0;
                obj.camera.lookY = 0;
                obj.camera.lookZ = 0;

                obj.socketCube.x = 0.0;
                obj.socketCube.y = 0.5;
                obj.socketCube.z = 1.0;
                obj.rotY = 0.0;
                cubes[thisSocket].rotation.y = 0.0;

                socket.emit('reset', {
                    sid: thisSocket,
                    rotY: 0.0,
                    room: thisRoom
                });

                changeScene();
            }
            //return;
        }
        if (map[80]) {
            pause = !pause;
            //return;
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
        obj.socketCube.rotY = 0.0;
    }
});
