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
        if (map[37] && map[38]) { // left + up
            if (!pause) {
                obj.socketCube.x -= 0.1;
                obj.socketCube.z -= 0.1;
                obj.camera.lookX -= 0.1;
                obj.camera.lookZ -= 0.1;
                changeScene();
            }
        }
        else if (map[38] && map[39]) { // up + right
            if (!pause) {
                obj.socketCube.z -= 0.1;
                obj.socketCube.x += 0.1;

                obj.camera.lookX += 0.1;
                obj.camera.lookZ -= 0.1;
                changeScene();
            }
        }
        else if (map[37] && map[40]) { // left + down
            if (!pause) {
                obj.socketCube.x -= 0.1;
                obj.socketCube.z += 0.1;
                obj.camera.lookX -= 0.1;
                obj.camera.lookZ += 0.1;
                changeScene();
            }
        }
        else if (map[39] && map[40]) { // left + right
            if (!pause) {
                obj.socketCube.x += 0.1;
                obj.socketCube.z += 0.1;
                obj.camera.lookX += 0.1;
                obj.camera.lookZ += 0.1;
                changeScene();
            }
        }
        else if (map[87] && map[65]) { // W + A
            if (!pause) {
                obj.camera.z -= 0.1;
                obj.socketCube.z -= 0.1;

                obj.camera.x -= 0.1;
                obj.socketCube.x -= 0.1;

                obj.camera.lookX -= 0.1;
                obj.camera.lookZ -= 0.1;
                changeScene();
            }
        }
        else if (map[87] && map[68]) { // W + D
            if (!pause) {
                obj.camera.z -= 0.1;
                obj.socketCube.z -= 0.1;

                obj.camera.x += 0.1;
                obj.socketCube.x += 0.1;

                obj.camera.lookX += 0.1;
                obj.camera.lookZ -= 0.1;
                changeScene();
            }
        }
        else if (map[83] && map[65]) { // S + A
            if (!pause) {
                obj.camera.z += 0.1;
                obj.socketCube.z += 0.1;

                obj.camera.x -= 0.1;
                obj.socketCube.x -= 0.1;

                obj.camera.lookX -= 0.1;
                obj.camera.lookZ += 0.1;
                changeScene();
            }
        }
        else if (map[83] && map[68]) { // S + D
            if (!pause) {
                obj.camera.z += 0.1;
                obj.socketCube.z += 0.1;

                obj.camera.x += 0.1;
                obj.socketCube.x += 0.1;

                obj.camera.lookX += 0.1;
                obj.camera.lookZ += 0.1;
                changeScene();
            }
        }
        else if (map[87] && map[69]) { // W + E
            if (!pause) {
                obj.camera.z -= 0.1;
                obj.socketCube.z -= 0.1;

                obj.camera.lookZ -= 0.1;

                cubes[thisSocket].rotation.y -= 0.1;
                socket.emit('rotation', {
                        sid: thisSocket,
                        rotY: -0.1,
                        room: thisRoom
                    }
                );
                changeScene();
            }
        }
        else if (map[68] && map[69]) { // D + E
            if (!pause) {
                obj.camera.x += 0.1;
                obj.socketCube.x += 0.1;


                obj.camera.lookX += 0.1;

                cubes[thisSocket].rotation.y -= 0.1;
                socket.emit('rotation', {
                        sid: thisSocket,
                        rotY: -0.1,
                        room: thisRoom
                    }
                );
                changeScene();
            }
        }
        else if (map[83] && map[69]) { // S + E
            if (!pause) {
                obj.camera.z += 0.1;
                obj.socketCube.z += 0.1;

                obj.camera.lookZ += 0.1;

                cubes[thisSocket].rotation.y -= 0.1;
                socket.emit('rotation', {
                        sid: thisSocket,
                        rotY: -0.1,
                        room: thisRoom
                    }
                );
                changeScene();
            }
        }
        else if (map[65] && map[69]) { // A + E
            if (!pause) {
                obj.camera.x -= 0.1;
                obj.socketCube.x -= 0.1;

                obj.camera.lookX -= 0.1;

                cubes[thisSocket].rotation.y -= 0.1;
                socket.emit('rotation', {
                        sid: thisSocket,
                        rotY: -0.1,
                        room: thisRoom
                    }
                );
                changeScene();
            }
        }
        else if (map[87] && map[81]) { // W + Q
            if (!pause) {
                obj.camera.z -= 0.1;
                obj.socketCube.z -= 0.1;

                obj.camera.lookZ -= 0.1;

                cubes[thisSocket].rotation.y += 0.1;
                socket.emit('rotation', {
                        sid: thisSocket,
                        rotY: 0.1,
                        room: thisRoom
                    }
                );
                changeScene();
            }
        }
        else if (map[68] && map[81]) { // D + Q
            if (!pause) {
                obj.camera.x += 0.1;
                obj.socketCube.x += 0.1;

                obj.camera.lookX += 0.1;

                cubes[thisSocket].rotation.y += 0.1;
                socket.emit('rotation', {
                        sid: thisSocket,
                        rotY: 0.1,
                        room: thisRoom
                    }
                );
                changeScene();
            }
        }
        else if (map[83] && map[81]) { // S + Q
            if (!pause) {
                obj.camera.z += 0.1;
                obj.socketCube.z += 0.1;

                obj.camera.lookZ += 0.1;

                cubes[thisSocket].rotation.y += 0.1;
                socket.emit('rotation', {
                        sid: thisSocket,
                        rotY: 0.1,
                        room: thisRoom
                    }
                );
                changeScene();
            }
        }
        else if (map[65] && map[81]) { // A + Q
            if (!pause) {
                obj.camera.x -= 0.1;
                obj.socketCube.x -= 0.1;

                obj.camera.lookX -= 0.1;

                cubes[thisSocket].rotation.y += 0.1;
                socket.emit('rotation', {
                        sid: thisSocket,
                        rotY: 0.1,
                        room: thisRoom
                    }
                );
                changeScene();
            }
        }
        else if(map[82]){
            obj.camera.lookY += 0.1;
            changeScene();
        }
        else if(map[70]){
            obj.camera.lookY -= 0.1;
            changeScene();
        }
        else if (map[38]) {
            if (!pause) {
                obj.socketCube.z -= 0.1;
                obj.camera.lookZ -= 0.1;
                changeScene();
            }
        }
        else if (map[37]) {
            if (!pause) {
                obj.socketCube.x -= 0.1;

                obj.camera.lookX -= 0.1;

                changeScene();
            }
        }
        else if (map[39]) {
            if (!pause) {
                obj.socketCube.x += 0.1;

                obj.camera.lookX += 0.1;

                changeScene();
            }
        }
        else if (map[40]) {
            if (!pause) {
                obj.socketCube.z += 0.1;


                obj.camera.lookZ += 0.1;
                changeScene();
            }
        }
        else if (map[87]) {
            if (!pause) {
                obj.camera.z -= 0.1;
                obj.socketCube.z -= 0.1;


                obj.camera.lookZ -= 0.1;
                changeScene();
            }
        }
        else if (map[83]) {
            if (!pause) {
                obj.camera.z += 0.1;
                obj.socketCube.z += 0.1;

                obj.camera.lookZ += 0.1;
                changeScene();
            }
        }
        else if (map[65]) {
            if (!pause) {
                obj.camera.x -= 0.1;
                obj.socketCube.x -= 0.1;

                obj.camera.lookX -= 0.1;

                changeScene();
            }
        }
        else if (map[68]) {
            if (!pause) {
                obj.camera.x += 0.1;
                obj.socketCube.x += 0.1;

                obj.camera.lookX += 0.1;

                changeScene();
            }
        }
        else if (map[81]) {
            if (!pause) {
                //cubes[thisSocket].rotateY(0.1);
                //obj.socketCube.rotY += 0.1;
                //obj.socketCube.rotY = 0.1;
                cubes[thisSocket].rotation.y += 0.1;
                socket.emit('rotation', {
                        sid: thisSocket,
                        rotY: 0.1,
                        room: thisRoom
                    }
                );
                changeScene();
            }
        }
        else if (map[69]) {
            if (!pause) {
                //cubes[thisSocket].rotateY(-0.1);
                //obj.socketCube.rotY -= 0.1;
                //obj.socketCube.rotY = -0.1;
                cubes[thisSocket].rotation.y -= 0.1;
                socket.emit('rotation', {
                        sid: thisSocket,
                        rotY: -0.1,
                        room: thisRoom
                    }
                );
                changeScene();
            }
        }
        else if (map[27]) {
            if (!pause) {
                obj.camera.x = 0;
                obj.camera.y = 4;
                obj.camera.z = 6;
                obj.camera.lookX = 0;
                obj.camera.lookY = 0;
                obj.camera.lookZ = 0;

                obj.socketCube.x = 0.0;
                obj.socketCube.y = 1.0;
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
        else if (map[80]) {
            pause = !pause;
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
