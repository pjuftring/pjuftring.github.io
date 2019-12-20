var canvas;
var ctx;
var width, height;
var FACTOR_V_2_MIDDLE = 10;
var DIST_V_2_V = 100;
var vertices;
function init() {
    canvas = (document.getElementsByTagName("canvas")).item(0);
    ctx = canvas.getContext("2d");
    vertices = [];
    resize();
    setInterval(function () { return requestAnimationFrame(draw); }, 1000 / 30);
    setInterval(function () { return vertices.push({ x: Math.random() * 100 + width / 2, y: Math.random() * 100 + height / 2, velo_x: 0, velo_y: 0 }); }, 2000);
}
function draw() {
    ctx.clearRect(0, 0, width, height);
    for (var _i = 0, vertices_1 = vertices; _i < vertices_1.length; _i++) {
        var v = vertices_1[_i];
        v.x += (width / 2 - v.x) / FACTOR_V_2_MIDDLE;
        v.y += (height / 2 - v.y) / FACTOR_V_2_MIDDLE;
        for (var _a = 0, vertices_2 = vertices; _a < vertices_2.length; _a++) {
            var v_other = vertices_2[_a];
            if (v !== v_other) {
                var dist_x = v_other.x - v.x;
                var dist_y = v_other.y - v.y;
                var dist = Math.sqrt(dist_x * dist_x + dist_y * dist_y);
                if (dist === 0) {
                    v.x += 1;
                    dist = 1;
                }
                else if (dist < DIST_V_2_V) {
                    dist_x = dist_x / dist * (DIST_V_2_V - dist) / 2;
                    dist_y = dist_y / dist * (DIST_V_2_V - dist) / 2;
                }
                else {
                    dist_x = 0;
                    dist_y = 0;
                }
                v.x -= dist_x;
                v.y -= dist_y;
                v_other.x += dist_x;
                v_other.y += dist_y;
            }
            else {
                //break;
            }
        }
    }
    for (var _b = 0, vertices_3 = vertices; _b < vertices_3.length; _b++) {
        var v = vertices_3[_b];
        v.x += v.velo_x;
        v.y += v.velo_y;
        v.velo_x = 0;
        v.velo_y = 0;
        ctx.beginPath();
        ctx.arc(v.x, v.y, 30, 0, 2 * Math.PI);
        ctx.stroke();
    }
}
function resize() {
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;
    requestAnimationFrame(draw);
}
