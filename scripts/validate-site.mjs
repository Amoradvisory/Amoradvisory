import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';

const root = resolve('site');
const expected = [
  'index.html',
  'styles.css',
  'robots.txt',
  'sitemap.xml',
  'cases/teacherflow.html',
  'cases/pilotecours.html',
  'cases/second-cerveau.html',
  'demos/pilotecours/index.html',
  'demos/pilotecours/pilotecours.js',
  'demos/pilotecours/app.js',
  'demos/pilotecours/styles.css',
  'demos/pilotecours/manifest.webmanifest',
  'demos/pilotecours/icon.svg'
];

for (const path of expected) {
  if (!existsSync(join(root, path))) {
    throw new Error(`Fichier public manquant : ${path}`);
  }
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

const htmlFiles = walk(root).filter((path) => extname(path) === '.html');
const canonicalEmail = 'enseignant.be@gmail.com';
const indexHtml = readFileSync(join(root, 'index.html'), 'utf8');
const canonicalMailtoCount = [...indexHtml.matchAll(/href="mailto:enseignant\.be@gmail\.com"/gi)].length;

if (canonicalMailtoCount !== 2) {
  throw new Error(
    `index.html doit contenir exactement deux liens mailto:${canonicalEmail} (trouvé : ${canonicalMailtoCount})`
  );
}

for (const required of [
  'Je transforme des frictions pédagogiques concrètes en dispositifs simples, testables et responsables.',
  'id="demonstrateurs"',
  'href="demos/pilotecours/"',
  'href="https://amoradvisory.github.io/FlowPilot/teacher/"',
  'href="https://www.linkedin.com/in/amor-el-hamrouni/"'
]) {
  if (!indexHtml.includes(required)) {
    throw new Error(`index.html ne contient pas le contrat attendu : ${required}`);
  }
}

for (const htmlPath of htmlFiles) {
  const html = readFileSync(htmlPath, 'utf8');
  const label = relative(root, htmlPath);

  const emailAddresses = [...html.matchAll(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)].map(
    (match) => match[0].toLowerCase()
  );
  const unexpectedEmails = [...new Set(emailAddresses)].filter((email) => email !== canonicalEmail);

  if (unexpectedEmails.length > 0) {
    throw new Error(`${label} contient une adresse e-mail non canonique : ${unexpectedEmails.join(', ')}`);
  }

  for (const required of [
    '<title>',
    'name="description"',
    'rel="canonical"',
    'property="og:title"',
    'property="og:description"',
    '<main'
  ]) {
    if (!html.includes(required)) {
      throw new Error(`${label} ne contient pas ${required}`);
    }
  }

  if (/C:\\Users|file:\/\//i.test(html)) {
    throw new Error(`${label} expose un chemin local`);
  }

  if (/\+32[\s.-]*(?:\(0\)[\s.-]*)?4\d{2}/i.test(html)) {
    throw new Error(`${label} expose un numéro de téléphone`);
  }

  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
  for (const href of hrefs) {
    if (/^(https?:|mailto:|#)/.test(href)) continue;
    const target = href.split('#')[0].split('?')[0];
    if (!target) continue;
    const resolved = resolve(htmlPath, '..', target);
    if (!existsSync(resolved)) {
      throw new Error(`${label} pointe vers un fichier absent : ${href}`);
    }
  }
}

console.log(`Portfolio validé : ${htmlFiles.length} pages HTML et ${expected.length} actifs essentiels.`);
