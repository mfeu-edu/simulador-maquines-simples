import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { TASKS, CATALOG, CHALLENGES } from './data.js';
import { buildPiece } from './pieces.js';
import { buildPalette, renderInspector, renderChallenges, renderAnalysis, reqOk } from './ui.js';
import { encodeState, decodeState } from './link.js';

const $ = id => document.getElementById(id);
const Q = new URLSearchParams(location.search);
const W = 28, HH = 16, SNAP = 0.5, MAXP = 30, MID = W / 2;
const DEFROT = { rampa: -20, rampaL: -15 };

const state = { analyze: Q.has('analitza'), pieces: [], task: 0, zone: 'all', next: 1, sel: null, tool: null, playing: false, won: false, cinema: false };
const done = new Set();
try { JSON.parse(localStorage.getItem('mq_ch2') || '[]').forEach(i => done.add(i)); } catch (e) { /* res */ }

// ---------- Escena ----------
const canvas = $('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: false });
let light = Q.has('lleuger');
try { if (localStorage.getItem('mq_light') === '1') light = true; } catch (e) { /* res */ }
renderer.shadowMap.enabled = !light;
renderer.setPixelRatio(light ? 1 : Math.min(devicePixelRatio, 1.5));
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1b2a45);
const camera = new THREE.PerspectiveCamera(38, 1, 0.5, 200);
scene.add(new THREE.HemisphereLight(0xdfeaff, 0x39455e, 0.85));
const sun = new THREE.DirectionalLight(0xffffff, 0.9);
sun.position.set(8, 24, 18); sun.castShadow = !light;
sun.shadow.mapSize.set(1024, 1024);
Object.assign(sun.shadow.camera, { left: -26, right: 26, top: 20, bottom: -8, near: 1, far: 70 });
sun.target.position.set(MID, 4, 0);
scene.add(sun, sun.target);

const matCache = {};
const mat = c => matCache[c] || (matCache[c] = new THREE.MeshLambertMaterial({ color: c }));

// fons estàtic: terra, paret amb quadrícula, línia de tram
const floor = new THREE.Mesh(new THREE.BoxGeometry(70, 1, 5), mat(0x2f4468));
floor.position.set(MID, -0.5, 0); floor.receiveShadow = true; scene.add(floor);
const wall = new THREE.Mesh(new THREE.PlaneGeometry(70, 30), mat(0x24365a));
wall.position.set(MID, 14, -2.6); wall.receiveShadow = true; scene.add(wall);
const grid = new THREE.GridHelper(70, 70, 0x3c5585, 0x2e4570);
grid.rotation.x = Math.PI / 2; grid.position.set(MID, 14, -2.55); scene.add(grid);
const mid = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 22), new THREE.MeshBasicMaterial({ color: 0xffd25e, transparent: true, opacity: 0.35 }));
mid.position.set(MID, 11, -2.5); scene.add(mid);
const shade = new THREE.Mesh(new THREE.PlaneGeometry(MID + 8, 40), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.38 }));
shade.position.z = 2.2; shade.visible = false; scene.add(shade);
const ghost = new THREE.Mesh(new THREE.RingGeometry(0.25, 0.4, 20), new THREE.MeshBasicMaterial({ color: 0xffd25e, depthTest: false }));
ghost.visible = false; ghost.renderOrder = 20; scene.add(ghost);
const selBox = new THREE.Box3Helper(new THREE.Box3(), 0xffd25e); selBox.visible = false; scene.add(selBox);

// ---------- Món físic ----------
const ctx = { scene, world: null, parts: [], extra: [], markers: [], ticks: [], upds: [], info: {}, mat, task: TASKS[0], onSuccess, showMarks: () => state.analyze };

function clearWorld() {
  for (const p of ctx.parts) { scene.remove(p.mesh); p.mesh.traverse(o => { if (o.geometry) o.geometry.dispose(); }); }
  for (const e of ctx.extra) { scene.remove(e); e.traverse(o => { if (o.geometry) o.geometry.dispose(); }); }
  Object.assign(ctx, { parts: [], extra: [], markers: [], ticks: [], upds: [], info: {}, goal: null });
}

