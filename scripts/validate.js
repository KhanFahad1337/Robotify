#!/usr/bin/env node
/* Static site validator — zero dependencies. Run: node scripts/validate.js */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ORIGIN = 'https://robotify.pk';
const errors = [];
const warnings = [];
const err = (file, msg) => errors.push(file + ': ' + msg);
const warn = (file, msg) => warnings.push(file + ': ' + msg);

// ---------- collect pages (recursive, skip .git) ----------
const SKIP = new Set(['.git', '.github', 'node_modules', 'scripts', 'projects', 'marketing']);
const htmlFiles = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (dir === ROOT && SKIP.has(e.name)) continue;
    if (e.isDirectory()) walk(path.join(dir, e.name));
    else if (e.name.endsWith('.html')) htmlFiles.push(path.relative(ROOT, path.join(dir, e.name)).replace(/\\/g, '/'));
  }
})(ROOT);
const targets = new Set(htmlFiles);
const read = rel => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const stripComments = s => s.replace(/<!--[\s\S]*?-->/g, '');

const pages = {};
for (const f of htmlFiles) pages[f] = stripComments(read(f));

// canonical URL for a page (dir indexes collapse to trailing slash)
const canonPath = rel => {
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -'index.html'.length);
  return '/' + rel;
};

// ---------- 1. JSON-LD must parse ----------
for (const [f, html] of Object.entries(pages)) {
  const blocks = html.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g) || [];
  for (const b of blocks) {
    const json = b.replace(/^<script type="application\/ld\+json">/, '').replace(/<\/script>$/, '');
    try { JSON.parse(json); } catch (e) { err(f, 'JSON-LD parse error: ' + e.message); }
  }
  if (!blocks.length && f !== '404.html') warn(f, 'no JSON-LD');
}

// ---------- 2. canonical ----------
for (const [f, html] of Object.entries(pages)) {
  const m = html.match(/<link rel="canonical" href="([^"]+)"/);
  if (f === '404.html') { if (m) err(f, '404 must not have canonical'); continue; }
  const want = ORIGIN + canonPath(f);
  if (!m) err(f, 'missing canonical');
  else if (m[1] !== want) err(f, 'canonical mismatch: ' + m[1] + ' (want ' + want + ')');
}

// ---------- 3. internal links resolve (incl. anchors) ----------
const anchorOf = html => {
  const ids = new Set();
  const re = /(?:id|name)="([^"]+)"/g;
  let m; while ((m = re.exec(html))) ids.add(m[1]);
  return ids;
};
const anchorCache = {};
const anchorsFor = rel => (anchorCache[rel] = anchorCache[rel] || (targets.has(rel) ? anchorOf(pages[rel]) : null));

for (const [f, html] of Object.entries(pages)) {
  const pageDir = path.posix.dirname(f) === '.' ? '' : path.posix.dirname(f) + '/';
  const re = /(?:href|src)="([^"]+)"/g;
  let m;
  while ((m = re.exec(html))) {
    let u = m[1].trim();
    if (/^(https?:)?\/\//.test(u) || /^(mailto:|tel:|data:|javascript:)/.test(u)) continue;
    if (u.startsWith(ORIGIN)) u = u.slice(ORIGIN.length);
    let file = null, frag = null;
    if (u === '' || u === '#') continue;
    if (u.startsWith('#')) { file = f; frag = u.slice(1); }
    else {
      const hashIdx = u.indexOf('#');
      if (hashIdx >= 0) { frag = u.slice(hashIdx + 1) || null; u = u.slice(0, hashIdx); }
      if (u.startsWith('/')) u = u.slice(1);
      else u = path.posix.normalize(pageDir + u);
      if (u.startsWith('..')) { err(f, 'link escapes root: ' + m[1]); continue; }
      file = u === '' || u === './' ? (f.endsWith('index.html') ? f : 'index.html') : u;
      if (file.endsWith('/')) file += 'index.html';
    }
    if (file === null) continue;
    if (/\.(css|js|png|jpg|jpeg|svg|ico|webp|gif|pdf|txt|xml|woff2?)$/i.test(file)) {
      if (!fs.existsSync(path.join(ROOT, file))) err(f, 'missing asset: ' + file);
      continue;
    }
    if (!targets.has(file)) { err(f, 'broken link: ' + m[1]); continue; }
    if (frag) {
      const ids = anchorsFor(file);
      if (ids && !ids.has(frag)) err(f, 'missing anchor: ' + m[1]);
    }
  }
}

// ---------- 4. sitemap ----------
const sm = read('sitemap.xml');
if (!sm.includes('<?xml')) err('sitemap.xml', 'missing xml declaration');
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x => x[1]);
const seen = new Set();
for (const loc of locs) {
  if (seen.has(loc)) err('sitemap.xml', 'duplicate loc: ' + loc);
  seen.add(loc);
  if (!loc.startsWith(ORIGIN)) { err('sitemap.xml', 'loc off-domain: ' + loc); continue; }
  const rest = loc.slice(ORIGIN.length);
  let file = rest === '/' ? 'index.html' : rest.replace(/^\//, '');
  if (file.endsWith('/')) file += 'index.html';
  if (!targets.has(file)) err('sitemap.xml', 'loc points to missing page: ' + loc);
}
const dates = [...sm.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map(x => x[1]);
for (const d of dates) if (!/^\d{4}-\d{2}-\d{2}$/.test(d) || isNaN(Date.parse(d))) err('sitemap.xml', 'bad lastmod: ' + d);
for (const f of htmlFiles) {
  if (f === '404.html') continue;
  const want = ORIGIN + canonPath(f);
  if (!seen.has(want)) err('sitemap.xml', 'page missing from sitemap: ' + want);
}
const robots = read('robots.txt');
if (!/Sitemap:\s*https:\/\/robotify\.pk\/sitemap\.xml/.test(robots)) err('robots.txt', 'missing Sitemap reference');
if (!/User-agent: \*/.test(robots)) err('robots.txt', 'missing User-agent');

// ---------- 5. OG image files exist ----------
for (const [f, html] of Object.entries(pages)) {
  for (const m of html.matchAll(/<meta property="og:image" content="([^"]+)"/g)) {
    const u = m[1];
    if (u.startsWith(ORIGIN + '/')) {
      const file = u.slice(ORIGIN.length + 1);
      if (!fs.existsSync(path.join(ROOT, file))) err(f, 'og:image missing file: ' + file);
    }
  }
}

// ---------- 6. basics: lang, viewport, title, single h1 ----------
for (const [f, html] of Object.entries(pages)) {
  if (!/<html lang="en"/.test(html)) err(f, 'missing <html lang="en">');
  if (!/<meta name="viewport"/.test(html)) err(f, 'missing viewport');
  if (!/<title>[^<]+<\/title>/.test(html)) err(f, 'missing title');
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) err(f, 'h1 count = ' + h1 + ' (want 1)');
}

// ---------- report ----------
for (const w of warnings) console.log('WARN  ' + w);
if (errors.length) {
  for (const e of errors) console.log('ERROR ' + e);
  console.log('\nFAILED — ' + errors.length + ' error(s), ' + warnings.length + ' warning(s)');
  process.exit(1);
}
console.log('OK — ' + htmlFiles.length + ' pages validated, 0 errors, ' + warnings.length + ' warning(s)');
