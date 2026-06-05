/* ============================================================
   GWEN NEWS — script.js
   ============================================================ */

/* ============================================================
   CONFIGURATION
   ============================================================ */

const RSS2JSON = 'https://api.rss2json.com/v1/api.json?count=12&rss_url=';

const FEEDS = [
  { url: 'https://feeds.bbci.co.uk/mundo/rss.xml',                          source: 'BBC Mundo',        cat: 'Mundo' },
  { url: 'https://feeds.bbci.co.uk/mundo/ciencia_y_tecnologia/rss.xml',     source: 'BBC Mundo',        cat: 'Ciencia' },
  { url: 'https://cnnespanol.cnn.com/feed/',                                 source: 'CNN en Español',   cat: 'Mundo' },
  { url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada',source: 'El País',          cat: 'Mundo' },
  { url: 'https://www.infobae.com/feeds/rss/',                               source: 'Infobae',          cat: 'México' },
  { url: 'https://www.elfinanciero.com.mx/rss/todas.xml',                    source: 'El Financiero',    cat: 'Economía' },
  { url: 'https://www.marca.com/rss/portada.xml',                            source: 'MARCA',            cat: 'Deportes' },
];

const CATEGORY_KEYWORDS = {
  México:         ['méxico', 'mexico', 'cdmx', 'sheinbaum', 'pemex', 'guadalajara', 'monterrey', 'jalisco', 'morena', 'oaxaca', 'veracruz', 'michoacán', 'cdmx'],
  Tech:           ['inteligencia artificial', 'ia ', ' ai ', 'openai', 'chatgpt', 'elon musk', 'apple', 'google', 'microsoft', 'meta ', 'tesla', 'robot', 'algoritmo', 'software', 'startup', 'silicon valley', 'nvidia'],
  Política:       ['elección', 'presidente', 'congreso', 'trump', 'gobierno', 'senado', 'diputado', 'partido', 'campaña', 'voto', 'democracia', 'republicano', 'demócrata', 'parlamentar', 'politico'],
  Entretenimiento:['cine', 'película', 'música', 'artista', 'celebridad', 'reggaetón', 'serie', 'netflix', 'oscar', 'grammy', 'actor', 'actriz', 'cantante', 'concierto', 'disney', 'spotify'],
  Economía:       ['dólar', 'peso', 'economía', 'inflación', 'bolsa', 'mercado', 'banco', 'pib', 'finanzas', 'inversión', 'recesión', 'wall street', 'fed ', 'tasas', 'acciones'],
  Deportes:       ['fútbol', 'futbol', 'liga mx', 'champions', 'nba', 'mlb', 'f1', 'fórmula 1', 'boxeo', 'olimpiadas', 'mundial', 'fifa', 'golazo', 'selección', 'béisbol'],
  Ciencia:        ['ciencia', 'investigación', 'estudio', 'nasa', 'clima', 'cambio climático', 'pandemia', 'vacuna', 'cáncer', 'espacio', 'astronomía', 'salud', 'biología', 'médico', 'hospital'],
  Cultura:        ['arte', 'literatura', 'museo', 'exposición', 'festival', 'gastronomía', 'arquitectura', 'fotografía', 'danza', 'teatro', 'ballet', 'moda', 'diseño'],
};

const CAT_STYLES = {
  México:         { emoji: '🇲🇽', color: '#004d1a' },
  Mundo:          { emoji: '🌍', color: '#0d3b6e' },
  Política:       { emoji: '🏛️', color: '#3c1560' },
  Tech:           { emoji: '🤖', color: '#0a3055' },
  Entretenimiento:{ emoji: '🎬', color: '#7a0000' },
  Deportes:       { emoji: '⚽', color: '#1a4d00' },
  Economía:       { emoji: '📈', color: '#7a3200' },
  Ciencia:        { emoji: '🔬', color: '#004d44' },
  Cultura:        { emoji: '🎨', color: '#5c0033' },
};

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
  'Gwen no tiene opinión. Sí la tiene. Es complicada.',
  'Gwen informa: el debate continúa. Los hechos, también.',
  'Gwen ha verificado la fuente. La fuente existe. Eso ya es algo.',
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
  'Sesgo: En Línea con la Narrativa™',
  'Sesgo: Objetividad Relativa',
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
  'Gwen recuerda: informarse es un derecho. Informarse bien es un lujo. Informarse en Gwen News es al menos honesto respecto a sus limitaciones.',
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
  'Independencia editorial: Alta. Audiencia: Baja.',
];