function rebuild() {
  clearWorld();
  const w = ctx.world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) });
  w.defaultContactMaterial.friction = 0.18; w.defaultContactMaterial.restitution = 0.12;
  w.solver.iterations = 14; w.allowSleep = false;
  ctx.domMat = new CANNON.Material('domino');
  w.addContactMaterial(new CANNON.ContactMaterial(ctx.domMat, ctx.domMat, { friction: 0.02, restitution: 0 }));
  const fb = new CANNON.Body({ mass: 0 }); fb.addShape(new CANNON.Box(new CANNON.Vec3(35, 0.5, 2.5))); fb.position.set(MID, -0.5, 0); w.addBody(fb);
  ctx.task = TASKS[state.task];
  for (const p of state.pieces) buildPiece(ctx, p);
  state.won = false; state.playing = false; setPlayUi();
  $('banner').hidden = true;
  shade.visible = state.zone !== 'all'; mid.visible = state.zone !== 'all';
  if (state.zone === 'A') shade.position.x = MID + (MID + 8) / 2; else shade.position.x = MID - (MID + 8) / 2;
  shade.position.y = 10;
  updateSel(); updateCount(); sync();
}

function sync() { for (const p of ctx.parts) { p.mesh.position.copy(p.body.position); p.mesh.quaternion.copy(p.body.quaternion); } ctx.upds.forEach(f => f()); }

// ---------- Èxit i confeti ----------
let conf = null;
function onSuccess() {
  if (state.won || !state.playing) return;
  state.won = true;
  const t = TASKS[state.task];
  $('banner').textContent = '🎉 ' + t.ok; $('banner').hidden = false;
  if (ctx.goal) ctx.goal.win();
  const d = state.pieces.find(p => p.t === 'diana');
  const n = 160, pos = new Float32Array(n * 3), vel = [];
  for (let i = 0; i < n; i++) { pos.set([d.x, d.y + 1, 0.8], i * 3); vel.push([(Math.random() - 0.5) * 9, Math.random() * 9 + 3, (Math.random() - 0.5) * 3]); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pts = new THREE.Points(g, new THREE.PointsMaterial({ size: 0.28, color: 0xffd25e, depthTest: false }));
  pts.renderOrder = 30; scene.add(pts); conf = { pts, vel, t: 0 };
  CHALLENGES.forEach((c, i) => { if (reqOk(c, state.pieces)) done.add(i); });
  try { localStorage.setItem('mq_ch2', JSON.stringify([...done])); } catch (e) { /* res */ }
  renderChallenges($('chList'), done);
}

// ---------- Selecció i inspector ----------
function updateSel() {
  const p = state.pieces.find(q => q.id === state.sel);
  if (!p) { selBox.visible = false; $('insBody').textContent = 'Prem el botó Cursor i fes clic en una peça del tauler per saber què fa i com s\'utilitza.'; return; }
  scene.updateMatrixWorld(true);
  const box = new THREE.Box3();
  scene.traverse(o => { if (o.userData.pid === p.id && o.isMesh) box.expandByObject(o); });
  if (!box.isEmpty()) { selBox.box.copy(box); selBox.visible = true; }
  renderInspector($('insBody'), p, ctx.info[p.id], state.analyze);
}
function updateCount() {
  $('count').textContent = `Peces: ${state.pieces.length} / ${MAXP}`;
  if (state.analyze) renderAnalysis($('anaBody'), state.pieces);
}

// ---------- Interacció ----------
const ray = new THREE.Raycaster(), plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), ndc = new THREE.Vector2();
function worldPt(e) {
  const r = canvas.getBoundingClientRect();
  ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  const v = new THREE.Vector3(); ray.ray.intersectPlane(plane, v);
  return v;
}
const snap = v => Math.round(v / SNAP) * SNAP;
function clampPt(p, t) {
  let x = Math.min(W - 0.5, Math.max(0.5, snap(p.x))), y = Math.min(HH, Math.max(0.5, snap(p.y)));
  if (state.zone === 'A') x = Math.min(x, MID - 0.5);
  if (state.zone === 'B') x = Math.max(x, MID + 0.5);
  if (t === 'politja' || t === 'polispast') y = Math.max(y, 7.5);
  return { x, y };
}
function pick(e) {
  const r = canvas.getBoundingClientRect();
  ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  for (const h of ray.intersectObjects(scene.children, true)) if (h.object.userData.pid) return h.object.userData.pid;
  return null;
}
let drag = null, orbit = null;
const cam = { az: -0.25, el: 0.12, dist: 36, tx: MID, ty: 7.5, v3d: true };

