precision mediump float;

varying vec3 nrm;

void main() {
    vec3 pos = normalize(vec3(3.0, 2.0, -5.0));
    gl_FragColor = vec4(dot(nrm, pos), 0.2 + dot(nrm, pos) * 0.8, 0.1, 1.0);
}