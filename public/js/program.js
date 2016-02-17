/**
 * Created by Andris on 2016. 02. 17..
 */

var keyboard = new THREEx.KeyboardState();

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );


var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth/2 + (window.innerWidth/4), window.innerHeight/2 + (window.innerHeight/4) );
document.body.appendChild( renderer.domElement );

var PI = 3.14;


var line_geo = new THREE.BoxGeometry(1000,0.1,0.1);
var line_geo2 = new THREE.BoxGeometry(0.1,1000,0.1);
var line_geo3 = new THREE.BoxGeometry(0.1,0.1,1000);

var basic_geometry = new THREE.BoxGeometry( 5, 5, 0 );
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var geometry2 = new THREE.BoxGeometry( 2, 4, 0.4 );

var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var material2 = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
var basic_material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );

var line_material = new THREE.MeshBasicMaterial( { color: 0x00006633} ); //zöld
var line2_material = new THREE.MeshBasicMaterial( { color: 0x00990000} ); //piros
var line3_material = new THREE.MeshBasicMaterial( { color: 0x00003399} ); //kék

var cube = new THREE.Mesh( geometry, material );
var cube2 = new THREE.Mesh( geometry2, material2 );
var floor = new THREE.Mesh( basic_geometry, basic_material);
var x_line = new THREE.Mesh( line_geo, line_material);
var y_line = new THREE.Mesh( line_geo2, line2_material);
var z_line = new THREE.Mesh( line_geo3, line3_material);
scene.add( floor );
scene.add( cube );
scene.add( cube2 );
scene.add(x_line); //zöld
scene.add(y_line); //piros
scene.add(z_line); //kék

var x = 0;
var y = 1;
var z = 0;

camera.position.z = 5;
camera.lookAt(new THREE.Vector3( x, y, z ));

var def_cam_x = camera.position.x;
var def_cam_y = camera.position.y;
var def_cam_z = camera.position.z;

var buttonPressed = function(){
    if(keyboard.pressed("d")){
        //console.log('d');
        //x += 0.1;
        //camera.position.x += 0.1;
        x += 0.1;
    }
    if(keyboard.pressed("a")){
        //console.log('a');
        //x -= 0.1;
        //camera.position.x -= 0.1;
        x -= 0.1;
    }
    if(keyboard.pressed("w")){
        //console.log('w');
        //y += 0.1;
        //camera.position.z -= 0.1;
        if(x > 0 && y > 0 && z > 0){
            camera.position.z += (y/100);
            camera.position.y += y/100;
            camera.position.x += x/100;
        }
        if(x == 0 && y > 0 && z == 0){
            camera.position.z -= (y/100);
            camera.position.y += y/100;
            camera.position.x += x/100;
            console.log(camera.position.x + ' ' + camera.position.y + ' ' + camera.position.z);
        }
        //z -= 0.1;
    }
    if(keyboard.pressed("s")){
        //console.log('s');
        //y -= 0.1;
        camera.position.z += 0.1;
        z += 0.1;
    }
    if(keyboard.pressed("e")){

        var fordulas = false;
        if(!fordulas && camera.position.y < 4.9 && camera.position.z > 0.1){
            camera.position.y += 0.1;
            camera.position.z -= 0.1;
        }else{
            fordulas = true;

            camera.position.y -= 0.1;
            camera.position.z -= 0.1;
            if(fordulas && camera.position.y < 0.1 && camera.position.z > 4.9){
                fordulas = false;
                camera.position.z = 5;
                camera.position.y = 0;
            }
            if(fordulas && camera.position.y > -0.1 && camera.position.z < -4.9){
                fordulas = false;
                camera.position.z = 5;
                camera.position.y = 0;
            }
            if(fordulas && camera.position.y < -0.1 && camera.position.z < -4.9){
                fordulas = false;
                camera.position.z = 5;
                camera.position.y = 0;
            }
        }
        //y += Math.sin(y*PI);

        console.log(camera.position.y + ' ' + camera.position.z + ' ' + y);
    }
    if(keyboard.pressed("q")){
        var fordulas = false;
        if(!fordulas && camera.position.y > 0.1 && camera.position.z < 4.9){
            camera.position.y -= 0.1;
            camera.position.z += 0.1;
        }else{
            fordulas = true;

            camera.position.y -= 0.1;
            camera.position.z -= 0.1;
            if(fordulas && camera.position.z < 0.1 && camera.position.y > 4.9){
                fordulas = false;
                camera.position.z = 0;
                camera.position.y = 5;
            }
            if(fordulas && camera.position.z > -0.1 && camera.position.y < -4.9){
                fordulas = false;
                camera.position.z = 5;
                camera.position.y = 0;
            }
            if(fordulas && camera.position.y < -0.1 && camera.position.z < -4.9){
                fordulas = false;
                camera.position.z = 5;
                camera.position.y = 0;
            }

        }
        console.log(camera.position.y + ' ' + camera.position.z + ' ' + y);
    }
    //keyboard.destroy();
    if(keyboard.pressed("escape")){
        x = 0;
        y = 1;
        z = 0;
        camera.position.z = 5;
        camera.position.y = 0;
        camera.position.x = 0;
    }
    camera.lookAt(new THREE.Vector3( x, y, z ));
}




var render = function () {
    requestAnimationFrame( render );
    buttonPressed();


    cube.rotation.y += 0.01;
    //cube2.rotation.x += 0.1;

    //floor.rotation.z += 0.1;

    renderer.render(scene, camera);
};

render();