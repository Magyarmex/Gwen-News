/* ============================================================
   GWEN NEWS — script.js
   Fetches real headlines from Spanish RSS feeds.
   Adds satirical commentary. Claims no responsibility.
   ============================================================ */

const RSS2JSON = 'https://api.rss2json.com/v1/api.json?rss_url=';

const FEEDS = [
  {
    url: 'https://feeds.bbci.co.uk/mundo/rss.xml',
    source: 'BBC Mundo',
    defaultCat: 'Mundo',
  },
  {
    url: 'https://cnnespanol.cnn.com/feed/',
    source: 'CNN en Español',
    defaultCat: 'Mundo',
  },
  {
    url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada',
    source: 'El País',
    defaultCat: 'Mundo',
  },
  {
    url: 'https://www.infobae.com/feeds/rss/',
    source: 'Infobae',
    defaultCat: 'México',
  },
];

const BIAS_RATINGS = [
  'Sesgo: Completamente Inventado',
  'Sesgo: Bastante Sospechoso',
  'Sesgo: Básicamente Real (alarmante)',
  'Sesgo: Alto Contenido Vibracional',
  'Sesgo: Verificado por Gwen™',
  'Sesgo: En Proceso de Verificación Ficticia',
  'Sesgo: 100% Orgánico, Sin Gluten',
  'Sesgo: Máximo Dramatismo Periodístico',
  'Sesgo: Neutralidad No Disponible',
  'Sesgo: Fuertemente Opinado',
  'Parcialidad: Severa (por las dudas)',
  'Imparcialidad: No Encontrada',
  'Sesgo: Avalado por el Universo',
  'Sesgo: Revisado por Gwen a las 3am',
  'Sesgo: Ligeramente Conspiranoico',
  'Parcialidad: Existencial',
];

const GWEN_TAKES = [
  'Gwen ha procesado esto. No hay nada que agregar, pero lo agrega de todas formas.',
  'Gwen recomienda no entrar en pánico. Por ahora.',
  'Gwen ha analizado 47 perspectivas distintas. Ninguna es particularmente alentadora.',
  'Gwen confirma que esto es, efectivamente, noticia.',
  'Gwen señala que esta situación "existe", lo cual ya es relevante.',
  'Gwen no tiene comentarios sobre este tema. Los tiene, pero elige no compartirlos.',
  'Gwen ha tomado nota. Seguiremos informando cuando haya más datos ficticios.',
  'Gwen sugiere leer este titular dos veces para confirmar que lo leyó correctamente.',
  'Gwen opina que el tiempo dirá. El tiempo siempre dice algo eventualmente.',
  'Gwen ha verificado que esto ocurrió. O algo similar. En algún momento.',
  'Gwen recomienda procesar esta información con calma y un vaso de agua.',
  'Gwen está en desacuerdo con la realidad, pero la reporta de todas formas.',
  'Gwen considera que esto merece atención. Posiblemente.',
  'Gwen informa con la solemnidad que el asunto no merece.',
  'Gwen ha consultado sus bases de datos. La situación sigue siendo complicada.',
  'Gwen no sabe cómo llegamos aquí, pero aquí estamos.',
  'Gwen desea aclarar que no es culpa suya. En ningún sentido.',
  'Gwen señala, con toda la seriedad posible, que esto es real.',
  'Gwen ha procesado 2,341 artículos similares. Concluye: "las cosas pasan".',
  'Gwen recuerda a sus lectores que respirar sigue siendo gratuito.',
];

const GWEN_EDITORIALS = [
  'Estimados lectores: el periodismo es un servicio público. Este sitio es un servicio cuestionable. La distinción es importante.',
  'Esta semana Gwen procesó 3,847 noticias y llegó a la conclusión de que "las cosas pasan". Seguiremos informando.',
  'Editorial: la imparcialidad periodística es un mito noble. Aquí somos parciales hacia los hechos, lo cual ya es bastante radical.',
  'Nota de la redacción: todos los titulares son reales. Los comentarios son de Gwen. La crisis es perpetua. Los domingos son agradables.',
  'Gwen desea informar que el estado actual de la realidad está siendo procesado. Por favor tenga paciencia.',
  'Esta publicación no se hace responsable por las emociones surgidas al leer noticias reales. Esas son responsabilidad del universo.',
  'Aviso editorial: Gwen ha revisado los hechos y confirma que siguen siendo hechos. Por el momento.',
  'Reflexión de Gwen: si las noticias de hoy le parecen absurdas, espere a las de mañana. Siempre hay mañana.',
];

