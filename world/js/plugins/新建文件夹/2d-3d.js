var gui

function initGui() {
    gui = new dat.GUI()
}




var renderer;

function initThree() {
    width = 800
    height = 600
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);
    renderer.setClearColor(0xFFFFFF, 1.0);
}

/**场景 */
var scene;

function initScene() {
    scene = new THREE.Scene();
}

var camera;

function initCamera() {

    camera1 = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    camera1.position.x = 600;
    camera1.position.y = 600;
    camera1.position.z = 600;
    camera1.lookAt({
        x: 0,
        y: 0,
        z: 0
    });
    scene.add(camera1)

    camera1.lookAt0 = camera1.lookAt.bind(camera1, {
        x: 0,
        y: 0,
        z: 0
    })
    camera1.change = function() { camera = camera1 }
    cgui = gui.addFolder("摄像机")
    cgui.add(camera1.position, "x", -1000, 1000, 1)
    cgui.add(camera1.position, "y", -1000, 1000, 1)
    cgui.add(camera1.position, "z", -1000, 1000, 1)
    cgui.add(camera1, "lookAt0")
    cgui.add(camera1, "change")



    camera2 = new THREE.OrthographicCamera(-1000, 1000, -1000, 1000, 1000, -1000, 1)
    camera2.lookAt0 = camera2.lookAt.bind(camera2, {
        x: 0,
        y: 0,
        z: 0
    })
    camera2.change = function() { camera = camera2 }
    cgui2 = gui.addFolder("摄像机2")
    cgui2.add(camera2.position, "x", -1000, 1000, 1)
    cgui2.add(camera2.position, "y", -1000, 1000, 1)
    cgui2.add(camera2.position, "z", -1000, 1000, 1)
    cgui2.add(camera2, "lookAt0")
    cgui2.add(camera2, "change")
    camera = camera1
}






/**灯光 */
var light;

function initLight() {
    //环境光
    ambientlight = new THREE.AmbientLight(0xFF00FF);
    ambientlight.position.set(100, 100, 200);
    scene.add(ambientlight);



    //点光
    pointlight = new THREE.PointLight(0x00FF00);
    pointlight.position.set(0, 0, 300);
    scene.add(pointlight);


}

var cube;
var mesh;

function initObject() {

    //轴
    var axis = new THREE.AxisHelper(1000)
    scene.add(axis);


    planeg = new THREE.PlaneGeometry(1000, 1000, 1, 1)
    planem = new THREE.MeshBasicMaterial({ color: 0x44ff44 })
    plane = new THREE.Mesh(planeg, planem)
    scene.add(plane)


    //物体
    var geometry = new THREE.CylinderGeometry(30, 30, 30);
    var material = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position = new THREE.Vector3(0, 0, 300);
    scene.add(mesh);
    mgui = gui.addFolder("物体")

    mgui.add(mesh.position, "x", -1000, 1000, 1)
    mgui.add(mesh.position, "y", -1000, 1000, 1)
    mgui.add(mesh.position, "z", -1000, 1000, 1)

    var geometry = new THREE.CylinderGeometry(100, 150, 400);
    var material = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
    mesh2 = new THREE.Mesh(geometry, material);
    mesh2.position = new THREE.Vector3(0, 0, 0);
    scene.add(mesh2);
    mesh2.move = 1

    mesh2.lookAt0 = mesh2.lookAt.bind(mesh2, {
        x: 0,
        y: 0,
        z: 0
    })
    mgui = gui.addFolder("物体2")
    mgui.add(mesh2.position, "x", -1000, 1000, 1)
    mgui.add(mesh2.position, "y", -1000, 1000, 1)
    mgui.add(mesh2.position, "z", -1000, 1000, 1)
    mgui.add(mesh2, "move", -10, 10, 0.01)
    mgui.add(mesh2, "lookAt0")



    geom = new THREE.Geometry()
    material = new THREE.PointsMaterial({ size: 5, vertexColors: true, color: 0xffffff })

    var i = 3
    for (var x = -i; x <= i; x++) {
        for (var y = -i; y <= i; y++) {
            for (var z = -i; z <= i; z++) {
                var particle = new THREE.Vector3(x * 10, y * 10, z * 10)
                geom.vertices.push(particle)
                geom.colors.push(new THREE.Color(Math.random() * 0xffffff))
            }
        }
    }
    cloud = new THREE.Points(geom, material)
    scene.add(cloud)

}

