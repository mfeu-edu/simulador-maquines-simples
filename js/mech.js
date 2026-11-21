// Politges, polispast, cargol elevador i objectiu final
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { buildGoal } from './goals.js';

const rad = d => d * Math.PI / 180;

function makeLine(ctx, n, color = 0x222222) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  const l = new THREE.Line(g, new THREE.LineBasicMaterial({ color }));
  l.frustumCulled = false; l.position.z = 0.2;
  ctx.scene.add(l); ctx.extra.push(l);
  return l;
}
function setLine(l, pts) {
  const a = l.geometry.attributes.position.array;
  pts.forEach((p, i) => { a[i * 3] = p[0]; a[i * 3 + 1] = p[1]; a[i * 3 + 2] = 0; });
  l.geometry.attributes.position.needsUpdate = true;
}
function cyl(ctx, r, h, color, x, y, z = 0, axisZ = true) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 20), ctx.mat(color));
  if (axisZ) m.rotation.x = Math.PI / 2;
  m.position.set(x, y, z); m.castShadow = true;
  ctx.scene.add(m); ctx.extra.push(m);
  return m;
}

function pulley(ctx, p, H, n) {
  const { compound, reg, marker } = H;
  const r = n === 0 ? 1 : 2, mL = 4, T = 3.5, g = 9.82;
  const px = p.x, py = p.y;
  const x0L = px + (n === 0 ? 1.7 : 2.2);
  const y0E = py - 2.4, y0L = py - 5.9;
  const bx = px - 1.7;
  const bs = compound(ctx, [
    { w: 2.2, h: 0.25, c: 0x00b894 },
    { w: 0.2, h: 1.1, c: 0x00b894, ox: -1.0, oy: 0.6 },
    { w: 0.2, h: 1.1, c: 0x00b894, ox: 1.0, oy: 0.6 }
  ], 0, bx, y0E, 0, CANNON.Body.KINEMATIC);
  reg(ctx, p, bs.root, bs.body, { mover: true });
  const ld = compound(ctx, [{ w: 1.4, h: 1.4, c: 0x636e72 }], 0, x0L, y0L, 0, CANNON.Body.KINEMATIC);
  reg(ctx, p, ld.root, ld.body, { mover: true });
  marker(ctx, bs.root, 'A', 0, 1.35, '#00a36c');
  marker(ctx, ld.root, 'C', 0, 1.1, '#0984e3');
  { const pr = new THREE.Object3D(); pr.position.set(px, py, 0); ctx.scene.add(pr); ctx.extra.push(pr); marker(ctx, pr, 'P', 0, 1.1, '#d63031'); }
  const wheel = cyl(ctx, 0.8, 0.5, 0xb2bec3, px, py);
  const post = cyl(ctx, 0.07, 1.4, 0x333333, px, py + 0.7, 0, false); void post;
  wheel.userData.pid = p.id; post.userData.pid = p.id;
  let mov = null;
  if (n === 1) { mov = cyl(ctx, 0.4, 0.5, 0xb2bec3, x0L, y0L + 1.1); mov.userData.pid = p.id; }
  const rope = makeLine(ctx, n === 0 ? 4 : 6);
  let s = 0, v = 0;
  const basketMass = () => {
    let m = 0.4;
    for (const b of ctx.world.bodies) {
      const u = b.userData; if (!u || !u.ball) continue;
      const dx = b.position.x - bs.body.position.x, dy = b.position.y - bs.body.position.y;
      if (Math.abs(dx) < 1.0 && dy > 0 && dy < 1.8) m += u.mass;
    }
    return m;
  };
  const upd = () => {
    const ey = bs.body.position.y, ly = ld.body.position.y;
    if (n === 0) {
      setLine(rope, [[px - 0.8, py], [bx, ey + 1.15], [px + 0.8, py], [x0L, ly + 0.7]]);
    } else {
      mov.position.y = ly + 1.1;
      setLine(rope, [[px - 0.8, py], [bx, ey + 1.15], [px + 0.8, py], [x0L - 0.4, ly + 1.1], [x0L + 0.4, ly + 1.1], [x0L + 0.4, py]]);
    }
  };
  ctx.upds.push(upd);
  ctx.ticks.push(dt => {
    const mE = basketMass();
    const a = (mE - mL / r) * g / (mE + mL / (r * r));
    if (s < T) { if (a > 0 || v > 0) { v += a * dt; if (v < 0) v = 0; } }
    s += v * dt;
    if (s >= T) { s = T; v = 0; }
    bs.body.velocity.set(0, -v, 0);
    ld.body.velocity.set(0, v / r, 0);
  });
  ctx.info[p.id] = { need: (mL / r).toFixed(1) };
}

