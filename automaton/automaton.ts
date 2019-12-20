let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

let width, height;

const FACTOR_V_2_MIDDLE = 10;
const DIST_V_2_V = 100;

interface vertex {
    x: number,
    y: number,
    velo_x: number,
    velo_y: number,
}

let vertices: vertex[];

function init() {
    canvas = (document.getElementsByTagName("canvas")).item(0) as HTMLCanvasElement;
    ctx = canvas.getContext("2d");
    vertices = [];

    resize();
    setInterval(() => requestAnimationFrame(draw), 1000 / 30);
    setInterval(() => vertices.push({x: Math.random() * 100 + width / 2, y: Math.random() * 100 + height / 2, velo_x: 0, velo_y: 0}), 2000);
}

function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let v of vertices) {
        v.x += (width / 2 - v.x) / FACTOR_V_2_MIDDLE;
        v.y += (height / 2 - v.y) / FACTOR_V_2_MIDDLE;
        for (let v_other of vertices) {
            if (v !== v_other) {
                let dist_x = v_other.x - v.x;
                let dist_y = v_other.y - v.y;
                let dist = Math.sqrt(dist_x * dist_x + dist_y * dist_y);

                if (dist === 0) {
                    v.x += 1;
                    dist = 1;
                } else if (dist < DIST_V_2_V) {
                    dist_x = dist_x / dist * (DIST_V_2_V - dist) / 2;
                    dist_y = dist_y / dist * (DIST_V_2_V - dist) / 2;
                } else {
                    dist_x = 0;
                    dist_y = 0;
                }

                v.x -= dist_x;
                v.y -= dist_y;
                v_other.x += dist_x;
                v_other.y += dist_y;
            } else {
                //break;
            }
        }
    }

    for (let v of vertices) {
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