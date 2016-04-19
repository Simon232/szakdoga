var socket = io();
var scene, camera, light, renderer;
var thisSocket = undefined;
var thisColor = undefined;
var thisRoom = undefined;
var thisTexture = undefined;
var otherPlayer = undefined;
var testRoom = undefined;

var gameWidth = 100;
var cubeHalf = 0.49;
var PI = Math.PI;
var movingSpeed = 0.05;
var rotationSpeed = PI / 240;
var cameraDistance = 6;

var getRandomPosition = function () {
    var pos = 0;
    while (pos <= 1 && pos >= -1) {
        pos = Math.floor(Math.random() * 2) % 2 == 0 ? Math.random() * ((gameWidth / 2) - cubeHalf) : -1 * Math.random() * ((gameWidth / 2) - cubeHalf);
    }
    return pos;
};

var cubes = {};
var pause = false;

var x = getRandomPosition();
var y = 0.5;
var z = getRandomPosition();

var obj = {
    socketCube: {
        x: this.x,
        y: 0.5,
        z: this.z,
        rotY: 0.0
    },
    camera: {
        x: this.x,
        y: 4,
        z: this.z + 6
    }
};

var collision = function (newX, newZ) {
    if (otherPlayer !== '') {
        var colX = Math.abs(newX - cubes[otherPlayer].position.x);
        var colZ = Math.abs(newZ - cubes[otherPlayer].position.z);
        var originalX = Math.abs(cubes[thisSocket].position.x - cubes[otherPlayer].position.x);
        var originalZ = Math.abs(cubes[thisSocket].position.z - cubes[otherPlayer].position.z);
        return (colX < 1 && colZ < 1) && (originalX > colX && originalZ > colZ);
        /*if (colX <= 1 && colZ <= 1 && (colX < (1 + 2 * movingSpeed) || colX < (1 + 2 * movingSpeed))) {
         return true;
         }
         return colX <= 1 && colZ <= 1;*/

    }
    return false;
};
socket.on("joined", function () {
    console.log("miafasz");
    //console.log("testroom: " + "room#"+thisRoom);
    //thisRoom = 'room#'+obj.room;
    socket.emit("joined", {userName: "not implemented yet", cube: cubes[thisSocket]});
});


