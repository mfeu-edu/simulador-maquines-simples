// SPDX-License-Identifier: AGPL-3.0-only
// Objectius finals: cada tasca es representa amb un objecte 3D senzill que reacciona quan la màquina arriba a l'objectiu
import * as THREE from 'three';

const ease = t => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

export function buildGoal(ctx, p, task) {
  const G = new THREE.Group();
  G.position.set(p.x, p.y - 0.78, -0.45);
  const L = c => new THREE.MeshLambertMaterial({ color: c });
  const B = (w, h, d, c, x = 0, y = 0, z = 0, par = G) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), L(c)); m.position.set(x, y, z); m.castShadow = true; par.add(m); return m; };
  const C = (rt, rb, h, c, x = 0, y = 0, z = 0, par = G, seg = 18) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), L(c)); m.position.set(x, y, z); m.castShadow = true; par.add(m); return m; };
  const S = (r, c, x = 0, y = 0, z = 0, par = G, sx = 1, sy = 1, sz = 1) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 12), L(c)); m.position.set(x, y, z); m.scale.set(sx, sy, sz); m.castShadow = true; par.add(m); return m; };
  const pivot = (x, y, par = G) => { const g = new THREE.Group(); g.position.set(x, y, 0); par.add(g); return g; };
  let anim = () => {};
  const g = task.g;

  if (g === 'gol') {
    C(0.07, 0.07, 1.5, 0xffffff, -1.25, 0.75); C(0.07, 0.07, 1.5, 0xffffff, 1.25, 0.75);
    const bar = C(0.07, 0.07, 2.5, 0xffffff, 0, 1.5); bar.rotation.z = Math.PI / 2;
    const net = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.45, 12, 7), new THREE.MeshBasicMaterial({ color: 0xdfe6e9, wireframe: true }));
    net.position.set(0, 0.75, -0.5); G.add(net);
    anim = t => { net.rotation.y = t < 0 ? 0 : Math.sin(t * 14) * 0.3 * Math.exp(-t * 1.5); net.position.z = -0.5 + (t < 0 ? 0 : 0.25 * Math.exp(-t * 2) * Math.abs(Math.sin(t * 9))); };
  } else if (g === 'cistella') {
    C(0.06, 0.06, 1.8, 0x636e72, 1.35, 0.9); B(0.1, 0.95, 1.1, 0xffffff, 1.2, 1.9);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.045, 8, 24), L(0xe17055)); ring.rotation.x = Math.PI / 2; ring.position.set(0.55, 1.45, 0); G.add(ring);
    const net = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.25, 0.5, 12, 3, true), new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true }));
    net.position.set(0.55, 1.18, 0); G.add(net);
    anim = t => { const k = t < 0 ? 0 : Math.exp(-t * 2) * Math.sin(t * 12); net.scale.y = 1 + 0.25 * k; net.position.y = 1.18 - 0.1 * k; };
  } else if (g === 'bitlles') {
    const pins = [];
    for (let i = 0; i < 5; i++) {
      const pv = pivot(-1.0 + i * 0.5, 0); const pin = new THREE.Group(); pv.add(pin);
      C(0.1, 0.16, 0.5, 0xffffff, 0, 0.25, 0, pin); S(0.11, 0xffffff, 0, 0.62, 0, pin); C(0.115, 0.115, 0.06, 0xd63031, 0, 0.45, 0, pin);
      pins.push(pv);
    }
    anim = t => pins.forEach((pv, i) => { const k = t < 0 ? 0 : ease((t - i * 0.05) * 2.5); pv.rotation.z = (i % 2 ? -1 : 1) * 1.5 * k; pv.position.x = -1.0 + i * 0.5 + (i % 2 ? -1 : 1) * 0.3 * k; });
  } else if (g === 'fitxa') {
    const pv = pivot(0.25, 0);
    const tile = B(0.5, 1.4, 0.22, 0xffffff, -0.25, 0.7, 0, pv);
    [0.35, 0, -0.35].forEach(y => { S(0.07, 0x2d3436, -0.25, 0.7 + y, 0.12, pv); });
    B(0.5, 0.04, 0.23, 0x2d3436, -0.25, 0.7, 0, pv); void tile;
    anim = t => { pv.rotation.z = t < 0 ? 0 : -1.5 * ease(t * 1.2) * 1; };
  } else if (g === 'llum') {
    C(0.4, 0.4, 0.08, 0x636e72, 0, 0.04); C(0.05, 0.05, 1.5, 0x636e72, 0, 0.8);
    const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.6, 0.55, 16, 1, true), new THREE.MeshLambertMaterial({ color: 0x74b9ff, side: THREE.DoubleSide })); shade.position.set(0, 1.8, 0); G.add(shade);
    const bulbM = new THREE.MeshBasicMaterial({ color: 0x8e9aa6 });
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), bulbM); bulb.position.set(0, 1.62, 0); G.add(bulb);
    const glow = new THREE.Mesh(new THREE.SphereGeometry(0.9, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffe66d, transparent: true, opacity: 0.0, depthWrite: false })); glow.position.set(0, 1.6, 0); G.add(glow);
    anim = t => { const on = t >= 0; bulbM.color.setHex(on ? 0xfff3a0 : 0x8e9aa6); glow.material.opacity = on ? 0.3 + 0.08 * Math.sin(t * 9) : 0; };
  } else if (g === 'despertador') {
    const cl = new THREE.Group(); cl.position.set(0, 0.85, 0); G.add(cl);
    const body = C(0.55, 0.55, 0.4, 0xe74c3c, 0, 0, 0, cl, 24); body.rotation.x = Math.PI / 2;
    const face = C(0.45, 0.45, 0.05, 0xffffff, 0, 0, 0.21, cl, 24); face.rotation.x = Math.PI / 2;
    B(0.04, 0.3, 0.03, 0x2d3436, 0, 0.12, 0.25, cl); B(0.22, 0.04, 0.03, 0x2d3436, 0.09, 0, 0.25, cl);
    const b1 = S(0.2, 0xf1c40f, -0.4, 0.55, 0, cl, 1, 0.7, 1), b2 = S(0.2, 0xf1c40f, 0.4, 0.55, 0, cl, 1, 0.7, 1);
    C(0.04, 0.04, 0.3, 0x2d3436, -0.3, -0.6, 0, cl); C(0.04, 0.04, 0.3, 0x2d3436, 0.3, -0.6, 0, cl);
    anim = t => { cl.rotation.z = t < 0 || t > 4 ? 0 : Math.sin(t * 45) * 0.1; cl.position.y = 0.85 + (t < 0 || t > 4 ? 0 : Math.abs(Math.sin(t * 22)) * 0.04); const c = t >= 0 && t < 4 && Math.floor(t * 10) % 2 ? 0xffffff : 0xf1c40f; b1.material.color.setHex(c); b2.material.color.setHex(c); };
  } else if (g === 'bustia') {
    C(0.06, 0.06, 1.0, 0x636e72, 0, 0.5, 0);
    B(1.1, 0.7, 0.8, 0x0984e3, 0, 1.3, 0); const roof = C(0.4, 0.4, 1.1, 0x0984e3, 0, 1.65, 0, G, 16); roof.rotation.z = Math.PI / 2; roof.scale.set(1, 1, 1); roof.rotation.x = 0;
    B(0.7, 0.05, 0.05, 0x2d3436, 0.0, 1.35, 0.42);
    const fp = pivot(0.6, 1.45), flag = B(0.45, 0.2, 0.05, 0xff7675, 0.22, 0, 0, fp); void flag; fp.rotation.z = -1.4;
    const env = B(0.5, 0.32, 0.04, 0xffffff, -1.2, 2.2, 0.45); env.visible = false;
    anim = t => { fp.rotation.z = -1.4 + 1.4 * ease(t * 1.5 - 0.3); env.visible = t >= 0 && t < 1; env.position.set(-0.4 + 0.4 * ease(t * 2), 2.3 - 0.95 * ease(t * 2), 0.45); if (t < 0) env.visible = false; };
  } else if (g === 'porta') {
    B(0.12, 1.9, 0.5, 0x6d4c41, -0.6, 0.95); B(0.12, 1.9, 0.5, 0x6d4c41, 0.6, 0.95); B(1.32, 0.12, 0.5, 0x6d4c41, 0, 1.95);
    const pv = pivot(-0.55, 0), door = B(1.05, 1.82, 0.1, 0xd4a76a, 0.52, 0.93, 0, pv); S(0.07, 0xf1c40f, 0.9, 0.95, 0.08, pv); void door;
    anim = t => { pv.rotation.y = 1.45 * (1 - ease(t < 0 ? 0 : t * 0.9)); };
  } else if (g === 'plat') {
    C(0.65, 0.42, 0.32, 0xe17055, -0.5, 0.16); C(0.5, 0.5, 0.02, 0x3e2723, -0.5, 0.3);
    const ks = []; for (let i = 0; i < 12; i++) { const k = S(0.07, 0x8d6e63, -0.5 + Math.cos(i * 2.4) * 0.28 * (i % 3 ? 1 : 0.4), 0.38 + (i % 4) * 0.03, Math.sin(i * 2.4) * 0.2, G); k.scale.setScalar(0.01); ks.push(k); }
    const dog = pivot(0.95, 0); B(0.7, 0.35, 0.3, 0xd7b98b, 0, 0.5, 0, dog); S(0.2, 0xd7b98b, -0.45, 0.72, 0, dog); B(0.12, 0.2, 0.05, 0x8d6e63, -0.55, 0.9, 0.1, dog); B(0.1, 0.1, 0.1, 0x2d3436, -0.62, 0.7, 0, dog);
    [-0.25, 0.25].forEach(x => { B(0.1, 0.3, 0.1, 0xd7b98b, x, 0.15, 0.08, dog); }); const tail = B(0.35, 0.07, 0.07, 0xd7b98b, 0.5, 0.65, 0, dog); tail.rotation.z = 0.7;
    anim = t => { ks.forEach((k, i) => k.scale.setScalar(t < 0 ? 0.01 : Math.min(1, ease((t - i * 0.05) * 2)))); tail.rotation.z = 0.7 + (t < 0 ? 0 : Math.sin(t * 18) * 0.3); };
  } else if (g === 'planta' || g === 'llavor') {
    C(0.5, 0.35, 0.55, 0xe17055, 0, 0.28); C(0.5, 0.5, 0.05, 0x3e2723, 0, 0.55);
    const gr = pivot(0, 0.56); const stem = C(0.04, 0.05, 1, 0x00b894, 0, 0.5, 0, gr);
    const l1 = S(0.28, 0x55efc4, -0.28, 0.65, 0, gr, 1, 0.35, 0.6), l2 = S(0.28, 0x55efc4, 0.28, 0.85, 0, gr, 1, 0.35, 0.6); l1.rotation.z = 0.5; l2.rotation.z = -0.5;
    const fl = S(0.16, 0xfd79a8, 0, 1.05, 0.02, gr);
    const seed = S(0.09, 0x8d6e63, 0.1, 0.6, 0.2, G, 1, 0.7, 1);
    const can = new THREE.Group(); can.position.set(-1.1, 1.9, 0.3); G.add(can);
    B(0.5, 0.4, 0.3, 0x74b9ff, 0, 0, 0, can); const sp = B(0.5, 0.06, 0.06, 0x74b9ff, -0.45, 0.1, 0, can); sp.rotation.z = -0.5;
    const drops = []; for (let i = 0; i < 6; i++) { const d = S(0.05, 0x74b9ff, -0.8, 1.7, 0.3, G); d.visible = false; drops.push(d); }
    const grow = g === 'planta';
    gr.scale.set(1, grow ? 0.5 : 0.01, 1); seed.visible = !grow; can.visible = grow; fl.visible = false;
    anim = t => {
      const k = t < 0 ? 0 : ease((t - 0.8) * 0.7);
      gr.scale.set(1, (grow ? 0.5 : 0.01) + (grow ? 0.9 : 1.2) * k, 1); fl.visible = grow ? k > 0.7 : k > 0.9;
      if (!grow) { seed.visible = t < 0.6; }
      can.rotation.z = grow && t >= 0 ? Math.min(0.6, t * 1.5) : 0;
      drops.forEach((d, i) => { const q = (t - i * 0.12) % 0.8; d.visible = grow && t >= 0 && t < 3 && q > 0; d.position.set(-0.85 - 0.1 * q, 1.7 - q * 1.5, 0.3); });
    };
  } else if (g === 'ocells') {
    C(0.05, 0.05, 1.3, 0x6d4c41, 0, 0.65); B(1.2, 0.08, 0.7, 0x8d6e63, 0, 1.3);
    B(0.9, 0.5, 0.5, 0xd4a76a, 0, 1.6); const roof = C(0.01, 0.8, 0.5, 0xc0392b, 0, 2.1, 0, G, 4); roof.rotation.y = Math.PI / 4; roof.scale.set(1, 1, 0.7);
    const seeds = []; for (let i = 0; i < 10; i++) { const s = S(0.05, 0xf1c40f, -0.4 + i * 0.09, 1.37, 0.1 + (i % 2) * 0.12, G); s.visible = false; seeds.push(s); }
    const birds = [-0.8, 0.8].map((x, i) => { const b = pivot(x, 1.4); S(0.17, i ? 0x0984e3 : 0xe17055, 0, 0.1, 0.1, b); S(0.11, i ? 0x0984e3 : 0xe17055, i ? 0.17 : -0.17, 0.25, 0.1, b); const bk = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.12, 6), L(0xf1c40f)); bk.rotation.z = i ? -Math.PI / 2 : Math.PI / 2; bk.position.set(i ? 0.3 : -0.3, 0.25, 0.1); b.add(bk); b.visible = false; return b; });
    anim = t => { seeds.forEach(s => { s.visible = t >= 0; }); birds.forEach((b, i) => { b.visible = t > 0.3; b.position.y = 1.4 + (t > 0.3 ? Math.abs(Math.sin((t + i) * 6)) * 0.12 : 0); const sc = ease((t - 0.3) * 3); b.scale.setScalar(Math.max(0.01, sc)); }); };
  } else if (g === 'reciclar') {
    B(1.1, 1.1, 0.8, 0x00b894, 0, 0.55); C(0.06, 0.06, 0.1, 0x2d3436, -0.4, 0.05, 0.4); C(0.06, 0.06, 0.1, 0x2d3436, 0.4, 0.05, 0.4);
    const cv = document.createElement('canvas'); cv.width = cv.height = 128; const x = cv.getContext('2d'); x.fillStyle = '#fff'; x.font = '100px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('♻', 64, 70);
    const sg = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.7), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), transparent: true })); sg.position.set(0, 0.55, 0.41); G.add(sg);
    const lp = pivot(-0.6, 1.1); B(1.25, 0.12, 0.85, 0x00a383, 0.62, 0.06, 0, lp);
    anim = t => { lp.rotation.z = t < 0 ? 0 : (t < 2.2 ? 1.2 * ease(t * 3) : 1.2 * (1 - ease((t - 2.2) * 2.5))); };
  } else if (g === 'guardiola') {
    const pig = pivot(0, 0); const pk = 0xfd79a8;
    S(0.65, pk, 0, 0.85, 0, pig, 1.2, 0.9, 0.9); S(0.3, pk, -0.8, 0.95, 0, pig); C(0.15, 0.15, 0.2, 0xf8a5c2, -1.05, 0.9, 0, pig).rotation.z = Math.PI / 2;
    [-0.25, 0.25].forEach(z => { const e = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.22, 6), L(pk)); e.position.set(-0.85, 1.25, z); pig.add(e); });
    [-0.5, 0.45].forEach(x => { C(0.1, 0.1, 0.35, pk, x, 0.22, 0.25, pig); C(0.1, 0.1, 0.35, pk, x, 0.22, -0.25, pig); });
    B(0.5, 0.05, 0.1, 0x2d3436, 0.05, 1.5, 0, pig); S(0.04, 0x2d3436, -0.9, 1.05, 0.22, pig);
    const coin = C(0.22, 0.22, 0.05, 0xf1c40f, 0.05, 2.5, 0, G); coin.rotation.x = Math.PI / 2; coin.rotation.z = Math.PI / 2; coin.visible = false;
    anim = t => { coin.visible = t >= 0 && t < 1.1; coin.position.y = 2.6 - 1.1 * ease(t * 1.2); coin.rotation.y = t * 8; pig.position.y = t > 1 && t < 2.6 ? Math.abs(Math.sin((t - 1) * 7)) * 0.3 : 0; };
  } else if (g === 'bandera') {
    C(0.05, 0.05, 2.4, 0x636e72, -0.5, 1.2); S(0.09, 0xf1c40f, -0.5, 2.45);
    const fl = B(1.0, 0.6, 0.04, 0x0984e3, 0, 0, 0); const st = B(1.0, 0.2, 0.05, 0xffffff, 0, 0, 0.0); const fg = new THREE.Group(); fg.add(fl, st); fg.position.set(0.02, 0.5, 0); G.add(fg);
    anim = t => { fg.position.y = 0.5 + 1.55 * ease(t < 0 ? 0 : t * 0.7); fg.rotation.y = t < 0 ? 0 : Math.sin(t * 6) * 0.15; };
  } else if (g === 'globus') {
    C(0.04, 0.04, 1.0, 0x636e72, 0, 0.5); const bl = pivot(0, 1.0); const ball = S(0.5, 0xe74c3c, 0, 0.7, 0, bl, 1, 1.2, 1); S(0.06, 0xe74c3c, 0, 0.1, 0, bl);
    const cv = document.createElement('canvas'); cv.width = 256; cv.height = 128; const x = cv.getContext('2d'); x.fillStyle = '#ffd25e'; x.strokeStyle = '#e74c3c'; x.lineWidth = 8; x.font = 'bold 72px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.strokeText('PAM!', 128, 64); x.fillText('PAM!', 128, 64);
    const pam = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), depthTest: false })); pam.scale.set(2.2, 1.1, 1); pam.position.set(0, 1.9, 0.6); pam.visible = false; G.add(pam);
    anim = t => { ball.visible = t < 0.12; ball.scale.set(1 + t * 3, 1.2 + t * 3, 1 + t * 3); bl.visible = t < 0.12; pam.visible = t >= 0.1 && t < 1.8; pam.scale.set(2.2 * (1 + 0.1 * Math.sin(t * 20)), 1.1, 1); };
  }

  // etiqueta amb el nom de l'objectiu
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = 72;
  const x = cv.getContext('2d'); x.fillStyle = 'rgba(15,23,36,0.78)'; x.beginPath(); x.roundRect(2, 2, 508, 68, 18); x.fill();
  x.fillStyle = '#fff'; x.font = 'bold 30px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
  let txt = task.e + ' ' + task.n; while (x.measureText(txt).width > 480 && x.font.indexOf('bold 30px') === 0) { x.font = 'bold ' + (parseInt(x.font.match(/(\d+)px/)[1], 10) - 2) + 'px sans-serif'; }
  x.fillText(txt, 256, 38);
  const lab = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), depthTest: false }));
  lab.scale.set(4.2, 0.6, 1); lab.position.set(0, 2.75, 0.6); lab.renderOrder = 5; G.add(lab);

  G.traverse(o => { o.userData.pid = p.id; });
  ctx.scene.add(G); ctx.extra.push(G);
  let t0 = null;
  anim(-1);
  ctx.upds.push(() => anim(t0 === null ? -1 : (performance.now() - t0) / 1000));
  ctx.goal = { win() { t0 = performance.now(); } };
}
