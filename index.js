let template = (code, sx, sy, sz, tx, ty, tz) => `
float sdCapsule( vec3 p, vec3 a, vec3 b, float r ) {
    vec3 pa = p - a, ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h ) - r;
}

float sdTorus( vec3 p, vec2 t ) {
    vec2 q = vec2(length(p.xz)-t.x,p.y);
    return length(q)-t.y;
}

float sdCappedTorus(in vec3 p, in vec2 sc, in float ra, in float rb) {
    p.x = abs(p.x);
    float k = (sc.y*p.x>sc.x*p.y) ? dot(p.xy,sc) : length(p.xy);
    return sqrt( dot(p,p) + ra*ra - 2.0*ra*k ) - rb;
}

float map(vec3 p) {
    vec3 scale = vec3(${sx}, ${sy}, ${sz});
    vec3 translate = vec3(${tx}, ${ty}, ${tz});
    vec3 p = (p - translate) / scale;
    float d = 1e30;${code}
    return d * scale;
}
`;

let charSdf = (c, px) => {
  switch (c) {
    case 'h': return `
    d = min(d, sdCapsule(p, vec3(.056, .035, 0.), vec3(.056, .495, 0.), .035));
    d = min(d, sdCappedTorus(p - vec3(.177, .199, 0.), vec2(1.,0.), .1205, .035));
    d = min(d, sdCapsule(p, vec3(.298, .035, 0.), vec3(.298, .199, 0.), .035));`;
      break;
    case 'o': return `
    d = min(d, sdTorus(p.xzy - vec3(.195, 0., .177), vec2(.1425, .035)));`;
      break;
    case 'w': return `
    d = min(d, sdCapsule(p, vec3(.036, .318, 0.), vec3(.143, .035, 0.), .035));
    d = min(d, sdCapsule(p, vec3(.143, .035, 0.), vec3(.249, .318, 0.), .035));
    d = min(d, sdCapsule(p, vec3(.249, .318, 0.), vec3(.356, .035, 0.), .035));
    d = min(d, sdCapsule(p, vec3(.356, .035, 0.), vec3(.463, .318, 0.), .035));`;
  }
}

let charWidth = (c) => { return 0.01; }
let charKerning = (c, c2) => { return 0.01; }

function codegen(str, sx, sy, sz, tx, ty, tz) {
  let code = '';
  let posx = 0;
  for(let i = 0; i < str.length; i++) {
    code += charSdf(str[i], posx);
    posx += charWidth(str[i]);
    if (i != str.length) {
      posx += charKerning(str[i], str[i + 1]);
    }
  }
  return template(code, sx, sy, sz, tx, ty, tz);
}

console.log(codegen('how'));