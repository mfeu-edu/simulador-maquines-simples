# Màquina de Rube Goldberg (amb màquines simples)

Simulador web 2,5D i activitat de tancament de la unitat de **Màquines simples** (3r d'ESO, Tecnologia i Digitalització). L'alumnat, en parelles, construeix una màquina de Rube Goldberg que acaba fent una tasca útil (marcar un gol, regar una planta, reciclar un envàs...) i després analitza les màquines simples que hi ha fet servir.

- Competència avaluada: **TiD-CA4.2** (eines digitals col·laboratives per representar esquemes tècnics).
- Sense comptes ni dades personals: l'«enllaç de la màquina» guarda la posició de les peces dins de la mateixa adreça.
- Funciona en ordinador, tauleta i mòbil (es recomana ordinador o tauleta gran).

## L'activitat en 6 passos

Els passos no estan lligats a sessions: cada grup els fa al seu ritme (2 o 3 sessions de taller).

1. **Tria l'objectiu** al desplegable del simulador (16 objectius) i practica amb els reptes inicials.
2. **Construeix la màquina.** Requisit: arribar a l'objectiu amb com a mínim **5 màquines simples** (compten les peces, no els tipus) i almenys **una palanca**. L'alumnat decideix quines peces ho són: les boles, el pes i els dòminos no ho són.
3. **Prova-la, afina-la i desa-la.** Engega, Reinicia, Desfés/Refés, i «Enllaç de la màquina» per recuperar-la un altre dia amb «Carrega una màquina».
4. **Analitza les màquines simples** amb el botó «Analitza les màquines simples». El simulador només mostra **P, C i A** i si cada peça és màquina simple o no (amb un comptador del requisit). El nom de la màquina i el grau de la palanca els ha de dir l'alumnat.
5. **Estudia una palanca:** esquema amb P, C i A, grau (1r, 2n, 3r), mesura de Da i Dc comptant quadres (1 quadre = 1 m) i càlcul amb **Fa · Da = Fc · Dc**.
6. **Presenta i comparteix** amb la plantilla de diapositives (màquina anotada, palanca en detall, punt feble i millora).

## Nomenclatura

P = punt de suport (fulcre) · C o Fc = força de càrrega · A o Fa = força aplicada · Da i Dc = distàncies de A i de C fins a P.

## Avaluació

Quatre criteris d'1 punt (AE = 4, AN = 3, AS = 2, NA = 0 o 1):

1. La màquina compleix el requisit (5 màquines simples i una palanca): es comprova al simulador amb el botó d'anàlisi.
2. La màquina representada: peces numerades, amb nom i màquina simple.
3. Anàlisi de la palanca i millores.
4. Treball i col·laboració en equip (observació, presentació compartida i preguntes orals).

L'enllaç dels trams del tauler (Tram A / Tram B) és opcional i no puntua, perquè una parella pot treballar en un sol ordinador.

## Materials de treball (carpeta `docs/`)

| Document | Per a què serveix |
|---|---|
| [Pla_sessions_Rube_Goldberg.docx](docs/Pla_sessions_Rube_Goldberg.docx) | Pla de l'activitat per a la docent: sessions, avaluació, llista de validació i notes tècniques |
| [Passos_alumnat_Rube_Goldberg.pptx](docs/Passos_alumnat_Rube_Goldberg.pptx) | Diapositives per explicar l'activitat a l'alumnat en 6 passos |
| [Plantilla_infografia_Rube_Goldberg.pptx](docs/Plantilla_infografia_Rube_Goldberg.pptx) | Plantilla de presentació que omple l'alumnat |
| [Exemple_resolt_Rube_Goldberg.pptx](docs/Exemple_resolt_Rube_Goldberg.pptx) | Exemple resolt d'una parella fictícia |
| [Guia_maquines_simples.docx](docs/Guia_maquines_simples.docx) | Guia (xuleta) opcional: peces i màquines simples, graus de palanca, distàncies i exemple de càlcul |
| [Guia_GitHub_Pages.docx](docs/Guia_GitHub_Pages.docx) | Com publicar i actualitzar el simulador a GitHub Pages |

## Controls del simulador

- **Posar una peça:** tria-la a l'esquerra i fes clic al tauler.
- **Seleccionar, moure, duplicar o eliminar:** botó 🖱️ Cursor (o Esc) i fes clic a la peça.
- **Girar:** ↺ ↻ o Q / E. **Voltejar:** ⇋ ⇅ o H / V.
- **Desfer / refer:** Ctrl+Z / Ctrl+Y. Per afegir o moure peces cal prémer Reinicia (simulació aturada).
- **Vista:** arrossega el fons, fletxes del teclat o dos dits; zoom amb la roda o pessigant; botó dret per girar; tecla 0 per centrar.
- **Versió lleugera** (botó taronja o `?lleuger=1`): sense ombres, per a ordinadors lents. També s'activa sola si va lent.
- `?analitza=1` obre el simulador amb l'anàlisi activada.

## Publicar-lo

No funciona obrint `index.html` directament del disc (els navegadors bloquegen els mòduls): cal publicar-lo amb GitHub Pages (vegeu la guia a `docs/`) o servir-lo en local amb `python3 -m http.server`. El fitxer `.nojekyll` ha de ser a l'arrel.

## Llibreries

Carpeta `lib/`: [three.js](https://threejs.org) i [cannon-es](https://github.com/pmndrs/cannon-es), ambdues amb llicència MIT.
