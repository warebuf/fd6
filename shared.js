// Shared card data + deck helpers for fd6 (index.html game + decks.html builder).
var CARD_DEFS = {
  attacker: { key:'attacker', type:'unit', unitType:'attacker', name:'Striker', icon:'⚔', power:10, hp:20, cooldown:20,
    effect:'Every 20 ticks, hits the nearest enemy unit, or a structure if none remain, for 10.' },
  healer:   { key:'healer',   type:'unit', unitType:'healer',   name:'Medic',   icon:'✚', heal:10,  hp:15, cooldown:20,
    effect:'Every 20 ticks, heals whichever own structure or unit is most wounded (by %) for 10.' },
  mirror:   { key:'mirror',   type:'trap', manualArm:true,      name:'Mirror Wall', icon:'◈',
    effect:'Dormant until you activate it during the battle. Once active, negates the next enemy attack on your side and destroys the unit that made it.' },

  gravedigger:  { key:'gravedigger',  type:'unit', unitType:'special', name:'Gravedigger',  icon:'Ω', hp:16, cooldown:Infinity, startCharges:1, usesCharges:true, activatable:true,
    effect:'1 charge. Activate it during the battle: fires once for every card in your graveyard, 4 damage each.' },
  undertaker:   { key:'undertaker',   type:'unit', unitType:'special', name:'Undertaker',   icon:'⛧', hp:14, cooldown:Infinity, usesCharges:true, activatable:true, activateCost:2,
    effect:'Gains 1 charge whenever one of your units dies. Activate whenever you like: spend 2 charges to return a unit card from your graveyard to hand.' },
  predator:     { key:'predator',     type:'unit', unitType:'attacker', name:'Predator',    icon:'♦', power:16, hp:18, cooldown:20,
    effect:'Powerful attacker (16 power). When it dies, its death throes hit every other unit on your side for 5.' },
  extortionist: { key:'extortionist', type:'unit', unitType:'passive', name:'Extortionist', icon:'¤', hp:14, cooldown:Infinity,
    effect:'Whenever the opponent activates a trap, continuous, or special ability, choose one of your cards to gain 1 charge.' },
  bodyguard:    { key:'bodyguard',    type:'unit', unitType:'passive', name:'Bodyguard',    icon:'⛨', hp:22, cooldown:Infinity,
    effect:'May redirect an attack aimed at another of your units or structures onto itself instead.' },
  scavenger:    { key:'scavenger',    type:'unit', unitType:'attacker', name:'Scavenger',   icon:'↻', power:5, hp:15, cooldown:20,
    effect:'Every 20 ticks, attacks for 5. Whenever any unit dies (either side), may take its unclaimed equip.' },
  parasite:     { key:'parasite',     type:'unit', unitType:'special', name:'Parasite',     icon:'☣', hp:8,  cooldown:20, usesCharges:true,
    effect:'Choose one of your other units as its host when placed. Mirrors every charge the host gains from then on.' },
  martyr:       { key:'martyr',       type:'unit', unitType:'special', name:'Martyr',      icon:'✟', hp:12, cooldown:Infinity, startCharges:1, usesCharges:true, activatable:true,
    effect:'1 charge. Activate it during the battle: give a target unit 2 charges, then Martyr destroys itself.' },
  loadedgun:    { key:'loadedgun',    type:'unit', unitType:'special', name:'Loaded Gun',   icon:'☍', hp:10, cooldown:Infinity, startCharges:3, usesCharges:true, activatable:true,
    effect:'3 charges. Fire it yourself at any point during the battle: spends 1 charge to deal 2 damage. Destroys itself at 0 charges.' },
  bulwark:      { key:'bulwark',      type:'unit', unitType:'passive', name:'Bulwark',      icon:'⛊', hp:16, cooldown:Infinity,
    effect:'When the battle begins, if Bulwark is the only unit on your side, it doubles its HP and taunts — every enemy attack must target it while it lives.' },
  mimic:        { key:'mimic',        type:'unit', unitType:'special', name:'Mimic',        icon:'❖', hp:12, cooldown:20, startCharges:1, usesCharges:true,
    effect:"1 charge. Spend it to copy and immediately use another of your unit's action." },

  donation:          { key:'donation',          type:'trap', manualFire:true, name:'Donation',    icon:'☞',
    effect:"Activate it during the battle: gives your weakest unit to the opponent's board." },
  liquidator:        { key:'liquidator',        type:'trap', manualFire:true, name:'Liquidator', icon:'⚗',
    effect:"Activate it during the battle: choose one of your units to sacrifice, then another to receive 1 charge for every 5 HP it had." },
  mutualdestruction: { key:'mutualdestruction', type:'trap', name:'Mutual Destruction', icon:'⇄',
    effect:"The first time you're attacked, you and the opponent each pick a unit to swap control of, then both attack." },
  standoff:          { key:'standoff',          type:'trap', manualFire:true, name:'Standoff',    icon:'⚖',
    effect:"Activate it during the battle: both sides bid charges from their units; the higher bid draws 2 cards, both pay." },
  repossess:         { key:'repossess',         type:'trap', manualFire:true, name:'Repossess',          icon:'⇦',
    effect:"Activate it during the battle: reclaims a unit you originally owned from the opponent's board." },
  lastwill:          { key:'lastwill',          type:'trap', name:"Last Will",          icon:'☠',
    effect:'When one of your units would die, choose: save it at 1 HP, or let it die and draw 2 cards.' },
  hijack:            { key:'hijack',            type:'trap', name:'Hijack',             icon:'⚡',
    effect:"When the opponent activates a charge ability, spend 1 of your charges to redirect it onto their own unit." },
  cannibalize:       { key:'cannibalize',       type:'trap', manualFire:true, name:'Cannibalize', icon:'⌇',
    effect:"Activate it during the battle: choose one of your units to destroy, then another to receive all of its HP." },

  deathless:       { key:'deathless',       type:'equip', name:'Deathless',           icon:'♞',
    effect:'Equip. Destroys itself instead of letting the equipped unit die, once.' },
  veteranstandard: { key:'veteranstandard', type:'equip', name:"Veteran's Standard",  icon:'⚑',
    effect:"Equip. Equipped unit's attacks gain +1 power for every unit you've summoned this game." },
  battery:         { key:'battery',         type:'equip', name:'Battery',             icon:'⎔',
    effect:"Equip. Stores up to 3 of the equipped unit's charges; on death, dumps them into another unit." },
  deadmanswitch:   { key:'deadmanswitch',   type:'equip', name:"Dead Man's Switch",   icon:'☢',
    effect:'Equip. When the equipped unit dies, it immediately acts once more for free.' },
  conduit:         { key:'conduit',         type:'equip', name:'Conduit',             icon:'⌁',
    effect:'Equip. Pick one of your units as its target when you equip it. Whenever the equipped unit is attacked, the target gains 1 charge.' },
  inheritance:     { key:'inheritance',     type:'equip', name:'Inheritance',         icon:'⚱',
    effect:'Equip. When the equipped unit dies, moves itself (and its stored charges) to another of your units.' },
  gravestone:      { key:'gravestone',      type:'equip', name:'Gravestone',          icon:'⚰',
    effect:"Equip. Whenever the equipped unit is attacked, adds a Grave Token to your graveyard." },

  blackbox: { key:'blackbox', type:'continuous', name:'Black Box', icon:'▣',
    effect:'Continuous. Gains a charge whenever one of your cards dies. At 3 charges, replays your last attack or heal.' }
};

