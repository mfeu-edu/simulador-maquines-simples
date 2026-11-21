// Constructors de peces: cada peça crea malles (Three.js) i cossos (cannon-es) dins del pla z=0
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { buildMech } from './mech.js';

const V = (x, y, z = 0) => new CANNON.Vec3(x, y, z);
const rad = d => d * Math.PI / 180;

export function newBody(mass, x, y, angDeg, type) {
  const b = new CANNON.Body({ mass, type: type ?? (mass > 0 ? CANNON.Body.DYNAMIC : CANNON.Body.STATIC) });
  b.position.set(x, y, 0);
  b.quaternion.setFromAxisAngle(V(0, 0, 1), rad(angDeg));
  b.linearFactor.set(1, 1, 0);
  b.angularFactor.set(0, 0, 1);
  b.linearDamping = 0.01;
  b.angularDamping = 0.05;
  return b;
}

// Cos compost per capses; shapes: [{w,h,d,ox,oy,c}]
export function compound(ctx, shapes, mass, x, y, ang, type) {
  const body = newBody(mass, x, y, ang, type);
  const root = new THREE.Object3D();
  for (const s of shapes) {
    const d = s.d ?? 1;
    body.addShape(new CANNON.Box(V(s.w / 2, s.h / 2, d / 2)), V(s.ox ?? 0, s.oy ?? 0, 0));
    const m = new THREE.Mesh(new THREE.BoxGeometry(s.w, s.h, d), ctx.mat(s.c ?? 0xcccccc));
    m.position.set(s.ox ?? 0, s.oy ?? 0, 0);
    m.castShadow = true; m.receiveShadow = true;
    root.add(m);
  }
  return { root, body };
}

export function reg(ctx, p, root, body, extra = {}) {
  root.userData.pid = p.id;
  root.traverse(o => { o.userData.pid = p.id; });
  body.userData = { kind: p.t, pid: p.id, ...extra };
  root.position.copy(body.position);
  root.quaternion.copy(body.quaternion);
  ctx.scene.add(root);
  ctx.world.addBody(body);
  ctx.parts.push({ mesh: root, body });
}

export function marker(ctx, root, letter, x, y, color) {
  const cv = document.createElement('canvas'); cv.width = cv.height = 64;
  const g = cv.getContext('2d');
  g.fillStyle = color; g.beginPath(); g.arc(32, 32, 28, 0, 7); g.fill();
  g.fillStyle = '#fff'; g.font = 'bold 38px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(letter, 32, 34);
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), depthTest: false }));
  sp.scale.set(0.8, 0.8, 1); sp.position.set(x, y, 0.9); sp.renderOrder = 10;
  sp.visible = ctx.showMarks();
  root.add(sp); ctx.markers.push(sp);
}

function ball(ctx, p, r, mass, color) {
  const body = newBody(mass, p.x, p.y, 0);
  body.addShape(new CANNON.Sphere(r));
  const root = new THREE.Object3D();
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), ctx.mat(color));
  m.castShadow = true; root.add(m);
  const st = new THREE.Mesh(new THREE.BoxGeometry(r * 1.2, r * 0.25, r * 2.05), ctx.mat(0xffffff));
  root.add(st);
  reg(ctx, p, root, body, { ball: true, mass });
}

function wheel(ctx, p) {
  const r = 0.9, body = newBody(2, p.x, p.y, 0);
  body.addShape(new CANNON.Sphere(r));
  const root = new THREE.Object3D();
  const cyl = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.6, 24), ctx.mat(0x2d9cdb));
  cyl.rotation.x = Math.PI / 2; cyl.castShadow = true; root.add(cyl);
  for (let i = 0; i < 3; i++) {
    const sp = new THREE.Mesh(new THREE.BoxGeometry(r * 2, 0.16, 0.7), ctx.mat(0xeaf4ff));
    sp.rotation.z = i * Math.PI / 3; root.add(sp);
  }
  reg(ctx, p, root, body, { ball: true, mass: 2 });
}

