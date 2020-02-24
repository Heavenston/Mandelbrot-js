import WebGLHelper from "~/helpers/webglHelper";

export const enum ShaderType {
  fragment,
  vertex
}

export default class Shader extends WebGLHelper {
  private _source?: string;
  private _compiled: boolean = false;
  get compiled() {return this._compiled}
  shader: WebGLShader;

  constructor(gl: WebGL2RenderingContext, type: ShaderType, source?: string) {
    super(gl);

    let sType: GLenum;

    switch (type) {
      case ShaderType.fragment:
        sType = gl.FRAGMENT_SHADER;
      break;
      case ShaderType.vertex:
        sType = gl.VERTEX_SHADER;
      break;
    }

    const shader = gl.createShader(sType);
    if (!shader) throw "Could not create shader";
    this.shader = shader;

    if (source) {
      this.source = source;
      this.compile();
    }
  }

  get source() {return this._source}
  set source(source: string|undefined) {
    if (!source) {
      console.warn("You can't clear a shader source");
      return;
    }
    if (this.compiled) {
      console.warn("Shader already compiled");
      return;
    }

    this.gl.shaderSource(this.shader, source);
    this._source = source;
  }

  compile() {
    if (this.compiled) {
      console.warn("Shader already compiled");
      return;
    }

    const {gl, shader} = this;
    gl.compileShader(shader);

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success)
      throw `Could not compile shader: ${gl.getShaderInfoLog(shader)}`;
    
    this._compiled = true;
  }
}