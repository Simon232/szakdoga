var socket = io();
var scene, camera, light, renderer;
var thisSocket = undefined;
var thisRoom = undefined;
var thisTexture = undefined;
var otherPlayer = undefined;
var thisPoints = 0;
var otherPoints = 0;
var yourBestScore = document.querySelector(".your-best-point").textContent;

var gameWidth = 100;
var cubeHalf = 0.49;
var PI = Math.PI;
var movingSpeed = 0.05;
var rotationSpeed = PI / 180;
var cameraDistance = 6;
var playable_time = 120;

var coinMeshes = [];
var trapMeshes = [];
var stepIntoTrap = false;

var time = 0;
var cubes = {};
var pause = false;

document.querySelector(".other-player-joined").style.display = "none";
document.querySelector(".other-player-disconnected").style.display = "none";

var x = 0.0;
var y = 0.5;
var z = 0.0;

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

// ********************
// *** server calls ***
// ********************

socket.on("getDamage", function(obj){
    document.querySelector(".e-points").textContent = obj.point;
    otherPoints = obj.point;
});

socket.on("giveNewCoin", function (obj) {
    if (obj.sid == thisSocket) {
        document.querySelector(".points").textContent = thisPoints;
    } else {
        scene.remove(coinMeshes[obj.index]);
        coinMeshes.splice(obj.index, 1);
        otherPoints = obj.socketPoints;
        document.querySelector('.e-points').textContent = otherPoints;
    }

    var coin = getCoin();
    coin.position.x = obj.x;
    coin.position.y = 0.7;
    coin.position.z = obj.z;
    coinMeshes.push(coin);
    scene.add(coinMeshes[coinMeshes.length - 1]);

});

socket.on("readyAgain", function () {
    if (time == 0) {
        thisPoints = 0;
        otherPoints = 0;
        document.querySelector('.points').textContent = thisPoints;
        document.querySelector('.e-points').textContent = otherPoints;
        doFadeOut(".again-container");
        setTimeout(function () {
            doFadeIn(".timer-container");
            document.querySelector('.time').textContent = "";
        }, 1000);
    }
});


socket.on("joined", function () {



    //document.querySelector(".timer-container").classList.remove("doFadeOut");
    //document.querySelector(".timer-container").style.display = "";
    //document.querySelector(".timer-container").classList.add("doFadeIn");

    doFadeIn(".other-player-joined");
    setTimeout(function () {
        doFadeOut(".other-player-joined");
    }, 1000);
});

socket.on('new', function (msg) {

    if (thisSocket == undefined) { // own character (cube)

        socket.room = msg.room;
        thisRoom = msg.room;

        document.querySelector(".again-container").style.right = ((window.innerWidth / 2) - 55) + "px";
        document.querySelector('.again-container').style.display = 'none';
        document.querySelector(".on-the-top-right").textContent += thisRoom;
        document.querySelector(".on-the-top-right").style.right = window.innerWidth / 120 + "px";
        document.querySelector(".timer-container").style.right = ((window.innerWidth / 2) - 55) + "px";
        document.querySelector(".timer-container").style.display = "none";
        document.querySelector(".chat").style.top = window.innerHeight / 2 + "px";
        document.querySelector(".points-container").style.right = window.innerWidth / 20 + "px";
        document.querySelector(".other-points-container").style.right = window.innerWidth / 20 + "px";
        document.querySelector(".your-points").style.right = window.innerWidth / 120 + "px";
        document.querySelector(".enemy-points").style.right = window.innerWidth / 120 + "px";
        //document.querySelector(".points").style.right = window.innerWidth / 2000 + "px";
        document.querySelector(".points").textContent = thisPoints;
        document.querySelector(".e-points").textContent = otherPoints;

        thisSocket = msg.sid;
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
        //if (randomNumber == 5) {
        //    boxTexture = "pics/transparent.png";
        //}
        //if (randomNumber == 5) {
        //    boxTexture = "pics/transparent.jpg";
        //}
        //if (randomNumber == 6) {
        //    boxTexture = "pics/earth.png";
        //}
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
        var socketCubeMaterial = new THREE.MeshPhongMaterial({map: textureBox}); //{map: textureBox, transparent: true, opacity: 0.5, color: "rgb(255,0,0)"}

        cubes[thisSocket] = new THREE.Mesh(socketCubeGeometry, socketCubeMaterial);

        obj.socketCube.x = msg.positions.x;
        obj.socketCube.z = msg.positions.z;

        cubes[thisSocket].position.x = obj.socketCube.x;
        cubes[thisSocket].position.y = obj.socketCube.y;
        cubes[thisSocket].position.z = obj.socketCube.z;


        camera.position.x = cubes[thisSocket].position.x;
        camera.position.y = 4;
        camera.position.z = cubes[thisSocket].position.z + 6;

        camera.lookAt(new THREE.Vector3(cubes[thisSocket].position.x, cubes[thisSocket].position.y, cubes[thisSocket].position.z));

        scene.add(cubes[thisSocket]);
        socket.emit("joined", {
            userName: "not implemented yet",
            cube: {
                x: cubes[thisSocket].position.x,
                y: cubes[thisSocket].position.y,
                z: cubes[thisSocket].position.z
            }
        });

    }

    if (socket.id != undefined) { // send my own cube
        try {

            socket.emit('update', {
                sid: thisSocket,
                x: cubes[thisSocket].position.x,
                y: cubes[thisSocket].position.y,
                z: cubes[thisSocket].position.z,
                rotationY: cubes[thisSocket].rotation.y,
                room: thisRoom,
                texture: thisTexture
            });

        } catch (e) {
            console.log(e);
        }
    }

});

