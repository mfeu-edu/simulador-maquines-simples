// Components d'interfície: paleta, inspector i reptes
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

const CLASS_TXT = {
  1: 'El <b>fulcre (F)</b> és entre la càrrega i l\'esforç.',
  2: 'La <b>càrrega (C)</b> és entre el fulcre i l\'esforç.',
  3: 'L\'<b>esforç (E)</b> és entre el fulcre i la càrrega.'
};

export function renderInspector(el, piece, info, analitza) {
  const def = CATALOG.find(c => c.t === piece.t);
  let h = `<b>${def.n}</b><br>${def.d}`;
  if (analitza) {
    h += `<br><br>Màquina simple: <b>${def.maq}</b>`;
    if (def.cl) h += `<br>${CLASS_TXT[def.cl]}<br>Quan el braç de l'esforç és més llarg que el de la càrrega, fas menys força.`;
    if (piece.t === 'politja') h += `<br>La politja fixa no redueix la força: només en canvia la direcció.`;
    if (piece.t === 'polispast') h += `<br>Amb una politja mòbil, la força es divideix per 2: Fa = Fc / (2·n), amb n = 1.`;
    if (piece.t === 'cargol') h += `<br>Converteix un moviment de gir en un moviment lineal, lent i amb molta força.`;
    if (piece.t === 'rampa' || piece.t === 'rampaL') h += `<br>Com menys inclinada és, menys força cal però més recorregut.`;
    if (piece.t === 'noria') h += `<br>Roda i eix: una força petita en un radi gran fa girar l'eix.`;
  }
  if (info && info.need) h += `<br><br>La càrrega pesa 4. Per moure-la, la cistella ha de pesar més de <b>${info.need}</b>. (Bola = 1, bola pesada = 4,4.)`;
  el.innerHTML = h;
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