var init = function () {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);

    skylight = new THREE.DirectionalLight(0x99FFFF, 1)
    light = new THREE.DirectionalLight(0xFFCC99, 1);
    light.position.x = -5;
    light.position.y = 5;
    light.position.z = 5;
    scene.add(light);

    renderer = new THREE.WebGLRenderer({antialias: true});
    //renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth - (window.innerWidth / 100), window.innerHeight - (window.innerHeight / 50));
    document.body.appendChild(renderer.domElement);
    renderer.gammaInput = true;
    renderer.gammaOutput = true;


    var vertexShader = document.getElementById('vertexShader').textContent;
    var fragmentShader = document.getElementById('fragmentShader').textContent;
    var uniforms = {
        topColor: {type: "c", value: new THREE.Color(0x0077ff)},
        bottomColor: {type: "c", value: new THREE.Color(0xffffff)},
        offset: {type: "f", value: 400},
        exponent: {type: "f", value: 0.6}
    };
    uniforms.topColor.value.copy(skylight.color);

    var skyGeo = new THREE.SphereGeometry(4000, 32, 15);
    var skyMat = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.BackSide
    });

    var sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(sky);

    var PI = 3.14;

    var line_geo = new THREE.BoxGeometry(gameWidth, 0.1, 0.1);
    var line_geo2 = new THREE.BoxGeometry(0.1, gameWidth, 0.1);
    var line_geo3 = new THREE.BoxGeometry(0.1, 0.1, gameWidth);
    //var line_material = new THREE.MeshBasicMaterial({color: 0x00006633}); //zold
    //var line2_material = new THREE.MeshBasicMaterial({color: 0x00990000}); //piros
    //var line3_material = new THREE.MeshBasicMaterial({color: 0x00003399}); //kek
    var line_material = new THREE.MeshBasicMaterial({color: 0x00990000}); //piros
    var line2_material = new THREE.MeshBasicMaterial({color: 0x00006633}); //zold
    var line3_material = new THREE.MeshBasicMaterial({color: 0x00003399}); //kek
    var x_line = new THREE.Mesh(line_geo, line_material);
    var y_line = new THREE.Mesh(line_geo2, line2_material);
    var z_line = new THREE.Mesh(line_geo3, line3_material);

    var circleMaterial = new THREE.MeshBasicMaterial({color: 0x00006633});
    var circleGeometry = new THREE.Geometry();
    var rate = 0.0;
    var angle = 20;
    var rating = (2*PI) / (angle);
    var radius = 2;

    circleGeometry.vertices.push(new THREE.Vector3(3, 3, 0));
    for (var i = 0; i < angle; i++) {
        circleGeometry.vertices.push(new THREE.Vector3(radius * Math.cos(rate) + 3, radius * Math.sin(rate) + 3, 0));
        rate += rating;
        if(i === angle -1 ){
            circleGeometry.vertices.push(circleGeometry.vertices[1]);
        }else {
            circleGeometry.vertices.push(new THREE.Vector3(radius * Math.cos(rate) + 3, radius * Math.sin(rate) + 3, 0));
        }
        circleGeometry.faces.push(new THREE.Face3(0, circleGeometry.vertices.length - 2, circleGeometry.vertices.length - 1));
    }
    
    rate = 0.0;
    circleGeometry.vertices.push(new THREE.Vector3(3, 3, -0.5));
    var middle = circleGeometry.vertices.length-1;
    for (var i = 0; i < angle; i++) {
        circleGeometry.vertices.push(new THREE.Vector3(radius * Math.cos(rate) + 3, radius * Math.sin(rate) + 3, -0.5));
        rate += rating;
        if(i === angle -1 ){
            circleGeometry.vertices.push(circleGeometry.vertices[middle+1]);
        }else {
            circleGeometry.vertices.push(new THREE.Vector3(radius * Math.cos(rate) + 3, radius * Math.sin(rate) + 3, -0.5));
        }
        circleGeometry.faces.push(new THREE.Face3(middle, circleGeometry.vertices.length - 1, circleGeometry.vertices.length - 2));
    }
    
    var circleMesh = new THREE.Mesh(circleGeometry, circleMaterial);


    var pyramidTexture = new THREE.TextureLoader().load("pics/pyramid.jpg");
    pyramidTexture.wrapS = THREE.RepeatWrapping;
    pyramidTexture.wrapT = THREE.RepeatWrapping;
    pyramidTexture.repeat.set(4, 4);
    var pyramidMaterial = new THREE.MeshBasicMaterial({map: pyramidTexture});
    //define a geometry
    var pyramidGeometry = new THREE.Geometry();
    //verticles
    pyramidGeometry.vertices.push(new THREE.Vector3(10, 0, -5));
    pyramidGeometry.vertices.push(new THREE.Vector3(14, 0, -5));
    pyramidGeometry.vertices.push(new THREE.Vector3(14, 0, -9));
    pyramidGeometry.vertices.push(new THREE.Vector3(10, 0, -9));
    pyramidGeometry.vertices.push(new THREE.Vector3(12, 2, -7));
    //face
    pyramidGeometry.faces.push(new THREE.Face3(0, 1, 2));
    pyramidGeometry.faces.push(new THREE.Face3(0, 2, 3));
    pyramidGeometry.faces.push(new THREE.Face3(0, 1, 4));
    pyramidGeometry.faces.push(new THREE.Face3(1, 2, 4));
    pyramidGeometry.faces.push(new THREE.Face3(2, 3, 4));
    pyramidGeometry.faces.push(new THREE.Face3(3, 0, 4));
    //pyramidGeometry.faceVertexUvs[0][0] = [ new THREE.Vector2(0.5, 0.5), new THREE.Vector2(0.5, 0.5), new THREE.Vector2(0.5, 0.5)]; // for textures
    var PyramidMesh = new THREE.Mesh(pyramidGeometry, pyramidMaterial);

    // load a texture, set wrap mode to repeat
    var texture = new THREE.TextureLoader().load("pics/sand3.jpg");
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(gameWidth / 12, gameWidth / 12);

    var ground_geo = new THREE.BoxGeometry(gameWidth, 0.0001, gameWidth);
    //var cube_material = new THREE.MeshPhongMaterial( { ambient: 0x050505, color: 0x0033ff, specular: 0x555555, shininess: 30 } );
    var ground_material = new THREE.MeshPhongMaterial({map: texture});
    var ground = new THREE.Mesh(ground_geo, ground_material);
    ground.position.x = 0;
    ground.position.y = 0;
    ground.position.z = 0;
    scene.add(ground);


    scene.add(x_line); //zold
    scene.add(y_line); //piros
    scene.add(z_line); //kek
    scene.add(PyramidMesh);
    scene.add(circleMesh);

};