socket.on("objectPositions", function (obj) {
    var coinPositions = obj.coinPositions;
    var trapPositions = obj.trapPositions;

    for (var i = 0; i < coinPositions.length; i++) {
        coinMeshes.push(getCoin());
        coinMeshes[coinMeshes.length - 1].position.x = coinPositions[i].x;
        coinMeshes[coinMeshes.length - 1].position.y = 0.7;
        coinMeshes[coinMeshes.length - 1].position.z = coinPositions[i].z;
        coinMeshes[coinMeshes.length - 1].name = "coin" + i;
        scene.add(coinMeshes[coinMeshes.length - 1]);
    }

    for (var i = 0; i < trapPositions.length; i++) {
        trapMeshes.push(getTrap());
        trapMeshes[trapMeshes.length - 1].position.x = trapPositions[i].x;
        trapMeshes[trapMeshes.length - 1].position.y = 0.0;
        trapMeshes[trapMeshes.length - 1].position.z = trapPositions[i].z;
        trapMeshes[trapMeshes.length - 1].name = "trap" + i;
        scene.add(trapMeshes[trapMeshes.length - 1]);
    }

    doFadeIn(".timer-container");
    if (time != 0) {
        time = playable_time;
    } else {
        time = playable_time;
        timer();
    }
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
        if (_obj.isReset) {
            cubes[sid].rotation.y = 0.0;
        }
    }
});

socket.on('rotation', function (msg) {
    if (msg.room == thisRoom) {
        cubes[msg.sid].rotation.y += msg.rotY;
    }
});

socket.on('disconnect', function (msg) {
    thisPoints = 0;
    otherPoints = 0;
    document.querySelector(".points").textContent = thisPoints;
    document.querySelector(".e-points").textContent = otherPoints;

    scene.remove(cubes[msg]);
    otherPlayer = '';

    doFadeOut(".again-container");
    doFadeIn(".other-player-disconnected");
    setTimeout(function () {
        doFadeOut(".other-player-disconnected");
    }, 1000);

    removeCoins();
    removeTraps();

    setTimeout(function(){
        if(otherPlayer == ''){
            doFadeOut(".timer-container");
        }
    }, 5000);

});

