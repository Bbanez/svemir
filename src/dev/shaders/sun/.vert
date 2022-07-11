varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
uniform float dt;

void main() {
  vUv = uv;
  vNormal = normal;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}