// *** server calls ***
socket.on('new', function (msg) {
    $('#other-player-joined').is(':hidden');

    if (thisSocket == undefined) { //sajat kocka

        var R = Math.floor(Math.random() * 256);
        var G = Math.floor(Math.random() * 256);
        var B = Math.floor(Math.random() * 256);

        socket.room = msg.room;
        thisRoom = msg.room;

        document.querySelector(".on-the-top-right").textContent += thisRoom;
        document.querySelector(".chat").style.top = window.innerHeight/4 + "px";


        thisSocket = msg.sid;
        thisColor = "rgb(" + R + "," + G + "," + B + ")";
        otherPlayer = '';

        var boxTexture = "";
        var randomNumber = Math.floor(Math.random() * 5);
        if (randomNumber == 0) {
            boxTexture = "pics/box.jpg";
        }
        if (randomNumber == 1) {
            boxTexture = "pics/box2.jpg";
        }
        if (randomNumber == 2) {
            boxTexture = "pics/box3.jpg";
        }
        if (randomNumber == 3) {
            boxTexture = "pics/box4.png";
        }
        if (randomNumber == 4) {
            boxTexture = "pics/box5.jpg";
        }
        thisTexture = boxTexture;

        var textureBox = new THREE.TextureLoader().load(boxTexture);
        //textureBox.wrapS = THREE.RepeatWrapping;
        //textureBox.wrapT = THREE.RepeatWrapping;
        //textureBox.repeat.set(256, 1);

        var socketCubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        //var socketCubeMaterial = new THREE.MeshBasicMaterial({color: thisColor});
        /*var socketCubeMaterial = new THREE.MeshPhongMaterial({
         ambient: 0x050505,
         color: thisColor,
         specular: 0x555555,
         shininess: 30
         });*/
        var socketCubeMaterial = new THREE.MeshPhongMaterial({map: textureBox});

        cubes[thisSocket] = new THREE.Mesh(socketCubeGeometry, socketCubeMaterial);
        cubes[thisSocket].position.x = obj.socketCube.x;
        cubes[thisSocket].position.y = obj.socketCube.y;
        cubes[thisSocket].position.z = obj.socketCube.z;

        scene.add(cubes[thisSocket]);
        socket.emit("joined", {
            userName: "not implemented yet",
            cube: {
                x: cubes[thisSocket].position.x,
                y: cubes[thisSocket].position.y,
                z: cubes[thisSocket].position.z
            }
        })
    }

    if (socket.id != undefined) { // elkuldom a kockamat a masiknak
        console.log("aaaa Ez vagyok en: ", thisSocket);
        try {

            socket.emit('update', {
                sid: thisSocket,
                x: cubes[thisSocket].position.x,
                y: cubes[thisSocket].position.y,
                z: cubes[thisSocket].position.z,
                rotationY: cubes[thisSocket].rotation.y,
                color: thisColor,
                room: thisRoom,
                texture: thisTexture
            });

        } catch (e) {
            console.log(e);
        }
    }

    camera.position.x = cubes[thisSocket].position.x;
    camera.position.y = 4;
    camera.position.z = cubes[thisSocket].position.z + 6;

    camera.lookAt(new THREE.Vector3(cubes[thisSocket].position.x, cubes[thisSocket].position.y, cubes[thisSocket].position.z));
    socket.emit("joined", {
        userName: "not implemented yet",
        cube: {
            x: cubes[thisSocket].position.x,
            y: cubes[thisSocket].position.y,
            z: cubes[thisSocket].position.z
        }
    })
});


