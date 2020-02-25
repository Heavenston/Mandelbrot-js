import Program from "~/helpers/program";
import Shader, { ShaderType } from "~/helpers/shader";
import fragmentSource from "./shaders/fragment.glsl";
import vertexSource from "./shaders/vertex.glsl";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const gl = canvas.getContext("webgl2");
if (!gl) throw "No Context";

const vertices = new Float32Array([
  -1, 1,
   1, 1,
   1,-1,
  -1,-1,
]);
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const indices = new Uint16Array([
  0, 1, 3,
  1, 3, 2
]);
const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

const program = new Program(gl);

const fragmentShader = new Shader(gl, ShaderType.fragment,
  fragmentSource
    .replace(/__ITERATIONS__/g, "1000.")
);
const vertexShader = new Shader(gl, ShaderType.vertex, vertexSource);
program.attach(fragmentShader);
program.attach(vertexShader);
program.link();

program.setAttribPointer("a_position", 2, gl.FLOAT);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

program.use();

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
gl.viewport(0,0, canvas.width, canvas.height);
program.setUniform("u_ratio", canvas.width/canvas.height);

window.onresize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0,0, canvas.width, canvas.height);
  gl.uniform1f(gl.getUniformLocation(program.program, "u_ratio"), canvas.width/canvas.height);
}

let zoom = 0;

program.setUniform("u_zoom", zoom);
program.setUniform("u_zoom", zoom);

program.setUniform("u_threshold", 32);
program.setUniform("u_ramp", 1000);
program.setUniform("u_position", [0.432905, 0.201506]);

const frame = (time: number) => {
  program.setUniform("u_threshold", 32);
  program.setUniform("u_ramp", 500);

  program.setUniform("u_zoom", zoom);
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

  zoom = (((time-2000)/10000)*32)%40;
  requestAnimationFrame(frame);
};
requestAnimationFrame(frame);