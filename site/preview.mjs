import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('./dist/', import.meta.url));
const configPath = new URL('./src/config.json', import.meta.url);
const { siteBaseUrl } = JSON.parse((await readFile(configPath, 'utf8')).replace(/^\uFEFF/, ''));
const base = new URL(siteBaseUrl).pathname.replace(/\/?$/, '/');
const port = Number(process.argv[2] ?? 8080);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.mp4': 'video/mp4',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};
const notFound = await readFile(join(dist, '404.html'));

createServer(async (request, response) => {
  const url = new URL(request.url, 'http://localhost');
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  if (base !== '/' && (url.pathname === '/' || url.pathname === base.slice(0, -1))) {
    response.writeHead(302, { Location: base }).end();
    return;
  }
  let path;
  try {
    path = decodeURIComponent(url.pathname);
  } catch {
    response.writeHead(400).end();
    return;
  }
  const parts = path.slice(base.length).split('/');
  if (!path.startsWith(base) || parts.some(part => part.startsWith('.') || /[\\:\u0000]/.test(part))) {
    response.writeHead(404, { 'Content-Type': types['.html'] }).end(request.method === 'HEAD' ? undefined : notFound);
    return;
  }
  const relative = parts.join('/') + (path.endsWith('/') ? 'index.html' : '');
  try {
    const data = await readFile(join(dist, relative));
    response.writeHead(200, { 'Content-Type': types[extname(relative)] ?? 'application/octet-stream' });
    response.end(request.method === 'HEAD' ? undefined : data);
  } catch (error) {
    if (error.code === 'EISDIR') {
      response.writeHead(302, { Location: url.pathname + '/' + url.search }).end();
      return;
    }
    response.writeHead(404, { 'Content-Type': types['.html'] }).end(request.method === 'HEAD' ? undefined : notFound);
  }
}).listen(port, '127.0.0.1', () => console.log('Preview at http://127.0.0.1:' + port + base));
