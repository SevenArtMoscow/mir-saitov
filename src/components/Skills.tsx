import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useInView, useMotionValue, useSpring } from 'motion/react';
import { finePointer, reducedMotion } from '../lib/smooth';
import { Eyebrow, Reveal, SplitReveal, auroraLetter } from './ui';

// Плитка: «прожектор» и светящаяся рамка следуют за курсором, карточка слегка наклоняется к нему
const Tile: React.FC<{ className?: string; title: string; text: string; children: React.ReactNode; tag: string; n: string; accent?: string }> = ({
  className = '',
  title,
  text,
  children,
  tag,
  n,
  accent = '139,108,255',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType === 'touch') return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty('--mx', `${x}px`);
    el.style.setProperty('--my', `${y}px`);
    if (!reducedMotion()) {
      el.style.setProperty('--ry', `${(x / r.width - 0.5) * 4}deg`);
      el.style.setProperty('--rx', `${-(y / r.height - 0.5) * 4}deg`);
    }
  };
  const leave = () => {
    ref.current?.style.setProperty('--rx', '0deg');
    ref.current?.style.setProperty('--ry', '0deg');
  };
  return (
    <div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      className={`group relative flex flex-col overflow-hidden rounded-[28px] border border-white/10 bg-night/80 p-6 sm:p-7 ${className}`}
      style={{ transform: 'perspective(1200px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))', transition: 'transform .6s cubic-bezier(.16,1,.3,1)' }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(420px circle at var(--mx) var(--my), rgba(${accent},.16), transparent 60%)` }}
      />
      {/* светящаяся рамка: тот же прожектор, но только по контуру */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[28px] p-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(300px circle at var(--mx) var(--my), rgba(${accent},.9), transparent 65%)`,
          mask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          maskComposite: 'exclude',
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
        }}
      />
      <div className="relative flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">
        <span>{n}</span>
        <span className="flex items-center gap-1.5">
          <i className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: `rgb(${accent})` }} />
          Демо
        </span>
      </div>
      <div className="relative flex min-h-[190px] flex-1 items-center justify-center py-4">{children}</div>
      <div className="relative mt-4">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-lime">{tag}</div>
        <h3 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">{title}</h3>
        <p className="mt-2 max-w-md text-[14px] leading-relaxed text-haze">{text}</p>
      </div>
    </div>
  );
};

