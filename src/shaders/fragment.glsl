precision mediump float;

float THRESHOLD = 100.;
float MAX_ITERATIONS = 25.;

varying vec2 v_position;

vec3 startColor = vec3(1., 0.5, 0.);
vec3 endColor = vec3(0., 0.5, 1.);

vec3 color(float its) {
  float t = its/25.;
  return startColor * (1. - t) + endColor * t;
}

void main() {

  vec2 c = v_position;
  vec2 z = vec2(0.);

  float iterations = 0.;
  for (float i = 0.; i < 1000000.; i++) {
    iterations = i;
    float zr2 = z.x * z.x;
    float zi2 = z.y * z.y;
 
    if(zr2 + zi2 > THRESHOLD) break;
    z = vec2(zr2 - zi2, 2.0 * z.x * z.y) + c;

    if (i >= MAX_ITERATIONS) break;
  }

  gl_FragColor = vec4(color(iterations), 1.);
}