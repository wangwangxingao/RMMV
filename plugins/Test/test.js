var t1 = "https://api.bilibili.com/x/v2/reply?callback=jQuery17207367607476015421_1525791380513&jsonp=jsonp&pn="
var t2 = "&type=1&oid=11357166&sort=0"


var i = 8000
var l = {}

var s = function () {
    i--
    console.log(i)
    if (i > 7990) { setTimeout(s, 1000) }
    var t = t1 + i + t2
    var z = i
    //网址请求 = 新 XML网址请求()
    var xhr = new XMLHttpRequest();
    //url位置 = "data" + src
    var url = t;
    //网址请求 打开( 'GET' , url位置)
    xhr.open('GET', url);
    //网址请求 文件类型('application/json')
    xhr.overrideMimeType('application/text');
    //网址请求 当读取
    xhr.onload = function () {
        if (xhr.status < 400) {
            if (xhr.responseText.indexOf("心高") >= 0) {
                l[z] = xhr.responseText
            }
        }
    };
    xhr.onerror = null
    xhr.send();

}
s()































var canvas = document.getElementById('rvo-test')
    , canvasSize = 800
    , center = [canvasSize / 2, canvasSize / 2]
    , goals = []
    , altgoals = []
    , colors = []
    , obstacles = []
    , total = 100
    , redrawIvl = 1000 / 60
    , speed = 2
    , newSpeed = speed
    , sim = new RVO.Simulator(1, 50, 7, 10, 30, 7, speed, [0, 0]);

for (var angle = Math.PI / total; angle < Math.PI * 2; angle += Math.PI / (.5 * total)) {
    var point = RVO.Vector.multiply([Math.sin(angle), Math.cos(angle)], canvasSize * .48)
        , rgb = HSVtoRGB(Math.round(360 * (angle / (Math.PI * 2))), 1, 255);

    sim.addAgent(RVO.Vector.add(center, point));
    goals.push(RVO.Vector.subtract(center, point));
    altgoals.push(RVO.Vector.add(center, point));
    colors.push('rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', .75)');
}

var vertices = [[200,200],[300,200],[300,300],[200,300]];

/*
for (var i = 0; i < 3; i++) {
    var angle = i * (2 * Math.PI) / 3; 
    vertices.push(RVO.Vector.multiply([Math.cos(angle),Math.sin(angle)], canvasSize * .48));
}*/
 
sim.addObstacle(vertices);
sim.processObstacles()
window.addEventListener('load', function () {
    document.getElementById('speed').addEventListener('change', function (e) {
        newSpeed = (e.srcElement.value >> 0) / 10;
    });
});

sim.globalTime = new Date().getTime() / redrawIvl;
function redraw() {
    var now = new Date().getTime()
        , timeStep = sim.timeStep = (now - sim.globalTime * redrawIvl) / redrawIvl;

    if (speed != newSpeed) {
        speed = newSpeed;
        for (var i = 0, len = sim.agents.length; i < len; i++) {
            sim.agents[i].maxSpeed = newSpeed;
        }
    }

    updateGoals();
    setPreferredVelocities();
    sim.doStep();
    updateVisualization();
    requestAnimationFrame(redraw, canvas);
}
requestAnimationFrame(redraw, canvas);

function updateGoals() {
    for (var i = 0, len = sim.agents.length; i < len; i++) {
        if (RVO.Vector.absSq(RVO.Vector.subtract(sim.agents[i].position, goals[i])) < 1) {
            var temp = goals[i];
            goals[i] = altgoals[i];
            altgoals[i] = temp;
        }
    }
}

function setPreferredVelocities() {
    for (var i = 0, len = sim.agents.length; i < len; i++) {
        var dist = RVO.Vector.subtract(goals[i], sim.agents[i].position)
            , distSq = RVO.Vector.absSq(dist)
            , goalVector = distSq > 1 ? RVO.Vector.multiply(RVO.Vector.normalize(dist), sim.agents[i].maxSpeed) : dist;
        if (RVO.Vector.absSq(RVO.Vector.multiply(goalVector, sim.timeStep)) > distSq) {
            goalVector = RVO.Vector.divide(dist, sim.timeStep);
        }
        sim.agents[i].prefVelocity = goalVector;
    }
}

function updateVisualization() {
    var ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvasSize, canvasSize);

    for (var i = 0, len = sim.agents.length; i < len; i++) {
        var agent = sim.agents[i];
        ctx.beginPath();
        ctx.arc(agent.position[0], agent.position[1], agent.radius * .9, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = colors[i];
        ctx.fill();
        
        ctx.fillStyle = "rgb(100,100,100,100)";
        ctx.beginPath();
        ctx.moveTo(agent.position[0], agent.position[1]);
         
        ctx.lineTo(agent.position[0] + agent.velocity[0] *10  ,  agent.position[1] +agent.velocity[1]  *10);
        ctx.lineTo(agent.position[0] + agent.velocity[0] *10+3 ,  agent.position[1] +agent.velocity[1]*10 +3  );
        ctx.lineTo(agent.position[0], agent.position[1]);
     
        ctx.closePath();
        ctx.fill();
    }
    var obstacles = sim.obstacles;

    if (obstacles.length) {
        ctx.fillStyle = "rgb(100,100,100,100)";
        ctx.beginPath();
        ctx.moveTo(obstacles[0].point[0]  , obstacles[0].point[1]  );
        for (var i = 1; i < obstacles.length; i++) {
            ctx.lineTo(obstacles[i].point[0]  , obstacles[i].point[1]  );
        }
        ctx.closePath();
        ctx.fill();
    }
}



function HSVtoRGB(h, s, v) {
    var r, g, b;
    if (s == 0) {
        r = g = b = v;
        return;
    }
    var h = h / 60
        , i = Math.floor(h)
        , f = h - i
        , p = v * (1 - s)
        , q = v * (1 - s * f)
        , t = v * (1 - s * (1 - f));
    switch (i) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;
        case 1:
            r = q;
            g = v;
            b = p;
            break;
        case 2:
            r = p;
            g = v;
            b = t;
            break;
        case 3:
            r = p;
            g = q;
            b = v;
            break;
        case 4:
            r = t;
            g = p;
            b = v;
            break;
        default:
            r = v;
            g = p;
            b = q;
            break;
    }
    return {
        r: Math.round(r),
        g: Math.round(g),
        b: Math.round(b)
    }
}
