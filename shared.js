// Shared card data + deck helpers for fd6 (index.html game + decks.html builder).
var CARD_DEFS = {
  attacker: { key:'attacker', type:'unit', unitType:'attacker', name:'Striker', icon:'⚔', ad:10, ap:0,  hp:20, armor:20, mr:10, as:0.5,
    effect:'Auto-attacks the nearest enemy unit, dealing its AD as physical damage.' },
  healer:   { key:'healer',   type:'unit', unitType:'healer',   name:'Medic',   icon:'✚', ad:0,  ap:10, hp:15, armor:10, mr:25, as:0.5,
    effect:'Each action, heals whichever of your units is most wounded (by %) for its AP.' },
  mirror:   { key:'mirror',   type:'trap', manualArm:true,      name:'Mirror Wall', icon:'◈',
    effect:'Dormant until you activate it during the battle. Once active, negates the next enemy attack on your side and destroys the unit that made it.' },

  gravedigger:  { key:'gravedigger',  type:'unit', unitType:'special', name:'Gravedigger',  icon:'Ω', ad:0,  ap:4,  hp:16, armor:10, mr:30, as:0, startCharges:1, usesCharges:true, activatable:true,
    effect:'1 charge. Activate it during the battle: fires once for every card in your graveyard, each dealing its AP as magic damage.' },
  undertaker:   { key:'undertaker',   type:'unit', unitType:'special', name:'Undertaker',   icon:'⛧', ad:0,  ap:0,  hp:14, armor:15, mr:25, as:0, usesCharges:true, activatable:true, activateCost:2,
    effect:'Gains 1 charge whenever one of your units dies. Activate whenever you like: spend 2 charges to return a unit card from your graveyard to hand.' },
  predator:     { key:'predator',     type:'unit', unitType:'attacker', name:'Predator',    icon:'♦', ad:16, ap:0,  hp:18, armor:15, mr:10, as:0.5,
    effect:'Hard-hitting attacker. When it dies, its death throes hit every other unit on your side for 5 true damage.' },
  extortionist: { key:'extortionist', type:'unit', unitType:'passive', name:'Extortionist', icon:'¤', ad:0,  ap:0,  hp:14, armor:15, mr:15, as:0,
    effect:'Whenever the opponent activates a trap, continuous, or special ability, choose one of your cards to gain 1 charge.' },
  bodyguard:    { key:'bodyguard',    type:'unit', unitType:'passive', name:'Bodyguard',    icon:'⛨', ad:0,  ap:0,  hp:22, armor:50, mr:20, as:0,
    effect:'Every attack aimed at another of your units is redirected onto Bodyguard instead, for as long as it lives.' },
  scavenger:    { key:'scavenger',    type:'unit', unitType:'attacker', name:'Scavenger',   icon:'↻', ad:5,  ap:0,  hp:15, armor:15, mr:15, as:0.5,
    effect:'Auto-attacks for its AD as physical damage. Whenever any unit dies (either side), may take its unclaimed equip.' },
  disarmer:     { key:'disarmer',     type:'unit', unitType:'attacker', name:'Disarmer',    icon:'✂', ad:8,  ap:0,  hp:14, armor:15, mr:15, as:0.5,
    effect:'Auto-attacks for its AD as physical damage. If the target is wearing an equip, destroys that equip instead of dealing damage.' },
  parasite:     { key:'parasite',     type:'unit', unitType:'special', name:'Parasite',     icon:'☣', ad:0,  ap:0,  hp:8,  armor:5,  mr:5,  as:0.5, usesCharges:true,
    effect:'Choose one of your other units as its host when placed. Mirrors every charge the host gains from then on.' },
  martyr:       { key:'martyr',       type:'unit', unitType:'special', name:'Martyr',      icon:'✟', ad:0,  ap:0,  hp:12, armor:10, mr:30, as:0, startCharges:1, usesCharges:true, activatable:true,
    effect:'1 charge. Activate it during the battle: give a target unit 3 charges, then Martyr destroys itself. If it is killed instead, it still passes 3 charges on.' },
  loadedgun:    { key:'loadedgun',    type:'unit', unitType:'special', name:'Loaded Gun',   icon:'☍', ad:0,  ap:2,  hp:10, armor:10, mr:10, as:0, startCharges:3, usesCharges:true, activatable:true,
    effect:'3 charges. Fire it yourself at any point during the battle: spends 1 charge to deal its AP as magic damage. Destroys itself at 0 charges.' },
  bulwark:      { key:'bulwark',      type:'unit', unitType:'passive', name:'Bulwark',      icon:'⛊', ad:0,  ap:0,  hp:16, armor:40, mr:40, as:0,
    effect:'When the battle begins, if Bulwark is the only unit on your side, it doubles its HP and taunts — every enemy attack must target it while it lives.' },
  pallbearer:   { key:'pallbearer',   type:'unit', unitType:'attacker', name:'Pallbearer',  icon:'⛓', ad:5,  ap:0,  hp:16, armor:20, mr:15, as:0.5,
    effect:'Auto-attacks for its AD as physical damage — and every Grave Token in your graveyard cuts 10% off the time between its attacks, to a floor of 5 ticks.' },
  mimic:        { key:'mimic',        type:'unit', unitType:'special', name:'Mimic',        icon:'❖', ad:0,  ap:0,  hp:12, armor:15, mr:15, as:0.5, startCharges:1, usesCharges:true,
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
    effect:"Equip. Equipped unit gains +1 AD for every unit you've summoned this game." },
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

  ossuary:  { key:'ossuary',  type:'continuous', name:'Ossuary', icon:'⌂',
    effect:'Continuous. Choose a unit. Activate it during the battle: remove a Grave Token from your graveyard to give the target +3 HP.' },
  vault:    { key:'vault',    type:'continuous', name:'Vault',   icon:'▥',
    effect:'Continuous. Holds up to 5 charges. When one of your units dies its charges move here instead of being lost, and your traps may spend them as if they were on a unit.' },
  blackbox: { key:'blackbox', type:'continuous', name:'Black Box', icon:'▣',
    effect:'Continuous. Gains a charge whenever one of your cards dies. At 3 charges, replays your last attack or heal.' }
};