socket.on('move', function (_obj) {
    var sid = _obj.sid;
    if (_obj.room == thisRoom && sid !== thisSocket) {
        var x = _obj.pos.x;
        var y = _obj.pos.y;
        var z = _obj.pos.z;

        cubes[sid].position.x = x;
        //cubes[obj.sid].position.y = obj.pos.y;
        cubes[sid].position.z = z;
    }
});

socket.on('reset', function (msg) { //set rotation to default when reset
    if (msg.room == thisRoom) {
        cubes[msg.sid].rotation.y = 0.0;
    }
});

socket.on('rotation', function (msg) {
    if (msg.room == thisRoom) {
        cubes[msg.sid].rotation.y += msg.rotY;
    }
});

socket.on("roomIsFull", function () {
    //alert("roomIsFull");
    //console.log("szopki");
});

socket.on('disconnect', function (msg) {
    setTimeout(function(){
        document.querySelector(".other-player-disconnected").style.display = true;
        $('.other-player-disconnected').toggle(1000);
        setTimeout(function(){
            $('.other-player-disconnected').toggle(3000);
        }, 3000);
    }, 1000);
    console.log(msg + " user disconnected: ");
    scene.remove(cubes[msg]);
    otherPlayer = '';
});

socket.on('update', function (msg) {

    setTimeout(function(){
        document.querySelector(".other-player-joined").style.display = true;
        $('.other-player-joined').toggle(1000);
        setTimeout(function(){
            $('.other-player-joined').toggle(3000);
        }, 3000);
    }, 1000);

    console.log("Ezt kaptam: ", msg);
    if (msg.room == thisRoom) {
        if (cubes[msg.sid] == undefined) {  // masik jatekos csatlakozasa

            otherPlayer = msg.sid;

            var socketCubeGeometry = new THREE.BoxGeometry(1, 1, 1);
            //var socketCubeMaterial = new THREE.MeshBasicMaterial({color: msg.color});
            /*var socketCubeMaterial = new THREE.MeshPhongMaterial({
             ambient: 0x050505,
             color: msg.color,
             specular: 0x555555,
             shininess: 30
             });*/
            var otherTexture = new THREE.TextureLoader().load(msg.texture);
            var socketCubeMaterial = new THREE.MeshPhongMaterial({map: otherTexture});
            cubes[msg.sid] = new THREE.Mesh(socketCubeGeometry, socketCubeMaterial);
            cubes[msg.sid].position.x = msg.x;
            cubes[msg.sid].position.y = msg.y;
            cubes[msg.sid].position.z = msg.z;
            cubes[msg.sid].rotation.y = msg.rotationY;

            scene.add(cubes[msg.sid]);
        }
    }
});




// *** functions ***
var changeScene = function () {
    ///&& !collision(obj.socketCube.x, obj.socketCube.z)
    if (socket.id !== undefined && socket.id !== null) {

        //cubes[obj.sid].position.y = obj.pos.y;


        socket.emit('move', {
            sid: thisSocket,
            pos: obj.socketCube,
            rotY: obj.socketCube.rotY,
            room: thisRoom,
            camera: {x: obj.camera.x, y: obj.camera.y, z: obj.camera.z}
        });

        cubes[thisSocket].position.x = obj.socketCube.x;
        cubes[thisSocket].position.z = obj.socketCube.z;

        camera.position.x = obj.camera.x;
        camera.position.y = obj.camera.y;
        camera.position.z = obj.camera.z;
        camera.lookAt(new THREE.Vector3(cubes[thisSocket].position.x, cubes[thisSocket].position.y, cubes[thisSocket].position.z));
    }
};


var animate = function () {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
};

init();
animate();