// Tokens are created during play, never drawn — kept out of CARD_DEFS so they can't be put in a deck.
var TOKEN_DEFS = {
  gravetoken: { key:'gravetoken', type:'token', name:'Grave Token', icon:'◌',
    effect:'Token. Does nothing on its own, but counts as a card in the graveyard.' }
};

var DECK_RECIPE = [
  ['attacker',1], ['healer',1], ['mirror',1],
  ['gravedigger',1], ['undertaker',1], ['predator',1], ['extortionist',1], ['bodyguard',1],
  ['scavenger',1], ['parasite',1], ['martyr',1], ['loadedgun',1], ['mimic',1],
  ['bulwark',1],
  ['donation',1], ['liquidator',1], ['mutualdestruction',1], ['standoff',1], ['repossess',1],
  ['lastwill',1], ['hijack',1], ['cannibalize',1],
  ['deathless',1], ['veteranstandard',1], ['battery',1], ['deadmanswitch',1], ['inheritance',1],
  ['conduit',1], ['gravestone',1],
  ['blackbox',1]
];
var MAX_COPIES = 12;
var INITIAL_HAND = 6;
var DECK_STORAGE_KEY = 'fd6-deck-recipes';

function el(tag, cls, attrs){
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]);
  return e;
}

function defaultRecipe(){
  var r = {};
  Object.keys(CARD_DEFS).forEach(function(k){ r[k] = 0; });
  DECK_RECIPE.forEach(function(pair){ r[pair[0]] = pair[1]; });
  return r;
}