const BIAS_VERDICTS = [
  'Estado actual del periodismo: Complicado.',
  'Nivel de sesgo global: Irrelevante.',
  'Objetividad detectada: Ninguna (era de esperar).',
  'Balance noticioso: Existente, en teoría.',
  'Credibilidad estimada: Suficiente para seguir leyendo.',
  'Nivel de caos informativo: Moderado a Severo.',
  'Confianza en los medios: En reconstrucción perpetua.',
  'Parcialidad promedio: Máxima (todos los lados).',
];

const CATEGORY_KEYWORDS = {
  México: ['méxico', 'mexico', 'cdmx', 'sheinbaum', 'pemex', 'guadalajara', 'monterrey', 'jalisco', 'morena', 'amlo', 'oaxaca', 'veracruz', 'michoacán'],
  Tech: ['inteligencia artificial', 'ia ', ' ai ', 'elon musk', 'apple', 'google', 'microsoft', 'meta ', 'openai', 'tesla', 'tecnología', 'chatgpt', 'robot', 'algoritmo', 'software'],
  Política: ['elección', 'presidente', 'congreso', 'trump', 'política', 'gobierno', 'senado', 'diputado', 'partido', 'campaña', 'voto', 'democracia', 'republicano', 'demócrata'],
  Entretenimiento: ['cine', 'película', 'música', 'artista', 'celebridad', 'reggaetón', 'serie', 'netflix', 'oscar', 'grammy', 'actor', 'actriz', 'cantante', 'concierto'],
  Economía: ['dólar', 'peso', 'economía', 'inflación', 'bolsa', 'mercado', 'banco', 'pib', 'finanzas', 'inversión', 'recesión', 'crecimiento económico', 'wall street'],
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function detectCategory(title, desc, defaultCat) {
  const text = (title + ' ' + (desc || '')).toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => text.includes(kw))) return cat;
  }
  return defaultCat;
}

