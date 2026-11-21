// Dades de l'activitat: objectius, catàleg de peces i reptes (tot en català)

export const TASKS = [
  { e: '⚽', n: 'Marcar un gol a la porteria', ok: 'Gol! La màquina ha marcat a la porteria!', g: 'gol' },
  { e: '🏀', n: 'Encistellar una pilota de bàsquet', ok: 'Cistella! Triple de la màquina!', g: 'cistella' },
  { e: '🎳', n: 'Fer un strike a les bitlles', ok: 'Strike! Totes les bitlles a terra!', g: 'bitlles' },
  { e: '🎲', n: 'Fer caure la fitxa final del joc', ok: 'La fitxa final ha caigut!', g: 'fitxa' },
  { e: '💡', n: 'Encendre un llum', ok: 'S\'ha fet la llum!', g: 'llum' },
  { e: '⏰', n: 'Fer sonar el despertador', ok: 'Dring! El despertador sona!', g: 'despertador' },
  { e: '📬', n: 'Deixar una carta a la bústia', ok: 'Carta entregada a la bústia!', g: 'bustia' },
  { e: '🚪', n: 'Tancar una porta', ok: 'La porta s\'ha tancat!', g: 'porta' },
  { e: '🐶', n: 'Omplir el plat de menjar d\'un animal', ok: 'El plat ja és ple. Bon profit!', g: 'plat' },
  { e: '🌱', n: 'Regar una planta', ok: 'La planta ja té aigua!', g: 'planta' },
  { e: '🐦', n: 'Omplir el menjador dels ocells', ok: 'El menjador dels ocells és ple!', g: 'ocells' },
  { e: '🌰', n: 'Plantar una llavor', ok: 'Llavor plantada!', g: 'llavor' },
  { e: '♻️', n: 'Reciclar: portar l\'envàs al contenidor', ok: 'Envàs reciclat correctament!', g: 'reciclar' },
  { e: '🐷', n: 'Posar una moneda a la guardiola', ok: 'Moneda estalviada!', g: 'guardiola' },
  { e: '🚩', n: 'Hissar una bandera', ok: 'La bandera és a dalt!', g: 'bandera' },
  { e: '🎈', n: 'Trencar un globus', ok: 'Pam! El globus ha petat!', g: 'globus' }
];