function emptyRecipe(){
  var r = {};
  Object.keys(CARD_DEFS).forEach(function(k){ r[k] = 0; });
  return r;
}

function cardColorClass(card){
  if (card.type === 'trap' || card.type === 'continuous') return 'ctrap';
  if (card.type === 'equip') return 'cequip';
  if (card.unitType === 'attacker') return 'cattack';
  if (card.unitType === 'healer') return 'cheal';
  return 'cspecial';
}

function statLines(card){
  if (card.type === 'equip') return ['EQUIP', ''];
  if (card.type === 'continuous') return ['FIELD', ''];
  if (card.type === 'trap') return ['TRAP', '1-USE'];
  if (card.unitType === 'attacker') return ['PWR ' + card.power, 'HP ' + card.hp];
  if (card.unitType === 'healer') return ['HEAL ' + card.heal, 'HP ' + card.hp];
  if (card.unitType === 'passive') return ['PASSIVE', 'HP ' + card.hp];
  return ['SPECIAL', 'HP ' + card.hp];
}

function cardTypeLabel(card){
  if (card.type === 'trap') return 'Trap · one use';
  if (card.type === 'continuous') return 'Continuous · field';
  if (card.type === 'equip') return 'Equip';
  if (card.type === 'token') return 'Token';
  if (card.unitType === 'attacker') return 'Unit · attacker';
  if (card.unitType === 'healer') return 'Unit · healer';
  if (card.unitType === 'passive') return 'Unit · passive';
  return 'Unit · special';
}

// Static card details for the "Card Info" inspector panel (title, stat chips, effect text).
function inspectorCardHtml(card){
  var stats = [];
  if (card.power != null) stats.push('PWR ' + card.power);
  if (card.heal != null) stats.push('HEAL ' + card.heal);
  if (card.hp != null) stats.push('HP ' + card.hp);
  if (card.startCharges != null) stats.push('Starts with ' + card.startCharges + ' charge' + (card.startCharges === 1 ? '' : 's'));
  else if (card.usesCharges) stats.push('Uses charges');
  if (isFinite(card.cooldown) && card.type === 'unit') stats.push('Every ' + card.cooldown + ' ticks');
  var html =
    '<div class="inspector-title"><div class="inspector-icon">' + card.icon + '</div>' +
    '<div><div class="inspector-name">' + card.name + '</div><div class="inspector-type">' + cardTypeLabel(card) + '</div></div></div>';
  if (stats.length) html += '<div class="inspector-stats">' + stats.map(function(t){ return '<span class="inspector-stat mono">' + t + '</span>'; }).join('') + '</div>';
  html += '<div class="inspector-effect">' + card.effect + '</div>';
  return html;
}

