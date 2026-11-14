// Цвет всей страницы: у каждой главы свой фон и свечение, переходы плавные (слой #page-bg, см. index.css).
// Главы могут временно перекрасить фон под своё состояние (работа на экране, атака в «Защите»).
export interface PageTheme {
  bg: string;
  glow?: string; // цвет свечения; без него свечения нет
  x?: number; // положение центра свечения, %
  y?: number;
}

const THEMES: Record<string, PageTheme> = {
  hero: { bg: '#07060c' },
  works: { bg: '#07060c', glow: 'rgba(139,108,255,.10)', x: 70, y: 30 },
  skills: { bg: '#090714', glow: 'rgba(139,108,255,.22)', x: 20, y: 30 },
  console: { bg: '#070c0a', glow: 'rgba(200,255,77,.12)', x: 82, y: 40 },
  team: { bg: '#06070d', glow: 'rgba(255,170,90,.09)', x: 50, y: 85 },
  process: { bg: '#060b10', glow: 'rgba(62,230,255,.15)', x: 50, y: 15 },
  security: { bg: '#0a0710', glow: 'rgba(255,77,94,.10)', x: 80, y: 30 },
  contact: { bg: '#09060f', glow: 'rgba(255,95,174,.13)', x: 25, y: 70 },
};

let chapter = 'hero';
const overrides: Record<string, PageTheme | null> = {};

function apply() {
  const el = document.getElementById('page-bg');
  if (!el) return;
  const t = overrides[chapter] ?? THEMES[chapter] ?? THEMES.hero;
  el.style.backgroundColor = t.bg;
  const g = el.firstElementChild as HTMLElement | null;
  if (!g) return;
  if (t.glow) {
    g.style.setProperty('--g1', t.glow);
    g.style.setProperty('--gx', `${t.x ?? 50}%`);
    g.style.setProperty('--gy', `${t.y ?? 40}%`);
    g.style.opacity = '1';
  } else g.style.opacity = '0';
}

/** Какая глава сейчас на экране (вызывает рейка глав) */
export function setChapter(id: string) {
  if (id === chapter) return;
  chapter = id;
  apply();
}

/** Временный цвет главы; null — вернуть обычный. Действует, только пока эта глава на экране */
export function setOverride(id: string, t: PageTheme | null) {
  overrides[id] = t;
  if (id === chapter) apply();
}
