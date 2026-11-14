import Lenis from 'lenis';

// Плавная прокрутка на весь сайт. Отключается, если человек попросил систему «уменьшить движение».
let lenis: Lenis | null = null;

export const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export function startSmooth(): (() => void) | undefined {
  if (lenis || reducedMotion()) return;
  lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), touchMultiplier: 1.4 });
  let id = 0;
  const raf = (time: number) => {
    lenis?.raf(time);
    id = requestAnimationFrame(raf);
  };
  id = requestAnimationFrame(raf);
  // отписка: цикл не должен жить после ухода с главной (#/stage, #/play) и при повторном монтировании
  return () => {
    cancelAnimationFrame(id);
    lenis?.destroy();
    lenis = null;
    document.documentElement.style.overflow = '';
  };
}

/** Прокрутить к якорю (#works) — плавно, с учётом шапки */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -10, duration: 1.6 });
  else el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' });
}

/** Прокрутить к высоте на странице (px) — через Lenis, чтобы он не спорил с обычной прокруткой браузера */
export function scrollToY(y: number, duration = 1.4) {
  if (lenis) lenis.scrollTo(y, { duration });
  else window.scrollTo({ top: y, behavior: reducedMotion() ? 'auto' : 'smooth' });
}

/** Остановить прокрутку страницы (открыто окно) и вернуть обратно */
export function lockScroll(lock: boolean) {
  if (lenis) (lock ? lenis.stop() : lenis.start());
  document.documentElement.style.overflow = lock ? 'hidden' : '';
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { duration: 1.8 });
  else window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
}
