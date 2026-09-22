// Local dev server for fd6: serves the game and lets the deck builder save decks into decks/.
//   node server.js        then open http://localhost:8000/decks.html
// No dependencies. Saved decks are plain .txt files; decks/index.json lists them so the builder's
// "Load preset" dropdown also works when the site is hosted statically (without this server).
var http = require('http');
var fs = require('fs');
var path = require('path');

var PORT = process.env.PORT || 8000;
var ROOT = __dirname;
var DECKS_DIR = path.join(ROOT, 'decks');
var MAX_BODY = 64 * 1024;

var TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon'
};

function send(res, status, body, type){
  res.writeHead(status, { 'Content-Type': type || 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
}

// "Aggro Strikers!" -> "aggro-strikers"
function slugify(name){
  return String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
}

function rebuildIndex(){
  var files = fs.readdirSync(DECKS_DIR).filter(function(f){ return f.endsWith('.txt'); }).sort();
  var list = files.map(function(f){
    var firstLine = fs.readFileSync(path.join(DECKS_DIR, f), 'utf8').split(/\r?\n/)[0] || '';
    var m = firstLine.match(/^#\s*Deck:\s*(.+)$/);
    return { file: f, name: m ? m[1].trim() : f.replace(/\.txt$/, '') };
  });
  fs.writeFileSync(path.join(DECKS_DIR, 'index.json'), JSON.stringify(list, null, 2) + '\n');
  return list;
}

function saveDeck(req, res){
  var body = '';
  req.on('data', function(chunk){
    body += chunk;
    if (body.length > MAX_BODY){ send(res, 413, { error: 'Deck is too large.' }); req.destroy(); }
  });
  req.on('end', function(){
    var data;
    try { data = JSON.parse(body); } catch (e){ return send(res, 400, { error: 'Invalid JSON.' }); }
    var slug = slugify(data.name || '');
    if (!slug) return send(res, 400, { error: 'Give the deck a name with at least one letter or number.' });
    if (typeof data.text !== 'string' || !data.text.trim()) return send(res, 400, { error: 'Deck is empty.' });
    var file = slug + '.txt';
    var target = path.join(DECKS_DIR, file);
    fs.mkdirSync(DECKS_DIR, { recursive: true });
    if (fs.existsSync(target) && !data.overwrite) return send(res, 409, { error: 'exists', file: file });
    fs.writeFileSync(target, data.text.replace(/\r\n/g, '\n'));
    rebuildIndex();
    console.log('saved decks/' + file);
    send(res, 200, { file: file });
  });
}

function serveStatic(req, res){
  var urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  var filePath = path.join(ROOT, path.normalize(urlPath));
  if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) return send(res, 403, 'Forbidden', 'text/plain');
  fs.readFile(filePath, function(err, data){
    if (err) return send(res, 404, 'Not found', 'text/plain');
    send(res, 200, data, TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream');
  });
}

http.createServer(function(req, res){
  if (req.url === '/api/status') return send(res, 200, { ok: true });
  if (req.url === '/api/decks' && req.method === 'POST') return saveDeck(req, res);
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, { error: 'Method not allowed.' });
  serveStatic(req, res);
}).listen(PORT, function(){
  console.log('fd6 running at http://localhost:' + PORT + '/  (deck builder: /decks.html)');
});