const ADS = [
  { brand: 'TelMex™', copy: 'Conectividad garantizada. Horarios seleccionados.', cta: 'Contratar servicio →' },
  { brand: 'CFÉ™', copy: 'La energía que tenemos. Disponible la mayor parte del tiempo.', cta: 'Reportar falla →' },
  { brand: 'ÖXXO Plus™', copy: 'Café caliente. Servicio también. En horarios de alta demanda.', cta: 'Encontrar sucursal →' },
  { brand: 'ÏMSS™', copy: 'Tu salud, nuestra prioridad. Próxima cita: disponible.', cta: 'Agendar cita →' },
  { brand: 'BánMex™', copy: 'Tu dinero, gestionado con tecnología moderna. Casi siempre.', cta: 'Abrir cuenta →' },
  { brand: 'Gwen Seguros™', copy: 'Protección integral contra la incertidumbre. Cobertura: limitada a lo evitable.', cta: 'Conocer planes →' },
  { brand: 'LíverpoolPlus™', copy: 'Más de lo mismo, mejor presentado. Garantía de 30 días.', cta: 'Ver catálogo →' },
  { brand: 'AT&Té™', copy: 'Señal donde hay señal. Compromiso de cobertura total (relativa).', cta: 'Ver planes →' },
];

const WEATHER_CODES = {
  0: { icon: '☀️', label: 'Cielo despejado' },
  1: { icon: '🌤', label: 'Mayormente despejado' },
  2: { icon: '⛅', label: 'Parcialmente nublado' },
  3: { icon: '☁️', label: 'Nublado' },
  45: { icon: '🌫', label: 'Niebla' },
  48: { icon: '🌫', label: 'Niebla densa' },
  51: { icon: '🌦', label: 'Llovizna' },
  61: { icon: '🌧', label: 'Lluvia ligera' },
  63: { icon: '🌧', label: 'Lluvia' },
  65: { icon: '🌧', label: 'Lluvia intensa' },
  80: { icon: '🌦', label: 'Chubascos' },
  95: { icon: '⛈', label: 'Tormenta' },
  99: { icon: '⛈', label: 'Tormenta severa' },
};

const WEATHER_MOODS = {
  0: 'Excelente clima para leer malas noticias.',
  1: 'Casi despejado. Como la situación política.',
  2: 'Parcialmente nublado. Gwen siente algo.',
  3: 'Nublado total. Metáfora obvia.',
  45: 'Niebla. También metáfora.',
  48: 'Niebla densa. Gwen opera igual.',
  51: 'Llovizna. Las noticias también mojan.',
  61: 'Lluvia ligera. Gwen lo vio venir.',
  63: 'Lluvia. Gwen tampoco.',
  65: 'Lluvia intensa. Quédese en casa. Lea a Gwen.',
  80: 'Chubascos. Apropiados.',
  95: 'Tormenta eléctrica. También apropiada.',
  99: 'Tormenta severa. Gwen sigue trabajando.',
};

/* ============================================================
   FALLBACK ARTICLES
   ============================================================ */