socket.on('update', function (msg) {
    doFadeIn(".timer-container");

    if (msg.room == thisRoom) {
        if (cubes[msg.sid] == undefined) {  // other player joinning

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

// *****************
// *** functions ***
// *****************

var init = function () {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setClearColor(0x000000, 0);
    //renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth - (window.innerWidth / 100), window.innerHeight - (window.innerHeight / 50));
    document.body.appendChild(renderer.domElement);
    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    skylight = new THREE.DirectionalLight(0x99FFFF, 1);
    light = new THREE.DirectionalLight(0xFFCC99, 1);
    light.position.x = -5;
    light.position.y = 5;
    light.position.z = 5;
    scene.add(light);

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

    var PyramidMesh = getPyramid();
    var PyramidMesh2 = getPyramid();
    var PyramidMesh3 = getPyramid();

    PyramidMesh.position.x = gameWidth - 10;
    PyramidMesh2.position.x = gameWidth;
    PyramidMesh3.position.x = gameWidth - 10;

    PyramidMesh.position.z = 16;
    PyramidMesh2.position.z = -15;
    PyramidMesh3.position.z = -28;

    PyramidMesh.rotation.y += 0.20;
    PyramidMesh2.rotation.y += 0.20;
    PyramidMesh3.rotation.y += 0.20;

    PyramidMesh.scale.set(4, 4, 4);
    PyramidMesh2.scale.set(8, 8, 8);
    PyramidMesh3.scale.set(4, 4, 4);


    // load a texture, set wrap mode to repeat
    var texture = new THREE.TextureLoader().load("pics/sand3.jpg");
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(gameWidth / 10, gameWidth / 10);

    var ground_geo = new THREE.BoxGeometry(gameWidth, 0.0001, gameWidth);
    //var cube_material = new THREE.MeshPhongMaterial( { ambient: 0x050505, color: 0x0033ff, specular: 0x555555, shininess: 30 } );
    var ground_material = new THREE.MeshPhongMaterial({map: texture});
    var ground = new THREE.Mesh(ground_geo, ground_material);
    ground.position.x = 0;
    ground.position.y = 0;
    ground.position.z = 0;



    var wallMesh = getWall();
    var wallMesh2 = getWall();
    var wallMesh3 = getWall();
    var wallMesh4 = getWall();

    wallMesh.position.x = gameWidth/2;
    wallMesh2.position.z = -gameWidth/2;
    wallMesh2.rotation.y += PI/2;
    wallMesh3.position.x = -gameWidth/2;
    wallMesh3.rotation.y += PI;
    wallMesh4.position.z = gameWidth/2;
    wallMesh4.rotation.y -= PI/2;


    scene.add(ground);

    scene.add(PyramidMesh);
    scene.add(PyramidMesh2);
    scene.add(PyramidMesh3);
    scene.add(wallMesh);
    scene.add(wallMesh2);
    scene.add(wallMesh3);
    scene.add(wallMesh4);
};

var collision = function (obj) {
    var coinBoxWidth = 1.05;
    var trapBoxWidth = 1.00;
    var coinIndex = -1;
    var getTrapDamage = false;

    for (var i = 0; i < coinMeshes.length; i++) {
        if (Math.abs(coinMeshes[i].position.x - obj.x) < coinBoxWidth && Math.abs(coinMeshes[i].position.z - obj.z) < coinBoxWidth) {
            coinIndex = i;
        }
    }
    for (var i = 0; i < trapMeshes.length; i++) {
        if (Math.abs(trapMeshes[i].position.x - obj.x) < trapBoxWidth && Math.abs(trapMeshes[i].position.z - obj.z) < trapBoxWidth) {
            getTrapDamage = true;
        }
    }

    if (coinIndex != -1) {
        scene.remove(coinMeshes[coinIndex]);
        coinMeshes.splice(coinIndex, 1);
        thisPoints += 10;
        socket.emit("giveNewCoin", {index: coinIndex, sid: thisSocket, socketPoints: thisPoints});
    }

    if(getTrapDamage){
        if(!stepIntoTrap) {
            if (thisPoints > 50) {
                thisPoints -= 50;
            } else {
                thisPoints = 0;
            }
            stepIntoTrap = true;
        }

        document.querySelector(".points").textContent = thisPoints;
        socket.emit("getDamage", {room: thisRoom, point: thisPoints, sid: thisSocket});
    }else{
        stepIntoTrap = false;
    }


};

var doFadeIn = function (className) {
    document.querySelector(className).classList.remove("doFadeOut");
    document.querySelector(className).style.display = "";
    document.querySelector(className).classList.add("doFadeIn");
};

var doFadeOut = function (className) {
    document.querySelector(className).classList.remove("doFadeIn");
    document.querySelector(className).classList.add("doFadeOut");
    setTimeout(function () {
        document.querySelector(className).style.display = "none";
    }, 1000);
};

var again = function () {
    socket.emit("readyAgain", {sid: thisSocket, room: thisRoom});
};

var getWall = function(){
    var wallTexture = new THREE.TextureLoader().load("pics/sandwall.png");
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(gameWidth / 10, gameWidth / 100);
    var wallMaterial = new THREE.MeshBasicMaterial({map: wallTexture, transparent: true});
    var wallGeometry = new THREE.Geometry();
    wallGeometry.vertices.push(new THREE.Vector3(0.0,0.0,-gameWidth/2));
    wallGeometry.vertices.push(new THREE.Vector3(0.0,0.0,gameWidth/2));
    wallGeometry.vertices.push(new THREE.Vector3(0.0,5.0,gameWidth/2));
    wallGeometry.vertices.push(new THREE.Vector3(0.0,5.0,-gameWidth/2));
    wallGeometry.faces.push(new THREE.Face3(0,1,2));
    wallGeometry.faces.push(new THREE.Face3(0,2,3));
    wallGeometry.faceVertexUvs[0].push([new THREE.Vector2(0.0,0.0),new THREE.Vector2(1.0,0,0), new THREE.Vector2(1.0,1.0)]);
    wallGeometry.faceVertexUvs[0].push([new THREE.Vector2(0.0,0.0),new THREE.Vector2(1.0,1,0), new THREE.Vector2(0.0,1.0)]);

    return new THREE.Mesh(wallGeometry, wallMaterial);
};

var getPyramid = function(){
    var pyramidTexture = new THREE.TextureLoader().load("pics/pyramid.jpg");
    pyramidTexture.wrapS = THREE.RepeatWrapping;
    pyramidTexture.wrapT = THREE.RepeatWrapping;
    pyramidTexture.repeat.set(4, 4);

    var pyramidMaterial = new THREE.MeshBasicMaterial({map: pyramidTexture});
    //define a geometry

    var pyramidGeometry = new THREE.Geometry();
    //verticles

    pyramidGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    pyramidGeometry.vertices.push(new THREE.Vector3(4, 0, 0));
    pyramidGeometry.vertices.push(new THREE.Vector3(4, 0, 4));
    pyramidGeometry.vertices.push(new THREE.Vector3(0, 0, 4));
    pyramidGeometry.vertices.push(new THREE.Vector3(2, 2, 2));
    //face
    pyramidGeometry.faces.push(new THREE.Face3(1, 0, 4));
    pyramidGeometry.faces.push(new THREE.Face3(2, 1, 4));
    pyramidGeometry.faces.push(new THREE.Face3(3, 2, 4));
    pyramidGeometry.faces.push(new THREE.Face3(0, 3, 4));
    //pyramidGeometry.faces.push(new THREE.Face3(2, 3, 4));
    //pyramidGeometry.faces.push(new THREE.Face3(3, 0, 4));
    //pyramidGeometry.faceVertexUvs[0][0] = [ new THREE.Vector2(0.5, 0.5), new THREE.Vector2(0.5, 0.5), new THREE.Vector2(0.5, 0.5)]; // for textures

    var pyramidUvs = [];
    pyramidUvs.push(new THREE.Vector2(0.0, 0.0));
    pyramidUvs.push(new THREE.Vector2(0.0, 1.0));
    pyramidUvs.push(new THREE.Vector2(1.0, 1.0));
    pyramidGeometry.faceVertexUvs[0].push([pyramidUvs[1], pyramidUvs[2], pyramidUvs[0]]);
    pyramidGeometry.faceVertexUvs[0].push([pyramidUvs[1], pyramidUvs[2], pyramidUvs[0]]);
    pyramidGeometry.faceVertexUvs[0].push([pyramidUvs[1], pyramidUvs[2], pyramidUvs[0]]);
    pyramidGeometry.faceVertexUvs[0].push([pyramidUvs[1], pyramidUvs[2], pyramidUvs[0]]);

    return new THREE.Mesh(pyramidGeometry, pyramidMaterial);
};

var getCoin = function () {
    //var circleMaterial = new THREE.MeshBasicMaterial({color: "rgb(255, 255, 102)"});
    var coinTexture = new THREE.TextureLoader().load("pics/coin.jpg");
    var circleMaterial = new THREE.MeshBasicMaterial({map: coinTexture});
    var circleGeometry = new THREE.Geometry();
    var rate = 0.0;
    var angle = 25;
    var rating = (2 * PI) / (angle);
    var radius = 0.5;

    //vertices number = 2*angle + 1
    circleGeometry.vertices.push(new THREE.Vector3(0, 0, 0.05));
    for (var i = 0; i < angle; i++) {
        circleGeometry.vertices.push(new THREE.Vector3(radius * Math.cos(rate) + 0, radius * Math.sin(rate) + 0, 0.05));
        rate += rating;
        if (i === angle - 1) {
            circleGeometry.vertices.push(circleGeometry.vertices[1]);
        } else {
            circleGeometry.vertices.push(new THREE.Vector3(radius * Math.cos(rate) + 0, radius * Math.sin(rate) + 0, 0.05));
        }
        circleGeometry.faces.push(new THREE.Face3(0, circleGeometry.vertices.length - 2, circleGeometry.vertices.length - 1));

        var faceUvs = [[]];
        faceUvs[0].push(new THREE.Vector2(1.0, 0.0), new THREE.Vector2(1.0, 1.0), new THREE.Vector2(0.0, 0.0));
        circleGeometry.faceVertexUvs[0].push(faceUvs[0]);
    }


    rate = 0.0;
    circleGeometry.vertices.push(new THREE.Vector3(0, 0, -0.05));
    var middle = circleGeometry.vertices.length - 1;
    for (var i = 0; i < angle; i++) {
        circleGeometry.vertices.push(new THREE.Vector3(radius * Math.cos(rate) + 0, radius * Math.sin(rate) + 0, -0.05));
        rate += rating;
        if (i === angle - 1) {
            circleGeometry.vertices.push(circleGeometry.vertices[middle + 1]);
        } else {
            circleGeometry.vertices.push(new THREE.Vector3(radius * Math.cos(rate) + 0, radius * Math.sin(rate) + 0, -0.05));
        }
        circleGeometry.faces.push(new THREE.Face3(middle, circleGeometry.vertices.length - 1, circleGeometry.vertices.length - 2));

        var faceUvs = [[]];
        faceUvs[0].push(new THREE.Vector2(1.0, 0.0), new THREE.Vector2(1.0, 1.0), new THREE.Vector2(0.0, 0.0));
        circleGeometry.faceVertexUvs[0].push(faceUvs[0]);
    }
    for (var i = 0; i < (angle * 2); i++) {
        circleGeometry.vertices.push(circleGeometry.vertices[i + 1]);
        circleGeometry.vertices.push(circleGeometry.vertices[(i + 1) + (2 * angle + 1)]);
        circleGeometry.vertices.push(circleGeometry.vertices[(i + 2)]);
        circleGeometry.faces.push(new THREE.Face3(circleGeometry.vertices.length - 3, circleGeometry.vertices.length - 2, circleGeometry.vertices.length - 1));
        circleGeometry.vertices.push(circleGeometry.vertices[(i + 1) + (2 * angle + 1)]);
        circleGeometry.vertices.push(circleGeometry.vertices[(i + 1) + (2 * angle + 2)]);
        circleGeometry.vertices.push(circleGeometry.vertices[(i + 2)]);
        circleGeometry.faces.push(new THREE.Face3(circleGeometry.vertices.length - 3, circleGeometry.vertices.length - 2, circleGeometry.vertices.length - 1));
        var faceUvs = [[]];
        faceUvs[0].push(new THREE.Vector2(1.0, 0.0), new THREE.Vector2(1.0, 1.0), new THREE.Vector2(0.0, 0.0));
        circleGeometry.faceVertexUvs[0].push(faceUvs[0]);
        circleGeometry.faceVertexUvs[0].push(faceUvs[0]);
    }
    circleGeometry.vertices.push(circleGeometry.vertices[middle + 1]);

    var coinMesh = new THREE.Mesh(circleGeometry, circleMaterial);
    return coinMesh;
};

var getTrap = function(){
    var trapTexture = new THREE.TextureLoader().load("pics/coin.jpg");
    var trapMaterial = new THREE.MeshBasicMaterial({color: "rgb(0,0,0)"}); //map: trapTexture
    var trapGeometry = new THREE.Geometry();
    var rate = 0.0;
    var angle = 30;
    var rating = (2 * PI) / (angle);
    var radius = 0.5;

    for (var i = 0; i < angle; i++) {
        trapGeometry.vertices.push(new THREE.Vector3(radius * Math.cos(rate) + 0, 0.0, radius * Math.sin(rate) + 0));
        rate += rating;
        trapGeometry.vertices.push(new THREE.Vector3(radius * Math.cos(rate) + 0, 0.0, radius * Math.sin(rate) + 0));
        trapGeometry.vertices.push(new THREE.Vector3(
            (trapGeometry.vertices[trapGeometry.vertices.length - 2].x + trapGeometry.vertices[trapGeometry.vertices.length - 1].x / 2),
            0.3,
            (trapGeometry.vertices[trapGeometry.vertices.length - 2].z + trapGeometry.vertices[trapGeometry.vertices.length - 1].z / 2)
        ));

        /*if (i === angle - 1) {
         trapGeometry.vertices.push(circleGeometry.vertices[1]);
         } else {
         trapGeometry.vertices.push(new THREE.Vector3(radius * Math.cos(rate) + 0, radius * Math.sin(rate) + 0, 0.05));
         }*/
        trapGeometry.faces.push(new THREE.Face3(trapGeometry.vertices.length - 2, trapGeometry.vertices.length - 3, trapGeometry.vertices.length - 1));
        trapGeometry.faces.push(new THREE.Face3(trapGeometry.vertices.length - 3, trapGeometry.vertices.length - 2, trapGeometry.vertices.length - 1));
        //var faceUvs = [[]];
        //faceUvs[0].push(new THREE.Vector2(1.0, 0.0), new THREE.Vector2(1.0, 1.0), new THREE.Vector2(0.0, 0.0));
        //circleGeometry.faceVertexUvs[0].push(faceUvs[0]);
    }

    var trapMesh = new THREE.Mesh(trapGeometry, trapMaterial);
    return trapMesh;
};

var removeCoins = function () {
    for (var i = 0; i < coinMeshes.length; i++) {
        scene.remove(coinMeshes[i]);
    }
    coinMeshes = [];
};
var removeTraps = function () {
    for (var i = 0; i < trapMeshes.length; i++) {
        scene.remove(trapMeshes[i]);
    }
    trapMeshes = [];
};

var changeScene = function (type) {
    if (socket.id !== undefined && socket.id !== null) {

        socket.emit('move', {
            sid: thisSocket,
            pos: obj.socketCube,
            rotY: obj.socketCube.rotY,
            room: thisRoom,
            isReset: false
        });

        cubes[thisSocket].position.x = obj.socketCube.x;
        cubes[thisSocket].position.z = obj.socketCube.z;

        if (Math.abs(gameWidth / 2 - cameraDistance / 3) > Math.abs(obj.camera.x)) {
            camera.position.x = obj.camera.x;
        }
        camera.position.y = obj.camera.y;
        if (Math.abs(gameWidth / 2 - cameraDistance / 3) > Math.abs(obj.camera.z)) {
            camera.position.z = obj.camera.z;
        }
        camera.lookAt(new THREE.Vector3(cubes[thisSocket].position.x, cubes[thisSocket].position.y, cubes[thisSocket].position.z));
    }
};

var timer = function () {
    setTimeout(function () {
        if (time > 0) {
            time--;
            timer();
            document.querySelector(".time").textContent = Math.floor(time / 60) + ":" + (time % 60 < 10 ? "0" + time % 60 : time % 60);
        }
        else if (time == 0) {
            savePoints();
            var winner = '';
            if(thisPoints == otherPoints){
                winner = " Döntetlen";
            }
            else if(thisPoints > otherPoints){
                winner = " Nyertél!";
            }else{
                winner = " Vesztettél!";
            }

            document.querySelector(".time").textContent = "Vege!" + winner;
            setTimeout(function () {
                removeCoins();
                removeTraps();
            }, 2000);
            removeCoins();
            removeTraps();

            setTimeout(function () {
                document.querySelector('.timer-container').classList.add("doFadeOut");
                setTimeout(function () {
                    document.querySelector('.timer-container').style.display = "none";
                    setTimeout(function () {
                        if (otherPlayer != '') {
                            doFadeIn(".again-container");
                        } else {
                            doFadeOut(".again-container");
                        }
                    }, 1000);
                }, 1000);
            }, 1000);
        }
    }, 1000);
};

function savePoints(){
    if(yourBestScore < thisPoints) {
        yourBestScore = thisPoints;
        $.post("./savescore", {highscore: thisPoints});
    }
}


var animate = function () {
    requestAnimationFrame(animate);

    for (var i = 0; i < coinMeshes.length; i++) {
        coinMeshes[i].rotation.y += 0.1;
    }

    renderer.render(scene, camera);

};

init();
animate();