function screw(ctx, p, H) {
  const { compound, reg, marker } = H;
  const H0 = 5.5;
  const led = compound(ctx, [
    { w: 2.6, h: 0.25, c: 0xfd9644 },
    { w: 0.2, h: 0.7, c: 0xfd9644, ox: -1.2, oy: 0.45 }
  ], 0, p.x, p.y, 4, CANNON.Body.KINEMATIC);
  reg(ctx, p, led.root, led.body, { mover: true });
  const rod = cyl(ctx, 0.22, 7.2, 0x8395a7, p.x, p.y + 3, -1.0, false); rod.userData.pid = p.id;
  const pts = [];
  for (let i = 0; i <= 90; i++) { const t = i / 90 * Math.PI * 2 * 9; pts.push(new THREE.Vector3(Math.cos(t) * 0.5, -0.4 + i / 90 * 6.6, Math.sin(t) * 0.5)); }
  const thread = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 360, 0.1, 6), ctx.mat(0xf6b93b));
  const grp = new THREE.Group(); grp.add(thread); grp.position.set(p.x, p.y, -1.0);
  ctx.scene.add(grp); ctx.extra.push(grp); grp.traverse(o => { o.userData.pid = p.id; });
  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.25, 1.1), ctx.mat(0xfd9644));
  arm.position.set(p.x, p.y, -0.5); ctx.scene.add(arm); ctx.extra.push(arm); arm.userData.pid = p.id;
  let load = 0, rise = false, y0 = p.y, ang = 4, rot = 0;
  ctx.ticks.push(dt => {
    const b = led.body;
    let on = 0;
    for (const o of ctx.world.bodies) {
      const u = o.userData; if (!u || !u.ball) continue;
      const dx = o.position.x - b.position.x, dy = o.position.y - b.position.y;
      if (Math.abs(dx) < 1.2 && dy > 0 && dy < 1.5) on++;
    }
    load = on ? load + dt : 0;
    if (load > 0.5) rise = true;
    if (rise && b.position.y - y0 < H0) { b.velocity.set(0, 0.8, 0); rot += dt * 0.8 / 0.5 * 6.28; }
    else { b.velocity.set(0, 0, 0); if (rise && ang > -22) { ang -= 40 * dt; b.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), rad(ang)); } }
    grp.rotation.y = rot;
    arm.position.y = b.position.y;
  });
}

function target(ctx, p, H) {
  const { compound, reg } = H;
  const { root, body } = compound(ctx, [{ w: 3.2, h: 0.25, c: 0x6c5ce7, oy: -0.9 }], 0, p.x, p.y, 0);
  reg(ctx, p, root, body);
  buildGoal(ctx, p, ctx.task);
  ctx.ticks.push(() => {
    for (const o of ctx.world.bodies) {
      const u = o.userData; if (!u || !u.ball) continue;
      if (Math.abs(o.position.x - p.x) < 1.7 && Math.abs(o.position.y - p.y) < 1.4) { ctx.onSuccess(); return; }
    }
  });
}

export function buildMech(ctx, p, H) {
  switch (p.t) {
    case 'politja': return pulley(ctx, p, H, 0);
    case 'polispast': return pulley(ctx, p, H, 1);
    case 'cargol': return screw(ctx, p, H);
    case 'diana': return target(ctx, p, H);
  }
}