// cat: categoria; maq: màquina simple (nom tècnic); cl: grau de palanca; use: com s'utilitza (es mostra en seleccionar la peça)
export const CATALOG = [
  { t: 'bola', cat: 'Per començar', n: 'Bola normal', maq: 'No és una màquina simple (és la càrrega)', d: 'Bola normal (pes 1).' },
  { t: 'bolaP', cat: 'Per començar', n: 'Bola pesada', maq: 'No és una màquina simple (és la càrrega)', d: 'Bola pesada (pes 4,4). Va bé per fer caure sobre una palanca o per omplir la cistella d\'una politja.' },
  { t: 'caixa', cat: 'Per començar', n: 'Pes (caixa)', maq: 'No és una màquina simple (és la càrrega)', d: 'Un bloc pesat (pes 3) per fer de contrapès.' },
  { t: 'domino', cat: 'Per començar', n: 'Dòmino', maq: 'No és una màquina simple (transmet el moviment)', d: 'Cau i empeny el següent. Posa\'ls a prop (0,5 a 1,5 de separació).' },
  { t: 'rampa', cat: 'Rampes i rodes', n: 'Rampa', maq: 'Pla inclinat', d: 'Una superfície inclinada per fer baixar coses.' },
  { t: 'rampaL', cat: 'Rampes i rodes', n: 'Rampa llarga', maq: 'Pla inclinat', d: 'Una rampa més llarga i, per tant, menys costeruda.' },
  { t: 'roda', cat: 'Rampes i rodes', n: 'Roda', maq: 'Roda', d: 'Una roda gran que rodola.' },
  { t: 'noria', cat: 'Rampes i rodes', n: 'Roda de pales', maq: 'Roda i eix', d: 'Una roda amb pales que gira al voltant d\'un eix.' },
  { t: 'balanci', cat: 'Palanques', n: 'Balancí', maq: 'Palanca de 1r grau', cl: 1,
    d: 'Un tauler que bascula pel mig.',
    use: 'Deixa caure una bola pesada a un extrem: l\'altre extrem puja i pot empènyer una altra peça (per exemple, els mànecs del carretó).' },
  { t: 'catapulta', cat: 'Palanques', n: 'Catapulta', maq: 'Palanca de 1r grau', cl: 1,
    d: 'Posa una bola a la cullera (esquerra) i deixa caure un pes a l\'extrem curt (dreta): la bola surt disparada.',
    use: 'Posa una bola a la cullera i deixa caure un pes (la bola pesada o la caixa) sobre l\'extrem de la dreta. Com més amunt caigui el pes, més lluny arriba la bola.' },
  { t: 'tisores', cat: 'Palanques', n: 'Tisores', maq: 'Palanca de 1r grau', cl: 1,
    d: 'Tallen la corda que subjecta un pes.',
    use: 'Deixa caure una bola o un pes sobre el mànec rosa (dreta): la fulla de l\'esquerra puja, talla la corda i el pes penjat cau. Posa una rampa o altres peces sota el pes perquè la màquina continuï.' },
  { t: 'carreto', cat: 'Palanques', n: 'Carretó', maq: 'Palanca de 2n grau', cl: 2,
    d: 'Un carretó amb la roda (punt de suport) a l\'esquerra i els mànecs a la dreta.',
    use: 'Posa-hi una bola a dins. Si s\'alcen els mànecs (dreta), el carretó bolca cap endavant i la bola surt cap a l\'esquerra. Per alçar els mànecs: col·loca un balancí amb un extrem just sota la punta dels mànecs (a la dreta del petit suport) i deixa caure la bola pesada a l\'altre extrem. També els pot alçar la càrrega (C) d\'una politja o d\'un polispast col·locada sota la punta dels mànecs, o el cargol elevador.' },
  { t: 'porta', cat: 'Palanques', n: 'Porta batent', maq: 'Palanca de 2n grau', cl: 2,
    d: 'Una porta penjada per dalt (la frontissa és el punt de suport) que només s\'obre cap a la dreta.',
    use: 'Una bola que ve de l\'esquerra la toca per baix i l\'obre; la porta torna enrere i no deixa passar res en sentit contrari. Col·loca-la perquè l\'extrem de baix quedi a l\'alçada de la bola (la frontissa, uns 3,5 per sobre del terra). També pots empènyer-la amb una altra peça.' },
  { t: 'martell', cat: 'Palanques', n: 'Martell', maq: 'Palanca de 3r grau', cl: 3, d: 'Penja del mànec. Si el copegen pel mig, el cap pega fort.' },
  { t: 'bat', cat: 'Palanques', n: 'Bat', maq: 'Palanca de 3r grau', cl: 3, d: 'Un bat llarg que penja i pega a la bola.' },
  { t: 'politja', cat: 'Politges i cargol', n: 'Politja fixa', maq: 'Politja fixa', d: 'Una politja fixa amb un contrapès (pes 4).',
    use: 'La càrrega (C) és el pes de la dreta: Fc = 4. La força aplicada (A) és el pes de la cistella de l\'esquerra: ha de ser més gran que Fc, per això hi has de deixar caure una bola pesada. La politja no redueix la força (Fa = Fc): només en canvia la direcció.' },
  { t: 'polispast', cat: 'Politges i cargol', n: 'Polispast', maq: 'Polispast (politja fixa + politja mòbil)', d: 'Una politja fixa a dalt i una politja mòbil que puja amb el pes (4).',
    use: 'La càrrega (C) és el pes de la dreta: Fc = 4. La força aplicada (A) és el pes de la cistella de l\'esquerra. Amb el polispast, Fa = Fc / 2: la cistella només ha de pesar més de 2 (sense polispast caldria més de 4). A canvi, la cistella baixa el doble del que puja el pes.' },
  { t: 'cargol', cat: 'Politges i cargol', n: 'Cargol elevador', maq: 'Cargol', d: 'Gira i puja lentament el que té a sobre.',
    use: 'Posa-hi una bola a la plataforma: al cap d\'un moment puja i, a dalt, s\'inclina i la bola surt cap a la dreta.' },
  { t: 'diana', cat: 'Final', n: 'Objectiu final', maq: 'Final de la màquina', d: 'La màquina ha d\'arribar aquí. Tria l\'objectiu a dalt.' }
];

export const CHALLENGES = [
  { n: 'Baixa per la rampa: fes arribar una bola a l\'objectiu amb una rampa.', need: ['rampa|rampaL', 'bola|bolaP'], types: 0 },
  { n: 'Palanca en acció: fes servir una peça de la secció «Palanques» (per exemple, el balancí o la catapulta) i arriba a l\'objectiu.', need: ['balanci|catapulta|tisores|carreto|porta|martell|bat'], types: 0 },
  { n: 'Efecte dòmino: fes caure 6 dòminos o més i arriba a l\'objectiu.', need: ['domino*6'], types: 0 },
  { n: 'Politja: fes servir una politja o un polispast per aixecar un pes i arriba a l\'objectiu. Pista: deixa caure una bola pesada a la cistella.', need: ['politja|polispast'], types: 0 },
  { n: 'Cargol elevador: fes pujar una bola amb el cargol i arriba a l\'objectiu.', need: ['cargol'], types: 0 },
  { n: 'Màquina llarga: fes servir 4 tipus de peces diferents i arriba a l\'objectiu.', need: [], types: 4 }
];