// Decks are exchanged as a plain text file:
//   [Player 1]
//   Striker x6
//   Medic x4
//   ...
//   [Player 2]
//   ...
// Card names are matched case-insensitively (card keys work too). Lines starting with # are comments.
function decksToText(recipes){
  var lines = ['# Structure Siege decks', '# One card per line: <card name> x<copies>', ''];
  recipes.forEach(function(recipe, side){
    lines.push('[Player ' + (side + 1) + ']');
    Object.keys(CARD_DEFS).forEach(function(k){ if (recipe[k] > 0) lines.push(CARD_DEFS[k].name + ' x' + recipe[k]); });
    lines.push('');
  });
  return lines.join('\n');
}

// Returns { recipes, errors } — unknown names are reported, not silently dropped.
// defaultSide: which player cards before any [Player N] header belong to (omit to treat them as an error).
function parseDecksText(text, defaultSide){
  var byName = {};
  Object.keys(CARD_DEFS).forEach(function(k){ byName[k.toLowerCase()] = k; byName[CARD_DEFS[k].name.toLowerCase()] = k; });
  var recipes = [emptyRecipe(), emptyRecipe()];
  var errors = [], side = defaultSide == null ? -1 : defaultSide;
  text.split(/\r?\n/).forEach(function(raw, n){
    var line = raw.trim();
    if (!line || line.charAt(0) === '#') return;
    var m = line.match(/^\[\s*player\s*([12])\s*\]$/i);
    if (m){ side = parseInt(m[1], 10) - 1; return; }
    var cm = line.match(/^(.+?)\s*[x×:]\s*(\d+)$/i);
    if (!cm){ errors.push('Line ' + (n + 1) + ': could not read "' + raw + '"'); return; }
    var key = byName[cm[1].trim().toLowerCase()];
    if (!key){ errors.push('Line ' + (n + 1) + ': unknown card "' + cm[1].trim() + '"'); return; }
    if (side === -1){ errors.push('Line ' + (n + 1) + ': card listed before any [Player N] header'); return; }
    recipes[side][key] = Math.max(0, Math.min(MAX_COPIES, parseInt(cm[2], 10)));
  });
  return { recipes: recipes, errors: errors };
}

// A single named deck, as saved in decks/<name>.txt:
//   # Deck: Aggro Strikers
//   Striker x6
//   ...
function deckToText(recipe, name){
  var lines = ['# Deck: ' + name, '# One card per line: <card name> x<copies>', ''];
  Object.keys(CARD_DEFS).forEach(function(k){ if (recipe[k] > 0) lines.push(CARD_DEFS[k].name + ' x' + recipe[k]); });
  return lines.join('\n') + '\n';
}

// Returns { recipe, errors }. A two-player decks file is accepted too; its Player 1 deck is used.
function parseDeckText(text){
  var parsed = parseDecksText(text, 0);
  return { recipe: parsed.recipes[0], errors: parsed.errors };
}

// localStorage persistence, shared between the game (reads) and the deck builder (reads + writes).
function sanitizeRecipe(saved){
  var r = emptyRecipe();
  if (saved) Object.keys(r).forEach(function(k){
    if (typeof saved[k] === 'number') r[k] = Math.max(0, Math.min(MAX_COPIES, Math.round(saved[k])));
  });
  return r;
}
function loadDeckRecipes(){
  try {
    var raw = localStorage.getItem(DECK_STORAGE_KEY);
    if (!raw) return [defaultRecipe(), defaultRecipe()];
    var parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length !== 2) return [defaultRecipe(), defaultRecipe()];
    return [sanitizeRecipe(parsed[0]), sanitizeRecipe(parsed[1])];
  } catch (e){
    return [defaultRecipe(), defaultRecipe()];
  }
}
function saveDeckRecipes(recipes){
  try { localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(recipes)); } catch (e){}
}