canvas.addEventListener('contextmenu', e => e.preventDefault());
canvas.addEventListener('pointerdown', e => {
  canvas.setPointerCapture(e.pointerId);
  if (e.button === 2) { orbit = { x: e.clientX, y: e.clientY, az: cam.az, el: cam.el }; return; }
  if (state.playing) { if (state.tool || pick(e)) toast('Per afegir, moure o girar peces, primer prem ⟲ Reinicia: la simulació ha d\'estar aturada.'); return; }
  const pt = worldPt(e);
  if (state.tool) {
    if (state.pieces.length >= MAXP) { say('Has arribat al màxim de peces (30).'); return; }
    const c = clampPt(pt, state.tool);
    mutate(() => { const p = { id: state.next++, t: state.tool, x: c.x, y: c.y, r: DEFROT[state.tool] ?? 0, m: 0 }; state.pieces.push(p); state.sel = p.id; }); return;
  }
  const id = pick(e);
  state.sel = id; updateSel();
  if (id) { const p = state.pieces.find(q => q.id === id); drag = { id, dx: p.x - pt.x, dy: p.y - pt.y, moved: false, snap: JSON.stringify(state.pieces) }; }
});
canvas.addEventListener('pointermove', e => {
  if (orbit) {
    cam.az = Math.max(-1.1, Math.min(1.1, orbit.az - (e.clientX - orbit.x) * 0.006));
    cam.el = Math.max(-0.1, Math.min(0.8, orbit.el + (e.clientY - orbit.y) * 0.006)); return;
  }
  const pt = worldPt(e);
  if (state.tool && !state.playing) { const c = clampPt(pt, state.tool); ghost.position.set(c.x, c.y, 1); ghost.visible = true; } else ghost.visible = false;
  if (drag && !state.playing) {
    const p = state.pieces.find(q => q.id === drag.id), c = clampPt({ x: pt.x + drag.dx, y: pt.y + drag.dy }, p.t);
    if (c.x !== p.x || c.y !== p.y) { if (!drag.moved) { pushHist(drag.snap); } p.x = c.x; p.y = c.y; drag.moved = true; dirty = true; }
  }
});
canvas.addEventListener('pointerup', () => { orbit = null; drag = null; });
canvas.addEventListener('pointerleave', () => { ghost.visible = false; });
canvas.addEventListener('wheel', e => { e.preventDefault(); cam.dist = Math.max(14, Math.min(60, cam.dist * (e.deltaY > 0 ? 1.08 : 0.92))); }, { passive: false });
let dirty = false;

// ---------- Historial (desfés / refés) i avisos ----------
const hist = { u: [], r: [] };
function pushHist(snap) { hist.u.push(snap); if (hist.u.length > 100) hist.u.shift(); hist.r.length = 0; histUi(); }
function mutate(fn) { if (state.playing) return; pushHist(JSON.stringify(state.pieces)); fn(); rebuild(); }
function histUi() { $('btnUndo').disabled = !hist.u.length; $('btnRedo').disabled = !hist.r.length; }
function undo() {
  if (!hist.u.length) return;
  hist.r.push(JSON.stringify(state.pieces)); state.pieces = JSON.parse(hist.u.pop());
  if (!state.pieces.some(q => q.id === state.sel)) state.sel = null;
  rebuild(); histUi(); toast('Acció desfeta.');
}
function redo() {
  if (!hist.r.length) return;
  hist.u.push(JSON.stringify(state.pieces)); state.pieces = JSON.parse(hist.r.pop());
  if (!state.pieces.some(q => q.id === state.sel)) state.sel = null;
  rebuild(); histUi(); toast('Acció refeta.');
}
function toast(s) { const t = $('toast'); t.textContent = s; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => { t.hidden = true; }, 4500); }

