import WebGLHelper from "~/helpers/webglHelper";
import Shader from "~/helpers/shader";

interface Attrib {
  index: number;
  info: WebGLActiveInfo;
}
interface Uniform {
  index: WebGLUniformLocation|null;
  info: WebGLActiveInfo|null;
}

export default class Program extends WebGLHelper {
  private _linked = false;
  get linked() {return this._linked}

  program: WebGLProgram;

  private uniformsCache: Map<string, Uniform> = new Map();
  private attribsCache: Map<string, Attrib> = new Map();

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

  getAttrib(name: string): Attrib {
    this.use();
    const {gl, program} = this;
    if (this.attribsCache.has(name)) return <Attrib>this.attribsCache.get(name);

    const index = gl.getAttribLocation(program, name);
    if (index === -1) throw `Could not find attribute ${name}`;
    const info = gl.getActiveAttrib(program, index);
    if (info === null) throw `Could not find attribute ${name} infos`;
    
    const attrib: Attrib = {info, index}
    this.attribsCache.set(name, attrib);
    return attrib;
  }
  setAttribPointer(name: string, size: 1|2|3|4, type: GLenum, normalized: boolean = false, stride: GLsizei = 0, offset: GLintptr = 0) {
    this.use();
    const {gl} = this;
    const {index} = this.getAttrib(name);
    gl.enableVertexAttribArray(index);
    gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
  }

  getUniform(name: string): Uniform {
    this.use();
    const {gl, program} = this;
    if (this.uniformsCache.has(name)) return <Uniform>this.uniformsCache.get(name);

    const index = gl.getUniformLocation(program, name);
    if (index === null) console.warn(`Could not find attribute ${name}`);
    const info = gl.getActiveUniform(program, <any>index);
    if (info === null) console.warn(`Could not find attribute ${name} infos`);
    
    const uniform: Uniform = {info, index}
    this.uniformsCache.set(name, uniform);
    return uniform;
  }
  setUniform(name: string, v1: GLfloat|GLint, v2?: GLfloat|GLint, v3?: GLfloat|GLint, v4?: GLfloat|GLint) {
    this.use();
    const {gl, program} = this;
    const {index, info} = this.getUniform(name);

    if (!index || !info) return;

    const values = [v1];
    if (v2) values.push(v2);
    if (v3) values.push(v3);
    if (v4) values.push(v4);
    if (values.length !== info.size) {
      console.warn(`Invalid number of arguments for uniform ${name}, expected ${info.size}, given ${values.length}`);
      return;
    }
    
    if (
      info.type === gl.FLOAT
      || info.type === gl.FLOAT_VEC2
      || info.type === gl.FLOAT_VEC3
      || info.type === gl.FLOAT_VEC4
      || info.type === gl.FLOAT_MAT2
      || info.type === gl.FLOAT_MAT3
      || info.type === gl.FLOAT_MAT4
      ) {
      switch (info.size) {
        case 1:
          gl.uniform1f(index, v1);
        break;
        case 2:
          gl.uniform2f(index, v1, <any>v2);
        break;
        case 3:
          gl.uniform3f(index, v1, <any>v2, <any>v3);
        break;
        case 4:
          gl.uniform4f(index, v1, <any>v2, <any>v3, <any>v4);
        break;
      }
    } else if (
      info.type === gl.INT
      || info.type === gl.INT_VEC2
      || info.type === gl.INT_VEC3
      || info.type === gl.INT_VEC4
    ) {
      switch (info.size) {
        case 1:
          gl.uniform1i(index, v1);
        break;
        case 2:
          gl.uniform2i(index, v1, <any>v2);
        break;
        case 3:
          gl.uniform3i(index, v1, <any>v2, <any>v3);
        break;
        case 4:
          gl.uniform4i(index, v1, <any>v2, <any>v3, <any>v4);
        break;
      }
    }
    else {
      console.warn(`Unknown uniform type`);
    }
  }
}