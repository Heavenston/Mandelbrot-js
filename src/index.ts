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


const program = gl.createProgram();
if (!program) throw "Error";
{
  const vs = gl.createShader(gl.VERTEX_SHADER);
  if (!vs) throw "Error";
  gl.shaderSource(vs, vertexSource);
  gl.compileShader(vs);
  gl.attachShader(program, vs);
  const success = gl.getShaderParameter(vs, gl.COMPILE_STATUS);
  if (!success) {
    // Something went wrong during compilation; get the error
    throw "could not compile shader:" + gl.getShaderInfoLog(vs);
  }
}
{
  const fs = gl.createShader(gl.FRAGMENT_SHADER);
  if (!fs) throw "Error";
  gl.shaderSource(fs, fragmentSource);
  gl.compileShader(fs);
  gl.attachShader(program, fs);
  const success = gl.getShaderParameter(fs, gl.COMPILE_STATUS);
  if (!success) {
    // Something went wrong during compilation; get the error
    throw "could not compile shader:" + gl.getShaderInfoLog(fs);
  }
}
gl.linkProgram(program);
{
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    // something went wrong with the link
    throw ("program failed to link:" + gl.getProgramInfoLog (program));
  }
}

{
  const positionLocation = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
}
const ratioLocation = gl.getUniformLocation(program, "u_ratio");
const timeLocation = gl.getUniformLocation(program, "u_time");

gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
gl.useProgram(program);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
gl.viewport(0,0, canvas.width, canvas.height);
gl.uniform1f(ratioLocation, canvas.width/canvas.height);

window.onresize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0,0, canvas.width, canvas.height);
  gl.uniform1f(ratioLocation, canvas.width/canvas.height);
}

const frame = (time: number) => {
  gl.uniform1f(timeLocation, time);
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
  requestAnimationFrame(frame);
};
requestAnimationFrame(frame);