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
  -1,-1
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

const fragmentShader = new Shader(gl, ShaderType.fragment);
fragmentShader.source = fragmentSource.replace(/__TRESHOLD__/g, "32.").replace(/__ITERATIONS__/g, "100.");
fragmentShader.compile();
const vertexShader = new Shader(gl, ShaderType.vertex, vertexSource);
program.attach(fragmentShader);
program.attach(vertexShader);
program.link();

program.setAttribPointer("a_position", 2, gl.FLOAT, false, 0, 0);
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
  program.setUniform("u_ratio", canvas.width/canvas.height);
}

const frame = (time: number) => {
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

  setTimeout(() => {
    requestAnimationFrame(frame);
  }, 250);
};
requestAnimationFrame(frame);