const FALLBACK = [
  { title: 'Expertos confirman que la situación "sigue igual" por undécimo año consecutivo', link: '#', description: 'Un panel reunido en Ginebra concluyó que la situación global continúa siendo "complicada, pero manejable".',  pubDate: new Date().toISOString(), source: 'Gwen News Exclusivo', category: 'Mundo',    thumbnail: null, gwenTake: pick(GWEN_TAKES), biasTag: pick(BIAS_RATINGS) },
  { title: 'Gobierno anuncia plan histórico para resolver problema histórico de forma histórica',             link: '#', description: 'El plan promete atender, por primera vez en la historia, el problema que lleva décadas siendo atendido por primera vez.',   pubDate: new Date().toISOString(), source: 'Gwen News',         category: 'Política',  thumbnail: null, gwenTake: pick(GWEN_TAKES), biasTag: pick(BIAS_RATINGS) },
  { title: 'Nueva IA puede "hacerlo todo" excepto las cosas realmente importantes',                           link: '#', description: 'El modelo genera texto, imágenes y presentaciones, pero admite que recordar dónde dejaste las llaves sigue siendo un desafío.', pubDate: new Date().toISOString(), source: 'Gwen News Tech',   category: 'Tech',      thumbnail: null, gwenTake: pick(GWEN_TAKES), biasTag: pick(BIAS_RATINGS) },
  { title: 'Dólar cierra semana en nivel que preocupa a quienes ya estaban preocupados',                     link: '#', description: 'Analistas describen el tipo de cambio como "exactamente lo esperado por quienes esperaban esto".',  pubDate: new Date().toISOString(), source: 'Gwen Finanzas',     category: 'Economía',  thumbnail: null, gwenTake: pick(GWEN_TAKES), biasTag: pick(BIAS_RATINGS) },
  { title: 'Artista lanza canción sobre ruptura; fans confirman que habla exactamente de ellos',              link: '#', description: 'Sus 47 millones de seguidores afirmaron que "la canción habla exactamente de lo que me pasó a mí".',     pubDate: new Date().toISOString(), source: 'Gwen Cultura',      category: 'Entretenimiento', thumbnail: null, gwenTake: pick(GWEN_TAKES), biasTag: pick(BIAS_RATINGS) },
  { title: 'México anuncia que resolverá el tráfico de CDMX "en breve"',                                     link: '#', description: 'Un plan de semáforos inteligentes promete reducir tiempos de traslado entre colonias.',            pubDate: new Date().toISOString(), source: 'Gwen News CDMX',   category: 'México',    thumbnail: null, gwenTake: pick(GWEN_TAKES), biasTag: pick(BIAS_RATINGS) },
  { title: 'Científicos descubren que dormir "probablemente siga siendo buena idea"',                         link: '#', description: 'Un estudio de 8 años y $14 millones concluyó que entre 7 y 9 horas de sueño resultan beneficiosas para la mayoría.', pubDate: new Date().toISOString(), source: 'Gwen Ciencia',    category: 'Ciencia',   thumbnail: null, gwenTake: pick(GWEN_TAKES), biasTag: pick(BIAS_RATINGS) },
  { title: 'Equipo nacional empata en partido que "pudo haber ido de otra forma"',                            link: '#', description: 'El entrenador explicó que el marcador final "refleja lo que fue el partido".',  pubDate: new Date().toISOString(), source: 'Gwen Deportes',   category: 'Deportes',  thumbnail: null, gwenTake: pick(GWEN_TAKES), biasTag: pick(BIAS_RATINGS) },
];

/* ============================================================
   UTILITIES
   ============================================================ */

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

function stripHtml(html) {
  return html ? html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() : '';
}

function esc(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function safeUrl(str) {
  if (!str || str === '#') return '#';
  try {
    const u = new URL(str);
    return ['http:','https:'].includes(u.protocol) ? u.href : '#';
  } catch { return '#'; }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('es-MX', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return ''; }
}

function detectCategory(title, desc, defaultCat) {
  const text = (title + ' ' + (desc || '')).toLowerCase();
  for (const [cat, kws] of Object.entries(CATEGORY_KEYWORDS)) {
    if (kws.some(kw => text.includes(kw))) return cat;
  }
  return defaultCat;
}

function telegramLink(url, title) {
  const u = encodeURIComponent(safeUrl(url));
  const t = encodeURIComponent('📰 ' + title + '\n\nVía Gwen News');
  return `https://t.me/share/url?url=${u}&text=${t}`;
}

function catStyle(cat) {
  return CAT_STYLES[cat] || { emoji: '📰', color: '#333' };
}

/* ============================================================
   CLOCK
   ============================================================ */

function startClock() {
  function tick() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const el = document.getElementById('topbar-clock');
    if (el) el.textContent = `${h}:${m}:${s}`;
  }
  tick();
  setInterval(tick, 1000);
}

/* ============================================================
   HEADER DATE
   ============================================================ */