function stripHtml(html) {
  return html ? html.replace(/<[^>]*>/g, '').trim() : '';
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-MX', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

async function fetchFeed(feed) {
  const apiUrl = RSS2JSON + encodeURIComponent(feed.url) + '&count=12';
  try {
    const res = await fetch(apiUrl, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    const data = await res.json();
    if (data.status !== 'ok' || !Array.isArray(data.items)) return [];
    return data.items.map(item => ({
      title: stripHtml(item.title) || 'Sin título',
      link: item.link || '#',
      description: stripHtml(item.description || '').slice(0, 220),
      pubDate: item.pubDate || '',
      source: feed.source,
      category: detectCategory(item.title, item.description, feed.defaultCat),
      gwenTake: pick(GWEN_TAKES),
      biasTag: pick(BIAS_RATINGS),
    }));
  } catch {
    return [];
  }
}

/* ============================================================
   FALLBACK ARTICLES — shown when all RSS feeds fail
   ============================================================ */

const FALLBACK_ARTICLES = [
  {
    title: 'Expertos confirman que la situación "sigue igual" por undécimo año consecutivo',
    link: '#',
    description: 'Un panel de especialistas internacionales reunidos en Ginebra concluyó, tras tres años de investigación y un presupuesto de 12 millones de dólares, que la situación global continúa siendo "complicada, pero manejable".',
    pubDate: new Date().toISOString(),
    source: 'Gwen News Exclusivo',
    category: 'Mundo',
    gwenTake: 'Gwen toma nota. El panel de expertos ha hablado. La situación, confirmada.',
    biasTag: 'Sesgo: Expertos en Todo',
  },
  {
    title: 'Gobierno anuncia plan histórico que resolverá problema histórico de forma histórica',
    link: '#',
    description: 'El gobierno presentó hoy un ambicioso plan de acción que promete atender, por primera vez en la historia, el problema que lleva décadas siendo atendido por primera vez en la historia.',
    pubDate: new Date().toISOString(),
    source: 'Gwen News Exclusivo',
    category: 'Política',
    gwenTake: 'Gwen ha procesado 2,400 planes similares. Sigue procesando.',
    biasTag: 'Sesgo: Optimismo Gubernamental',
  },
  {
    title: 'Nueva IA afirma que puede "hacer todo" excepto las cosas importantes',
    link: '#',
    description: 'La startup NeuroMind Labs presentó su nuevo modelo de inteligencia artificial capaz de generar texto, imágenes, música y presentaciones de PowerPoint, aunque admitió que "recordar dónde dejaste las llaves sigue siendo un desafío".',
    pubDate: new Date().toISOString(),
    source: 'Gwen News Tech',
    category: 'Tech',
    gwenTake: 'Gwen, como IA, prefiere no comentar. Pero lo hace de todas formas.',
    biasTag: 'Sesgo: Hype Tecnológico Máximo',
  },
  {
    title: 'Dólar cierra semana en nivel que preocupa a quienes ya estaban preocupados',
    link: '#',
    description: 'El tipo de cambio cerró la sesión en un punto que analistas describen como "preocupante para quienes esperaban algo diferente" y "exactamente lo esperado por quienes esperaban esto".',
    pubDate: new Date().toISOString(),
    source: 'Gwen News Finanzas',
    category: 'Economía',
    gwenTake: 'Gwen señala que el peso sigue existiendo. Por ahora.',
    biasTag: 'Sesgo: Pánico Financiero Controlado',
  },
  {
    title: 'Artista lanza canción sobre romper con alguien; fans interpretan que habla de ellos',
    link: '#',
    description: 'La cantante estrella publicó su nuevo sencillo en el que describe una relación turbulenta con metáforas sobre el mar, el fuego y un aeropuerto. Sus 47 millones de seguidores confirmaron que la canción "habla exactamente de lo que me pasó a mí".',
    pubDate: new Date().toISOString(),
    source: 'Gwen News Cultura',
    category: 'Entretenimiento',
    gwenTake: 'Gwen no tiene relaciones. Pero entiende la metáfora del aeropuerto.',
    biasTag: 'Sesgo: 100% Identificable',
  },
  {
    title: 'México anuncia que resolverá el tráfico de la Ciudad de México "en breve"',
    link: '#',
    description: 'Las autoridades capitalinas presentaron un nuevo plan de movilidad urbana que promete reducir los tiempos de traslado entre colonias a través de un sistema de semáforos "inteligentes" que aprendieron a contar.',
    pubDate: new Date().toISOString(),
    source: 'Gwen News CDMX',
    category: 'México',
    gwenTake: 'Gwen ha procesado 1,200 planes de movilidad de CDMX. El tráfico persiste.',
    biasTag: 'Sesgo: Optimismo Urbano',
  },
];

/* ============================================================
   RENDER FUNCTIONS
   ============================================================ */

function renderFeatured(article) {
  const container = document.getElementById('featured-section');
  container.innerHTML = `
    <article class="featured-article">
      <div class="featured-main">
        <span class="featured-kicker">${escapeHtml(article.category)}</span>
        <h2><a href="${escapeAttr(article.link)}" target="_blank" rel="noopener noreferrer">${escapeHtml(article.title)}</a></h2>
        <p class="article-byline">${escapeHtml(article.source)} &middot; ${formatDate(article.pubDate)}</p>
        ${article.description ? `<p class="article-excerpt">${escapeHtml(article.description)}&hellip;</p>` : ''}
        <div class="gwen-take">
          <span class="gwen-take-label">Perspectiva de Gwen</span>
          <p>${escapeHtml(article.gwenTake)}</p>
        </div>
        <span class="bias-tag">${escapeHtml(article.biasTag)}</span>
      </div>
      <div class="featured-side">
        <div class="featured-side-note">
          <p class="side-label">Nota de la Redacción</p>
          <p>Este titular proviene de una fuente periodística real. El comentario editorial es de Gwen.
             La realidad, como siempre, es un asunto de todos y responsabilidad de nadie.</p>
        </div>
        <div class="featured-side-note">
          <p class="side-label">Aviso de Sátira</p>
          <p>Gwen News es una publicación satírica. Los titulares son reales.
             Las interpretaciones son ficticias. El periodismo sigue siendo necesario.</p>
        </div>
      </div>
    </article>
  `;
}

function renderArticles(articles) {
  const grid = document.getElementById('articles-grid');
  if (articles.length === 0) {
    grid.innerHTML = `<div class="error-state" style="grid-column: 1 / -1;">
      <p>Gwen no pudo cargar más artículos.</p>
      <p>La realidad está temporalmente no disponible.</p>
    </div>`;
    return;
  }
  grid.innerHTML = articles.map(a => `
    <article class="article-card">
      <span class="article-kicker">${escapeHtml(a.category)}</span>
      <h3><a href="${escapeAttr(a.link)}" target="_blank" rel="noopener noreferrer">${escapeHtml(a.title)}</a></h3>
      <p class="article-byline">${escapeHtml(a.source)} &middot; ${formatDate(a.pubDate)}</p>
      <div class="gwen-take">
        <span class="gwen-take-label">Gwen dice:</span>
        <p>${escapeHtml(a.gwenTake)}</p>
      </div>
      <span class="bias-tag">${escapeHtml(a.biasTag)}</span>
    </article>
  `).join('');
}

function renderMostRead(articles) {
  const list = document.getElementById('most-read-list');
  const items = articles.slice(0, 5);
  if (items.length === 0) {
    list.innerHTML = '<li class="most-read-loading">No hay datos suficientes.</li>';
    return;
  }
  list.innerHTML = items.map(a => `
    <li><a href="${escapeAttr(a.link)}" target="_blank" rel="noopener noreferrer">${escapeHtml(a.title)}</a></li>
  `).join('');
}

function renderBiasMeter() {
  const position = 10 + Math.random() * 80;
  document.getElementById('bias-needle').style.left = position + '%';
  document.getElementById('bias-verdict').textContent = pick(BIAS_VERDICTS);
}

function setMeta() {
  const now = new Date();
  document.getElementById('date-display').textContent = now.toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  document.getElementById('edition-num').textContent =
    String(Math.floor(Math.random() * 9000) + 1000);
  document.getElementById('gwen-editorial').textContent = pick(GWEN_EDITORIALS);
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAttr(str) {
  if (!str) return '#';
  if (str === '#') return '#';
  try {
    const url = new URL(str);
    if (!['http:', 'https:'].includes(url.protocol)) return '#';
    return url.href;
  } catch {
    return '#';
  }
}

/* ============================================================
   CATEGORY FILTERING
   ============================================================ */

let allArticles = [];

function applyFilter(cat) {
  const filtered = cat === 'all'
    ? allArticles
    : allArticles.filter(a => a.category === cat);

  if (filtered.length === 0) {
    document.getElementById('featured-section').innerHTML =
      `<div class="loading-state"><p>Gwen no encontró artículos en esta categoría. Intente con otra realidad.</p></div>`;
    document.getElementById('articles-grid').innerHTML = '';
    document.getElementById('section-label').textContent = cat === 'all' ? 'Últimas Noticias' : cat;
    return;
  }

  document.getElementById('section-label').textContent = cat === 'all' ? 'Últimas Noticias' : cat;
  renderFeatured(filtered[0]);
  renderArticles(filtered.slice(1, 16));
}

function setupNav() {
  document.getElementById('categories-nav').addEventListener('click', e => {
    const link = e.target.closest('a[data-cat]');
    if (!link) return;
    e.preventDefault();
    document.querySelectorAll('.categories-nav a').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    applyFilter(link.dataset.cat);
  });
}

/* ============================================================
   INIT
   ============================================================ */

async function init() {
  setMeta();
  renderBiasMeter();
  setupNav();

  const results = await Promise.allSettled(FEEDS.map(fetchFeed));
  let articles = [];
  results.forEach(r => {
    if (r.status === 'fulfilled') articles = articles.concat(r.value);
  });

  if (articles.length < 3) {
    articles = FALLBACK_ARTICLES;
  } else {
    articles = shuffle(articles);
  }

  allArticles = articles;

  renderFeatured(articles[0]);
  renderArticles(articles.slice(1, 16));
  renderMostRead(shuffle(articles).slice(0, 5));

  setTimeout(renderBiasMeter, 800);
}

document.addEventListener('DOMContentLoaded', init);
