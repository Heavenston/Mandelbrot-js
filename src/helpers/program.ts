import WebGLHelper from "./webglHelper";
import Shader from "./shader";
import * as WebGLTypes from "../utils/webGLTypes";

interface Attrib {
  location: number;
  info: WebGLActiveInfo;
}
interface Uniform {
  location: WebGLUniformLocation|null;
  info: WebGLActiveInfo|null;
}

export default class Program extends WebGLHelper {
  program: WebGLProgram;

  private uniforms: Map<string, Uniform> = new Map();
  private attribs: Map<string, Attrib> = new Map();

  constructor(gl: WebGL2RenderingContext, vertexShader?: Shader, fragmentShader?: Shader) {
    super(gl);

    const program = gl.createProgram();
    if (!program) throw "Could not create program";
    this.program = program;
  }

  attach(shader: Shader) {
    this.gl.attachShader(this.program, shader.shader);
  }

  link() {
    const {gl, program} = this;
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success)
      throw (`program failed to link: ${gl.getProgramInfoLog(program)}`);
    
    this.attribs.clear();
    this.uniforms.clear();

    {
      const n = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < n; i++) {
        const info = gl.getActiveUniform(program, i);
        if (!info) break;
        const loc = gl.getUniformLocation(program, info.name);
        if (!loc) break;
        this.uniforms.set(info.name, {location: loc, info});
      }
    }
    {
      const n = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
      for (let i = 0; i < n; i++) {
        const info = gl.getActiveAttrib(program, i);
        if (!info) break;
        const loc = gl.getAttribLocation(program, info.name);
        if (loc === -1) break;
        this.attribs.set(info.name, {location: loc, info});
      }
    }

    console.log(this.uniforms);
    console.log(this.attribs);
  }
  use() {
    const {gl, program} = this;
    gl.useProgram(program);
  }

  getAttrib(name: string): Attrib|undefined {
    if (this.attribs.has(name)) return this.attribs.get(name);
    console.warn(`Could not find attribute ${name}`);
  }
  setAttribPointer(name: string, size: 1|2|3|4, type: GLenum, normalized: boolean = false, stride: GLsizei = 0, offset: GLintptr = 0) {
    this.use();
    const {gl} = this;
    const {location} = this.getAttrib(name) || {};
    if (location === undefined) return;

    console.log({location, size, type, normalized, stride, offset});

    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, type, normalized, stride, offset);
  }

  getUniform(name: string): Uniform|undefined {
    if (this.uniforms.has(name)) return this.uniforms.get(name);
    console.warn(`Could not find attribute ${name}`);
  }
  setUniform(name: string, v1: GLfloat|GLint|GLfloat[]|GLint[], v2?: GLfloat|GLint, v3?: GLfloat|GLint, v4?: GLfloat|GLint) {
    this.use();
    const {gl, program} = this;
    const {location, info} = this.getUniform(name) || {};
    if (!location || !info) return;

    const values = [v1];
    if (v2 !== undefined) values.push(v2);
    if (v3 !== undefined) values.push(v3);
    if (v4 !== undefined) values.push(v4);
    if (values.length !== info.size) {
      console.warn(`Invalid number of arguments for uniform ${name}, expected ${info.size}, given ${values.length}`);
      console.groupEnd();
      return;
    }
    
    if (WebGLTypes.isVector(info.type)) {
      if (WebGLTypes.isFloat(info.type)) {
        switch (WebGLTypes.getSize(info.type)) {
          case 1:
            gl.uniform1fv(location, new Float32Array(<any>v1));
          break;
          case 2:
            gl.uniform2fv(location, new Float32Array(<any>v1));
          break;
          case 3:
            gl.uniform3fv(location, new Float32Array(<any>v1));
          break;
          case 4:
            gl.uniform4fv(location, new Float32Array(<any>v1));
          break;
        }
      } else {
        switch (WebGLTypes.getSize(info.type)) {
          case 1:
            gl.uniform1iv(location, new Int32Array(<any>v1));
          break;
          case 2:
            gl.uniform2iv(location, new Int32Array(<any>v1));
          break;
          case 3:
            gl.uniform3iv(location, new Int32Array(<any>v1));
          break;
          case 4:
            gl.uniform4iv(location, new Int32Array(<any>v1));
          break;
        }
      }
    }
    else {
      if (WebGLTypes.isFloat(info.type)) {
        switch (info.size) {
          case 1:
            gl.uniform1f(location, <any>v1);
          break;
          case 2:
            gl.uniform2f(location, <any>v1, <any>v2);
          break;
          case 3:
            gl.uniform3f(location, <any>v1, <any>v2, <any>v3);
          break;
          case 4:
            gl.uniform4f(location, <any>v1, <any>v2, <any>v3, <any>v4);
          break;
        }
      } else {
        switch (info.size) {
          case 1:
            gl.uniform1i(location, <any>v1);
          break;
          case 2:
            gl.uniform2i(location, <any>v1, <any>v2);
          break;
          case 3:
            gl.uniform3i(location, <any>v1, <any>v2, <any>v3);
          break;
          case 4:
            gl.uniform4i(location, <any>v1, <any>v2, <any>v3, <any>v4);
          break;
        }
      }
    }
  }
}