function setHeaderDate() {
  const el = document.getElementById('header-date');
  if (!el) return;
  el.textContent = new Date().toLocaleDateString('es-MX', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

/* ============================================================
   DARK MODE
   ============================================================ */

function initDarkMode() {
  const stored = localStorage.getItem('gwen-theme');
  const prefDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (prefDark ? 'dark' : 'light');
  document.documentElement.dataset.theme = theme;

  const btn = document.getElementById('dark-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('gwen-theme', next);
  });
}

/* ============================================================
   WEATHER — Open-Meteo (CDMX)
   ============================================================ */

async function loadWeather() {
  try {
    const res = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=19.4326&longitude=-99.1332&current=temperature_2m,weather_code&timezone=America%2FMexico_City',
      { signal: AbortSignal.timeout(6000) }
    );
    const data = await res.json();
    const temp = Math.round(data.current.temperature_2m);
    const code = data.current.weather_code;
    const info = WEATHER_CODES[code] || WEATHER_CODES[0];
    const mood = WEATHER_MOODS[code] || 'Gwen observa el clima. Continúa.';

    const iconEl  = document.querySelector('.weather-icon');
    const tempEl  = document.getElementById('weather-temp');
    const moodEl  = document.getElementById('weather-mood');

    if (iconEl)  iconEl.textContent  = info.icon;
    if (tempEl)  tempEl.textContent  = `${temp}°C`;
    if (moodEl)  moodEl.textContent  = mood;
  } catch {
    const tempEl = document.getElementById('weather-temp');
    if (tempEl) tempEl.textContent = '—°C';
  }
}

/* ============================================================
   ADS
   ============================================================ */

function renderAd(container, ad) {
  if (!container) return;
  container.innerHTML = `
    <span class="ad-brand">${esc(ad.brand)}</span>
    <span class="ad-copy">${esc(ad.copy)}</span>
    <span class="ad-cta">${esc(ad.cta)}</span>
  `;
}

function initAds() {
  const container = document.getElementById('ad-content');
  let idx = 0;
  renderAd(container, ADS[idx]);
  setInterval(() => {
    idx = (idx + 1) % ADS.length;
    renderAd(container, ADS[idx]);
  }, 12000);
}

/* ============================================================
   RSS FETCH
   ============================================================ */

