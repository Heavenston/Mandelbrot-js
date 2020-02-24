precision highp float;

varying highp vec2 v_position;

uniform highp float u_threshold;
uniform highp float u_ramp;

vec3 startColor = vec3(1., 0.5, 0.);
vec3 endColor = vec3(0., 0.5, 1.);

vec3 color(float its) {
  float t = its/u_ramp;
  return startColor * (1. - t) + endColor * t;
}

void main() {
  highp vec2 c = v_position;
  highp vec2 z = vec2(0.);

  float iterations = 0.;
  for (float i = 0.; i < __ITERATIONS__; i++) {
    iterations = i;
    highp float zr2 = z.x * z.x;
    highp float zi2 = z.y * z.y;
 
    if(zr2 + zi2 > u_threshold) break;
    z = vec2(zr2 - zi2, 2.0 * z.x * z.y) + c;
  }

  gl_FragColor = vec4(color(iterations), 1.);
}