function rotateSel(d) {
  const p = state.pieces.find(q => q.id === state.sel); if (!p || state.playing) return;
  mutate(() => { p.r = ((p.r ?? 0) + d + 360) % 360; });
}
const NOFLIP = new Set(['politja', 'polispast', 'cargol', 'diana', 'bola', 'bolaP', 'roda', 'caixa', 'noria']);
function flipSel(dir) {
  const p = state.pieces.find(q => q.id === state.sel); if (!p || state.playing) return;
  if (NOFLIP.has(p.t)) { say('Aquesta peça és igual pels dos costats: no cal voltejar-la.'); return; }
  mutate(() => { p.m = p.m ? 0 : 1; p.r = (((dir === 'h' ? -(p.r ?? 0) : 180 - (p.r ?? 0)) % 360) + 360) % 360; });
}
function delSel() {
  if (state.playing) return;
  if (!state.sel) return;
  mutate(() => { state.pieces = state.pieces.filter(q => q.id !== state.sel); state.sel = null; });
}
addEventListener('keydown', e => {
  if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
  if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) { e.preventDefault(); if (e.shiftKey) redo(); else undo(); return; }
  if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y')) { e.preventDefault(); redo(); return; }
  if (e.key === 'q' || e.key === 'Q') rotateSel(15);
  else if (e.key === 'e' || e.key === 'E') rotateSel(-15);
  else if (e.key === 'Delete' || e.key === 'Backspace') delSel();
  else if (e.key === 'h' || e.key === 'H') flipSel('h');
  else if (e.key === 'v' || e.key === 'V') flipSel('v');
  else if (e.key === 'Escape') pickTool(null);
});

// ---------- Interfície ----------
const pal = buildPalette($('pieceList'), pickTool);
function pickTool(t) {
  state.tool = (t && state.tool !== t) ? t : null;
  pal.setActive(state.tool); ghost.visible = false;
  for (const id of ['btnCursor', 'btnCursorP']) $(id).classList.toggle('on', !state.tool);
  const def = state.tool && CATALOG.find(c => c.t === state.tool);
  $('hint').textContent = def ? `Col·locant: ${def.n} · Per seleccionar peces del tauler, prem 🖱️ Cursor (o Esc)` : '';
}
function say(s) { toast(s); }
function setPlayUi() {
  $('btnPlay').textContent = state.playing ? '⏸ Pausa' : '▶ Engega';
  for (const id of ['btnRotL', 'btnRotR', 'btnFlipH', 'btnFlipV', 'btnDup', 'btnDel', 'btnClear']) $(id).disabled = state.playing;
}
TASKS.forEach((t, i) => { const o = document.createElement('option'); o.value = i; o.textContent = `${t.e} ${t.n}`; $('taskSel').appendChild(o); });
$('taskSel').onchange = e => { state.task = +e.target.value; rebuild(); };
$('zoneSel').onchange = e => { state.zone = e.target.value; rebuild(); };
$('btnPlay').onclick = () => { state.playing = !state.playing; if (state.playing) pickTool(null); setPlayUi(); };
$('btnReset').onclick = () => rebuild();
$('btnRotL').onclick = () => rotateSel(15);
$('btnRotR').onclick = () => rotateSel(-15);
$('btnUndo').onclick = undo;
$('btnRedo').onclick = redo;
$('btnFlipH').onclick = () => flipSel('h');
$('btnFlipV').onclick = () => flipSel('v');
$('btnCursor').onclick = () => pickTool(null);
$('btnCursorP').onclick = () => pickTool(null);
pickTool(null);
$('btnDel').onclick = delSel;
$('btnDup').onclick = () => {
  const p = state.pieces.find(q => q.id === state.sel); if (!p || state.pieces.length >= MAXP) return;
  const c = clampPt({ x: p.x + 1, y: p.y + 1 }, p.t);
  mutate(() => { const n = { ...p, id: state.next++, x: c.x, y: c.y }; state.pieces.push(n); state.sel = n.id; });
};
$('btnClear').onclick = () => { if (!state.pieces.length || confirm('Vols buidar tot el tauler? (Pots recuperar-lo amb ↩ Desfés.)')) mutate(() => { state.pieces = []; state.sel = null; }); };
$('btnView').onclick = () => { cam.v3d = !cam.v3d; cam.az = cam.v3d ? -0.25 : 0; cam.el = cam.v3d ? 0.12 : 0; };
$('btnCinema').onclick = () => { state.cinema = !state.cinema; $('btnCinema').classList.toggle('primary', state.cinema); };
$('btnShot').onclick = () => {
  renderer.render(scene, camera);
  canvas.toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'la-meva-maquina.png'; a.click(); }, 'image/png');
};

