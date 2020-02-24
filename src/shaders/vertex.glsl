attribute vec2 a_position;
attribute vec3 a_color;

varying vec3 v_color;

uniform float u_ratio;

void main() {
  gl_Position = vec4(a_position, 1.0, 1.0);

  v_color = a_color;
}