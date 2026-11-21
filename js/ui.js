// Components d'interfície: paleta, inspector, anàlisi i reptes
import { CATALOG, CHALLENGES } from './data.js';

export function buildPalette(el, onPick) {
  let cat = '';
  const btns = {};
  for (const c of CATALOG) {
    if (c.cat !== cat) { cat = c.cat; const h = document.createElement('div'); h.className = 'cat'; h.textContent = cat; el.appendChild(h); }
    const b = document.createElement('button');
    b.className = 'pcs'; b.textContent = c.n; b.title = c.d;
    b.onclick = () => onPick(c.t);
    el.appendChild(b); btns[c.t] = b;
  }
  return { setActive(t) { for (const k in btns) btns[k].classList.toggle('on', k === t); } };
}

// Nomenclatura de classe: P = punt de suport, C = força de càrrega (Fc), A = força aplicada (Fa)
export const MIN_MS = 5;
export const isSimple = def => !/^No és|^Final/.test(def.maq);

// Anàlisi bàsica: només diu si la peça és una màquina simple i on són P, C i A (sense noms ni graus)
export function analysisText(piece, def) {
  if (!isSimple(def)) return '<b>❌ No és una màquina simple.</b>';
  let h = '<b>✅ És una màquina simple.</b>';
  if (def.cl || piece.t === 'politja' || piece.t === 'polispast') h += '<br>Mira a la peça on són <b>P</b> (punt de suport), <b>C</b> (càrrega, Fc) i <b>A</b> (força aplicada, Fa).';
  return h;
}

export function renderInspector(el, piece, info, analitza) {
  const def = CATALOG.find(c => c.t === piece.t);
  let h = `<b>${def.n}</b><br>${def.d}`;
  if (def.use) h += `<br><br><b>Com s'utilitza:</b> ${def.use}`;
  if (analitza) h += `<br><br>${analysisText(piece, def)}`;
  if (info && info.need) h += `<br><br>Fc = 4. Per moure la càrrega, la cistella (Fa) ha de pesar més de <b>${info.need}</b>. (Bola normal = 1 · pesada = 4,4 · la cistella buida pesa 0,4.)`;
  el.innerHTML = h;
}

// Resum de l'anàlisi: quantes màquines simples hi ha i si hi ha almenys una palanca
export function renderAnalysis(el, pieces) {
  let n = 0, lev = 0;
  pieces.forEach(p => { const def = CATALOG.find(c => c.t === p.t); if (isSimple(def)) { n++; if (def.cl) lev++; } });
  const ok1 = n >= MIN_MS, ok2 = lev >= 1;
  el.innerHTML = `<div class="mq ${ok1 ? 'good' : 'bad'}">${ok1 ? '✅' : '⬜'} Màquines simples: <b>${n}</b> (en calen com a mínim ${MIN_MS})</div>`
    + `<div class="mq ${ok2 ? 'good' : 'bad'}">${ok2 ? '✅' : '⬜'} Hi ha almenys una palanca</div>`
    + '<div class="mq">Per saber si una peça és una màquina simple, selecciona-la amb el botó Cursor.</div>';
}

export function reqOk(ch, pieces) {
  const cnt = {}; pieces.forEach(p => { cnt[p.t] = (cnt[p.t] || 0) + 1; });
  for (const r of ch.need) {
    const [alts, n] = r.split('*');
    const k = alts.split('|').reduce((s, t) => s + (cnt[t] || 0), 0);
    if (k < (n ? +n : 1)) return false;
  }
  return Object.keys(cnt).filter(t => t !== 'diana').length >= ch.types;
}

export function renderChallenges(list, done) {
  list.innerHTML = '';
  CHALLENGES.forEach((c, i) => {
    const li = document.createElement('li'); li.textContent = c.n;
    if (done.has(i)) li.className = 'ok';
    list.appendChild(li);
  });
}
