import React, { useCallback, useEffect, useState } from 'react';
import { scrollToId } from '../lib/smooth';
import { setChapter } from '../lib/theme';

// «Слайды»: сайт читается как одна большая презентация. Справа — рейка с номерами глав и подписью,
// с клавиатуры — PageUp/PageDown и ←/→ прыгают между главами (↑/↓ и колесо листают как обычно).
export const CHAPTERS: { id: string; name: string }[] = [
  { id: 'hero', name: 'Старт' },
  { id: 'works', name: 'Работы' },
  { id: 'skills', name: 'Возможности' },
  { id: 'console', name: 'Пульт сайта' },
  { id: 'team', name: 'Команда' },
  { id: 'process', name: 'Процесс' },
  { id: 'security', name: 'Защита' },
  { id: 'contact', name: 'Контакты' },
];

const pad = (n: number) => String(n).padStart(2, '0'); // Старт — 00, дальше как в подписях глав

const Deck: React.FC<{ visible: boolean }> = ({ visible }) => {
  const [cur, setCur] = useState(0);

  // какая глава сейчас в центре экрана
  useEffect(() => {
    const els = CHAPTERS.map((c) => document.getElementById(c.id));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setCur(els.indexOf(e.target as HTMLElement));
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    els.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  // цвет страницы следует за главой
  useEffect(() => setChapter(CHAPTERS[cur].id), [cur]);

  const go = useCallback(
    (to: number) => {
      const i = Math.min(CHAPTERS.length - 1, Math.max(0, to));
      scrollToId(CHAPTERS[i].id);
    },
    [],
  );

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      // не мешаем набору текста и открытым окнам (там прокрутка заблокирована)
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (document.documentElement.style.overflow === 'hidden') return;
      const next = e.key === 'PageDown' || e.key === 'ArrowRight';
      const prev = e.key === 'PageUp' || e.key === 'ArrowLeft';
      if (!next && !prev) return;
      e.preventDefault();
      go(cur + (next ? 1 : -1));
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [cur, go]);

  return (
    <nav
      aria-label="Главы"
      className={`fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 transition-opacity duration-700 lg:flex ${visible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
    >
      <ol className="flex flex-col items-end gap-2.5">
        {CHAPTERS.map((c, i) => (
          <li key={c.id}>
            <button
              onClick={() => go(i)}
              aria-label={`${pad(i)} ${c.name}`}
              aria-current={i === cur ? 'true' : undefined}
              className="group flex items-center gap-3 py-0.5"
            >
              <span
                className={`font-mono text-[10px] uppercase tracking-[0.25em] transition-all duration-300 ${i === cur ? 'translate-x-0 text-mist opacity-100' : 'translate-x-2 text-haze opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}
              >
                {c.name}
              </span>
              <span className={`block h-px transition-all duration-500 ease-out-expo ${i === cur ? 'w-8 bg-lime' : 'w-3 bg-white/30 group-hover:w-6 group-hover:bg-white/70'}`} />
            </button>
          </li>
        ))}
      </ol>
      <div className="font-mono text-[10px] tracking-[0.25em] text-haze">
        <span className="text-mist">{pad(cur)}</span> / {pad(CHAPTERS.length - 1)}
      </div>
    </nav>
  );
};

export default Deck;
