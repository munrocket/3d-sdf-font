import kerning from './kerning.js';

let f32 = x => x.toFixed(4);

let template = (sdf, scale, tx, ty, tz) => {
  if (!scale) scale = 1;
  if (!tx) tx = 0;
  if (!ty) ty = 0;
  if (!tz) tz = 0;
  scale = f32(scale);
  tx = f32(tx);
  ty = f32(ty);
  tz = f32(tz);
  return `
float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
  vec3 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), .0, 1.0);
  return length(pa - ba*h) - r;
}

float sdTorus(vec3 p, vec2 t) {
  vec2 q = vec2(length(p.xz) - t.x, p.y);
  return length(q) - t.y;
}

float sdCappedTorus(in vec3 p, in vec2 sc, in float ra, in float rb) {
  p.x = abs(p.x);
  float k = (sc.y * p.x > sc.x * p.y) ? dot(p.xy, sc) : length(p.xy);
  return sqrt(dot(p,p) + ra*ra - 2.0*ra*k) - rb;
}

float text(vec3 p) {
  float d = 1e30, fr = 1./sqrt(2.);
  float rc = cos(2.2), rs = sin(2.2); mat2 rm = mat2(rc, -rs, rs, rc);
  float gc = cos(1.25), gs = sin(1.25); mat2 gm = mat2(gc, -gs, gs, gc);
  float jc = cos(0.687), js = sin(0.687); mat2 jm = mat2(jc, -js, js, jc);
  float scale = ${scale};
  vec3 translate = vec3(${tx}, ${ty}, ${tz});
  p = (p - translate) / scale;${sdf}
  return d * scale;
}`};

