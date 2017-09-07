
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
    camera1.change = function(){ camera =camera1}
    cgui = gui.addFolder("摄像机")
    cgui.add(camera1.position, "x", -1000, 1000, 1)
    cgui.add(camera1.position, "y", -1000, 1000, 1)
    cgui.add(camera1.position, "z", -1000, 1000, 1)
    cgui.add(camera1, "lookAt0")
    cgui.add(camera1, "change")



    camera2 = new THREE.OrthographicCamera(-1000,1000,-1000,1000,1000,-1000,1)
        camera2.lookAt0 = camera2.lookAt.bind(camera2, {
        x: 0,
        y: 0,
        z: 0
    })
    camera2.change = function(){ camera= camera2 }
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


     planeg = new THREE.PlaneGeometry(1000,1000,1,1)
     planem =  new THREE.MeshBasicMaterial({ color: 0x44ff44 })
     plane = new THREE.Mesh(planeg,planem)
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
                var particle = new THREE.Vector3(x * 10, y * 10, z*10)
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

SceneManager.run = function () {
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
