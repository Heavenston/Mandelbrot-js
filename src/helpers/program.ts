import WebGLHelper from "~/helpers/webglHelper";
import Shader from "~/helpers/shader";

export default class Program extends WebGLHelper {
  private _linked = false;
  get linked() {return this._linked}

  program: WebGLProgram;

  constructor(gl: WebGL2RenderingContext, vertexShader?: Shader, fragmentShader?: Shader) {
    super(gl);

    const program = gl.createProgram();
    if (!program) throw "Could not create program";
    this.program = program;
  }

  attach(shader: Shader) {
    if (this.linked) {
      console.warn("You can't attach a shader to a linked program");
      return;
    }
    this.gl.attachShader(this.program, shader.shader);
  }

  link() {
    const {gl, program} = this;
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success)
      throw (`program failed to link: ${gl.getProgramInfoLog(program)}`);
  }
  use() {
    const {gl, program} = this;
    gl.useProgram(program);
  }
}