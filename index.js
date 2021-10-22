let template = (code, scale, tx, ty, tz) => {
  scale = scale.toFixed(1);
  tx = tx.toFixed(1);
  ty = ty.toFixed(1);
  tz = tz.toFixed(1);
  return `
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
    vec3 translate = vec3(${tx}, ${ty}, ${tz});
    vec3 p = (p - translate) / ${scale};
    float d = 1e30;${code}
    return d * scale;
}`};

let charSdf = (c, px) => {
  switch (c) {
    case 'a': return `
    d = min(d, sdTorus(p.xzy - vec3(.196, 0., .177), vec2(.142, .035)));
    d = min(d, sdCapsule(p, vec3(.338, .035, .0), vec3(.338, .196, 0.), .035));`;
    case 'b': return `
    d = min(d, sdTorus(p.xzy - vec3(.199, 0., .177), vec2(.142, .035)));
    d = min(d, sdCapsule(p, vec3(.057, .177, .0), vec3(.057, .494, 0.), .035));`;
    case 'c': return `
    d = min(d, sdCappedTorus(vec3(p.y,-p.x,p.z) - vec3(0.177, -0.195, 0.), normalize(vec2(0.054, -0.093)), 0.142, .035));`;
    case 'd': return `
    d = min(d, sdTorus(p.xzy - vec3(.196, 0., .177), vec2(.142, .035)));
    d = min(d, sdCapsule(p, vec3(.338, .177, .0), vec3(.338, .494, 0.), .035));`;
    case 'e': return `
    d = min(d, sdCappedTorus(vec3(p.y, -p.xz) - vec3(0.177, -.181, 0.), normalize(vec2(.094, -0.115)), .1425, .035));
    d = min(d, sdCappedTorus((p - vec3(0.181, .177, 0.)), vec2(1,0), .1425, .035));
    d = min(d, sdCapsule(p, vec3(.022, .177, 0.), vec3(.323, .177, 0.), .035));`;
    case 'f': return `
    d = min(d, sdCapsule(p, vec3(.131, .035, .0), vec3(.131, .386, 0.), .035));
    d = min(d, sdCapsule(p, vec3(.058, .320, .0), vec3(.229, .320, 0.), .035));
    d = min(d, max(-p.y+0.386, sdCappedTorus(vec3(p.y,-p.x,p.z) - vec3(0.386, -0.239, 0.), normalize(vec2(0.2,.04)), 0.108, .035)));`;
    case 'g': return `
    d = min(d, sdTorus(p.xzy - vec3(.195, 0., .177), vec2(.1425, .035)));
    d = min(d, sdCapsule(p, vec3(.338, .0, .0), vec3(.338, .177, 0.), .035));
    d = min(d, max(p.y, sdCappedTorus(vec3(-p.y, p.x, p.z) - vec3(0., .195, 0.), vec2(sin(2.5), cos(2.5)), 0.142, .035)));`;
    case 'h': return `
    d = min(d, sdCapsule(p, vec3(.056, .035, 0.), vec3(.056, .495, 0.), .035));
    d = min(d, sdCappedTorus(p - vec3(.177, .199, 0.), vec2(1.,0.), .1205, .035));
    d = min(d, sdCapsule(p, vec3(.298, .035, 0.), vec3(.298, .199, 0.), .035));`;
    case 'i': return `
    d = min(d, sdCapsule(p, vec3(0.057, 0.035, 0.), vec3(0.057, 0.319, 0.), .035));
    d = min(d, length(p - vec3(0.057, .459, 0.)) - 0.035);`;
    case 'j': return ``;

    case 'k': return ``;

    case 'l': return `
    d = min(d, sdCapsule(p, vec3(.057, .035, .0), vec3(.057, .494, 0.), .035));`;
    case 'm': return `
    d = min(d, sdCapsule(p, vec3(.057, .034, 0.), vec3(0.057, .2125, 0.), .035));
    d = min(d, sdCappedTorus(p - vec3(0.1635, .2125, 0.), vec2(1,0), 0.1065, .035));
    d = min(d, sdCapsule(p, vec3(0.27, .034, 0.), vec3(0.27, .2125, 0.), .035));
    d = min(d, sdCappedTorus(p - vec3(0.3765, .2125, 0.), vec2(1,0), 0.1065, .035));
    d = min(d, sdCapsule(p, vec3(0.483, .034, 0.), vec3(0.483, .2125, 0.), .035));`;
    case 'n': return `
    d = min(d, sdCapsule(p, vec3(.053, .035, 0.), vec3(.053, .177, 0.), .035));
    d = min(d, sdCappedTorus(p - vec3(.195, .177, 0.), vec2(1, 0), 0.142, .035));
    d = min(d, sdCapsule(p, vec3(.337, .035, 0.), vec3(0.337, .177, 0.), .035));`;
    case 'o': return `
    d = min(d, sdTorus(p.xzy - vec3(.195, 0., .177), vec2(.1425, .035)));`;
    case 'p': return `
    d = min(d, sdTorus(p.xzy - vec3(.195, 0., .177), vec2(.1425, .035)));
    d = min(d, sdCapsule(p, vec3(.0525, .177, .0), vec3(.0525, -.177, 0.), .035));`;
    case 'q': return `
    d = min(d, sdTorus(p.xzy - vec3(.195, 0., .177), vec2(.1425, .035)));
    d = min(d, sdCapsule(p, vec3(.338, .177, .0), vec3(.338, -.177, 0.), .035));`;
    case 'r': return ``;

    case 's': return ``;

    case 't': return ``;

    case 'u': return `
    d = min(d, sdCapsule(p, vec3(.056, .319, 0.), vec3(.056, .141, 0.), .035));
    d = min(d, sdCappedTorus(vec3(p.x, -p.y, p.z) - vec3(.164, -.141, 0.), vec2(1, 0), 0.108, .035));
    d = min(d, sdCapsule(p, vec3(.273, .319, 0.), vec3(.273, .141, 0.), .035));`;
    case 'v': return `
    d = min(d, sdCapsule(p, vec3(.0365, .319, 0.), vec3(.143, .035, 0.), .035));
    d = min(d, sdCapsule(p, vec3(.143, .035, 0.), vec3(.2495, .319, 0.), .035));`;
    case 'w': return `
    d = min(d, sdCapsule(p, vec3(.036, .319, 0.), vec3(.143, .035, 0.), .035));
    d = min(d, sdCapsule(p, vec3(.143, .035, 0.), vec3(.249, .319, 0.), .035));
    d = min(d, sdCapsule(p, vec3(.249, .319, 0.), vec3(.356, .035, 0.), .035));
    d = min(d, sdCapsule(p, vec3(.356, .035, 0.), vec3(.463, .319, 0.), .035));`;
    case 'x': return `
    d = min(d, sdCapsule(p, vec3(.037, .035, 0.), vec3(.257, .319, 0.), .035));
    d = min(d, sdCapsule(p, vec3(.037, .319, 0.), vec3(.257, .035, 0.), .035));`;
    case 'y': return `
    d = min(d, sdCapsule(p, vec3(.053, .141, .0), vec3(.053, .319, 0.), .035));
    d = min(d, sdCappedTorus(vec3(p.x, -p.y, p.z) - vec3(.160, -.141, 0.), vec2(1,0), 0.108, .035));
    d = min(d, sdCapsule(p, vec3(.269, -.031, .0), vec3(.269, .319, 0.), .035));
    d = min(d, max(p.y+.031, sdCappedTorus(vec3(-p.y, p.x, p.z) - vec3(0.031, .160, 0.), vec2(sin(2.5), cos(2.5)), 0.108, .035)));`;
    case 'z': return `
    d = min(d, sdCapsule(p, vec3(.049, .319, .0), vec3(.270, .319, 0.), .035));
    d = min(d, sdCapsule(p, vec3(.049, .035, .0), vec3(.270, .319, 0.), .035));
    d = min(d, sdCapsule(p, vec3(.049, .035, .0), vec3(.270, .035, 0.), .035));`;
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
  return template(code, scale, tx, ty, tz);
}

console.log(codegen('how'));