// League-style unit stats:
//   hp     health
//   ad     attack damage — auto-attacks deal this as physical damage
//   ap     ability power — scales heals and abilities, which deal magic damage
//   armor  reduces physical damage, mr (magic resist) reduces magic damage: taken = dmg × 100 / (100 + resist)
//   as     attack speed — actions per second, one second being TICKS_PER_SECOND ticks (0 = never acts on its own)
// The tick scheduler still works in cooldowns, so each unit's cooldown is derived from its attack speed.
var TICKS_PER_SECOND = 10;
Object.keys(CARD_DEFS).forEach(function(k){
  var c = CARD_DEFS[k];
  if (c.type === 'unit') c.cooldown = c.as > 0 ? Math.round(TICKS_PER_SECOND / c.as) : Infinity;
});

// Tokens are created during play, never drawn — kept out of CARD_DEFS so they can't be put in a deck.
var TOKEN_DEFS = {
  gravetoken: { key:'gravetoken', type:'token', name:'Grave Token', icon:'◌',
    effect:'Token. Does nothing on its own, but counts as a card in the graveyard.' }
};

var DECK_RECIPE = [
  ['attacker',1], ['healer',1], ['mirror',1],
  ['gravedigger',1], ['undertaker',1], ['predator',1], ['extortionist',1], ['bodyguard',1],
  ['scavenger',1], ['disarmer',1], ['parasite',1], ['martyr',1], ['loadedgun',1], ['mimic',1],
  ['bulwark',1], ['pallbearer',1],
  ['donation',1], ['liquidator',1], ['mutualdestruction',1], ['standoff',1], ['repossess',1],
  ['lastwill',1], ['hijack',1], ['cannibalize',1],
  ['deathless',1], ['veteranstandard',1], ['battery',1], ['deadmanswitch',1], ['inheritance',1],
  ['conduit',1], ['gravestone',1],
  ['blackbox',1], ['ossuary',1], ['vault',1]
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
  if (card.unitType === 'attacker') return ['AD ' + card.ad, 'HP ' + card.hp];
  if (card.unitType === 'healer') return ['AP ' + card.ap, 'HP ' + card.hp];
  if (card.unitType === 'passive') return ['PASSIVE', 'HP ' + card.hp];
  return ['SPECIAL', 'HP ' + card.hp];
}

// The full stat block, e.g. ['HP 20', 'AD 10', 'AP 0', 'ARM 20', 'MR 10', 'AS 0.50'].
function unitStatList(card){
  if (card.type !== 'unit') return [];
  return ['HP ' + card.hp, 'AD ' + card.ad, 'AP ' + card.ap, 'ARM ' + card.armor, 'MR ' + card.mr,
          'AS ' + (card.as > 0 ? card.as.toFixed(2) : '—')];
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
  var stats = unitStatList(card);
  if (card.startCharges != null) stats.push('Starts with ' + card.startCharges + ' charge' + (card.startCharges === 1 ? '' : 's'));
  else if (card.usesCharges) stats.push('Uses charges');
  if (isFinite(card.cooldown) && card.type === 'unit') stats.push('Acts every ' + card.cooldown + ' ticks');
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
  var lines = ['# fd6 decks', '# One card per line: <card name> x<copies>', ''];
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