function noria(ctx, p) {
  const shapes = [0, 60, 120].map(a => ({ w: 4.6, h: 0.28, d: 1, c: 0x9b51e0, rot: a }));
  const body = newBody(3, p.x, p.y, p.r ?? 0), root = new THREE.Object3D();
  shapes.forEach(s => {
    const q = new CANNON.Quaternion(); q.setFromAxisAngle(V(0, 0, 1), rad(s.rot));
    body.addShape(new CANNON.Box(V(s.w / 2, s.h / 2, 0.5)), V(0, 0), q);
    const m = new THREE.Mesh(new THREE.BoxGeometry(s.w, s.h, 1), ctx.mat(s.c));
    m.rotation.z = rad(s.rot); m.castShadow = true; root.add(m);
  });
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.3, 16), ctx.mat(0x5b2d8a));
  hub.rotation.x = Math.PI / 2; root.add(hub);
  body.angularDamping = 0.25;
  reg(ctx, p, root, body);
  const anchor = newBody(0, p.x, p.y, 0);
  ctx.world.addBody(anchor);
  ctx.world.addConstraint(new CANNON.HingeConstraint(anchor, body, {
    pivotA: V(0, 0, 0), axisA: V(0, 0, 1), pivotB: V(0, 0, 0), axisB: V(0, 0, 1)
  }));
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.3, 8), ctx.mat(0x444444));
  post.rotation.x = Math.PI / 2; post.position.set(p.x, p.y, 0.7); ctx.scene.add(post); post.userData.pid = p.id;
  ctx.extra.push(post);
}

// Palanca genèrica: el fulcre és a (p.x,p.y); L=llarg, f=posició del fulcre (0..1), a0=angle de repòs
function lever(ctx, p, c) {
  const ang = (p.r ?? 0) + c.a0, L = c.L, fx = c.f * L - L / 2;
  const R = a => ({ c: Math.cos(rad(a)), s: Math.sin(rad(a)) });
  const rr = R(ang);
  const cx = p.x - (rr.c * fx), cy = p.y - (rr.s * fx);
  const shapes = [{ w: L, h: c.th, c: c.color }, ...(c.extra || [])];
  const { root, body } = compound(ctx, shapes, c.mass, cx, cy, ang);
  body.angularDamping = 0.35;
  reg(ctx, p, root, body, { lever: true });
  const anchor = newBody(0, p.x, p.y, 0);
  ctx.world.addBody(anchor);
  ctx.world.addConstraint(new CANNON.HingeConstraint(anchor, body, {
    pivotA: V(0, 0, 0), axisA: V(0, 0, 1), pivotB: V(fx, 0, 0), axisB: V(0, 0, 1)
  }));
  const tri = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.55, 1.0, 3), ctx.mat(0x444b57));
  tri.rotation.x = Math.PI / 2; tri.position.set(p.x, p.y - 0.4, -0.1); tri.castShadow = true;
  ctx.scene.add(tri); tri.userData.pid = p.id; ctx.extra.push(tri);
  for (const st of (c.stops || [])) {
    const side = Array.isArray(st) ? st[0] : st, dr = Array.isArray(st) ? st[1] : (c.drop || 0);
    const ex = side * L / 2, wx = cx + rr.c * ex, wy = cy + rr.s * ex;
    const sb = newBody(0, wx, wy - c.th / 2 - 0.2 - dr, 0);
    sb.addShape(new CANNON.Box(V(0.35, 0.2, 0.5)));
    ctx.world.addBody(sb);
    const sm = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.4, 1), ctx.mat(0x444b57));
    sm.position.copy(sb.position); sm.position.z = 0; ctx.scene.add(sm); sm.userData.pid = p.id; ctx.extra.push(sm);
  }
  for (const m of (c.marks || [])) marker(ctx, root, m[0], m[1], m[2] ?? 0.5, m[0] === 'F' ? '#d63031' : m[0] === 'C' ? '#0984e3' : '#00a36c');
}

const cup = (x) => [
  { w: 1.8, h: 0.2, c: 0xd9822b, ox: x, oy: 0.35 },
  { w: 0.2, h: 1.1, c: 0xd9822b, ox: x + 0.8, oy: 0.85 }
];