// Enllaç de la màquina
const dlg = $('dialog');
const closeDlg = () => { dlg.hidden = true; };
$('dlgCancel').onclick = closeDlg;
async function openLink(mode) {
  const share = mode === 'share';
  $('dlgTitle').textContent = share ? 'Enllaç de la màquina' : 'Carrega una màquina';
  $('dlgText').textContent = share
    ? 'Copia aquest enllaç i posa\'l a la teva presentació. Per carregar la màquina d\'una altra persona, enganxa-hi el seu enllaç i prem «Carrega».'
    : 'Enganxa aquí l\'enllaç de la teva màquina (el que vas guardar a la sessió 1) i prem «Carrega».';
  $('dlgArea').readOnly = false; $('dlgArea').value = share ? location.origin + location.pathname + '#m=' + await encodeState(state) : '';
  $('dlgOk').hidden = !share; $('dlgImport').hidden = false; dlg.hidden = false;
  $('dlgArea').focus(); if (share) $('dlgArea').select();
}
$('btnLink').onclick = () => openLink('share');
$('btnLoad').onclick = () => openLink('load');
$('dlgOk').onclick = async () => {
  $('dlgArea').select();
  try { await navigator.clipboard.writeText($('dlgArea').value); say('Enllaç copiat.'); } catch (e) { say('Prem Ctrl+C per copiar el text seleccionat.'); }
};
$('dlgLoad').onclick = async () => {
  try {
    const s = await decodeState($('dlgArea').value);
    const merge = document.querySelector('input[name=imode]:checked').value === 'merge';
    let list = s.pieces.filter(p => CATALOG.some(c => c.t === p.t));
    pushHist(JSON.stringify(state.pieces));
    if (merge) {
      if (state.zone === 'A') list = list.filter(p => p.x >= MID); else if (state.zone === 'B') list = list.filter(p => p.x < MID);
      state.pieces = state.pieces.concat(list.map(p => ({ ...p, id: state.next++ })));
    } else { state.pieces = list.map(p => ({ ...p, id: state.next++ })); state.task = Math.max(0, Math.min(TASKS.length - 1, s.task)); $('taskSel').value = state.task; }
    state.pieces = state.pieces.slice(0, MAXP); state.sel = null; closeDlg(); rebuild(); say('Màquina carregada.');
  } catch (e) { say('Aquest enllaç no és vàlid. Comprova que està sencer.'); }
};

// Mode anàlisi i versió lleugera
function setAnalyze(on) {
  state.analyze = on;
  $('btnAnalyze').classList.toggle('active', on);
  $('btnAnalyze').textContent = on ? '🔍 Analitzant: tanca l\'anàlisi' : '🔍 Analitza les màquines simples';
  $('analysis').hidden = !on; $('legend').hidden = !on;
  ctx.markers.forEach(m => { m.visible = on; });
  updateSel(); updateCount();
  if (on) toast('Anàlisi activada: mira P, C i A a les peces i la llista de màquines simples a la dreta.');
}
function setLight(on, auto) {
  light = on; renderer.shadowMap.enabled = !on; sun.castShadow = !on;
  renderer.setPixelRatio(on ? 1 : Math.min(devicePixelRatio, 1.5)); resize();
  scene.traverse(o => { if (o.material) o.material.needsUpdate = true; });
  $('btnLight').classList.toggle('active', on);
  $('btnLight').textContent = on ? '🐢 Versió lleugera: ACTIVADA (prem per tornar a la normal)' : '🐢 Versió lleugera (si va lent)';
  try { localStorage.setItem('mq_light', on ? '1' : '0'); } catch (e) { /* res */ }
  toast(on ? (auto ? 'He activat la versió lleugera perquè anava lent.' : 'Versió lleugera activada.') : 'Versió normal activada.');
}
$('btnAnalyze').onclick = () => setAnalyze(!state.analyze);
$('btnLight').onclick = () => setLight(!light, false);

