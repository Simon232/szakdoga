var socket = io();
var scene, camera, light, renderer;
var thisSocket = undefined;
var thisColor = undefined;
var thisRoom = undefined;
var thisTexture = undefined;


var gameWidth = 250;

var init = function () {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);

    skylight = new THREE.DirectionalLight(0x99FFFF, 1)
    light = new THREE.DirectionalLight(0xFFCC99	, 1);
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
    var line_material = new THREE.MeshBasicMaterial({color: 0x00006633}); //zold
    var line2_material = new THREE.MeshBasicMaterial({color: 0x00990000}); //piros
    var line3_material = new THREE.MeshBasicMaterial({color: 0x00003399}); //kek
    var x_line = new THREE.Mesh(line_geo, line_material);
    var y_line = new THREE.Mesh(line_geo2, line2_material);
    var z_line = new THREE.Mesh(line_geo3, line3_material);

    // load a texture, set wrap mode to repeat
    var texture = new THREE.TextureLoader().load("pics/sand3.jpg");
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(gameWidth / 4, gameWidth /4);

    var ground_geo = new THREE.BoxGeometry(gameWidth, 0.0001, gameWidth);
    //var cube_material = new THREE.MeshPhongMaterial( { ambient: 0x050505, color: 0x0033ff, specular: 0x555555, shininess: 30 } );
    var ground_material = new THREE.MeshPhongMaterial({map: texture});
    var ground = new THREE.Mesh(ground_geo, ground_material);
    ground.position.x = 0;
    ground.position.y = 0;
    ground.position.z = 0;
    scene.add(ground);

    camera.position.x = 0;
    camera.position.y = 4;
    camera.position.z = 6;

    camera.lookAt(new THREE.Vector3(x, y, z));

    scene.add(x_line); //zold
    scene.add(y_line); //piros
    scene.add(z_line); //kek
};

// *** server calls ***
socket.on('new', function (msg) {
    if (thisSocket == undefined) { //sajat kocka

        var R = Math.floor(Math.random() * 256);
        var G = Math.floor(Math.random() * 256);
        var B = Math.floor(Math.random() * 256);

        socket.room = msg.room;
        thisRoom = msg.room;
        thisSocket = msg.sid;
        thisColor = "rgb(" + R + "," + G + "," + B + ")";

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
        cubes[thisSocket].position.x = 0.0;
        cubes[thisSocket].position.y = 1.0;
        cubes[thisSocket].position.z = 1.0;

        scene.add(cubes[thisSocket]);
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
});


socket.on('move', function (obj) {
    if (obj.room == thisRoom) {
        cubes[obj.sid].position.x = obj.pos.x;
        cubes[obj.sid].position.y = obj.pos.y;
        cubes[obj.sid].position.z = obj.pos.z;
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

socket.on('disconnect', function (msg) {
    console.log("user disconnected: ", msg);
    scene.remove(cubes[msg]);
});

socket.on('update', function (msg) {

    console.log("aaaaa Ezt kaptam: ", msg);
    if (msg.room == thisRoom) {
        if (cubes[msg.sid] == undefined) {

            var socketCubeGeometry = new THREE.BoxGeometry(1, 1, 1);
            //var socketCubeMaterial = new THREE.MeshBasicMaterial({color: msg.color});
            /*var socketCubeMaterial = new THREE.MeshPhongMaterial({
                ambient: 0x050505,
                color: msg.color,
                specular: 0x555555,
                shininess: 30
            });*/
            var otherTexture =  new THREE.TextureLoader().load(msg.texture);
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

socket.on('chat message', function (msg) {
    $('#messages').append($('<li>').text(msg));
});

var cubes = {};
var pause = false;



var x = 0;
var y = 0;
var z = 0;

var obj = {
    camera: {
        x: 0,
        y: 4,
        z: 6,
        lookX: 0,
        lookY: 0,
        lookZ: 0
    },
    socketCube: {
        x: 0.0,
        y: 1.0,
        z: 1.0,
        rotY: 0.0
    }
};

var changeScene = function () {
    camera.position.x = obj.camera.x;
    camera.position.y = obj.camera.y;
    camera.position.z = obj.camera.z;
    camera.lookAt(new THREE.Vector3(obj.camera.lookX, obj.camera.lookY, obj.camera.lookZ));

    if (socket.id !== undefined && socket.id !== null) {

        socket.emit('move', {
            sid: '/#' + socket.id,
            pos: obj.socketCube,
            rotY: obj.socketCube.rotY,
            room: thisRoom
        });
    }
};

var animate = function () {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
};

init();
animate();
