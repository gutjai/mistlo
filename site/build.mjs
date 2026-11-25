import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { escapeHtml as h, frontMatter, markdown } from './markdown.mjs';

const site = dirname(fileURLToPath(import.meta.url));
const src = join(site, 'src');
const dist = join(site, 'dist');
const content = join(site, '..', 'content');
const read = async file => (await readFile(file, 'utf8')).replace(/^\uFEFF/, '');
async function optional(file) {
  try {
    return await read(file);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return null;
  }
}

const config = JSON.parse(await read(join(src, 'config.json')));
const { productName, tagline, ownerName, goatCounterCode, indexNowKey } = config;
const brandName = config.brandName || productName;
const base = new URL(config.siteBaseUrl);
if (!['http:', 'https:'].includes(base.protocol) || base.search || base.hash || base.username || base.password) {
  throw new Error('siteBaseUrl must be an HTTP(S) origin with an optional project path.');
}
if (!base.pathname.endsWith('/')) base.pathname += '/';
const root = base.pathname;
const abs = route => new URL(route.replace(/^\//, ''), base).href;
const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: config.currency, maximumFractionDigits: Number.isInteger(config.price) ? 0 : 2 }).format(config.price);
const contact = config.ownerContactUrl;
if (contact && !/^https?:\/\//i.test(contact)) throw new Error('ownerContactUrl must be a public HTTP(S) URL.');
if (goatCounterCode && !/^[a-z\d][a-z\d-]*$/i.test(goatCounterCode)) throw new Error('Use only the GoatCounter site code.');
if (indexNowKey && !/^[a-z\d-]{8,128}$/i.test(indexNowKey)) throw new Error('Invalid IndexNow key.');

const disclosure = 'Portfolio experiment — no products are sold.';
const substitutions = { root, brandName, productName, tagline, ownerName, price, currency: config.currency };
const expand = (source, values, escape = String) => source.replace(/\{\{([\w:-]+)\}\}/g, (token, name) => (
  Object.hasOwn(values, name) ? escape(values[name]) : token
));
const articleDir = join(content, 'articles');
const files = await readdir(articleDir).catch(error => {
  if (error.code === 'ENOENT') return [];
  throw error;
});
const articleSources = await Promise.all(files.filter(file => file.endsWith('.md')).sort().map(async file => ({
  file, ...frontMatter(await read(join(articleDir, file)))
})));
const published = new Set(articleSources.map(({ data }) => data.slug));

// The first editorial drafts predate the config tokens.
const editorial = source => expand(source.replace(/\bMistlo\b/g, () => productName).replace(/\$44\b/g, () => price), substitutions);
const renderText = (source, settings = {}) => markdown(editorial(source), { root, published, ...settings });
const productSource = await optional(join(content, 'product.md'));
const product = productSource ? frontMatter(productSource) : { data: {}, body: '' };
async function contentPart(name) {
  const source = await optional(join(content, name + '.md'));
  return frontMatter(source ?? '');
}
const [aboutPart, faqPart, guidePart, revealPart, metadata] = await Promise.all(
  ['about', 'faq', 'guides-hub', 'reveal', 'meta'].map(contentPart)
);

function namedSections(source, depth) {
  const pattern = new RegExp('^' + '#'.repeat(depth) + ' +([^\r\n]+)\\r?$', 'gm');
  const headings = [...source.matchAll(pattern)];
  return headings.map((match, index) => [
    match[1].trim(), source.slice(match.index + match[0].length, headings[index + 1]?.index).trim()
  ]);
}

const productSections = new Map(namedSections(product.body, 2));
function labeled(section, label) {
  const prefix = '- **' + label + ':** ';
  return section?.split(/\r?\n/).find(line => line.startsWith(prefix))?.slice(prefix.length);
}
const structured = (type, props) => ({ '@type': type, ...props });
const organization = structured('Organization', { '@id': abs('/#organization'), name: brandName, url: abs('/') });
const description = product.data.description ? editorial(product.data.description) : productName + ' is a rain-cloud humidifier and night light with visible rainfall, cool mist and a soft amber glow.';
const image = abs('/assets/photos/og.jpg');
const routes = new Map();
const logo = '<a class="logo" href="' + h(root) + '"><img src="' + h(root) + 'assets/icon.svg" width="28" height="28" alt="">' + h(brandName) + '</a>';

function buy(location, compact = false) {
  const label = compact ? 'Buy now' : 'Buy now · ' + price;
  return '<a class="button" href="' + h(root) + 'gotcha/" data-buy="' + h(location) + '">' + h(label) + '</a>';
}

function contactLink() {
  return '<a class="button secondary" href="' + h(contact || root + 'about/#contact') + '"' +
    (contact ? ' data-portfolio' : '') + '>Contact ' + h(ownerName) + '</a>';
}

function breadcrumbs(items) {
  return '<nav aria-label="Breadcrumb"><ol class="crumbs">' + items.map(([name, route], index) => (
    index === items.length - 1
      ? '<li aria-current="page">' + h(name) + '</li>'
      : '<li><a href="' + h(root + route.slice(1)) + '">' + h(name) + '</a></li>'
  )).join('') + '</ol></nav>';
}

function breadcrumbSchema(items) {
  return structured('BreadcrumbList', { itemListElement: items.map(([name, route], index) => (
    structured('ListItem', { position: index + 1, name, item: abs(route) })
  )) });
}

async function copyPart(name, options) {
  const replacement = await optional(join(content, name + '.md'));
  return replacement ? renderText(frontMatter(replacement).body, options) : null;
}

const faqSource = await optional(join(content, 'faq.json'));
const normalizeFaq = items => items.map(([question, answer]) => [editorial(question), editorial(answer)]);
const faqItems = normalizeFaq(faqSource ? JSON.parse(faqSource) :
  product.data.faq ?? JSON.parse(await read(join(src, 'partials', 'faq.json'))));
const faqHtml = items => items.map(([question, answer]) => '<details><summary>' + h(question) + '</summary>' + markdown(answer, { root, published }).html + '</details>').join('\n');
const faqSchema = items => structured('FAQPage', { mainEntity: items.map(([question, answer]) => (
  structured('Question', { name: question, acceptedAnswer: structured('Answer', { text: answer.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') }) })
)) });

const revealCopy = revealPart.body ? renderText(revealPart.body, { minimumHeading: 1, headingId: 'reveal-title' }) : null;
const revealMessage = revealCopy?.headings.some(heading => heading.level === 1)
  ? revealCopy.html
  : revealCopy
    ? '<h1 id="reveal-title">Gotcha!</h1>' + revealCopy.html
    : expand(await read(join(src, 'partials', 'reveal.html')), substitutions, h);
const hasVideo = (await readdir(join(src, 'assets', 'reveal'))).includes('reveal.mp4');
function reveal(directPage = false) {
  const message = revealPart.data.headline && revealPart.data.line1
    ? '<p class="eyebrow">' + h(editorial(revealPart.data.eyebrow || 'The reveal')) + '</p><h1 id="reveal-title">' +
      h(editorial(revealPart.data.headline)) + '</h1><p class="lede">' + h(editorial(revealPart.data.line1)) + '</p>' +
      '<p>The site collects no checkout details or payments. GoatCounter measures aggregate visits and clicks without cookies.</p>' +
      (!directPage && revealPart.data.line3 ? '<p>' + h(editorial(revealPart.data.line3)) + '</p>' : '')
    : revealMessage;
  const poster = h(root) + 'assets/reveal/face.jpg';
  const media = hasVideo
    ? '<video controls playsinline preload="none" poster="' + poster + '" aria-label="Reveal video from ' + h(ownerName) + '"><source src="' + h(root) + 'assets/reveal/reveal.mp4" type="video/mp4"></video>'
    : '<img src="' + poster + '" alt="" width="800" height="800">';
  return '<div class="reveal-layout"><div class="reveal-media">' + media + '</div><div class="reveal-copy">' +
    message + '<div class="reveal-actions"><button class="button" type="button" data-share data-share-text="' +
    h(editorial(String(revealPart.data.shareWhatsApp || 'Try to buy the little rain cloud lamp and see what happens:').replace(/\s*\{\{siteUrl\}\}\s*/g, ' ').trim())) +
    '" hidden>' + h(editorial(revealPart.data.shareButton || 'Share the reveal')) + '</button>' +
    '<a class="button secondary" href="' + h(root) + 'about/">' + h(editorial(revealPart.data.buildButton || 'How this was built')) + '</a>' + contactLink() +
    '</div><p class="share-status" role="status"></p><p class="manual-share" hidden><a href="' + h(root) + 'gotcha/">Open the reveal link to share it</a></p></div></div>';
}

const dialog = '<dialog aria-labelledby="reveal-title" id="reveal-dialog"><button type="button" class="button secondary dialog-close" data-close autofocus>Close <span aria-hidden="true">×</span></button>' +
  '<template id="reveal-template">' + reveal() + '</template><div class="dialog-content"></div><p class="disclosure dialog-disclosure">' +
  h(disclosure) + '</p></dialog>';

function pageHtml(route, page) {
  const canonical = abs(route);
  const title = page.title.toLowerCase().includes(brandName.toLowerCase()) ? page.title : page.title + ' | ' + brandName;
  const socialKey = { '/': 'home', '/guides/': 'guides', '/gotcha/': 'reveal', '/about/': 'about' }[route];
  const socialTitle = route === '/' ? brandName + ' — ' + tagline : editorial(metadata.data[socialKey + 'OgTitle'] || title);
  const socialDescription = editorial(metadata.data[socialKey + 'OgDescription'] || page.description);
  const schema = JSON.stringify({ '@context': 'https://schema.org', '@graph': [organization, ...(page.schema ?? [])] }).replaceAll('<', '\\u003c');
  const verification = [
    ['google-site-verification', config.googleSiteVerification],
    ['msvalidate.01', config.bingSiteVerification]
  ].filter(([, value]) => route === '/' && value).map(([name, value]) => (
    '<meta name="' + name + '" content="' + h(value) + '">'
  )).join('\n');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${h(title)}</title>
<meta name="description" content="${h(page.description)}">
<link rel="canonical" href="${h(canonical)}">
<link rel="icon" href="${h(root)}assets/icon.svg" type="image/svg+xml">
<link rel="preload" href="${h(root)}assets/fonts/bricolage.woff2" as="font" type="font/woff2" crossorigin>
${page.noindex ? '<meta name="robots" content="noindex, follow">' : ''}
${verification}
<meta property="og:type" content="${page.article ? 'article' : 'website'}">
<meta property="og:site_name" content="${h(brandName)}">
<meta property="og:title" content="${h(socialTitle)}">
<meta property="og:description" content="${h(socialDescription)}">
<meta property="og:url" content="${h(canonical)}">
<meta property="og:image" content="${h(image)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Mistlo rain cloud lamp glowing amber on a nightstand at night">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${h(socialTitle)}">
<meta name="twitter:description" content="${h(socialDescription)}">
<meta name="twitter:image" content="${h(image)}">
<meta name="twitter:image:alt" content="Mistlo rain cloud lamp glowing amber on a nightstand at night">
<script type="application/ld+json">${schema}</script>
<style>${styles}</style>
<script src="${h(root)}site.js" defer></script>
</head>
<body data-page="${h(route)}" data-root="${h(root)}" data-goat="${h(goatCounterCode)}">
<a href="#main" class="skip">Skip to content</a>
<header><div class="head wrap">${logo}<nav aria-label="Main navigation"><a href="${h(root)}guides/">Guides</a><a href="${h(root)}faq/">FAQ</a>${page.buy ? buy('header', true) : '<a href="' + h(root) + '#product">Shop</a>'}</nav></div></header>
<main class="wrap" id="main">${page.body}</main>
<footer><div class="footer wrap">${logo}<nav aria-label="Footer navigation"><a href="${h(root)}guides/">Guides</a><a href="${h(root)}faq/">FAQ</a><a href="${h(root)}about/">About</a></nav>${page.disclose ? '<p class="disclosure">' + h(disclosure) + '</p>' : ''}</div></footer>
${page.buy ? dialog : ''}
</body>
</html>
`;
}

const styles = (await read(join(src, 'styles.css'))).replaceAll('{{root}}', root);
const homeTemplate = await read(join(src, 'partials', 'home.html'));
const homeHero = await copyPart('home-hero');
const heroCopy = productSections.get('Hero');
const homeFaq = faqItems.slice(0, 4);
const featureCopy = namedSections(productSections.get('Features') ?? '', 3);
const specs = [...(productSections.get('Specs') ?? '').matchAll(/^\| ([^|]+?) \| ([^|]+?) \|\s*$/gm)];
const featuredSpecs = new Set(['Tank', 'Rain speeds', 'Light', 'Power', 'Size', 'Finish']);
const specHtml = specs.filter(([, label]) => label !== 'Spec' && label !== 'Product').map(([, label, value]) =>
  '<div><dt>' + h(label) + '</dt><dd>' + h(editorial(value)) + '</dd></div>').join('');
const steps = (productSections.get('How it works') ?? '').split(/\r?\n/).filter(line => /^\d+\. /.test(line));
const fit = productSections.get('Honest fit');
const fitTitle = labeled(fit, 'Headline');
const fitLink = fit?.split(/\r?\n/).find(line => line.startsWith('Still deciding?'));
const homeGuides = [
  fitLink,
  productSections.get('Sound & light')?.split(/\r?\n/).find(line => line.includes('](/guides/')),
  productSections.get('Care')?.split(/\r?\n/).find(line => line.includes('](/guides/'))
].filter(Boolean);
const guideLinks = homeGuides.length && published.size
  ? '<section class="details"><div><p class="eyebrow">Good to know</p><h2>' +
    h(editorial(fitTitle || 'Before you choose')) + '</h2></div><div>' +
    homeGuides.map(line => renderText(line).html).join('') + '</div></section>'
  : '';
const homeParts = {
  faqs: faqHtml(homeFaq),
  heroEyebrow: h(labeled(heroCopy, 'Eyebrow') || 'The Rain Collection'),
  heroDetails: h(labeled(heroCopy, 'Micro-proof line (specifics, not social proof)') || 'Soft ambient light · USB-C powered'),
  closingHeadline: h(labeled(heroCopy, 'Closing section headline') || 'A small change of atmosphere.'),
  storySteps: steps.length ? renderText(steps.join('\n')).html.replace('<ol>', '<ol class="steps">') :
    '<ol class="steps"><li><strong>Fill the base.</strong> Add clean water to the reservoir.</li><li><strong>Plug it in.</strong> Connect USB-C and turn on the rain.</li><li><strong>Set the mood.</strong> Use the light on its own or with the mist.</li></ol>',
  storyTitle: h(labeled(productSections.get('How it works'), 'Headline') || 'Make it rain, indoors.'),
  specs: specHtml || '<div><dt>Finish</dt><dd>Warm ivory</dd></div><div><dt>Tank</dt><dd>300 mL</dd></div><div><dt>Power</dt><dd>USB-C</dd></div><div><dt>Footprint</dt><dd>18 × 12 cm</dd></div>',
  guideLinks,
  features: (() => {
    const photos = [
      ['rain-macro.jpg', 1200, 1500, 'Close-up of drops falling from the cloud into the basin, lit from behind'],
      ['evening-shelf.jpg', 1600, 1200, 'Mistlo glowing lavender on a living-room shelf at dusk'],
      ['desk-day.jpg', 1600, 1200, 'Mistlo raining on a light oak desk by a window in daylight']
    ];
    const rows = featureCopy.slice(0, 3).map(([title, text], i) => '<article class="row' + (i % 2 ? ' flip' : '') + '"><figure><img loading="lazy" src="' + h(root) + 'assets/photos/' + photos[i][0] + '" width="' + photos[i][1] + '" height="' + photos[i][2] + '" alt="' + h(photos[i][3]) + '"></figure><div class="row-copy"><h2>' + h(editorial(title)) + '</h2>' + renderText(text).html + '</div></article>').join('');
    const small = featureCopy.slice(3).map(([title, text]) => '<div><h3>' + h(editorial(title)) + '</h3>' + renderText(text).html + '</div>').join('');
    return rows + (small ? '<div class="pair">' + small + '</div>' : '');
  })(),
  swatches: [['Warm Amber', '#f3b467'], ['Candle', '#ffcf8a'], ['Soft White', '#f4efe6'], ['Dusk Rose', '#e9a3a8'], ['Lavender', '#b8a6e6'], ['Sea Glass', '#8fd1c0'], ['Midnight Blue', '#5f7fd6']]
    .map(([name, hex], i) => '<label class="swatch" style="--c:' + hex + '"><input type="radio" name="glow" value="' + hex + '" data-name="' + h(name) + '"' + (i ? '' : ' checked') + '><span class="sr">' + h(name) + '</span></label>').join(''),
  inBox: renderText(productSections.get('In the box') ?? '').html.replace('<ul>', '<ul class="box-list">'),
  shipping: h(String(productSections.get('Shipping & returns') ?? '').trim()),
  heroDescription: (homeHero?.html ?? (labeled(heroCopy, 'Subhead') ? renderText(labeled(heroCopy, 'Subhead')).html : null))?.replace('<p>', '<p class="lede">') ?? '<p class="lede">Meet ' + h(productName) + ', a rain-cloud humidifier and night light that brings a little of the outdoors to your nightstand.</p>',
  ...Object.fromEntries(['hero', 'closing', 'sticky'].map(location => ['buy:' + location, buy(location)]))
};
const home = expand(expand(homeTemplate, substitutions, h), homeParts);
routes.set('/', {
  title: product.data.seoTitle ? editorial(product.data.seoTitle) : productName + ' Rain-Cloud Humidifier & Night Light',
  description,
  body: home,
  buy: true,
  schema: [structured('Product', {
    name: productName, description, image: [abs('/assets/photos/pack-shot.jpg'), abs('/assets/photos/hero-night.jpg')],
    brand: structured('Brand', { name: brandName }), url: abs('/')
  }), faqSchema(homeFaq)]
});

const homeCrumb = ['Home', '/'];
const guidesCrumb = ['Guides', '/guides/'];
const section = body => '<section class="reading">' + body + '</section>';
const aboutCrumbs = [homeCrumb, ['About', '/about/']];
const aboutBody = aboutPart.body.split(/^## Contact\b/m)[0].replace(
  /^GoatCounter counts visits without cookies.+$/m,
  'GoatCounter counts visits and interactions without cookies. The analytics dashboard reports totals.'
);
const aboutContent = aboutBody.trim() ? renderText(aboutBody, { minimumHeading: 1 }) : null;
const aboutContact = contact
  ? contactLink()
  : '<p>A public contact link will be added before launch.</p>';
const contactSection = '<section id="contact"><h2>Contact ' + h(ownerName) + '</h2>' + aboutContact + '</section>';
const aboutCopy = aboutContent
  ? (aboutContent.headings.some(heading => heading.level === 1) ? '' : '<h1>How this was built</h1>') + aboutContent.html
  : expand(await read(join(src, 'partials', 'about.html')), substitutions, h);
routes.set('/about/', {
  title: editorial(aboutPart.data.seoTitle || 'How this was built'),
  description: editorial(aboutPart.data.description || 'How {{ownerName}} built {{brandName}} with AI to measure search reach and buying intent.'),
  body: section(breadcrumbs(aboutCrumbs) + aboutCopy + contactSection),
  disclose: true,
  schema: [breadcrumbSchema(aboutCrumbs)]
});

const fullFaq = faqPart.data.faq ? normalizeFaq(faqPart.data.faq) : faqItems;
const faqCrumbs = [homeCrumb, ['FAQ', '/faq/']];
routes.set('/faq/', {
  title: editorial(faqPart.data.seoTitle || '{{productName}} FAQ'),
  description: editorial(faqPart.data.description || 'Answers to common questions about {{productName}}, including setup, lighting, and care.'),
  body: section(breadcrumbs(faqCrumbs) + '<h1>Frequently asked questions</h1>' + (faqPart.body ? renderText(faqPart.body).html : '') + '<div class="accordion">' + faqHtml(fullFaq) + '</div>'),
  schema: [faqSchema(fullFaq), breadcrumbSchema(faqCrumbs)]
});

routes.set('/gotcha/', {
  title: 'The reveal',
  description: 'Meet ' + ownerName + ' and see the story behind ' + brandName + '.',
  body: '<section class="reveal-page" data-direct-reveal>' + reveal(true) + '</section>',
  disclose: true,
  noindex: true
});
const dashboard = goatCounterCode
  ? '<p><a class="button" href="https://' + h(goatCounterCode) + '.goatcounter.com/">Open the public GoatCounter dashboard</a></p>'
  : '<p>The GoatCounter dashboard link appears here after analytics is configured.</p>';
routes.set('/stats/', {
  title: 'Experiment statistics',
  description: 'How search reach, visits and buy clicks are counted for the portfolio experiment.',
  noindex: true,
  body: section(`<h1>Experiment statistics</h1><p class="lede">Search impressions → site visits → buy clicks</p>
<h2>Search reach</h2><p>Google Search Console reports impressions, clicks, queries and average position. Compare the same date range in both tools.</p>
<h2>On-site activity</h2>${dashboard}
<ul>
<li>Page paths show visits and referrer domains.</li>
<li><code>product-view</code> records a view of the product landing page.</li>
<li><code>buy-click/&lt;placement&gt;</code> records the button that opened the reveal.</li>
<li><code>reveal-complete</code> records a reveal visible for at least one second. It includes direct visits to the share link.</li>
<li><code>share-click</code> records a tap on the share button.</li>
<li><code>portfolio-click</code> records a click on the owner’s contact link.</li>
<li><code>scroll-75</code> records when the visitor reaches 75% of a scrollable page.</li>
</ul>
<p>For the portfolio headline, divide buy events across placements by total site visits, then multiply by 100. This measures clicks per visit. Repeat clicks and analytics blocking can affect the result.</p>`)
});
routes.set('/404.html', {
  title: 'Page not found',
  description: 'Find your way back to the ' + brandName + ' storefront.',
  body: section('<h1>Page not found</h1><p class="lede">Try the storefront or browse the guides.</p><p><a href="' + h(root) + '">Back to the storefront</a></p>'),
  noindex: true
});

const posts = [];
for (const { file, data, body } of articleSources) {
  const { slug, date } = data;
  if (!data.title || !data.description || !/^[a-z\d]+(?:-[a-z\d]+)*$/.test(slug ?? '') || !/^\d{4}-\d{2}-\d{2}$/.test(date ?? '')) {
    throw new Error(file + ' requires title, description, a lowercase URL slug and a YYYY-MM-DD date.');
  }
  const day = new Date(date);
  if (Number.isNaN(+day) || day.toISOString().slice(0, 10) !== date) throw new Error(file + ' has an invalid date.');
  if (posts.some(post => post.slug === slug)) throw new Error(file + ' duplicates article slug ' + slug);
  posts.push({
    slug, date,
    title: editorial(data.title),
    seoTitle: data.seoTitle ? editorial(data.seoTitle) : '',
    faq: normalizeFaq(data.faq ?? []),
    description: editorial(data.description),
    keyword: expand(data.keyword ?? '', substitutions),
    author: expand(data.author ?? '', substitutions),
    path: '/guides/' + slug + '/',
    ...renderText(body)
  });
}
posts.sort((first, second) => second.date.localeCompare(first.date) || first.slug.localeCompare(second.slug));

function postList(items) {
  return '<ul class="post-list">' + items.map(post => '<li><a href="' + h(root + post.path.slice(1)) + '"><strong>' +
    h(post.title) + '</strong></a><p>' + h(post.description) + '</p></li>').join('') + '</ul>';
}

const guideCrumbs = [homeCrumb, guidesCrumb];
routes.set('/guides/', {
  title: editorial(guidePart.data.seoTitle || 'Guides'),
  description: editorial(guidePart.data.description || 'Practical guides to humidifiers, ambient light, and making a nightstand your own.'),
  body: section(breadcrumbs(guideCrumbs) + '<h1>' + h(guidePart.data.title || 'Guides') + '</h1>' + (guidePart.body ? renderText(guidePart.body.split(/^## /m)[0]).html : '<p class="lede">Practical notes on humidifiers and lighting for small spaces.</p>') +
    (posts.length ? postList(posts) : '<p>Guides are coming soon.</p>')),
  noindex: !posts.length,
  schema: [breadcrumbSchema(guideCrumbs)]
});

for (const post of posts) {
  const crumbs = [...guideCrumbs, [post.title, post.path]];
  const author = post.author ? structured('Person', { name: post.author }) : organization;
  const dateText = new Intl.DateTimeFormat('en', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(post.date));
  const toc = post.headings.filter(({ level }) => level <= 3);
  const tocHtml = toc.length ? '<nav class="toc" aria-label="Table of contents"><strong>On this page</strong><ol>' +
    toc.map(({ id, label, level }) => '<li' + (level === 3 ? ' class="subheading"' : '') + '><a href="#' + encodeURIComponent(id) + '">' +
      h(label) + '</a></li>').join('') + '</ol></nav>' : '';
  const others = posts.filter(item => item !== post);
  const sameTopic = others.filter(item => post.keyword && item.keyword.toLowerCase() === post.keyword.toLowerCase());
  const related = [...new Set([...sameTopic, ...others])].slice(0, 3);
  const relatedHtml = related.length ? '<aside><h2>Related guides</h2>' + postList(related) + '</aside>' :
    '<aside><h2>Explore more</h2><p><a href="' + h(root) + 'blog/">Browse all guides</a></p></aside>';
  const articleFaq = post.faq.length ? '<section class="accordion"><h2>Frequently asked questions</h2>' + faqHtml(post.faq) + '</section>' : '';
  routes.set(post.path, {
    title: post.seoTitle || post.title,
    description: post.description,
    article: true,
    buy: true,
    body: '<article class="reading">' + breadcrumbs(crumbs) + '<h1>' + h(post.title) + '</h1><p class="lede">' +
      h(post.description) + '</p><p class="byline">' + h(author.name) + ' · <time datetime="' + post.date + '">' + h(dateText) +
      '</time></p>' + tocHtml + '<div class="article-body">' + post.html + '</div>' + articleFaq + '<aside class="cta"><p>Meet <a href="' + h(root) +
      '">' + h(productName) + '</a>, a rain-cloud humidifier and night light.</p>' + buy('article') + '</aside>' + relatedHtml + '</article>',
    schema: [structured('Article', {
      headline: post.title, description: post.description, image, datePublished: post.date,
      author, publisher: { '@id': organization['@id'] }, mainEntityOfPage: abs(post.path),
      ...(post.keyword ? { keywords: post.keyword } : {})
    }), breadcrumbSchema(crumbs), ...(post.faq.length ? [faqSchema(post.faq)] : [])]
  });
}

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(join(src, 'assets'), join(dist, 'assets'), { recursive: true, filter: file => !file.endsWith('README.md') });
await cp(join(src, 'site.js'), join(dist, 'site.js'));
for (const [route, data] of routes) {
  const file = join(dist, route.slice(1), route.endsWith('/') ? 'index.html' : '');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, pageHtml(route, data));
}
const sitemap = [...routes].filter(([, data]) => !data.noindex).map(([route]) => '  <url><loc>' + h(abs(route)) + '</loc></url>');
await writeFile(join(dist, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  sitemap.join('\n') + '\n</urlset>\n');
await writeFile(join(dist, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: ' + abs('/sitemap.xml') + '\n');
await writeFile(join(dist, '.nojekyll'), '');
if (indexNowKey) await writeFile(join(dist, indexNowKey + '.txt'), indexNowKey + '\n');
console.log('Built ' + routes.size + ' pages (' + posts.length + ' articles) in ' + dist);