let charSdf = (c, px) => {
  if (!px) px = 0;
  switch (c) {
  case 'a': return `
  d = min(d, sdTorus(p.xzy - vec3(${f32(.196+px)}, 0., .177), vec2(.142, .035))); //a
  d = min(d, sdCapsule(p, vec3(${f32(.338+px)}, .035, .0), vec3(${f32(.338+px)}, .177, 0.), .035));`;
  case 'b': return `
  d = min(d, sdTorus(p.xzy - vec3(${f32(.199+px)}, 0., .177), vec2(.142, .035))); //b
  d = min(d, sdCapsule(p, vec3(${f32(.057+px)}, .177, .0), vec3(${f32(.057+px)}, .494, 0.), .035));`;
  case 'c': return `
  d = min(d, sdCappedTorus(vec3(p.y,-p.x,p.z) - vec3(.177, ${f32(-.195-px)}, 0.), normalize(vec2(.054, -0.093)), 0.142, .035)); //c`;
  case 'd': return `
  d = min(d, sdTorus(p.xzy - vec3(${f32(.196+px)}, 0., .177), vec2(.142, .035))); //d
  d = min(d, sdCapsule(p, vec3(${f32(.338+px)}, .177, .0), vec3(${f32(.338+px)}, .494, 0.), .035));`;
  case 'e': return `
  d = min(d, sdCappedTorus(vec3(p.y, -p.xz) - vec3(.177, ${f32(-.181-px)}, 0.), normalize(vec2(.094, -.115)), .142, .035)); //e
  d = min(d, sdCappedTorus((p - vec3(${f32(.181+px)}, .177, 0.)), vec2(1,0), .142, .035));
  d = min(d, sdCapsule(p, vec3(${f32(.039+px)}, .177, 0.), vec3(${f32(.323+px)}, .177, 0.), .035));`;
  case 'f': return `
  d = min(d, sdCapsule(p, vec3(${f32(.131+px)}, .035, .0), vec3(${f32(.131+px)}, .387, 0.), .035)); //f
  d = min(d, sdCapsule(p, vec3(${f32(.058+px)}, .319, .0), vec3(${f32(.229+px)}, .319, 0.), .035));
  d = min(d, sdCappedTorus(vec3((p.x+p.y)*fr, (-p.x+p.y)*fr, p.z) - vec3(${f32((.387+.239+px))}*fr, ${f32(.387-.239-px)}*fr, 0.), vec2(fr, fr), .108, .035));`;
  case 'g': return `
  d = min(d, sdTorus(p.xzy - vec3(${f32(.196+px)}, 0., .177), vec2(.142, .035))); //g
  d = min(d, sdCappedTorus(vec3(vec2(-p.y, p.x)*gm, p.z) - vec3(vec2(0., ${f32(.196+px)})*gm, 0.), gm[1], .142, .035));
  d = min(d, sdCapsule(p, vec3(${f32(.338+px)}, .0, .0), vec3(${f32(.338+px)}, .177, 0.), .035));`;
  case 'h': return `
  d = min(d, sdCapsule(p, vec3(${f32(.057+px)}, .035, 0.), vec3(${f32(.057+px)}, .494, 0.), .035)); //h
  d = min(d, sdCapsule(p, vec3(${f32(.297+px)}, .035, 0.), vec3(${f32(.297+px)}, .199, 0.), .035));
  d = min(d, sdCappedTorus(p - vec3(${f32(.177+px)}, .199, 0.), vec2(1.,0.), .120, .035));`;
  case 'i': return `
  d = min(d, sdCapsule(p, vec3(${f32(.057+px)}, .035, 0.), vec3(${f32(.057+px)}, .319, 0.), .035)); //i
  d = min(d, length(p - vec3(${f32(.057+px)}, .459, 0.)) - .035);`;
  case 'j': return `
  d = min(d, length(p - vec3(${f32(.057+px)}, .459, 0.)) - .035); //j
  d = min(d, sdCapsule(p, vec3(${f32(.057+px)}, 0., 0.), vec3(${f32(.057+px)}, .319, 0.), .035));
  d = min(d, sdCappedTorus(vec3(vec2(-p.y, p.x)*jm, p.z) - vec3(vec2(0., ${f32(-.085+px)})*jm, 0.), jm[1], .142, .035));`;
  case 'k': return `
  d = min(d, sdCapsule(p, vec3(${f32(.059+px)}, .035, .0), vec3(${f32(.059+px)}, .494, 0.), .035)); //k
  d = min(d, sdCapsule(p, vec3(${f32(.277+px)}, .035, .0), vec3(mix(vec2(${f32(.277+px)}, .319), vec2(${f32(.06+px)}, .179), 0.72), 0.), .035));
  d = min(d, sdCapsule(p, vec3(${f32(.277+px)}, .319, .0), vec3(${f32(.06+px)}, .179, 0.), .035));`;
  case 'l': return `
  d = min(d, sdCapsule(p, vec3(${f32(.057+px)}, .035, .0), vec3(${f32(.057+px)}, .494, 0.), .035)); //l`;
  case 'm': return `
  d = min(d, sdCapsule(p, vec3(${f32(.057+px)}, .034, 0.), vec3(${f32(.057+px)}, .2125, 0.), .035)); //m
  d = min(d, sdCapsule(p, vec3(${f32(.270+px)}, .034, 0.), vec3(${f32(.270+px)}, .2125, 0.), .035));
  d = min(d, sdCapsule(p, vec3(${f32(.483+px)}, .034, 0.), vec3(${f32(.483+px)}, .2125, 0.), .035));
  d = min(d, sdCappedTorus(p - vec3(${f32(.1635+px)}, .2125, 0.), vec2(1,0), .1065, .035));
  d = min(d, sdCappedTorus(p - vec3(${f32(.3765+px)}, .2125, 0.), vec2(1,0), .1065, .035));`;
  case 'n': return `
  d = min(d, sdCapsule(p, vec3(${f32(.053+px)}, .035, 0.), vec3(${f32(.053+px)}, .177, 0.), .035)); //n
  d = min(d, sdCapsule(p, vec3(${f32(.337+px)}, .035, 0.), vec3(${f32(.337+px)}, .177, 0.), .035));
  d = min(d, sdCappedTorus(p - vec3(${f32(.195+px)}, .177, 0.), vec2(1, 0), .142, .035));`;
  case 'o': return `
  d = min(d, sdTorus(p.xzy - vec3(${f32(.195+px)}, 0., .177), vec2(.142, .035))); //o`;
  case 'p': return `
  d = min(d, sdTorus(p.xzy - vec3(${f32(.195+px)}, 0., .177), vec2(.142, .035))); //p
  d = min(d, sdCapsule(p, vec3(${f32(.053+px)}, .177, .0), vec3(${f32(.053+px)}, -.177, 0.), .035));`;
  case 'q': return `
  d = min(d, sdTorus(p.xzy - vec3(${f32(.195+px)}, 0., .177), vec2(.142, .035))); //q
  d = min(d, sdCapsule(p, vec3(${f32(.337+px)}, .177, .0), vec3(${f32(.337+px)}, -.177, 0.), .035));`;
  case 'r': return `
  d = min(d, sdCapsule(p, vec3(${f32(.053+px)}, .035, 0.), vec3(${f32(.053+px)}, .177, 0.), .035)); //r
  d = min(d, sdCappedTorus(vec3((p.x+p.y)*fr, (-p.x+p.y)*fr, p.z) - vec3(${f32((.177+.195+px))}*fr, ${f32(.177-.195-px)}*fr, 0.), vec2(fr, fr), .142, .035));`;
  //p.x -= 0.032;
  //p.x = p.x - 0.03 - clamp(p.x-1.8416, -.03, .03);
  case 's': return `
  d = min(d, sdCappedTorus(vec3(-vec2(p.x, p.y)*rm - vec2(),p.z) + vec3(vec2(${f32(.122+px)}, .248)*rm, 0.), rm[1], .071, .035));//s
  d = min(d, sdCappedTorus(vec3(vec2(p.x, p.y)*rm,p.z) - vec3(vec2(${f32(.122+px)}, .106)*rm, 0.), rm[1], .071, .035));`;
  case 't': return `
  d = min(d, sdCapsule(p, vec3(${f32(.118+px)}, .035, .0), vec3(${f32(.118+px)}, .494, 0.), .035)); //t
  d = min(d, sdCapsule(p, vec3(${f32(.032+px)}, .319, .0), vec3(${f32(.203+px)}, .319, 0.), .035));`;
  case 'u': return `
  d = min(d, sdCapsule(p, vec3(${f32(.056+px)}, .319, 0.), vec3(${f32(.056+px)}, .141, 0.), .035)); //u
  d = min(d, sdCapsule(p, vec3(${f32(.272+px)}, .319, 0.), vec3(${f32(.272+px)}, .141, 0.), .035));
  d = min(d, sdCappedTorus(vec3(p.x, -p.y, p.z) - vec3(${f32(.164+px)}, -.141, 0.), vec2(1, 0), .108, .035));`;
  case 'v': return `
  d = min(d, sdCapsule(p, vec3(${f32(.0365+px)}, .319, 0.), vec3(${f32(.143+px)}, .035, 0.), .035)); //v
  d = min(d, sdCapsule(p, vec3(${f32(.143+px)}, .035, 0.), vec3(${f32(.2495+px)}, .319, 0.), .035));`;
  case 'w': return `
  d = min(d, sdCapsule(p, vec3(${f32(.036+px)}, .319, 0.), vec3(${f32(.143+px)}, .035, 0.), .035)); //w
  d = min(d, sdCapsule(p, vec3(${f32(.143+px)}, .035, 0.), vec3(${f32(.249+px)}, .319, 0.), .035));
  d = min(d, sdCapsule(p, vec3(${f32(.249+px)}, .319, 0.), vec3(${f32(.356+px)}, .035, 0.), .035));
  d = min(d, sdCapsule(p, vec3(${f32(.356+px)}, .035, 0.), vec3(${f32(.463+px)}, .319, 0.), .035));`;
  case 'x': return `
  d = min(d, sdCapsule(p, vec3(${f32(.037+px)}, .035, 0.), vec3(${f32(.257+px)}, .319, 0.), .035)); //x
  d = min(d, sdCapsule(p, vec3(${f32(.037+px)}, .319, 0.), vec3(${f32(.257+px)}, .035, 0.), .035));`;
  case 'y': return `
  d = min(d, sdCapsule(p, vec3(${f32(.052+px)}, .141, .0), vec3(${f32(.052+px)}, .319, 0.), .035)); //y
  d = min(d, sdCappedTorus(vec3(p.x, -p.y, p.z) - vec3(${f32(.160+px)}, -.141, 0.), vec2(1,0), .108, .035));
  d = min(d, sdCapsule(p, vec3(${f32(.268+px)}, -.031, .0), vec3(${f32(.268+px)}, .319, 0.), .035));
  d = min(d, sdCappedTorus(vec3(vec2(-p.y, p.x)*gm, p.z) - vec3(vec2(.031, ${f32(.160+px)})*gm, 0.), gm[1], .108, .035));`;
  case 'z': return `
  d = min(d, sdCapsule(p, vec3(${f32(.049+px)}, .319, .0), vec3(${f32(.270+px)}, .319, 0.), .035)); //z
  d = min(d, sdCapsule(p, vec3(${f32(.049+px)}, .035, .0), vec3(${f32(.270+px)}, .319, 0.), .035));
  d = min(d, sdCapsule(p, vec3(${f32(.049+px)}, .035, .0), vec3(${f32(.270+px)}, .035, 0.), .035));`;
  case '.': return `
  d = min(d, length(p - vec3(${f32(.059+px)}, 0.035, 0)) - .035); //.`;
  case '!': return `
  d = min(d, length(p - vec3(${f32(.057+px)}, 0.035, 0)) - .035); //!
  d = min(d, sdCapsule(p, vec3(${f32(.057+px)}, .145, .0), vec3(${f32(.057+px)}, .459, 0.), .035));`;
  //case 'A': return `
  //d = min(d, sdCapsule(p, vec3(${f32(.050+px)}, .036, .0), vec3(${f32(.202+px)}, .458, 0.), .035));
  //d = min(d, sdCapsule(p, vec3(mix(.50, .202, 0.2)+${f32(px)}, .036, .0), vec3(mix(.202, .458, 0.2)+${f32(px)}, .319, 0.), .035));
  //d = min(d, sdCapsule(p, vec3(${f32(.202+px)}, .458, .0), vec3(${f32(.344+px)}, .036, 0.), .035));`;
  default: return '';
  }
}

function sdfKerning(str) {
  if (kerning[str]) {
    return 0.35388 * kerning[str];
  } else {
    return 0;
  }
} 

function sdf(str, linespace = 1.15, scale, tx, ty, tz) {
  let sdf = '';
  let px = 0;
  for(let i = 0; i < str.length; i++) {
    sdf += charSdf(str[i], px);
    if (i != str.length - 1) {
      px += sdfKerning(str[i]);
      px += sdfKerning(str[i] + str[i + 1]);
      if (str[i + 1] == '\n') {
        px = 0;
        sdf += `\n  p.y += ${f32(.811 * linespace / 1.15)};`;
      }
    }
  }
  return template(sdf, scale, tx, ty, tz);
}

console.log(sdf(process.argv.slice(2).reduce((l, r) => l + ' ' + r, '').toLowerCase().replace('\\n', '\n')));
//console.log(sdf('how vexingly\nquick daft\nzebras jump!'));
export { sdf };