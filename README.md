# Màquina de Rube Goldberg (amb màquines simples)

Simulador 2,5D per a l'activitat de tancament de la unitat de **Màquines simples** (3r d'ESO, Tecnologia i Digitalització).
L'alumnat construeix una màquina de Rube Goldberg amb palanques, rampes, politges, cargol i dòminos.

- **Sessió 1:** obre `index.html` (noms quotidians de les peces).
- **Sessió 2:** obre `index.html?analitza=1` (mostra la màquina simple de cada peça i els punts F, C i E de les palanques).
- `?lleuger=1` desactiva ombres i redueix la qualitat gràfica (per a ordinadors lents).

No es recull ni es desa cap dada personal. L'«enllaç de la màquina» guarda la disposició de les peces dins de la mateixa adreça.

**Important:** no funciona obrint `index.html` directament del disc (els navegadors bloquegen els mòduls). Cal publicar-lo (GitHub Pages) o servir-lo amb un servidor local (`python3 -m http.server`).

Llibreries incloses (carpeta `lib/`): [three.js](https://threejs.org) i [cannon-es](https://github.com/pmndrs/cannon-es), ambdues amb llicència MIT.

## Novetats
- Botons destacats: Analitza les màquines simples, Carrega una màquina i Versió lleugera.
- Desfés / Refés (Ctrl+Z / Ctrl+Y). Nomenclatura P, C (Fc), A (Fa).
- Per afegir o moure peces cal prémer Reinicia (simulació aturada).
- Tauler ampliat, vista que es pot moure (arrossegar el fons, fletxes, dos dits), responsive (mòbil/tauleta).
- Anàlisi bàsica: només P, C, A i si una peça és màquina simple (comptador: mínim 5, una palanca).
