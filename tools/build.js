#!/usr/bin/env node
// Build youfailed.us into docs/ from content/legacy.json (the resurrected
// 2005-2025 WordPress archive) plus posts/*.md (the post-WordPress era:
// write markdown, run build, push).
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'docs');
const MEDIA_SRC = process.env.MEDIA_SRC || 'C:/Sites/move-wordpress/backups/youfailed-extract/blogs.dir/70/files';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// legacy titles arrive with entities already applied; decode before re-escaping
const unent = (s) => s.replace(/&#(\d+);/g, (m, n) => String.fromCharCode(n))
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#x([0-9a-f]+);/gi, (m, h) => String.fromCharCode(parseInt(h, 16)))
  .replace(/&(#8217|rsquo);/g, '’').replace(/&(#8216|lsquo);/g, '‘')
  .replace(/&(#8220|ldquo);/g, '“').replace(/&(#8221|rdquo);/g, '”')
  .replace(/&(#8230|hellip);/g, '…').replace(/&(#8211|ndash);/g, '–')
  .replace(/&(#8212|mdash);/g, '—');
const fmtDate = (d) => new Date(d.replace(' ', 'T')).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

// ---- legacy WordPress content normalization ----
function wpautop(html) {
  // Posts written before the block editor stored bare newlines.
  if (/<!-- wp:/.test(html)) return html.replace(/<!-- \/?wp:[^>]*-->/g, '');
  const blocks = html.split(/\n{2,}/);
  return blocks.map((b) => {
    const t = b.trim();
    if (!t) return '';
    if (/^<\/?(p|div|ul|ol|li|h[1-6]|blockquote|pre|table|figure|img|iframe|object|embed|hr|style|script)/i.test(t)) return t;
    return '<p>' + t.replace(/\n/g, '<br>\n') + '</p>';
  }).join('\n');
}

function normalizeLegacy(html) {
  let h = html;
  h = h.replace(/\[caption[^\]]*\]([\s\S]*?)\[\/caption\]/g, (m, inner) => {
    const img = (inner.match(/<img[^>]*>/) || [''])[0];
    const cap = inner.replace(/<img[^>]*>/, '').replace(/<\/?a[^>]*>/g, '').trim();
    return `<figure>${img}${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>`;
  });
  h = wpautop(h);
  h = h.replace(/https?:\/\/(?:www\.youfailed\.us|youfailed\.us|youfailedus\.wpsplit\.com)\/files\//g, '/files/');
  h = h.replace(/https?:\/\/(?:www\.youfailed\.us|youfailed\.us)\//g, '/');
  // WordPress made bare URLs clickable; keep that behavior for text nodes
  h = h.replace(/(^|[\s>(])(https?:\/\/[^\s<>"')]+)(?![^<]*<\/a>)/g, (m, pre, url) => `${pre}<a href="${url}">${url}</a>`);
  return h;
}

// ---- tiny markdown renderer for new posts ----
function md(src) {
  const lines = src.split(/\r?\n/);
  const out = [];
  let i = 0, inCode = false, codeBuf = [], listType = null;
  const closeList = () => { if (listType) { out.push(`</${listType}>`); listType = null; } };
  const inline = (s) => esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  while (i < lines.length) {
    const l = lines[i];
    if (l.startsWith('```')) {
      if (inCode) { out.push('<pre><code>' + esc(codeBuf.join('\n')) + '</code></pre>'); codeBuf = []; }
      inCode = !inCode; i++; continue;
    }
    if (inCode) { codeBuf.push(l); i++; continue; }
    const h = l.match(/^(#{1,4})\s+(.*)/);
    if (h) { closeList(); out.push(`<h${h[1].length + 1}>${inline(h[2])}</h${h[1].length + 1}>`); i++; continue; }
    const li = l.match(/^\s*([-*]|\d+\.)\s+(.*)/);
    if (li) {
      const want = /\d/.test(li[1]) ? 'ol' : 'ul';
      if (listType !== want) { closeList(); out.push(`<${want}>`); listType = want; }
      out.push(`<li>${inline(li[2])}</li>`); i++; continue;
    }
    if (l.startsWith('> ')) { closeList(); out.push(`<blockquote><p>${inline(l.slice(2))}</p></blockquote>`); i++; continue; }
    if (!l.trim()) { closeList(); i++; continue; }
    closeList();
    let para = [l];
    while (i + 1 < lines.length && lines[i + 1].trim() && !/^(#|```|[-*] |\d+\. |> )/.test(lines[i + 1])) para.push(lines[++i]);
    out.push(`<p>${inline(para.join(' '))}</p>`);
    i++;
  }
  closeList();
  return out.join('\n');
}

// ---- load content ----
const legacy = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/legacy.json'), 'utf8'));
for (const e of legacy) e.title = unent(e.title);
const posts = legacy.filter((e) => e.type === 'post').map((e) => ({ ...e, body: normalizeLegacy(e.html) }));
const about = legacy.find((e) => e.type === 'page' && e.slug === 'about');

for (const f of fs.existsSync(path.join(ROOT, 'posts')) ? fs.readdirSync(path.join(ROOT, 'posts')) : []) {
  if (!f.endsWith('.md')) continue;
  const raw = fs.readFileSync(path.join(ROOT, 'posts', f), 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) { console.warn('skipping (no front matter):', f); continue; }
  const meta = {};
  for (const line of m[1].split('\n')) { const kv = line.match(/^(\w+):\s*(.*)$/); if (kv) meta[kv[1]] = kv[2].trim(); }
  posts.push({
    slug: meta.slug || f.replace(/\.md$/, ''),
    title: meta.title || f, date: meta.date || new Date().toISOString().slice(0, 19).replace('T', ' '),
    author: meta.author || 'Sheldon', body: md(m[2]),
  });
}
posts.sort((a, b) => (a.date < b.date ? 1 : -1));

// ---- templates ----
const STYLE = `
:root { --bg:#fbfaf8; --ink:#1d1d1f; --soft:#6d6d70; --accent:#c22f2f; --rule:#e7e4df; --code:#f1efe9; color-scheme: light; }
@media (prefers-color-scheme: dark) { :root { --bg:#161616; --ink:#e8e6e3; --soft:#9a9893; --accent:#e05252; --rule:#2c2c2c; --code:#222; color-scheme: dark; } }
* { box-sizing: border-box; }
body { margin:0; background:var(--bg); color:var(--ink);
  font: 17px/1.65 Charter, 'Bitstream Charter', Cambria, Georgia, serif; }
.wrap { max-width: 44rem; margin: 0 auto; padding: 0 20px 4rem; }
header.site { padding: 3.2rem 0 0; }
.mast { font: 800 clamp(2.4rem,7vw,3.4rem)/1 -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif;
  letter-spacing: -0.03em; margin:0; }
.mast a { color: var(--ink); text-decoration: none; }
.mast .dot { color: var(--accent); }
.tag { color: var(--soft); margin: .6rem 0 0; font-size: .95rem; }
nav.site { margin: 1.6rem 0 0; padding-bottom: 1rem; border-bottom: 1px solid var(--rule);
  font-family: -apple-system,'Segoe UI',Helvetica,Arial,sans-serif; font-size: .85rem; }
nav.site a { color: var(--soft); text-decoration: none; text-transform: uppercase; letter-spacing: .12em; margin-right: 1.4rem; }
nav.site a:hover, nav.site a[aria-current] { color: var(--accent); }
h2.year { font: 700 1rem -apple-system,'Segoe UI',Helvetica,Arial,sans-serif; letter-spacing:.14em;
  color: var(--accent); margin: 2.6rem 0 .4rem; }
ul.posts { list-style:none; margin:0; padding:0; }
ul.posts li { display:flex; gap:1rem; padding:.42rem 0; border-bottom:1px dotted var(--rule); align-items: baseline; }
ul.posts time { color:var(--soft); font-size:.85rem; min-width:4.6rem; font-family:-apple-system,'Segoe UI',sans-serif; }
ul.posts a { color:var(--ink); text-decoration:none; }
ul.posts a:hover { color:var(--accent); }
article h1 { font-size:2rem; line-height:1.2; letter-spacing:-0.015em; margin:2.4rem 0 .3rem; }
.meta { color:var(--soft); font-size:.9rem; margin:0 0 2rem; font-family:-apple-system,'Segoe UI',sans-serif; }
article img { max-width:100%; height:auto; border-radius:4px; }
article figure { margin:1.6rem 0; }
article figcaption { color:var(--soft); font-size:.85rem; margin-top:.4rem; }
article a { color:var(--accent); text-decoration-thickness:1px; text-underline-offset:3px; }
article pre { background:var(--code); padding:1rem 1.2rem; overflow-x:auto; border-radius:6px; font-size:.85rem; line-height:1.5; }
article code { font-family: ui-monospace, 'Cascadia Code', Consolas, monospace; font-size:.9em; background:var(--code); padding:.1em .35em; border-radius:3px; }
article pre code { background:none; padding:0; }
article blockquote { margin:1.4rem 0; padding:.2rem 0 .2rem 1.2rem; border-left:3px solid var(--accent); color:var(--soft); }
.pager { display:flex; justify-content:space-between; gap:2rem; margin-top:3.4rem; padding-top:1.2rem; border-top:1px solid var(--rule);
  font-family:-apple-system,'Segoe UI',sans-serif; font-size:.9rem; }
.pager a { color:var(--soft); text-decoration:none; max-width:46%; }
.pager a:hover { color:var(--accent); }
footer.site { margin-top:4rem; padding-top:1.2rem; border-top:1px solid var(--rule);
  color:var(--soft); font-size:.85rem; font-family:-apple-system,'Segoe UI',sans-serif; }
footer.site a { color:var(--soft); }
::selection { background:var(--accent); color:#fff; }
`;

const page = ({ title, desc, path: p, body, current }) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="https://www.youfailed.us${p}">
<link rel="alternate" type="application/rss+xml" title="you failed." href="/feed.xml">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<style>${STYLE}</style>
</head>
<body>
<div class="wrap">
<header class="site">
  <h1 class="mast"><a href="/">you failed<span class="dot">.us</span></a></h1>
  <p class="tag">Today is the yesterday that we will regret tomorrow.</p>
  <nav class="site">
    <a href="/" ${current === 'home' ? 'aria-current="page"' : ''}>Posts</a>
    <a href="/about/" ${current === 'about' ? 'aria-current="page"' : ''}>About</a>
    <a href="/feed.xml">RSS</a>
  </nav>
</header>
${body}
<footer class="site">
  <p>&copy; 2005&ndash;${new Date().getFullYear()} Jim deVos &amp; Sheldon McGee &middot; survived WordPress, now plain HTML</p>
</footer>
</div>
</body>
</html>
`;

// ---- render ----
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

// index: posts grouped by year
let listHtml = '';
let year = '';
for (const p of posts) {
  const y = p.date.slice(0, 4);
  if (y !== year) {
    if (year) listHtml += '</ul>';
    listHtml += `<h2 class="year">${y}</h2><ul class="posts">`;
    year = y;
  }
  const d = new Date(p.date.replace(' ', 'T'));
  const short = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  listHtml += `<li><time datetime="${p.date.slice(0, 10)}">${short}</time><a href="/${p.slug}/">${esc(p.title)}</a></li>`;
}
listHtml += '</ul>';
fs.writeFileSync(path.join(OUT, 'index.html'), page({
  title: 'you failed.us', desc: 'Jim & Sheldon write when something goes wrong. Programming, games, engineering management, and complaints. Since 2005.',
  path: '/', body: listHtml, current: 'home',
}));

// posts
posts.forEach((p, idx) => {
  const dir = path.join(OUT, p.slug);
  fs.mkdirSync(dir, { recursive: true });
  const newer = posts[idx - 1], older = posts[idx + 1];
  const pager = `<div class="pager">
    <a href="${older ? `/${older.slug}/` : '/'}">${older ? '&larr; ' + esc(older.title) : '&larr; All posts'}</a>
    ${newer ? `<a href="/${newer.slug}/" style="text-align:right">${esc(newer.title)} &rarr;</a>` : ''}
  </div>`;
  const body = `<article>
  <h1>${esc(p.title)}</h1>
  <p class="meta">${fmtDate(p.date)} &middot; ${p.author}</p>
  ${p.body}
  ${pager}
  </article>`;
  const firstPara = (p.body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()).slice(0, 150);
  fs.writeFileSync(path.join(dir, 'index.html'), page({ title: p.title + ' — you failed.us', desc: firstPara, path: `/${p.slug}/`, body }));
});

// about
if (about) {
  fs.mkdirSync(path.join(OUT, 'about'), { recursive: true });
  fs.writeFileSync(path.join(OUT, 'about/index.html'), page({
    title: 'About — you failed.us', desc: 'What this site is and why it exists.',
    path: '/about/', body: `<article><h1>About</h1>${normalizeLegacy(about.html).replace(/<(\/?)h4>/g, '<$1h2>')}</article>`, current: 'about',
  }));
}

// 404
fs.writeFileSync(path.join(OUT, '404.html'), page({
  title: 'Not found — you failed.us', desc: 'This page does not exist.', path: '/404',
  body: '<article><h1>404. You failed.</h1><p>Well, one of us did. That page isn&rsquo;t here.</p><p><a href="/">Browse every complaint since 2005 &rarr;</a></p></article>',
}));

// favicon: red period on ink square
fs.writeFileSync(path.join(OUT, 'favicon.svg'),
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#1d1d1f"/><text x="6" y="26" font-family="Helvetica,Arial,sans-serif" font-weight="800" font-size="26" fill="#e05252">F</text><circle cx="25" cy="22.5" r="5" fill="#e05252"/></svg>');

// RSS (newest 20)
const rssItems = posts.slice(0, 20).map((p) => `<item>
<title>${esc(p.title)}</title>
<link>https://www.youfailed.us/${p.slug}/</link>
<guid>https://www.youfailed.us/${p.slug}/</guid>
<pubDate>${new Date(p.date.replace(' ', 'T')).toUTCString()}</pubDate>
<description>${esc(p.body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300))}</description>
</item>`).join('\n');
fs.writeFileSync(path.join(OUT, 'feed.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>you failed.us</title>
<link>https://www.youfailed.us/</link>
<description>Jim &amp; Sheldon write when something goes wrong.</description>
${rssItems}
</channel></rss>`);

// media: copy only files the rendered site references
const refs = new Set();
for (const p of posts) for (const m of p.body.matchAll(/\/files\/([^"') ]+)/g)) refs.add(decodeURIComponent(m[1]));
if (about) for (const m of normalizeLegacy(about.html).matchAll(/\/files\/([^"') ]+)/g)) refs.add(decodeURIComponent(m[1]));
let copied = 0, missing = [];
for (const r of refs) {
  const src = path.join(MEDIA_SRC, r);
  const dst = path.join(OUT, 'files', r);
  if (fs.existsSync(src)) { fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.copyFileSync(src, dst); copied++; }
  else missing.push(r);
}
// media/ holds images for new markdown posts; ships to /files/
const MEDIA_NEW = path.join(ROOT, 'media');
if (fs.existsSync(MEDIA_NEW)) {
  for (const f of fs.readdirSync(MEDIA_NEW)) {
    fs.mkdirSync(path.join(OUT, 'files'), { recursive: true });
    fs.copyFileSync(path.join(MEDIA_NEW, f), path.join(OUT, 'files', f));
  }
}
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
fs.writeFileSync(path.join(OUT, 'CNAME'), 'www.youfailed.us' + String.fromCharCode(10)); // Pages drops the domain if this file ever disappears
console.log(`built ${posts.length} posts + about + feed; media copied: ${copied}, missing: ${missing.length}`);
if (missing.length) console.log('missing:', missing.slice(0, 10).join('\n  '));