// ---------- Bucle ----------
function resize() {
  const r = canvas.parentElement.getBoundingClientRect();
  renderer.setSize(r.width, r.height, false); camera.aspect = r.width / r.height; camera.updateProjectionMatrix();
  const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  cam.fit = Math.max(W / (2 * t * camera.aspect), HH / (2 * t)) * 1.18;
  if (!cam.set) { cam.dist = cam.fit; cam.set = true; }
}
addEventListener('resize', resize); resize();
let last = performance.now(), acc = 0, slow = 0, frames = 0;
const tgt = new THREE.Vector3(cam.tx, cam.ty, 0);

function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  if (dirty) { dirty = false; rebuild(); }
  if (state.playing) {
    acc += dt;
    while (acc >= 1 / 60) { ctx.ticks.forEach(f => f(1 / 60)); ctx.world.step(1 / 60); acc -= 1 / 60; }
    sync();
  }
  // càmera
  let want = new THREE.Vector3(MID, 6.9, 0), dist = cam.dist;
  if (state.cinema && state.playing) {
    let sx = 0, sy = 0, n = 0;
    for (const b of ctx.world.bodies) { const u = b.userData; if (u && u.ball && b.velocity.length() > 0.6) { sx += b.position.x; sy += b.position.y; n++; } }
    if (n) { want.set(sx / n, Math.max(3, sy / n), 0); dist = cam.fit * 0.55; }
  }
  tgt.lerp(want, 0.06); cam.cur = (cam.cur ?? dist) + (dist - (cam.cur ?? dist)) * 0.06;
  camera.position.set(tgt.x + Math.sin(cam.az) * Math.cos(cam.el) * cam.cur, tgt.y + Math.sin(cam.el) * cam.cur, Math.cos(cam.az) * Math.cos(cam.el) * cam.cur);
  camera.lookAt(tgt);
  if (conf) {
    conf.t += dt; const a = conf.pts.geometry.attributes.position;
    conf.vel.forEach((v, i) => { v[1] -= 12 * dt; a.array[i * 3] += v[0] * dt; a.array[i * 3 + 1] += v[1] * dt; a.array[i * 3 + 2] += v[2] * dt; });
    a.needsUpdate = true;
    if (conf.t > 2.5) { scene.remove(conf.pts); conf.pts.geometry.dispose(); conf = null; }
  }
  renderer.render(scene, camera);
  // mode lleuger automàtic
  if (!light && ++frames > 90) { slow = slow * 0.9 + dt * 1000 * 0.1; if (frames > 200 && slow > 40) setLight(true, true); }
  else if (frames <= 90) slow = dt * 1000;
}

renderChallenges($('chList'), done); histUi();
(async () => {
  const m = location.hash.match(/#m=(.+)/);
  if (m) { try { const s = await decodeState(m[1]); state.pieces = s.pieces.filter(p => CATALOG.some(c => c.t === p.t)).map(p => ({ ...p, id: state.next++ })); state.task = s.task; $('taskSel').value = s.task; } catch (e) { say('L\'enllaç de la màquina no és vàlid.'); } }
  rebuild();
  if (light) setLight(true, false); else $('btnLight').textContent = '🐢 Versió lleugera (si va lent)';
  if (state.analyze) setAnalyze(true);
  requestAnimationFrame(frame);
})();
window.__sim = { toScreen: (x, y) => { const v = new THREE.Vector3(x, y, 0).project(camera); const r = canvas.getBoundingClientRect(); return [r.left + (v.x + 1) / 2 * r.width, r.top + (1 - v.y) / 2 * r.height]; }, state, rebuild, ctx, cam, TASKS, selBox, shot: () => { renderer.render(scene, camera); return canvas.toDataURL('image/png'); } };
