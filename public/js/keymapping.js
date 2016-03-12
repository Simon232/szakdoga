var movingSpeed = 0.1;
var rotationSpeed = 0.1;
var cubeHalf = 0.49

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
            if (!pause 
            && (obj.socketCube.x - movingSpeed) > -gameWidth/2 + cubeHalf
            && (obj.socketCube.z - movingSpeed) > -gameWidth/2 + cubeHalf) {
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
            && (obj.socketCube.x + movingSpeed) < gameWidth/2 - cubeHalf
            && (obj.socketCube.z - movingSpeed) > -gameWidth/2 + cubeHalf) {
                
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
            && (obj.socketCube.x - movingSpeed) > -gameWidth/2 + cubeHalf
            && (obj.socketCube.z + movingSpeed) < gameWidth/2 - cubeHalf) {
            
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
            && (obj.socketCube.x + movingSpeed) < gameWidth/2 - cubeHalf
            && (obj.socketCube.z + movingSpeed) < gameWidth/2 - cubeHalf) {
                
                obj.socketCube.x += movingSpeed;
                obj.socketCube.z += movingSpeed;
                obj.camera.lookX += movingSpeed;
                obj.camera.lookZ += movingSpeed;
                changeScene();
            }
            return;
        }
        else if (map[87] && map[65]) { // W + A
            if (!pause) {
               
               if((obj.socketCube.z - movingSpeed) > -gameWidth/2 + cubeHalf) {
                    obj.camera.z -= movingSpeed;
                    obj.socketCube.z -= movingSpeed;
                    obj.camera.lookZ -= movingSpeed;
               }

                if((obj.socketCube.x - movingSpeed) > -gameWidth/2 + cubeHalf){
                    obj.camera.x -= movingSpeed;
                    obj.socketCube.x -= movingSpeed;
                    obj.camera.lookX -= movingSpeed;
                }
                changeScene();
            }
            return;
        }
        else if (map[87] && map[68]) { // W + D
            if (!pause){
                if((obj.socketCube.z - movingSpeed) > -gameWidth/2 + cubeHalf){
                    obj.camera.z -= movingSpeed;
                    obj.socketCube.z -= movingSpeed;
                    obj.camera.lookZ -= movingSpeed;
                }

                if((obj.socketCube.x + movingSpeed) < gameWidth/2 - cubeHalf){
                    obj.camera.x += movingSpeed;
                    obj.socketCube.x += movingSpeed;
                    obj.camera.lookX += movingSpeed;
                }
                
                changeScene();
            }
            return;
        }
        else if (map[83] && map[65]) { // S + A
            if (!pause){
                
                if((obj.socketCube.z + movingSpeed) < gameWidth/2 - cubeHalf){
                    obj.camera.z += movingSpeed;
                    obj.socketCube.z += movingSpeed;
                    obj.camera.lookZ += movingSpeed;
                }

                if((obj.socketCube.x - movingSpeed) > -gameWidth/2 + cubeHalf){
                    obj.camera.x -= movingSpeed;
                    obj.socketCube.x -= movingSpeed;
                    obj.camera.lookX -= movingSpeed;
                }
                changeScene();
            }
            return;
        }
        else if (map[83] && map[68]) { // S + D
            if (!pause) {
                if((obj.socketCube.z + movingSpeed) < gameWidth/2 - cubeHalf){
                    obj.camera.z += movingSpeed;
                    obj.socketCube.z += movingSpeed;
                    obj.camera.lookZ += movingSpeed;
                }

                if((obj.socketCube.x + movingSpeed) < gameWidth/2 - cubeHalf){
                    obj.camera.x += movingSpeed;
                    obj.socketCube.x += movingSpeed;
                    obj.camera.lookX += movingSpeed;
                }
                changeScene();
            }
            return;
        }
        else if (map[87] && map[69]) { // W + E
            if (!pause
            && (obj.socketCube.z - movingSpeed) > -gameWidth/2 + cubeHalf)
            {
                obj.camera.z -= movingSpeed;
                obj.socketCube.z -= movingSpeed;

                obj.camera.lookZ -= movingSpeed;

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
        else if (map[68] && map[69]) { // D + E
            if (!pause
            && (obj.socketCube.x + movingSpeed) < gameWidth/2 - cubeHalf )
            {
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
        else if (map[83] && map[69]) { // S + E
            if (!pause
            && (obj.socketCube.z + movingSpeed) < gameWidth/2 - cubeHalf){
                obj.camera.z += movingSpeed;
                obj.socketCube.z += movingSpeed;

                obj.camera.lookZ += movingSpeed;

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
        else if (map[65] && map[69]) { // A + E
            if (!pause
            && (obj.socketCube.x - movingSpeed) > -gameWidth/2 + cubeHalf )
            {
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
        else if (map[87] && map[81]) { // W + Q
            if (!pause
            && (obj.socketCube.z - movingSpeed) > -gameWidth/2 + cubeHalf){
                obj.camera.z -= movingSpeed;
                obj.socketCube.z -= movingSpeed;

                obj.camera.lookZ -= movingSpeed;

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
        else if (map[68] && map[81]) { // D + Q
            if (!pause
            && (obj.socketCube.x + movingSpeed) < gameWidth/2 - cubeHalf)
            {
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
        }
        else if (map[83] && map[81]) { // S + Q
            if (!pause
            && (obj.socketCube.z + movingSpeed) < gameWidth/2 - cubeHalf){
                obj.camera.z += movingSpeed;
                obj.socketCube.z += movingSpeed;

                obj.camera.lookZ += movingSpeed;

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
        else if (map[65] && map[81]) { // A + Q
            if (!pause
            && (obj.socketCube.x - movingSpeed) > -gameWidth/2 + cubeHalf ){
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
        else if(map[82]){ // R
            obj.camera.lookY += movingSpeed;
            changeScene();
            return;
        }
        else if(map[70]){ // F
            obj.camera.lookY -= movingSpeed;
            changeScene();
            return;
        }
        else if (map[38]) { // UP
            if (!pause
            && (obj.socketCube.z - movingSpeed) > -gameWidth/2 + cubeHalf){
                obj.socketCube.z -= movingSpeed;
                obj.camera.lookZ -= movingSpeed;
                changeScene();
            }
            return;
        }
        else if (map[37]) { // LEFT
            if (!pause
            && (obj.socketCube.x - movingSpeed) > -gameWidth/2 + cubeHalf){
                obj.socketCube.x -= movingSpeed;

                obj.camera.lookX -= movingSpeed;

                changeScene();
            }
            return;
        }
        else if (map[39]) { // RIGHT
            if (!pause
            && (obj.socketCube.x + movingSpeed) < gameWidth/2 - cubeHalf ){
                obj.socketCube.x += movingSpeed;

                obj.camera.lookX += movingSpeed;

                changeScene();
            }
            return;
        }
        else if (map[40]) { // DOWN
            if (!pause
            && (obj.socketCube.z + movingSpeed) < gameWidth/2 - cubeHalf){
                obj.socketCube.z += movingSpeed;


                obj.camera.lookZ += movingSpeed;
                changeScene();
            }
            return;
        }
        else if (map[87]) { // W
            if (!pause
            && (obj.socketCube.z - movingSpeed) > (-1*gameWidth)/2 + cubeHalf)
            {
                obj.camera.z -= movingSpeed;
                obj.socketCube.z -= movingSpeed;


                obj.camera.lookZ -= movingSpeed;
                changeScene();
            }else{
                console.log(gameWidth);
            }
            return;
        }
        else if (map[83]) { // S
            if (!pause
            && (obj.socketCube.z + movingSpeed) < gameWidth/2 - cubeHalf){
                obj.camera.z += movingSpeed;
                obj.socketCube.z += movingSpeed;

                obj.camera.lookZ += movingSpeed;
                changeScene();
            }
            return;
        }
        else if (map[65]) { // A
            if (!pause
            && (obj.socketCube.x - movingSpeed) > -gameWidth/2 + cubeHalf){
                obj.camera.x -= movingSpeed;
                obj.socketCube.x -= movingSpeed;

                obj.camera.lookX -= movingSpeed;

                changeScene();
            }
            return;
        }
        else if (map[68]) { // D
            if (!pause
            && (obj.socketCube.x + movingSpeed) < gameWidth/2 - cubeHalf){
                obj.camera.x += movingSpeed;
                obj.socketCube.x += movingSpeed;

                obj.camera.lookX += movingSpeed;

                changeScene();
            }
            return;
        }
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
        }
        else if (map[27]) { // ESC
            if (!pause) {
                obj.camera.x = 0;
                obj.camera.y = 4;
                obj.camera.z = 6;
                obj.camera.lookX = 0;
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
            return;
        }
        else if (map[80]) {
            pause = !pause;
            return;
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
