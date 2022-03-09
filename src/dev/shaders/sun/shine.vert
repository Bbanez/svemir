varying vec3 v_Normal;
varying vec3 vPosition;
varying vec2 vUv;

void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  v_Normal = normal;
}
