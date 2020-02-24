export function typeToString(type: GLenum) {
  switch (type) {
    case WebGL2RenderingContext.prototype.FLOAT:
      return "FLOAT";
    case WebGL2RenderingContext.prototype.FLOAT_VEC2:
      return "FLOAT_VEC2";
    case WebGL2RenderingContext.prototype.FLOAT_VEC3:
      return "FLOAT_VEC3";
    case WebGL2RenderingContext.prototype.FLOAT_VEC4:
      return "FLOAT_VEC4";
    case WebGL2RenderingContext.prototype.FLOAT_MAT2:
      return "FLOAT_MAT2";
    case WebGL2RenderingContext.prototype.FLOAT_MAT3:
      return "FLOAT_MAT3";
    case WebGL2RenderingContext.prototype.FLOAT_MAT4:
      return "FLOAT_MAT4";
    case WebGL2RenderingContext.prototype.INT:
      return "INT";
    case WebGL2RenderingContext.prototype.INT_VEC2:
      return "INT_VEC2";
    case WebGL2RenderingContext.prototype.INT_VEC3:
      return "INT_VEC3";
    case WebGL2RenderingContext.prototype.INT_VEC4:
      return "INT_VEC4";
  }
}

export function isFloat(type: GLenum) {
  return /FLOAT/.test(typeToString(type) || "");
}
export function isVector(type: GLenum) {
  return /VEC/.test(typeToString(type) || "");
}

export function getSize(type: GLenum): number {
  const name = typeToString(type);
  if (!name) return 1;
  const regex = /(?:VEC|MAT)([0-9])/g;
  const r = regex.exec(name);
  if (!r) return 1;
  return Number(r[1]) || 1;
}