attribute vec3 position;
attribute vec3 normal;
varying vec3 nrm;
uniform mat4 camera;
uniform float time;

void main() {
    nrm = normalize(camera * vec4(normal, 0.0)).xyz;
    gl_Position = camera * vec4(position + normal * clamp(sin(time/2000.), 0., 1.) * 3., 1.0);
}