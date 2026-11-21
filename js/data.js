// Dades de l'activitat: tasques, catàleg de peces i reptes (tot en català)

export const TASKS = [
  { e: '⚽', n: 'Marcar un gol a la porteria', ok: 'Gol! La cadena ha marcat a la porteria!' },
  { e: '🏀', n: 'Encistellar una pilota de bàsquet', ok: 'Cistella! Triple de la cadena!' },
  { e: '🎳', n: 'Fer un strike a les bitlles', ok: 'Strike! Totes les bitlles a terra!' },
  { e: '🎲', n: 'Fer caure la fitxa final del joc', ok: 'La fitxa final ha caigut!' },
  { e: '💡', n: 'Encendre un llum', ok: 'S\'ha fet la llum!' },
  { e: '⏰', n: 'Fer sonar el despertador', ok: 'Dring! El despertador sona!' },
  { e: '📬', n: 'Deixar una carta a la bústia', ok: 'Carta entregada a la bústia!' },
  { e: '🚪', n: 'Tancar una porta', ok: 'La porta s\'ha tancat!' },
  { e: '🐶', n: 'Omplir el plat de menjar d\'un animal', ok: 'El plat ja és ple. Bon profit!' },
  { e: '🌱', n: 'Regar una planta', ok: 'La planta ja té aigua!' },
  { e: '🐦', n: 'Omplir el menjador dels ocells', ok: 'El menjador dels ocells és ple!' },
  { e: '🌰', n: 'Plantar una llavor', ok: 'Llavor plantada!' },
  { e: '♻️', n: 'Reciclar: portar l\'envàs al contenidor', ok: 'Envàs reciclat correctament!' },
  { e: '🐷', n: 'Posar una moneda a la guardiola', ok: 'Moneda estalviada!' },
  { e: '🚩', n: 'Hissar una bandera', ok: 'La bandera és a dalt!' },
  { e: '🎈', n: 'Trencar un globus', ok: 'Pam! El globus ha petat!' }
];

// cat: categoria; maq: màquina simple (nom tècnic); cl: classe de palanca
export const CATALOG = [
  { t: 'bola', cat: 'Per començar', n: 'Bola', maq: 'No és una màquina simple (és la càrrega)', d: 'Una bola lleugera que roda.' },
  { t: 'bolaP', cat: 'Per començar', n: 'Bola pesada', maq: 'No és una màquina simple (és la càrrega)', d: 'Pesa 4 vegades més que la bola normal.' },
  { t: 'caixa', cat: 'Per començar', n: 'Pes (caixa)', maq: 'No és una màquina simple (és la càrrega)', d: 'Un bloc pesat per fer de contrapès.' },
  { t: 'domino', cat: 'Per començar', n: 'Dòmino', maq: 'No és una màquina simple (transmet el moviment)', d: 'Cau i empeny el següent.' },
  { t: 'rampa', cat: 'Rampes i rodes', n: 'Rampa', maq: 'Pla inclinat', d: 'Una superfície inclinada per fer baixar coses.' },
  { t: 'rampaL', cat: 'Rampes i rodes', n: 'Rampa llarga', maq: 'Pla inclinat', d: 'Una rampa més llarga i, per tant, menys costeruda.' },
  { t: 'roda', cat: 'Rampes i rodes', n: 'Roda', maq: 'Roda', d: 'Una roda gran que rodola.' },
  { t: 'noria', cat: 'Rampes i rodes', n: 'Roda de pales', maq: 'Roda i eix', d: 'Una roda amb pales que gira al voltant d\'un eix.' },
  { t: 'balanci', cat: 'Palanques', n: 'Balancí', maq: 'Palanca de 1a classe', cl: 1, d: 'Un tauler que bascula pel mig.' },
  { t: 'catapulta', cat: 'Palanques', n: 'Catapulta', maq: 'Palanca de 1a classe', cl: 1, d: 'Posa la bola a la cullera (esquerra) i deixa caure un pes a l\'extrem curt (dreta): la bola surt disparada.' },
  { t: 'tisores', cat: 'Palanques', n: 'Tisores', maq: 'Palanca de 1a classe', cl: 1, d: 'Dos braços que giren al voltant d\'un punt.' },
  { t: 'carreto', cat: 'Palanques', n: 'Carretó', maq: 'Palanca de 2a classe', cl: 2, d: 'Si alces els mànecs, buida el que porta.' },
  { t: 'portella', cat: 'Palanques', n: 'Portella', maq: 'Palanca de 2a classe', cl: 2, d: 'Una porta amb frontissa a un costat.' },
  { t: 'martell', cat: 'Palanques', n: 'Martell', maq: 'Palanca de 3a classe', cl: 3, d: 'Penja del mànec. Si el copegen pel mig, el cap pega fort.' },
  { t: 'bat', cat: 'Palanques', n: 'Bat', maq: 'Palanca de 3a classe', cl: 3, d: 'Un bat llarg que penja i pega a la bola.' },
  { t: 'politja', cat: 'Politges i cargol', n: 'Politja amb contrapès', maq: 'Politja fixa', d: 'Si la cistella pesa més que el contrapès, baixa i el puja.' },
  { t: 'polispast', cat: 'Politges i cargol', n: 'Politja amb corriol', maq: 'Polispast (politja mòbil)', d: 'Amb la politja mòbil, la càrrega es mou la meitat.' },
  { t: 'cargol', cat: 'Politges i cargol', n: 'Cargol elevador', maq: 'Cargol', d: 'Gira i puja lentament el que té a sobre.' },
  { t: 'diana', cat: 'Final', n: 'Objectiu final', maq: 'Final de la cadena', d: 'La cadena ha d\'arribar aquí. Tria la tasca a dalt.' }
];

export const CHALLENGES = [
  { n: 'Baixa per la rampa: fes arribar una bola a l\'objectiu amb una rampa.', need: ['rampa|rampaL', 'bola|bolaP'], types: 0 },
  { n: 'Palanca en acció: fes servir una palanca i arriba a l\'objectiu.', need: ['balanci|catapulta|tisores|carreto|portella|martell|bat'], types: 0 },
  { n: 'Efecte dòmino: fes caure 6 dòminos o més i arriba a l\'objectiu.', need: ['domino*6'], types: 0 },
  { n: 'Cadena llarga: fes servir 4 tipus de peces diferents i arriba a l\'objectiu.', need: [], types: 4 }
];
