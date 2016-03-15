var PI = Math.PI;
var movingSpeed = 0.05;
var rotationSpeed = PI / 240;
var cubeHalf = 0.49;
var cameraDistance = 6;

var keyPressed = {};

document.addEventListener('keydown', function (e) {
    keyPressed[e.keyCode] = true;
}, false);
document.addEventListener('keyup', function (e) {
    keyPressed[e.keyCode] = false;
}, false);

function gameLogic() {

    if (keyPressed[87] || keyPressed[38]) { // W
        var newX = obj.socketCube.x - Math.sin(cubes[thisSocket].rotation.y) * movingSpeed;
        var newZ = obj.socketCube.z - Math.cos(cubes[thisSocket].rotation.y) * movingSpeed;
        if (!collision(newX, newZ)) {


            if (newZ >= -(gameWidth / 2) + cubeHalf
                && newZ <= (gameWidth / 2) - cubeHalf) {
                obj.socketCube.z -= Math.cos(cubes[thisSocket].rotation.y) * movingSpeed;
            }
            if (newX >= -(gameWidth / 2) + cubeHalf
                && newX <= (gameWidth / 2) - cubeHalf) {
                obj.socketCube.x -= Math.sin(cubes[thisSocket].rotation.y) * movingSpeed;
            }

            obj.camera.z = cubes[thisSocket].position.z + cameraDistance * (Math.cos(cubes[thisSocket].rotation.y));
            obj.camera.x = cubes[thisSocket].position.x + cameraDistance * (Math.sin(cubes[thisSocket].rotation.y));

            changeScene();
        }
    }
    if (keyPressed[83] || keyPressed[40]) { // S
        var newX = obj.socketCube.x + Math.sin(cubes[thisSocket].rotation.y) * movingSpeed;
        var newZ = obj.socketCube.z + Math.cos(cubes[thisSocket].rotation.y) * movingSpeed;
        if (!collision(newX, newZ)) {

            if (newZ >= -(gameWidth / 2) + cubeHalf
                && newZ <= (gameWidth / 2) - cubeHalf
            ) {
                obj.socketCube.z += Math.cos(cubes[thisSocket].rotation.y) * movingSpeed;
            }
            if (newX >= -(gameWidth / 2) + cubeHalf
                && newX <= (gameWidth / 2) - cubeHalf) {
                obj.socketCube.x += Math.sin(cubes[thisSocket].rotation.y) * movingSpeed;
            }

            obj.camera.z = cubes[thisSocket].position.z + cameraDistance * (Math.cos(cubes[thisSocket].rotation.y));
            obj.camera.x = cubes[thisSocket].position.x + cameraDistance * (Math.sin(cubes[thisSocket].rotation.y));

            changeScene();
        }
    }
    if (keyPressed[65] || keyPressed[37]) { // A
        var newX = obj.socketCube.x - Math.cos(cubes[thisSocket].rotation.y) * movingSpeed;
        var newZ = obj.socketCube.z + Math.sin(cubes[thisSocket].rotation.y) * movingSpeed;
        if (!collision(newX, newZ)) {

            if (newZ >= -(gameWidth / 2) + cubeHalf
                && newZ <= (gameWidth / 2) - cubeHalf) {
                obj.socketCube.z += Math.sin(cubes[thisSocket].rotation.y) * movingSpeed;
                obj.camera.z += Math.sin(cubes[thisSocket].rotation.y) * movingSpeed;
            }
            if (newX >= -(gameWidth / 2) + cubeHalf
                && newX <= (gameWidth / 2) - cubeHalf) {
                obj.socketCube.x -= Math.cos(cubes[thisSocket].rotation.y) * movingSpeed;
                obj.camera.x -= Math.cos(cubes[thisSocket].rotation.y) * movingSpeed;
            }

            changeScene();
        }
    }
    if (keyPressed[68] || keyPressed[39]) { // D
        var newX = obj.socketCube.x + Math.cos(cubes[thisSocket].rotation.y) * movingSpeed;
        var newZ = obj.socketCube.z - Math.sin(cubes[thisSocket].rotation.y) * movingSpeed;
        if (!collision(newX, newZ)) {

            if (newZ >= -(gameWidth / 2) + cubeHalf
                && newZ <= (gameWidth / 2) - cubeHalf) {
                obj.socketCube.z -= Math.sin(cubes[thisSocket].rotation.y) * movingSpeed;
                obj.camera.z -= Math.sin(cubes[thisSocket].rotation.y) * movingSpeed;
            }
            if (newX >= -(gameWidth / 2) + cubeHalf
                && newX <= (gameWidth / 2) - cubeHalf) {
                obj.socketCube.x += Math.cos(cubes[thisSocket].rotation.y) * movingSpeed;
                obj.camera.x += Math.cos(cubes[thisSocket].rotation.y) * movingSpeed;
            }
            changeScene();
        }
    }
    /*
     *  37: false, // left
     38: false, // up
     39: false, // right
     40: false, // down
     * */


    if ((keyPressed[87] && keyPressed[68]) || (keyPressed[38] && keyPressed[39])) { // W + D
        if (!pause
            && obj.socketCube.z <= (gameWidth / 2) - cubeHalf && obj.socketCube.z >= -(gameWidth / 2) + cubeHalf
            && obj.socketCube.x <= (gameWidth / 2) - cubeHalf && obj.socketCube.x >= -(gameWidth / 2) + cubeHalf
        ) {

            cubes[thisSocket].rotation.y -= rotationSpeed;
            socket.emit('rotation', {
                    sid: thisSocket,
                    rotY: -rotationSpeed,
                    room: thisRoom
                }
            );

            changeScene();
        }
    }

    if ((keyPressed[83] && keyPressed[68]) || (keyPressed[40] && keyPressed[39])) { // S + D
        if (!pause
            && obj.socketCube.z <= (gameWidth / 2) - cubeHalf && obj.socketCube.z >= -(gameWidth / 2) + cubeHalf
            && obj.socketCube.x <= (gameWidth / 2) - cubeHalf && obj.socketCube.x >= -(gameWidth / 2) + cubeHalf
        ) {

            cubes[thisSocket].rotation.y += rotationSpeed;
            socket.emit('rotation', {
                    sid: thisSocket,
                    rotY: rotationSpeed,
                    room: thisRoom
                }
            );

            changeScene();
        }
    }

    if ((keyPressed[87] && keyPressed[65]) || (keyPressed[38] && keyPressed[37])) { // W + A
        if (!pause
            && obj.socketCube.z <= (gameWidth / 2) - cubeHalf && obj.socketCube.z >= -(gameWidth / 2) + cubeHalf
            && obj.socketCube.x <= (gameWidth / 2) - cubeHalf && obj.socketCube.x >= -(gameWidth / 2) + cubeHalf
        ) {
            cubes[thisSocket].rotation.y += rotationSpeed;
            socket.emit('rotation', {
                    sid: thisSocket,
                    rotY: rotationSpeed,
                    room: thisRoom
                }
            );

            changeScene();
        }
    }

    if ((keyPressed[83] && keyPressed[65]) || (keyPressed[40] && keyPressed[37])) { // S + A
        if (!pause
            && obj.socketCube.z <= (gameWidth / 2) - cubeHalf && obj.socketCube.z >= -(gameWidth / 2) + cubeHalf
            && obj.socketCube.x <= (gameWidth / 2) - cubeHalf && obj.socketCube.x >= -(gameWidth / 2) + cubeHalf
        ) {
            cubes[thisSocket].rotation.y -= rotationSpeed;
            socket.emit('rotation', {
                    sid: thisSocket,
                    rotY: -rotationSpeed,
                    room: thisRoom
                }
            );

            changeScene();
        }
    }
    if (keyPressed[27]) { // ESC
        if (!pause) {
            obj.camera.x = 0;
            obj.camera.y = 4;
            obj.camera.z = 6;

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

    }
    if (keyPressed[80]) {
        pause = !pause;
    } else {
        prevent = false;
    }


    // etc
    // update display here
    setTimeout(gameLogic, 5);
}

var collision = function (newX, newZ) {
    if(otherPlayer !== '') {
        return Math.abs(newX - cubes[otherPlayer].position.x) < 1 && Math.abs(newZ - cubes[otherPlayer].position.z) < 1;
    }
    return false;
};

gameLogic();