// 1. Магазин: товар «летит» в корзину, счётчик растёт
const ShopDemo: React.FC = () => {
  const [count, setCount] = useState(2);
  const [flying, setFlying] = useState<number[]>([]);
  const add = () => {
    const id = Date.now();
    setFlying((f) => [...f, id]);
    setTimeout(() => {
      setFlying((f) => f.filter((x) => x !== id));
      setCount((c) => c + 1);
    }, 700);
  };
  return (
    <div className="relative flex w-full max-w-[460px] items-center gap-5">
      <div className="relative w-[58%] rounded-3xl border border-white/10 bg-white/[0.04] p-4">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[linear-gradient(160deg,#1f1b33,#121019)]">
          {/* макет смартфона: корпус, экран, вырез под камеру */}
          <motion.div
            className="absolute left-1/2 top-[14%] h-[96%] w-[38%] -translate-x-1/2 rounded-[22px] border-[3px] border-[#3a3748] bg-[#0b0a10] p-[5px] shadow-[0_20px_40px_rgba(0,0,0,.5)]"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-[16px] bg-[linear-gradient(170deg,#8b6cff,#3ee6ff_70%,#c8ff4d)]">
              <div className="absolute left-1/2 top-1.5 h-2 w-8 -translate-x-1/2 rounded-full bg-black" />
              <div className="absolute inset-x-2 bottom-3 space-y-1">
                <div className="h-1.5 w-2/3 rounded-full bg-white/80" />
                <div className="h-1.5 w-1/2 rounded-full bg-white/50" />
              </div>
            </div>
          </motion.div>
        </div>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="text-[13px] font-semibold">Смартфон Nova</div>
            <div className="font-display text-lg font-semibold">89 990 ₽</div>
          </div>
          <button onClick={add} className="rounded-full bg-lime px-4 py-2 text-[12px] font-bold text-void transition-transform active:scale-90">
            В корзину
          </button>
        </div>
        <AnimatePresence>
          {flying.map((id) => (
            <motion.span
              key={id}
              className="absolute bottom-6 right-8 z-10 h-4 w-4 rounded-full bg-lime shadow-[0_0_20px_#c8ff4d]"
              initial={{ x: 0, y: 0, scale: 1 }}
              animate={{ x: [0, 60, 150], y: [0, -120, -40], scale: [1, 1.2, 0.4] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
            />
          ))}
        </AnimatePresence>
      </div>
      <div className="flex flex-1 flex-col items-center gap-3">
        <motion.div key={count} initial={{ scale: 1.35 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }} className="relative grid h-20 w-20 place-items-center rounded-3xl border border-white/15 bg-white/[0.05]">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" />
            <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
          </svg>
          <span className="absolute -right-2 -top-2 grid h-7 min-w-7 place-items-center rounded-full bg-rose px-1.5 text-[12px] font-bold text-white">{count}</span>
        </motion.div>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-haze">Нажмите «В корзину»</span>
      </div>
    </div>
  );
};

// 2. Каркасный 3D-глобус: крутится сам и тянется за курсором
const CubeDemo: React.FC = () => {
  const rx = useSpring(useMotionValue(-22), { stiffness: 80, damping: 14 });
  const ry = useSpring(useMotionValue(35), { stiffness: 80, damping: 14 });
  const box = useRef<HTMLDivElement>(null);
  const auto = useRef(35);
  const hovering = useRef(false);
  const inView = useInView(box);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const loop = () => {
      if (!hovering.current) {
        auto.current += 0.4;
        ry.set(auto.current);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [ry, inView]);
  return (
    <div
      ref={box}
      className="grid h-full w-full place-items-center"
      style={{ perspective: 700 }}
      onPointerMove={(e) => {
        if (!finePointer() || !box.current) return;
        hovering.current = true;
        const r = box.current.getBoundingClientRect();
        ry.set(auto.current + ((e.clientX - r.left) / r.width - 0.5) * 140);
        rx.set(-22 - ((e.clientY - r.top) / r.height - 0.5) * 90);
      }}
      onPointerLeave={() => {
        hovering.current = false;
        rx.set(-22);
      }}
    >
      {/* каркасный глобус: меридианы и параллели из тонких колец */}
      <motion.div className="relative h-32 w-32" style={{ transformStyle: 'preserve-3d', rotateX: rx, rotateY: ry }}>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={`m${i}`} className="absolute inset-0 rounded-full border border-cyan/50" style={{ transform: `rotateY(${i * 22.5}deg)` }} />
        ))}
        {[-0.66, -0.33, 0, 0.33, 0.66].map((k) => (
          <div
            key={`p${k}`}
            className={`absolute inset-0 rounded-full border ${k === 0 ? 'border-lime/80' : 'border-violet/50'}`}
            style={{ transform: `rotateX(90deg) translateZ(${k * 64}px) scale(${Math.sqrt(1 - k * k)})` }}
          />
        ))}
        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime shadow-[0_0_16px_#c8ff4d]" />
      </motion.div>
    </div>
  );
};

// 3. Буквы разбегаются от курсора (считаем только когда мышь двигается над плиткой)
type Pointer = { x: number; y: number } | null;
const Letter: React.FC<{ ch: string; subs: React.MutableRefObject<Set<(m: Pointer) => void>>; style?: React.CSSProperties }> = ({ ch, subs, style }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 12 });
  const y = useSpring(0, { stiffness: 200, damping: 12 });
  const r = useSpring(0, { stiffness: 200, damping: 12 });
  useEffect(() => {
    const fn = (m: Pointer) => {
      const el = ref.current;
      if (!el || !m) {
        x.set(0);
        y.set(0);
        r.set(0);
        return;
      }
      const b = el.getBoundingClientRect();
      const dx = b.left + b.width / 2 - m.x;
      const dy = b.top + b.height / 2 - m.y;
      const d = Math.hypot(dx, dy);
      const f = Math.max(0, 1 - d / 120);
      x.set((dx / (d || 1)) * f * 38);
      y.set((dy / (d || 1)) * f * 38);
      r.set(f * (dx > 0 ? 25 : -25));
    };
    const set = subs.current;
    set.add(fn);
    return () => {
      set.delete(fn);
    };
  }, [subs, x, y, r]);
  return (
    <motion.span ref={ref} className="inline-block" style={{ ...style, x, y, rotate: r }}>
      {ch}
    </motion.span>
  );
};
const MotionDemo: React.FC = () => {
  const subs = useRef(new Set<(m: Pointer) => void>());
  const send = (m: Pointer) => subs.current.forEach((fn) => fn(m));
  return (
    <div className="grid h-full w-full place-items-center" onPointerMove={(e) => send({ x: e.clientX, y: e.clientY })} onPointerLeave={() => send(null)}>
      <div className="select-none text-center font-display text-[13vw] font-semibold leading-none tracking-tight sm:text-6xl">
        {[...'живое'].map((c, i) => (
          <Letter key={i} ch={c} subs={subs} style={auroraLetter(i, 5)} />
        ))}
        <div className="mt-3 font-mono text-[10px] font-normal uppercase tracking-[0.25em] text-haze">проведите курсором</div>
      </div>
    </div>
  );
};

// 4. Telegram: бот «печатает», сообщения приходят по очереди, у отправленных — галочки
const MESSAGES = [
  { me: false, t: 'Здравствуйте! Хочу iPhone 17 Pro' },
  { me: true, t: 'Отличный выбор! Цвет и память?' },
  { me: false, t: 'Синий, 256 ГБ' },
  { me: true, t: 'Заказ №1042 оформлен' },
];
const Typing: React.FC<{ me: boolean }> = ({ me }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 8, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className={`flex gap-1 rounded-2xl px-3 py-2.5 ${me ? 'self-end rounded-br-md bg-[#2b5278]' : 'self-start rounded-bl-md bg-[#232e3c]'}`}
    aria-label="печатает"
  >
    {[0, 1, 2].map((i) => (
      <motion.span key={i} className="h-1.5 w-1.5 rounded-full bg-white/60" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.12 }} />
    ))}
  </motion.div>
);
const TelegramDemo: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-20% 0px' });
  // шаг чётный — «печатает», нечётный — сообщение пришло; в конце пауза и новый круг
  const [step, setStep] = useState(1);
  useEffect(() => {
    if (!inView) return;
    const t = setInterval(() => setStep((v) => (v + 1) % (MESSAGES.length * 2 + 3)), 950);
    return () => clearInterval(t);
  }, [inView]);
  const shown = Math.min(MESSAGES.length, Math.floor(step / 2) + (step % 2));
  const typing = step % 2 === 0 && shown < MESSAGES.length ? MESSAGES[shown] : null;
  return (
    <div ref={ref} className="w-full max-w-[250px] rounded-[30px] border border-white/10 bg-[#17212b] p-3 shadow-2xl">
      <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-2.5">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-cyan to-violet text-[12px] font-bold">М</span>
        <div className="leading-tight">
          <div className="text-[13px] font-semibold">Магазин · бот</div>
          <div className="text-[10px] text-cyan">{typing?.me ? 'печатает…' : 'онлайн'}</div>
        </div>
      </div>
      <div className="flex h-[150px] flex-col justify-end gap-1.5 overflow-hidden">
        <AnimatePresence initial={false}>
          {MESSAGES.slice(0, shown).map((m, i) => (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className={`max-w-[85%] rounded-2xl px-3 py-1.5 text-[12px] ${m.me ? 'self-end rounded-br-md bg-[#2b5278]' : 'self-start rounded-bl-md bg-[#232e3c]'}`}
            >
              {m.t}
              {m.me && <span className="ml-1.5 text-[10px] text-cyan">✓✓</span>}
            </motion.div>
          ))}
          {typing && <Typing key="typing" me={typing.me} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

// 5. Админка: столбики растут, число считается, потом приходят новые заказы
const AdminDemo: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20% 0px' });
  const visible = useInView(ref, { margin: '-10% 0px' });
  const [total, setTotal] = useState(0);
  const [bars, setBars] = useState([38, 52, 44, 70, 58, 86, 74, 95]);
  const [live, setLive] = useState(false);
  const [toast, setToast] = useState<{ id: number; sum: string } | null>(null);
  const target = useRef(1284);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, 1284, { duration: 2, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setTotal(Math.round(v)), onComplete: () => setLive(true) });
    return () => c.stop();
  }, [inView]);
  // после разгона «живой» режим: раз в пару секунд приходит заказ
  useEffect(() => {
    if (!live || !visible) return;
    const t = setInterval(() => {
      target.current += 1;
      setTotal(target.current);
      setBars((b) => b.map((v, i) => (i === b.length - 1 ? 80 + Math.round(Math.random() * 20) : i === b.length - 2 ? Math.max(60, v + Math.round(Math.random() * 6 - 3)) : v)));
      setToast({ id: target.current, sum: (Math.round((3 + Math.random() * 20) * 10) * 100).toLocaleString('ru-RU') });
    }, 2600);
    return () => clearInterval(t);
  }, [live, visible]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(t);
  }, [toast]);
  return (
    <div ref={ref} className="relative w-full max-w-[320px] rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-haze">Заказы за месяц</span>
        <span className="font-mono text-[10px] text-lime">+24%</span>
      </div>
      <div className="mt-1 font-display text-3xl font-semibold tabular-nums">{total.toLocaleString('ru-RU')}</div>
      <div className="mt-4 flex h-24 items-end gap-1.5">
        {bars.map((b, i) => (
          <motion.div
            key={i}
            className="group relative flex-1 rounded-t-md bg-gradient-to-t from-violet/70 to-cyan"
            initial={{ height: 0 }}
            animate={inView ? { height: `${b}%` } : {}}
            transition={live ? { type: 'spring', stiffness: 120, damping: 14 } : { delay: 0.1 + i * 0.07, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-white px-1.5 py-0.5 font-mono text-[9px] font-bold text-void opacity-0 transition-opacity group-hover:opacity-100">{b * 13}</span>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -10, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="absolute -top-3 right-3 flex items-center gap-2 rounded-full border border-lime/30 bg-void/90 px-3 py-1.5 font-mono text-[10px] text-mist shadow-[0_8px_24px_rgba(0,0,0,.5)] backdrop-blur"
          >
            <i className="h-1.5 w-1.5 rounded-full bg-lime" />
            Заказ №{toast.id} · {toast.sum} ₽
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 6. Адаптив: одна и та же страница перестраивается под компьютер, планшет и телефон
const WIDTHS = [300, 200, 112];
const DEVICES = [
  { name: 'Компьютер', px: '1440' },
  { name: 'Планшет', px: '768' },
  { name: 'Телефон', px: '375' },
];
const ResponsiveDemo: React.FC<{ k: number }> = ({ k }) => {
  const narrow = k === 2;
  return (
    <motion.div className="rounded-2xl border-2 border-white/20 bg-white/[0.03] p-2.5" animate={{ width: WIDTHS[k] }} transition={{ type: 'spring', stiffness: 120, damping: 18 }}>
      <div className="mb-2 h-2.5 w-1/3 rounded-full bg-white/30" />
      <motion.div layout className="mb-2 h-14 rounded-lg bg-gradient-to-r from-violet to-cyan" />
      <motion.div layout className={`grid gap-1.5 ${narrow ? 'grid-cols-1' : k === 1 ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {[0, 1, 2].map((i) => (
          <motion.div layout key={i} className="h-9 rounded-md bg-white/15" />
        ))}
      </motion.div>
    </motion.div>
  );
};
const ResponsiveBlock: React.FC = () => {
  const [k, setK] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const inView = useInView(box);
  useEffect(() => {
    if (!inView) return; // за экраном не перестраиваемся (каждая смена — пересчёт раскладки)
    const t = setInterval(() => setK((v) => (v + 1) % WIDTHS.length), 1800);
    return () => clearInterval(t);
  }, [inView]);
  return (
    <div ref={box} className="flex w-full flex-wrap items-center justify-center gap-x-12 gap-y-6">
      <ResponsiveDemo k={k} />
      <div className="flex flex-col items-start gap-3">
        <div className="flex gap-2 font-mono text-[10px] uppercase tracking-[0.2em]">
          {DEVICES.map((d, i) => (
            <button
              key={d.name}
              onClick={() => setK(i)}
              className={`rounded-full border px-3 py-1.5 transition-colors ${i === k ? 'border-lime/60 bg-lime/10 text-lime' : 'border-white/10 text-haze hover:border-white/30'}`}
            >
              {d.name}
            </button>
          ))}
        </div>
        <div className="font-mono text-[11px] text-haze">
          ширина экрана: <span className="tabular-nums text-mist">{DEVICES[k].px} px</span>
        </div>
      </div>
    </div>
  );
};

// Плитка выезжает с лёгким «приземлением»
const Rise: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = '' }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 56, scale: 0.95 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, margin: '-8% 0px' }}
    transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

const Skills: React.FC = () => (
  <section id="skills" className="relative mx-auto max-w-[1500px] px-5 py-28 sm:px-10 sm:py-40">
    <Eyebrow n="02">Возможности</Eyebrow>
    <div className="mt-8 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
      <h2 className="max-w-5xl font-display text-[12vw] font-semibold leading-[0.9] tracking-[-0.04em] sm:text-[8vw] lg:text-[5.6vw]">
        <SplitReveal text="Не просто красиво —" />{' '}
        <span className="text-outline">
          <SplitReveal text="работает" delay={0.3} />
        </span>
      </h2>
      <Reveal delay={0.4} y={20} className="max-w-xs shrink-0">
        <p className="text-[14px] leading-relaxed text-haze">
          Шесть вещей, которые отличают наши сайты от шаблонов. <span className="text-mist">Здесь всё живое</span> — нажимайте, водите курсором, смотрите.
        </p>
      </Reveal>
    </div>
    <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Rise className="md:col-span-2">
        <Tile n="01" accent="200,255,77" tag="Продажи" title="Интернет-магазины" text="Каталог, корзина, заказы прямо в Telegram и админка, где цены и товары меняются без программиста." className="h-full">
          <ShopDemo />
        </Tile>
      </Rise>
      <Rise delay={0.08}>
        <Tile n="02" accent="62,230,255" tag="WebGL" title="3D прямо в браузере" text="Модели, планеты, товары, которые можно покрутить. Без плагинов и установки." className="h-full">
          <CubeDemo />
        </Tile>
      </Rise>
      <Rise>
        <Tile n="03" accent="139,108,255" tag="Motion" title="Анимации с характером" text="Интерфейс отвечает на каждое движение — поэтому на сайте хочется задержаться." className="h-full">
          <MotionDemo />
        </Tile>
      </Rise>
      <Rise delay={0.08}>
        <Tile n="04" accent="62,230,255" tag="Telegram" title="Мини-приложения и боты" text="Магазин внутри Telegram и заявки, которые сразу падают менеджеру в чат." className="h-full">
          <TelegramDemo />
        </Tile>
      </Rise>
      <Rise delay={0.16}>
        <Tile n="05" accent="200,255,77" tag="Данные" title="Админ-панели" text="Заказы, остатки, статистика посещений и импорт прайсов — всё в одном месте." className="h-full">
          <AdminDemo />
        </Tile>
      </Rise>
      <Rise className="md:col-span-2 lg:col-span-3">
        <Tile n="06" accent="255,95,174" tag="Адаптив" title="Идеально на любом экране" text="Компьютер, планшет, телефон, MacBook и встроенный браузер Telegram — вёрстка подстраивается под каждый." className="h-full">
          <ResponsiveBlock />
        </Tile>
      </Rise>
    </div>
  </section>
);

export default Skills;