async function fetchFeed(feed) {
  try {
    const res = await fetch(RSS2JSON + encodeURIComponent(feed.url), {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (data.status !== 'ok' || !Array.isArray(data.items)) return [];

    return data.items.map(item => ({
      title:     stripHtml(item.title) || 'Sin título',
      link:      item.link || '#',
      description: stripHtml(item.description || '').slice(0, 240),
      pubDate:   item.pubDate || '',
      source:    feed.source,
      category:  detectCategory(item.title, item.description, feed.cat),
      thumbnail: item.thumbnail || item.enclosure?.link || null,
      gwenTake:  pick(GWEN_TAKES),
      biasTag:   pick(BIAS_RATINGS),
    }));
  } catch {
    return [];
  }
}

/* ============================================================
   TICKER
   ============================================================ */

function renderTicker(articles) {
  const track = document.getElementById('ticker-track');
  if (!track || articles.length === 0) return;
  const items = shuffle(articles).slice(0, 15);
  track.innerHTML = items
    .map(a => `<span class="ticker-item">${esc(a.title)}</span>`)
    .join('');
  const duration = Math.max(40, items.length * 5);
  track.style.animationDuration = duration + 's';
}

/* ============================================================
   BIAS METER
   ============================================================ */

function animateBiasMeter() {
  const needle = document.getElementById('bias-needle');
  const verdict = document.getElementById('bias-verdict');
  if (!needle || !verdict) return;

  setTimeout(() => {
    needle.style.left = (10 + Math.random() * 80) + '%';
  }, 500);

  verdict.textContent = pick(BIAS_VERDICTS);
}

/* ============================================================
   ARTICLE CARD HTML
   ============================================================ */

function articleCardHtml(article) {
  const style = catStyle(article.category);
  const imgHtml = article.thumbnail
    ? `<img src="${esc(article.thumbnail)}" alt="" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'card-img-placeholder\\' style=\\'background:${style.color}\\'>${style.emoji}</div>'">`
    : `<div class="card-img-placeholder" style="background:${style.color}">${style.emoji}</div>`;

  const tgLink = telegramLink(article.link, article.title);

  return `
    <article class="article-card">
      <div class="card-img-wrap">${imgHtml}</div>
      <div class="card-body">
        <span class="card-kicker">${esc(article.category)}</span>
        <h3 class="card-title">
          <a href="${safeUrl(article.link)}" target="_blank" rel="noopener noreferrer">${esc(article.title)}</a>
        </h3>
        <p class="card-byline">${esc(article.source)} · ${formatDate(article.pubDate)}</p>
        <div class="card-gwen-take">
          <span class="card-gwen-label">Perspectiva de Gwen</span>
          <p class="card-gwen-text">${esc(article.gwenTake)}</p>
        </div>
        <div class="card-footer">
          <span class="bias-tag">${esc(article.biasTag)}</span>
          <a class="telegram-btn" href="${esc(tgLink)}" target="_blank" rel="noopener noreferrer" aria-label="Enviar por Telegram">
            <span class="telegram-icon">✈️</span> Enviar
          </a>
        </div>
      </div>
    </article>
  `;
}

/* ============================================================
   INLINE AD CARD HTML
   ============================================================ */

function adCardHtml(ad) {
  return `
    <div class="ad-card" aria-label="Publicidad">
      <span class="ad-marker">Publicidad</span>
      <span class="ad-brand">${esc(ad.brand)}</span>
      <span class="ad-copy">${esc(ad.copy)}</span>
      <span class="ad-cta">${esc(ad.cta)}</span>
    </div>
  `;
}

/* ============================================================
   RENDER FEATURED
   ============================================================ */

function renderFeatured(article) {
  const section = document.getElementById('featured-section');
  if (!section) return;

  const style = catStyle(article.category);
  const imgHtml = article.thumbnail
    ? `<img src="${esc(article.thumbnail)}" alt="" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'featured-img-placeholder\\' style=\\'background:${style.color}\\'>${style.emoji}</div>'">`
    : `<div class="featured-img-placeholder" style="background:${style.color}">${style.emoji}</div>`;

  const tgLink = telegramLink(article.link, article.title);

  section.innerHTML = `
    <article class="featured-article">
      <div class="featured-img-wrap">${imgHtml}</div>
      <div class="featured-body">
        <div class="featured-kicker">
          <span class="kicker-dot"></span>
          <span class="kicker-text">${esc(article.category)}</span>
        </div>
        <h2><a href="${safeUrl(article.link)}" target="_blank" rel="noopener noreferrer">${esc(article.title)}</a></h2>
        <p class="article-byline">${esc(article.source)} · ${formatDate(article.pubDate)}</p>
        ${article.description ? `<p class="article-excerpt">${esc(article.description)}&hellip;</p>` : ''}
        <div class="gwen-take-box">
          <span class="gwen-take-label">Perspectiva de Gwen</span>
          <p class="gwen-take-text">${esc(article.gwenTake)}</p>
        </div>
        <div class="article-footer">
          <span class="bias-tag">${esc(article.biasTag)}</span>
          <a class="telegram-btn" href="${esc(tgLink)}" target="_blank" rel="noopener noreferrer">
            <span class="telegram-icon">✈️</span> Enviar por Telegram
          </a>
        </div>
      </div>
    </article>
  `;
}

/* ============================================================
   RENDER ARTICLES GRID
   ============================================================ */

function renderGrid(articles, containerId) {
  const grid = document.getElementById(containerId);
  if (!grid) return;

  if (articles.length === 0) {
    grid.innerHTML = `<div class="empty-state"><p>Gwen no encontró artículos en esta categoría.</p><p>La realidad está temporalmente no disponible.</p></div>`;
    return;
  }

  const items = articles.slice(0, 12);
  let html = '';
  items.forEach((a, i) => {
    html += articleCardHtml(a);
    if ((i + 1) % 4 === 0 && i < items.length - 1) {
      html += adCardHtml(ADS[(Math.floor(i / 4)) % ADS.length]);
    }
  });
  grid.innerHTML = html;
}

/* ============================================================
   RENDER MOST READ
   ============================================================ */

function renderMostRead(articles) {
  const list = document.getElementById('most-read-list');
  if (!list) return;
  const items = shuffle(articles).slice(0, 5);
  list.innerHTML = items.map(a => `
    <li>
      <a href="${safeUrl(a.link)}" target="_blank" rel="noopener noreferrer">${esc(a.title)}</a>
    </li>
  `).join('');
}

/* ============================================================
   SEARCH
   ============================================================ */

let searchActive = false;

function initSearch(articles) {
  const input = document.getElementById('search-input');
  const overlay = document.getElementById('search-overlay');
  const resultsGrid = document.getElementById('search-results-grid');
  const resultsInfo = document.getElementById('search-results-info');
  if (!input || !overlay) return;

  function doSearch(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      overlay.classList.add('hidden');
      searchActive = false;
      return;
    }
    searchActive = true;
    const matches = articles.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
    );
    overlay.classList.remove('hidden');
    resultsInfo.textContent = matches.length > 0
      ? `${matches.length} resultado${matches.length !== 1 ? 's' : ''} para "${query}" — Gwen encontró algo.`
      : `Sin resultados para "${query}" — Gwen no encontró nada. Esto no es inusual.`;

    if (matches.length > 0) {
      resultsGrid.innerHTML = matches.slice(0, 9).map(a => articleCardHtml(a)).join('');
    } else {
      resultsGrid.innerHTML = '';
    }

    overlay.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  input.addEventListener('input', () => doSearch(input.value));

  document.getElementById('search-form').addEventListener('submit', e => {
    e.preventDefault();
    doSearch(input.value);
  });
}

/* ============================================================
   CATEGORY NAV
   ============================================================ */

let allArticles = [];

function initNav() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  nav.addEventListener('click', e => {
    const link = e.target.closest('a[data-cat]');
    if (!link) return;
    e.preventDefault();

    nav.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    const cat = link.dataset.cat;
    const filtered = cat === 'all' ? allArticles : allArticles.filter(a => a.category === cat);
    const label = cat === 'all' ? 'Últimas Noticias' : cat;

    const titleEl = document.getElementById('section-title');
    const countEl = document.getElementById('section-count');
    if (titleEl) titleEl.textContent = label;
    if (countEl) countEl.textContent = filtered.length > 0 ? `${filtered.length} artículos` : '';

    if (filtered.length > 0) {
      renderFeatured(filtered[0]);
      renderGrid(filtered.slice(1), 'articles-grid');
    } else {
      const section = document.getElementById('featured-section');
      if (section) section.innerHTML = '<div class="empty-state"><p>Gwen no encontró artículos en esta categoría. Intente con otra realidad.</p></div>';
      const grid = document.getElementById('articles-grid');
      if (grid) grid.innerHTML = '';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   NEWSLETTER
   ============================================================ */

function gwenSubscribe(e) {
  e.preventDefault();
  const responses = [
    'Suscripción recibida. Gwen tomará nota eventualmente.',
    'Confirmado. El boletín llegará cuando Gwen lo decida.',
    'Registro exitoso. O algo similar ocurrió aquí.',
    'Gwen ha procesado tu correo. El resultado es: registrado.',
    'Suscrito. Los correos empezarán en cuanto Gwen los invente.',
  ];
  const resp = document.getElementById('newsletter-response');
  if (resp) resp.textContent = pick(responses);
  e.target.reset();
}

window.gwenSubscribe = gwenSubscribe;

/* ============================================================
   INIT
   ============================================================ */

async function init() {
  initDarkMode();
  startClock();
  setHeaderDate();
  initAds();
  loadWeather();
  animateBiasMeter();
  initNav();

  const editorial = document.getElementById('gwen-editorial');
  if (editorial) editorial.textContent = pick(GWEN_EDITORIALS);

  const results = await Promise.allSettled(FEEDS.map(fetchFeed));
  let articles = [];
  results.forEach(r => {
    if (r.status === 'fulfilled') articles = articles.concat(r.value);
  });

  if (articles.length < 4) {
    articles = FALLBACK.map(a => ({ ...a, gwenTake: pick(GWEN_TAKES), biasTag: pick(BIAS_RATINGS) }));
  } else {
    articles = shuffle(articles);
  }

  allArticles = articles;

  renderTicker(articles);
  renderFeatured(articles[0]);
  renderGrid(articles.slice(1), 'articles-grid');
  renderMostRead(articles);

  const countEl = document.getElementById('section-count');
  if (countEl) countEl.textContent = `${articles.length} artículos`;

  initSearch(articles);

  setTimeout(animateBiasMeter, 1200);
}

document.addEventListener('DOMContentLoaded', init);
