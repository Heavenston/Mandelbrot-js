attribute vec2 a_position;

varying vec2 v_position;
uniform float u_ratio;

void main() {
  gl_Position = vec4(a_position, 1.0, 1.0);
  v_position = a_position;
  v_position.x *= u_ratio;
}