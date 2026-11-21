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
const CLASS_TXT = {
  1: 'El <b>punt de suport (P)</b> és entre la càrrega (C) i la força aplicada (A).',
  2: 'La <b>càrrega (C)</b> és entre el punt de suport (P) i la força aplicada (A).',
  3: 'La <b>força aplicada (A)</b> és entre el punt de suport (P) i la càrrega (C).'
};
const LAW = 'Llei de la palanca: <b>Fa · Da = Fc · Dc</b> (Da i Dc són les distàncies de A i de C fins a P).';

export function analysisText(piece, def, info) {
  let h = `Màquina simple: <b>${def.maq}</b>`;
  if (def.cl) {
    h += `<br>${CLASS_TXT[def.cl]}<br>${LAW}`;
    if (info && info.arms) {
      const da = info.arms.ba, dc = info.arms.bc;
      h += `<br>En aquesta peça: Da ≈ ${da.toFixed(1).replace('.', ',')} · Dc ≈ ${dc.toFixed(1).replace('.', ',')}. `;
      h += da > dc ? 'Com que Da és més gran que Dc, fas menys força (Fa < Fc).' : (da < dc ? 'Com que Da és més petit que Dc, no guanyes força, però la càrrega es mou més de pressa.' : 'Da i Dc són iguals: Fa = Fc.');
    }
  }
  if (piece.t === 'politja') h += `<br><b>P</b> és l'eix de la politja, <b>A</b> és la cistella i <b>C</b> el pes. La politja fixa no redueix la força (<b>Fa = Fc</b>): només en canvia la direcció.`;
  if (piece.t === 'polispast') h += `<br><b>P</b> és l'eix de la politja fixa, <b>A</b> la cistella i <b>C</b> el pes. Amb una politja mòbil, 2 cordes sostenen la càrrega: <b>Fa = Fc / 2</b>.`;
  if (piece.t === 'cargol') h += `<br>Converteix un moviment de gir en un moviment lineal: avança lentament però amb molta força.`;
  if (piece.t === 'rampa' || piece.t === 'rampaL') h += `<br>Com menys inclinada és, menys força cal però més recorregut.`;
  if (piece.t === 'noria') h += `<br>Roda i eix: una força petita en un radi gran fa girar l'eix.`;
  return h;
}

export function renderInspector(el, piece, info, analitza) {
  const def = CATALOG.find(c => c.t === piece.t);
  let h = `<b>${def.n}</b><br>${def.d}`;
  if (def.use) h += `<br><br><b>Com s'utilitza:</b> ${def.use}`;
  if (analitza) h += `<br><br>${analysisText(piece, def, info)}`;
  if (info && info.need) h += `<br><br>Fc = 4. Per moure la càrrega, la cistella (Fa) ha de pesar més de <b>${info.need}</b>. (Bola normal = 1 · pesada = 4,4 · la cistella buida pesa 0,4.)`;
  el.innerHTML = h;
}

// Llista de les màquines simples que hi ha a la màquina de l'alumne
export function renderAnalysis(el, pieces) {
  const t = {};
  pieces.forEach(p => {
    const def = CATALOG.find(c => c.t === p.t);
    if (/^No és|^Final/.test(def.maq)) return;
    (t[def.maq] = t[def.maq] || { n: 0, def }).n++;
  });
  const ks = Object.keys(t);
  if (!ks.length) { el.innerHTML = 'Encara no has posat cap màquina simple.'; return; }
  el.innerHTML = ks.map(k => {
    const d = t[k].def;
    let x = `<div class="mq"><b>${k}</b> × ${t[k].n}`;
    if (d.cl) x += `<br><span>${CLASS_TXT[d.cl]}</span>`;
    return x + '</div>';
  }).join('') + '<div class="mq law">' + LAW + '</div><div class="mq">Per veure P, C i A i el detall de cada peça, selecciona-la amb el botó Cursor.</div>';
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