const LEV = {
  balanci: { L: 6, th: 0.3, f: 0.5, mass: 2, a0: 0, color: 0xf28c28, stops: [-1, 1], drop: 1.0,
    extra: [{ w: 0.18, h: 0.55, c: 0xd9731b, ox: -2.91, oy: 0.28 }, { w: 0.18, h: 0.55, c: 0xd9731b, ox: 2.91, oy: 0.28 }],
    marks: [['F', 0], ['C', -3], ['E', 3]] },
  catapulta: {
    L: 7, th: 0.3, f: 0.75, mass: 1.5, a0: 14, color: 0xe55039, stops: [[-1, 0], [1, 1.0]],
    extra: [{ w: 1.3, h: 0.2, c: 0xc0392b, ox: -3.0, oy: 0.25 }, { w: 0.2, h: 0.9, c: 0xc0392b, ox: -3.6, oy: 0.6 }],
    marks: [['F', 1.75], ['C', -3.0], ['E', 3.3]]
  },
  tisores: {
    L: 5, th: 0.22, f: 0.5, mass: 1.2, a0: 0, color: 0xc9d3e3, stops: [-1, 1], drop: 0.8,
    extra: [{ w: 0.9, h: 0.6, c: 0xe84393, ox: 2.1, oy: -0.4 }, { w: 1.6, h: 0.1, c: 0x95a5c6, ox: -1.6, oy: 0.14 }],
    marks: [['F', 0], ['C', -2.4], ['E', 2.2]]
  },
  carreto: {
    L: 6, th: 0.3, f: 0, mass: 1.0, a0: -9, color: 0x16a085, stops: [1],
    extra: cup(0.2), marks: [['F', -3], ['C', 0.2], ['E', 3]]
  },
  portella: { L: 5, th: 0.25, f: 0, mass: 0.6, a0: 0, color: 0x8a5a2b, stops: [1], marks: [['F', -2.5], ['C', 0], ['E', 2.5]] },
  martell: {
    L: 5, th: 0.3, f: 0, mass: 3.5, a0: -90, color: 0xb9770e,
    extra: [{ w: 1.3, h: 1.4, c: 0x566573, ox: 2.4, oy: 0 }], marks: [['F', -2.5], ['C', 2.4], ['E', 0]]
  },
  bat: {
    L: 6, th: 0.3, f: 0, mass: 1.0, a0: -90, color: 0xd4a76a,
    extra: [{ w: 2.4, h: 0.75, c: 0xa0763d, ox: 1.8, oy: 0 }], marks: [['F', -3], ['C', 2.4], ['E', -0.2]]
  }
};

export function buildPiece(ctx, p) {
  switch (p.t) {
    case 'bola': return ball(ctx, p, 0.4, 1, 0xff5e57);
    case 'bolaP': return ball(ctx, p, 0.55, 4.4, 0x2d3436);
    case 'caixa': {
      const { root, body } = compound(ctx, [{ w: 1, h: 1, c: 0x7f8c8d }], 3, p.x, p.y, p.r ?? 0);
      return reg(ctx, p, root, body, { ball: true, mass: 3 });
    }
    case 'domino': {
      const { root, body } = compound(ctx, [{ w: 0.25, h: 1.6, d: 0.8, c: 0xfdfdfd }], 0.35, p.x, p.y, p.r ?? 0);
      body.material = ctx.domMat;
      return reg(ctx, p, root, body, { ball: true, mass: 0.35 });
    }
    case 'rampa': case 'rampaL': {
      const L = p.t === 'rampa' ? 6 : 9;
      const { root, body } = compound(ctx, [{ w: L, h: 0.3, c: 0xf7b731 }], 0, p.x, p.y, p.r ?? 0);
      return reg(ctx, p, root, body);
    }
    case 'roda': return wheel(ctx, p);
    case 'noria': return noria(ctx, p);
    default:
      if (LEV[p.t]) return lever(ctx, p, LEV[p.t]);
      return buildMech(ctx, p, { newBody, compound, reg });
  }
}
