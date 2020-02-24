precision mediump float;

varying vec2 v_position;

vec3 startColor = vec3(1., 0.5, 0.);
vec3 endColor = vec3(0., 0.5, 1.);

vec3 color(float its) {
  float t = its/__TRESHOLD__;
  return startColor * (1. - t) + endColor * t;
}

void main() {
  vec2 c = v_position;
  vec2 z = vec2(0.);

  float iterations = 0.;
  for (float i = 0.; i < __ITERATIONS__; i++) {
    iterations = i;
    float zr2 = z.x * z.x;
    float zi2 = z.y * z.y;
 
    if(zr2 + zi2 > __TRESHOLD__) break;
    z = vec2(zr2 - zi2, 2.0 * z.x * z.y) + c;
  }

  gl_FragColor = vec4(color(iterations), 1.);
}