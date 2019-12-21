let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

let width, height;

const FACTOR_V_2_MIDDLE = 10;
const DIST_V_2_V = 100;

interface vertex {
    x: number,
    y: number,
}

interface edge {
    src: number,
    dst: number,
}

let vertices: vertex[] = [];
let edges: edge[] = [];

let c: number = 0;

let captured_vertex: vertex | null = null;
let capture_x: number = 0;
let capture_y: number = 0;
let mouse_x: number = 0;
let mouse_y: number = 0;
let is_vertex_captured = false;


function init() {
    canvas = (document.getElementsByTagName("canvas")).item(0) as HTMLCanvasElement;
    ctx = canvas.getContext("2d");

    resize();
    setInterval(() => requestAnimationFrame(draw), 1000 / 30);
    setInterval(() => {
        vertices.push({x: Math.random() * 100 + width / 2, y: Math.random() * 100 + height / 2});
        edges.push({src: Math.max(c - 1, 0), dst: c});
        c++;
    }, 2000);
}
window['init'] = init;

function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let e of edges) {
        const v1 = vertices[e.src];
        const v2 = vertices[e.dst];

        let dist_x = v2.x - v1.x;
        let dist_y = v2.y - v1.y;
        let dist = Math.sqrt(dist_x * dist_x + dist_y * dist_y);

        if (dist > DIST_V_2_V * 2) {
            dist_x = dist_x / dist * (DIST_V_2_V * 2 - dist) / 2;
            dist_y = dist_y / dist * (DIST_V_2_V * 2- dist) / 2;
        } else {
            dist_x = 0;
            dist_y = 0;
        }

        v1.x -= dist_x;
        v1.y -= dist_y;
        v2.x += dist_x;
        v2.y += dist_y;
    }

    for (let v of vertices) {
        if (v !== captured_vertex) {
            v.x += (width / 2 - v.x) / FACTOR_V_2_MIDDLE;
            v.y += (height / 2 - v.y) / FACTOR_V_2_MIDDLE;
        }
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
                break;
            }
        }
    }

    if (is_vertex_captured) {
        captured_vertex.x = capture_x + mouse_x;
        captured_vertex.y = capture_y + mouse_y;
    }

    for (let e of edges) {
        let src_v = vertices[e.src];
        let dst_v = vertices[e.dst];

        ctx.beginPath();
        ctx.moveTo(src_v.x, src_v.y);
        ctx.lineTo(dst_v.x, dst_v.y);
        ctx.stroke();
    }

    ctx.fillStyle = 'white';
    for (let v of vertices) {
        ctx.beginPath();
        ctx.arc(v.x, v.y, 30, 0, 2 * Math.PI);
        ctx.fill();
    }
    ctx.fillStyle = 'black';
    for (let v of vertices) {
        ctx.beginPath();
        ctx.arc(v.x, v.y, 30, 0, 2 * Math.PI);
        ctx.stroke();
    }
}
window['draw'] = draw;

function oncapture(event: MouseEvent) {
    const x: number = event.offsetX;
    const y: number = event.offsetY;

    for (let v of vertices) {
        const dist_x = v.x - x;
        const dist_y = v.y - y;
        const distsqr: number = dist_x * dist_x + dist_y * dist_y;
        if (distsqr < 30 * 30) {
            console.log(distsqr);
            captured_vertex = v;
            is_vertex_captured = true;
            capture_x = dist_x;
            capture_y = dist_y;
            onmove(event);
            break;
        }
    }
}
window['oncapture'] = oncapture;

function onmove(event: MouseEvent) {
    if (is_vertex_captured) {
        mouse_x = event.offsetX;
        mouse_y = event.offsetY;
    }
}
window['onmove'] = onmove;

function onrelease() {
    is_vertex_captured = false;
    captured_vertex = null;
}
window['onrelease'] = onrelease;

function resize() {
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;

    canvas.width = width;
    canvas.height = height;

    requestAnimationFrame(draw);
}
window['resize'] = resize;