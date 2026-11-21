// Codificació de la màquina en un enllaç (a la part #m= de l'adreça)
const b64u = (u8) => btoa(String.fromCharCode(...u8)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64u = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));

async function pipe(u8, stream) {
  const s = new Blob([u8]).stream().pipeThrough(stream);
  return new Uint8Array(await new Response(s).arrayBuffer());
}

export async function encodeState(state) {
  const json = JSON.stringify({ v: 1, k: state.task, p: state.pieces.map(q => [q.t, +q.x.toFixed(2), +q.y.toFixed(2), q.r ?? 0, q.m ? 1 : 0]) });
  const raw = new TextEncoder().encode(json);
  if (typeof CompressionStream !== 'undefined') {
    try { return 'z' + b64u(await pipe(raw, new CompressionStream('deflate-raw'))); } catch (e) { /* segueix */ }
  }
  return 'r' + b64u(raw);
}

export async function decodeState(code) {
  code = (code || '').trim();
  const m = code.match(/#m=([A-Za-z0-9_-]+)/); if (m) code = m[1];
  if (!code) throw new Error('buit');
  let raw;
  if (code[0] === 'z') raw = await pipe(unb64u(code.slice(1)), new DecompressionStream('deflate-raw'));
  else if (code[0] === 'r') raw = unb64u(code.slice(1));
  else throw new Error('format');
  const o = JSON.parse(new TextDecoder().decode(raw));
  if (!o || o.v !== 1 || !Array.isArray(o.p)) throw new Error('versio');
  return { task: o.k | 0, pieces: o.p.map(a => ({ t: String(a[0]), x: +a[1], y: +a[2], r: +a[3], m: a[4] ? 1 : 0 })) };
}
