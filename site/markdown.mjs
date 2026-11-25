const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => entities[character]);
}

function safeLink(url, root, published) {
  const guide = url.match(/^\/guides\/([a-z\d-]+)\/?(?:[?#].*)?$/);
  if (guide && published && !published.has(guide[1])) return null;
  if (url.startsWith('//') || url.includes('\\')) return null;
  if (url.startsWith('/')) return root + url.slice(1);
  if (/^[a-z][a-z\d+.-]*:/i.test(url) && !/^https?:\/\//i.test(url)) return null;
  return url;
}

function inline(text, root, published) {
  const tokens = /`([^`]+)`|(!?)\[([^\]\n]+)\]\(([^\s)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let html = '';
  let cursor = 0;
  for (const match of text.matchAll(tokens)) {
    const [token, code, image, label, url, bold, emphasis] = match;
    html += escapeHtml(text.slice(cursor, match.index));
    if (code) {
      html += '<code>' + escapeHtml(code) + '</code>';
    } else if (url) {
      const href = safeLink(url, root, published);
      if (!href) html += escapeHtml(label);
      else if (image) html += '<img loading="lazy" src="' + escapeHtml(href) + '" alt="' + escapeHtml(label) + '">';
      else html += '<a href="' + escapeHtml(href) + '">' + inline(label, root, published) + '</a>';
    } else {
      const tag = bold ? 'strong' : 'em';
      html += '<' + tag + '>' + escapeHtml(bold || emphasis) + '</' + tag + '>';
    }
    cursor = match.index + token.length;
  }
  return html + escapeHtml(text.slice(cursor));
}

export function frontMatter(source) {
  const match = source.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return { data: {}, body: source };
  const data = Object.create(null);
  let faqItem;
  const unquote = raw => {
    if (raw.startsWith('"') && raw.endsWith('"')) return raw.slice(1, -1).replace(/\\(["\\])/g, '$1');
    if (raw.startsWith("'") && raw.endsWith("'")) return raw.slice(1, -1).replaceAll("''", "'");
    return raw;
  };
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    const question = line.match(/^\s+- q:\s*(.+)$/);
    const answer = line.match(/^\s+a:\s*(.+)$/);
    if (Array.isArray(data.faq) && question) {
      faqItem = [unquote(question[1])];
      data.faq.push(faqItem);
      continue;
    }
    if (faqItem && answer && faqItem.length === 1) {
      faqItem.push(unquote(answer[1]));
      continue;
    }
    const field = line.match(/^([a-zA-Z][\w-]*):\s*(.*?)\s*$/);
    if (!field) throw new Error('Unsupported front-matter field: ' + line);
    const [, key, raw] = field;
    data[key] = key === 'faq' && raw === '' ? [] : unquote(raw);
    faqItem = null;
  }
  if (data.faq && (!Array.isArray(data.faq) || data.faq.some(item => item.length !== 2))) throw new Error('FAQ entries need a question and answer.');
  return { data, body: source.slice(match[0].length) };
}

export function markdown(source, { root, minimumHeading = 2, headingId = '', published }) {
  const lines = source.replace(/^\uFEFF/, '').replace(/<!--[\s\S]*?-->/g, '').split(/\r?\n/);
  const headings = [];
  const ids = new Set();
  const html = [];
  let paragraph = [];
  let list = '';
  let code = null;

  function flush() {
    if (paragraph.length) html.push('<p>' + inline(paragraph.join(' '), root, published) + '</p>');
    paragraph = [];
    if (list) html.push('</' + list + '>');
    list = '';
  }

  const cells = line => line.trim().replace(/^\||\|$/g, '').split('|').map(cell => inline(cell.trim(), root, published));
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (code === null && line.startsWith('|') && /^\|\s*:?-{3}/.test(lines[index + 1] ?? '')) {
      flush();
      const row = (values, tag) => '<tr>' + values.map(value => '<' + tag + '>' + value + '</' + tag + '>').join('') + '</tr>';
      html.push('<div class="table-scroll"><table><thead>' + row(cells(line), 'th') + '</thead><tbody>');
      index += 2;
      while (lines[index]?.startsWith('|')) {
        html.push(row(cells(lines[index]), 'td'));
        index += 1;
      }
      html.push('</tbody></table></div>');
      index -= 1;
      continue;
    }
    if (/^\s*```/.test(line)) {
      if (code === null) {
        flush();
        code = [];
      } else {
        html.push('<pre><code>' + escapeHtml(code.join('\n')) + '</code></pre>');
        code = null;
      }
      continue;
    }
    if (code !== null) {
      code.push(line);
      continue;
    }
    const heading = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    const item = /^\s*(?:([-*+])|(\d+)\.)\s+(.+)$/.exec(line);
    const quote = /^>\s?(.*)$/.exec(line);
    if (heading) {
      flush();
      const level = Math.max(minimumHeading, heading[1].length);
      const label = heading[2].replace(/[*`]/g, '');
      const base = (level === 1 && headingId) || label.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'section';
      let id = base;
      for (let counter = 2; ids.has(id); counter += 1) id = base + '-' + counter;
      ids.add(id);
      headings.push({ id, label, level });
      html.push('<h' + level + ' id="' + escapeHtml(id) + '">' + inline(heading[2], root, published) + '</h' + level + '>');
    } else if (item) {
      const nextList = item[1] ? 'ul' : 'ol';
      if (list !== nextList) {
        flush();
        html.push('<' + nextList + '>');
        list = nextList;
      }
      html.push('<li>' + inline(item[3], root, published) + '</li>');
    } else if (quote) {
      flush();
      html.push('<blockquote><p>' + inline(quote[1], root, published) + '</p></blockquote>');
    } else if (!line.trim()) {
      flush();
    } else {
      if (list) flush();
      paragraph.push(line.trim());
    }
  }
  flush();
  if (code !== null) html.push('<pre><code>' + escapeHtml(code.join('\n')) + '</code></pre>');
  return { html: html.join('\n'), headings };
}

