varying vec3 vPosition;

void main() {
  float rad = 0.0 + vPosition.z;
  rad *= rad;
  float bright = 1.0 + rad * 0.83;

  // gl_FragColor = vec4(v_Normal, 1.0);
  gl_FragColor = vec4(1.0, 0.0, 0.0, rad*5.2);
}