function threeStart() {
    initGui()
    initThree();
    initScene();
    initCamera();
    initLight();
    initObject();
    animation();
}

function animation() {
    mesh2.position.x -= mesh2.move;
    renderer.render(scene, camera);
    requestAnimationFrame(animation);
}

SceneManager.run = function() {
    /*Graphics.init()
    Graphics.initRenderer()
    Graphics.initCanvas()
    Graphics.initScene()
    Graphics.initCamera()
    Graphics.initLight()
    Graphics.initObject()
    Graphics.initShow()
    console.log(Graphics._canvas, Graphics._renderer, Graphics._scene)*/
    threeStart()

    if (Utils.isNwjs() && Utils.isOptionValid('test')) {
        require('nw.gui').Window.get().showDevTools();
    }
}































width = window.innerWidth;
height = window.innerHeight;

//-------------------------------------------------------------------------------------
// 3D Scene canvas
//-------------------------------------------------------------------------------------
var scene_3D = new THREE.Scene();
scene_3D.fog = new THREE.Fog("#eeeeee", 2000, 4000);

var camera = new THREE.PerspectiveCamera(75, width / height, 1, 10000);
camera.position.set(0, 0, 700);
camera.updateProjectionMatrix();

var canvas_3D = new THREE.WebGLRenderer({
    antialias: true
});
canvas_3D.setSize(width, height);
canvas_3D.setClearColor(scene_3D.fog.color, 1);
document.body.appendChild(canvas_3D.domElement);

var geometry = new THREE.BoxGeometry(500, 500, 500);
var material = new THREE.MeshNormalMaterial();
var cube = new THREE.Mesh(geometry, material);
cube.position.z = -500;
cube.rotation.z = -45;
scene_3D.add(cube);

//-------------------------------------------------------------------------------------
// 2D UI canvas
//-------------------------------------------------------------------------------------
var scene_UI = new PIXI.Stage(0x66FF99);

var canvas_UI = PIXI.autoDetectRenderer(width, height, {
    transparent: true
});
canvas_UI.view.style.position = "absolute";
canvas_UI.view.style.top = "0px";
canvas_UI.view.style.left = "0px";

var graphics = new PIXI.Graphics();
graphics.beginFill(0xe60630);
graphics.moveTo(width / 2 - 200, height / 2 + 100);
graphics.lineTo(width / 2 - 200, height / 2 - 100);
graphics.lineTo(width / 2 + 200, height / 2 - 100);
graphics.lineTo(width / 2 + 200, height / 2 + 100);
graphics.endFill();

scene_UI.addChild(graphics);

//-------------------------------------------------------------------------------------
// Map 2D UI canvas on 3D Plane
//-------------------------------------------------------------------------------------
var texture_UI = new THREE.Texture(canvas_UI.view);
texture_UI.needsUpdate = true;

var material_UI = new THREE.MeshBasicMaterial({
    map: texture_UI,
    side: THREE.DoubleSide
});
material_UI.transparent = true;

var mesh_UI = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material_UI);
mesh_UI.position.set(0, 0, 0);
scene_3D.add(mesh_UI);

//-------------------------------------------------------------------------------------
// Render Animation
//-------------------------------------------------------------------------------------
function animate() {
    requestAnimationFrame(animate);
    canvas_UI.render(scene_UI);

    cube.rotation.y += 0.01;
    canvas_3D.render(scene_3D, camera);
}
animate();