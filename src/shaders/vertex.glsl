attribute vec2 a_position;

varying vec2 v_position;

uniform float u_ratio;
uniform float u_zoom;
uniform vec2 u_position;

void main() {
  gl_Position = vec4(a_position, 1.0, 1.0);
  v_position = a_position;
  v_position.x *= u_ratio;

  float zoom_factor = pow(0.75, u_zoom);

  v_position *= zoom_factor;
  v_position += u_position;
}