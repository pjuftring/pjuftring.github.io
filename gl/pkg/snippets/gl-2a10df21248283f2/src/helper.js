let CONTEXT;
export function init_canvas() {
    let canvas = document.getElementsByTagName('canvas')[0];
    let context = canvas.getContext('webgl');
    if (context === null) {
        throw 'Could not create webgl context.';
    }
    else {
        CONTEXT = context;
    }
    CONTEXT.viewport(0, 0, canvas.width, canvas.height);
    CONTEXT.enable(CONTEXT.DEPTH_TEST);
}
export function gl_clear_color(red, green, blue, alpha) {
    CONTEXT.clearColor(red, green, blue, alpha);
}
export function gl_clear(mask) {
    CONTEXT.clear(mask);
}
export function array_buffer_from_f32_array(data) {
    let buffer = CONTEXT.createBuffer();
    if (buffer === null) {
        throw "Could not create buffer!";
    }
    CONTEXT.bindBuffer(CONTEXT.ARRAY_BUFFER, buffer);
    CONTEXT.bufferData(CONTEXT.ARRAY_BUFFER, data, CONTEXT.STATIC_DRAW);
    return buffer;
}
export function delete_buffer(buffer) {
    CONTEXT.deleteBuffer(buffer);
}
export function create_program_from_sources(vert_src, frag_src) {
    let vert = CONTEXT.createShader(CONTEXT.VERTEX_SHADER);
    let frag = CONTEXT.createShader(CONTEXT.FRAGMENT_SHADER);
    let prog = CONTEXT.createProgram();
    if (vert === null || frag === null || prog === null) {
        throw "Could not create program or shader.";
    }
    CONTEXT.shaderSource(vert, vert_src);
    CONTEXT.shaderSource(frag, frag_src);
    CONTEXT.compileShader(vert);
    if (!CONTEXT.getShaderParameter(vert, CONTEXT.COMPILE_STATUS)) {
        throw "Could not compile vertex shader: " + CONTEXT.getShaderInfoLog(vert);
    }
    CONTEXT.compileShader(frag);
    if (!CONTEXT.getShaderParameter(frag, CONTEXT.COMPILE_STATUS)) {
        throw "Could not compile fragment shader: " + CONTEXT.getShaderInfoLog(frag);
    }
    CONTEXT.attachShader(prog, vert);
    CONTEXT.attachShader(prog, frag);
    CONTEXT.bindAttribLocation(prog, 0, "position");
    CONTEXT.bindAttribLocation(prog, 1, "normal");
    CONTEXT.linkProgram(prog);
    if (!CONTEXT.getProgramParameter(prog, CONTEXT.LINK_STATUS)) {
        throw "Could not link program: " + CONTEXT.getProgramInfoLog(prog);
    }
    CONTEXT.detachShader(prog, vert);
    CONTEXT.deleteShader(vert);
    CONTEXT.detachShader(prog, frag);
    CONTEXT.deleteShader(frag);
    return prog;
}
export function delete_program(program) {
    CONTEXT.deleteProgram(program);
}
export function get_uniform_location(prog, name) {
    let loc = CONTEXT.getUniformLocation(prog, name);
    if (loc === null) {
        throw "Unform location " + name + " does not exist.";
    }
    return loc;
}
export function set_uniform_matrix(program, location, data) {
    CONTEXT.useProgram(program);
    CONTEXT.uniformMatrix4fv(location, false, data);
}
export function set_uniform_float(program, location, data) {
    CONTEXT.useProgram(program);
    CONTEXT.uniform1f(location, data);
}
export function log(text) {
    console.log(text);
}
export function draw(vertices, colors, vert_len, program) {
    CONTEXT.clearColor(0.4, 0.3, 0.5, 1.0);
    CONTEXT.clear(CONTEXT.COLOR_BUFFER_BIT);
    CONTEXT.useProgram(program);
    CONTEXT.enableVertexAttribArray(0);
    CONTEXT.enableVertexAttribArray(1);
    CONTEXT.bindBuffer(CONTEXT.ARRAY_BUFFER, vertices);
    CONTEXT.vertexAttribPointer(0, 3, CONTEXT.FLOAT, false, 0, 0);
    CONTEXT.bindBuffer(CONTEXT.ARRAY_BUFFER, colors);
    CONTEXT.vertexAttribPointer(1, 3, CONTEXT.FLOAT, false, 0, 0);
    CONTEXT.drawArrays(CONTEXT.TRIANGLES, 0, vert_len);
}
