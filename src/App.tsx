import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useInView, animate } from 'framer-motion';

// ============ DATA ============
const EMAIL = 'aritra.sreemany@edu.em-lyon.com';
const PHONE = '+33 7 45 74 01 52';
const LINKEDIN = 'https://www.linkedin.com/in/aritra-sreemany-9171351ba/';
const LOCATION = 'Caluire-et-Cuire, Lyon, France';
const FORMSPREE = 'https://formspree.io/f/xkjrqjyb';

const CVS: { file: string; label: string; icon: string }[] = [
  { file: 'cv-general.pdf', label: 'General Business Internship', icon: 'fa-briefcase' },
  { file: 'cv-operations-supply-chain.pdf', label: 'Operations & Supply Chain', icon: 'fa-truck-fast' },
  { file: 'cv-project-management-operations.pdf', label: 'Project Management & Ops', icon: 'fa-diagram-project' },
  { file: 'cv-strategy-consulting.pdf', label: 'Strategy Consulting', icon: 'fa-chess-knight' },
  { file: 'cv-business-management.pdf', label: 'Business Management', icon: 'fa-building' },
  { file: 'cv-business-development.pdf', label: 'Business Development', icon: 'fa-handshake' },
  { file: 'cv-sales-marketing.pdf', label: 'Sales & Marketing', icon: 'fa-bullhorn' },
  { file: 'cv-luxury-marketing.pdf', label: 'Luxury Marketing', icon: 'fa-gem' },
  { file: 'cv-product-management.pdf', label: 'Product Management', icon: 'fa-cubes' },
  { file: 'cv-finance.pdf', label: 'Finance', icon: 'fa-chart-line' },
];

const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Expertise' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'credentials', label: 'Credentials' },
  { id: 'contact', label: 'Contact' },
];

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

// ============ SHARED BITS ============
function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span className={`inline-block px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] font-display ${dark ? 'bg-lime text-ink' : 'bg-lime text-ink'}`}>
      {children}
    </span>
  );
}

// heading that reveals word by word, like the template's scroll-in titles
function RevealHeading({ text, className = '', light = false }: { text: string; className?: string; light?: boolean }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <h2 ref={ref} className={`font-display font-bold text-3xl md:text-5xl leading-[1.15] ${className}`} style={light ? { color: '#fff' } : undefined}>
      {text.split(' ').map((w, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0.15, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * 0.06, duration: 0.45 }}
        >
          {w}
        </motion.span>
      ))}
    </h2>
  );
}

function Counter({ to, decimals = 0, prefix = '', suffix = '' }: { to: number; decimals?: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.6, ease: 'easeOut', onUpdate: (v) => setVal(v) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{prefix}{val.toFixed(decimals)}{suffix}</span>;
}

function Ring({ pct, size = 84, stroke = 6, track = 'rgba(255,255,255,0.15)', color = '#c6d936', children }: { pct: number; size?: number; stroke?: number; track?: string; color?: string; children?: React.ReactNode }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true });
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg ref={ref} width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={inView ? { strokeDashoffset: c * (1 - pct / 100) } : {}}
          transition={{ duration: 1.6, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[90] bg-ink/70 backdrop-blur-sm flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
            initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 w-10 h-10 rounded-full bg-mint hover:bg-lime text-ink transition-colors z-10">
              <i className="fas fa-xmark"></i>
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============ CV DROPDOWN ============
function CVDropdown({ label = 'Download CV', variant = 'lime', align = 'left', up = false }: { label?: string; variant?: 'lime' | 'dark' | 'outline'; align?: 'left' | 'right'; up?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const away = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener('mousedown', away);
    return () => document.removeEventListener('mousedown', away);
  }, []);
  const styles = {
    lime: 'bg-lime text-ink hover:bg-white',
    dark: 'bg-forest text-white hover:bg-lime hover:text-ink',
    outline: 'bg-transparent text-white border border-white/40 hover:bg-white hover:text-ink',
  }[variant];
  return (
    <div ref={ref} className="relative inline-block">
      <button onClick={() => setOpen((o) => !o)} className={`flex items-center gap-3 px-7 py-4 rounded-full font-display font-semibold text-sm transition-colors ${styles}`}>
        <i className="fas fa-download"></i>
        {label}
        <i className={`fas fa-chevron-down text-xs transition-transform ${open ? 'rotate-180' : ''}`}></i>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: up ? 8 : -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: up ? 8 : -8 }}
            className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} ${up ? 'bottom-full mb-2' : 'top-full mt-2'} w-72 bg-white rounded-xl shadow-2xl overflow-hidden z-50 border border-black/5`}
          >
            <div className="px-4 py-3 bg-forest text-white text-xs font-bold uppercase tracking-wider font-display">Pick the CV for the role</div>
            {CVS.map((cv) => (
              <a key={cv.file} href={`/${cv.file}`} download={`Aritra_Sreemany_CV_${cv.label.replace(/[^A-Za-z]+/g, '_')}.pdf`} onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-lime/30 transition-colors">
                <i className={`fas ${cv.icon} w-5 text-forest`}></i>
                {cv.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============ TOP BAR + NAVBAR ============
function TopBar() {
  return (
    <div className="hidden lg:flex bg-white border-b border-black/5 text-[13px] text-ink">
      <div className="flex-1 flex items-center gap-8 px-10 py-2.5">
        <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 hover:text-forest"><i className="fas fa-envelope text-forest"></i>{EMAIL}</a>
        <span className="flex items-center gap-2"><i className="fas fa-location-dot text-forest"></i>{LOCATION}</span>
      </div>
      <div className="bg-lime flex items-center gap-6 px-10 py-2.5 font-medium" style={{ clipPath: 'polygon(14px 0,100% 0,100% 100%,0 100%)' }}>
        <button onClick={() => scrollTo('about')} className="hover:underline">About</button>
        <button onClick={() => scrollTo('faq')} className="hover:underline">FAQs</button>
        <button onClick={() => scrollTo('contact')} className="hover:underline">Contact</button>
        <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
        <a href={`mailto:${EMAIL}`} aria-label="Email"><i className="fas fa-at"></i></a>
      </div>
    </div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState('home');
  useEffect(() => {
    const on = () => {
      setScrolled(window.scrollY > 60);
      for (const n of [...NAV].reverse()) {
        const el = document.getElementById(n.id);
        if (el && el.getBoundingClientRect().top < 140) { setActive(n.id); break; }
      }
    };
    window.addEventListener('scroll', on);
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <nav className={`sticky top-0 z-50 bg-white transition-shadow ${scrolled ? 'shadow-[0_8px_30px_rgba(0,0,0,0.06)]' : ''}`}>
      <div className="flex items-center justify-between px-5 lg:px-10 h-[78px]">
        <button onClick={() => scrollTo('home')} className="flex items-center gap-2.5">
          <svg width="40" height="40" viewBox="0 0 40 40" className="shrink-0 group" aria-label="AS monogram">
            <rect width="40" height="40" rx="11" fill="#1a4137" />
            <text x="20" y="22.5" textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif" fontWeight="800" fontSize="19" fill="#fff" letterSpacing="-1">AS</text>
            <line x1="9" y1="30" x2="31" y2="30" stroke="#c6d936" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="3 3.2">
              <animate attributeName="stroke-dashoffset" from="0" to="-12.4" dur="1.2s" repeatCount="indefinite" />
            </line>
            <circle cx="9" cy="30" r="2.6" fill="#c6d936" />
            <circle cx="31" cy="30" r="2.6" fill="#c6d936" />
          </svg>
          <span className="font-display font-bold text-2xl text-head">Aritra<span className="text-forest">.</span></span>
        </button>
        <div className="hidden lg:flex items-center gap-9">
          {NAV.map((n) => (
            <button key={n.id} onClick={() => scrollTo(n.id)}
              className={`relative font-display text-[15px] font-medium transition-colors ${active === n.id ? 'text-forest' : 'text-ink hover:text-forest'}`}>
              {n.label}
              {active === n.id && <motion.span layoutId="navline" className="absolute -bottom-2 left-0 right-0 h-0.5 bg-lime" />}
            </button>
          ))}
        </div>
        <div className="hidden lg:flex items-center gap-6">
          <a href={`tel:${PHONE.replace(/\s/g, '')}`} className="flex items-center gap-3 group">
            <span className="w-11 h-11 rounded-full bg-lime flex items-center justify-center text-ink group-hover:bg-forest group-hover:text-lime transition-colors"><i className="fas fa-phone"></i></span>
            <span className="text-xs leading-tight"><span className="block text-forest font-semibold">PHONE:</span><span className="text-ink text-sm">🇫🇷 {PHONE}</span></span>
          </a>
          <button onClick={() => scrollTo('contact')} className="rounded-full px-7 py-3.5 bg-forest text-white font-display font-semibold text-sm hover:bg-lime hover:text-ink transition-colors">Contact Now</button>
        </div>
        <button onClick={() => setMenu(!menu)} className="lg:hidden w-11 h-11 flex items-center justify-center bg-forest text-white" aria-label="Menu">
          <i className={`fas ${menu ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>
      </div>
      <AnimatePresence>
        {menu && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="lg:hidden overflow-hidden bg-forest">
            {NAV.map((n) => (
              <button key={n.id} onClick={() => { scrollTo(n.id); setMenu(false); }} className="rounded-full block w-full text-left px-6 py-3.5 text-white border-b border-white/10 font-display">{n.label}</button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ============ HERO SLIDER ============
const SLIDES = [
  { eyebrow: 'OPERATIONS, PLANNING & EXECUTION', l1: 'Delivering', l2: 'Industrial Projects', l3: 'On Schedule', side: '35 months running a €125M steel expansion package, from vendor PO to commissioning.' },
  { eyebrow: 'ANALYTICS, FORECASTING & STRATEGY', l1: 'Turning Data', l2: 'Into Decisions', l3: 'That Save Cost', side: 'Excel, Power BI and SAP trackers that cut tracking errors by 20%+ and steered raw-material planning.' },
  { eyebrow: 'MiM @ EMLYON BUSINESS SCHOOL · 2027', l1: 'Engineer', l2: 'Turned Business', l3: 'Generalist', side: 'Available for a business internship in France & Europe, January to December 2027.' },
];

function Hero() {
  const [i, setI] = useState(0);
  const [m, setM] = useState({ x: 50, y: 50 });
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % SLIDES.length), 6500);
    return () => clearInterval(t);
  }, []);
  const s = SLIDES[i];
  return (
    <section id="home" onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setM({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }); }}
      className="relative bg-ink overflow-hidden min-h-[640px] lg:min-h-[760px] flex items-center">
      <div className="absolute inset-0 grid-pattern opacity-70"></div>
      <div className="absolute inset-0 z-[1] pointer-events-none transition-[background] duration-300" style={{ background: `radial-gradient(420px circle at ${m.x}% ${m.y}%, rgba(198,217,54,0.14), transparent 70%)` }}></div>
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/95 to-forest/70"></div>
      {/* orbit visual, right side (replaces the template's photo backdrop) */}
      <div className="absolute right-[-6%] top-1/2 -translate-y-1/2 w-[620px] h-[620px] hidden md:block pointer-events-none">
        {[1, 0.74, 0.48].map((sc, k) => (
          <motion.div key={k} className="absolute inset-0 m-auto rounded-full border border-lime/25" style={{ width: `${sc * 100}%`, height: `${sc * 100}%` }}
            animate={{ rotate: k % 2 ? -360 : 360 }} transition={{ duration: 40 + k * 15, repeat: Infinity, ease: 'linear' }}>
            <span className="absolute -top-2 left-1/2 w-4 h-4 rounded-full bg-lime shadow-[0_0_24px_#c6d936]"></span>
          </motion.div>
        ))}
        <div className="absolute inset-0 m-auto w-40 h-40 rounded-full bg-lime/10 backdrop-blur flex items-center justify-center">
          <span className="font-display font-extrabold text-5xl text-lime">AS</span>
        </div>
      </div>
      {[
        { t: '€125M', s: 'capex package', x: '62%', y: '18%' },
        { t: '13+', s: 'vendors managed', x: '84%', y: '20%' },
        { t: 'B1', s: 'French · C2 English', x: '57%', y: '50%' },
      ].map((c, k) => (
        <motion.div key={k} className="absolute hidden lg:block bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-5 py-3 z-[5]" style={{ left: c.x, top: c.y }}
          animate={{ y: [0, -12, 0] }} transition={{ duration: 5, delay: k * 1.2, repeat: Infinity }}>
          <p className="font-display font-extrabold text-2xl text-lime leading-none">{c.t}</p>
          <p className="text-white/70 text-xs mt-1">{c.s}</p>
        </motion.div>
      ))}
      <div className="relative z-10 w-full px-6 lg:px-16 py-20 grid lg:grid-cols-[1.3fr_1fr] gap-10 items-end">
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }}>
            <p className="text-lime text-xs md:text-sm font-bold tracking-[0.14em] font-display underline underline-offset-4 decoration-lime/40 mb-6">{s.eyebrow}</p>
            <h1 className="font-display text-white leading-[1.02] text-5xl md:text-7xl lg:text-[88px]" style={{ color: '#fff' }}>
              <span className="block font-bold">{s.l1}</span>
              <span className="block font-light">{s.l2}</span>
              <span className="block font-bold">{s.l3}</span>
            </h1>
            <div className="flex flex-wrap gap-4 mt-10">
              <CVDropdown variant="lime" up />
              <button onClick={() => scrollTo('experience')} className="rounded-full px-7 py-4 border border-white/40 text-white font-display font-semibold text-sm hover:bg-white hover:text-ink transition-colors">View Experience</button>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="lg:pb-4">
          <AnimatePresence mode="wait">
            <motion.p key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-white font-display font-semibold text-lg max-w-sm lg:ml-auto">{s.side}</motion.p>
          </AnimatePresence>
          <div className="flex gap-3 mt-8 lg:justify-end">
            {SLIDES.map((_, k) => (
              <button key={k} onClick={() => setI(k)} aria-label={`Slide ${k + 1}`}
                className={`h-2.5 rounded-full transition-all ${k === i ? 'w-10 bg-lime' : 'w-2.5 bg-white/40 hover:bg-white'}`} />
            ))}
          </div>
        </div>
      </div>
      <button onClick={() => setI((i - 1 + SLIDES.length) % SLIDES.length)} aria-label="Previous slide" className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-white/20 text-white items-center justify-center hover:bg-lime hover:text-ink hover:border-lime transition-colors z-10"><i className="fas fa-arrow-left text-sm"></i></button>
      <button onClick={() => setI((i + 1) % SLIDES.length)} aria-label="Next slide" className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-white/20 text-white items-center justify-center hover:bg-lime hover:text-ink hover:border-lime transition-colors z-10"><i className="fas fa-arrow-right text-sm"></i></button>
    </section>
  );
}

// ============ MARQUEE (own addition) ============
function Marquee({ items, dark = false }: { items: string[]; dark?: boolean }) {
  const row = [...items, ...items];
  return (
    <div className={`overflow-hidden py-5 ${dark ? 'bg-forest' : 'bg-lime'} -rotate-1 scale-[1.02]`}>
      <motion.div className="flex gap-10 whitespace-nowrap w-max" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}>
        {row.map((t, k) => (
          <span key={k} className={`font-display font-bold text-2xl md:text-3xl flex items-center gap-10 ${dark ? 'text-white' : 'text-ink'}`}>
            {t}<i className={`fas fa-asterisk text-lg ${dark ? 'text-lime' : 'text-forest'}`}></i>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ============ ABOUT ============
function About() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <section id="about" className="py-24 lg:py-32 px-6 lg:px-16 bg-white">
      <div className="max-w-[1344px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div className="relative pb-16 pr-10">
          <div className="bg-white p-3 shadow-[0_20px_60px_rgba(0,0,0,0.1)] w-[85%]">
            <div className="relative aspect-[4/5] bg-forest overflow-hidden">
              <img src="/aritra-suit.jpg" alt="Aritra Sreemany in a suit" className="w-full h-full object-cover object-top" />
            </div>
          </div>
          <motion.div whileHover={{ y: -6 }} className="absolute right-0 bottom-0 w-[52%] bg-white p-3 shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
            <div className="aspect-square bg-forest grid-pattern flex flex-col items-center justify-center text-center p-4">
              <span className="font-display font-bold text-5xl text-lime"><Counter to={125} prefix="€" suffix="M" /></span>
              <span className="text-white/80 text-sm mt-2">BOF expansion project delivered on site</span>
            </div>
          </motion.div>
          <motion.button onClick={() => scrollTo('credentials')} whileHover={{ scale: 1.04 }} className="absolute left-6 bottom-24 bg-white shadow-xl px-5 py-4 text-left">
            <span className="block font-display font-bold text-head text-sm mb-2">Credentials</span>
            <span className="flex items-center">
              {['fa-chess-knight', 'fa-industry', 'fa-leaf', 'fa-python'].map((ic, k) => (
                <span key={k} className="w-8 h-8 -ml-2 first:ml-0 rounded-full bg-mint border-2 border-white flex items-center justify-center text-forest text-xs"><i className={`${ic === 'fa-python' ? 'fab' : 'fas'} ${ic}`}></i></span>
              ))}
              <span className="w-8 h-8 -ml-2 rounded-full bg-lime border-2 border-white flex items-center justify-center text-ink text-[10px] font-bold">5+</span>
            </span>
          </motion.button>
        </div>
        <div ref={ref}>
          <Eyebrow>About Me</Eyebrow>
          <RevealHeading text="The Journey From Engineering To Business" className="mt-5" />
          <p className="mt-6 leading-8">
            Mechanical engineer from IIEST Shibpur (CGPA 8.93), now a MiM student at emlyon business school specialising in Business Analytics &amp; Consulting, through a dual-degree with MDI Gurgaon. Before this I spent 35 months as Associate Manager, Operations at Jindal Stainless, India's largest stainless steel maker.
          </p>
          <div className="mt-8 space-y-6">
            {[
              { ic: 'fa-diagram-project', t: 'Project Execution', d: 'Led the full RMHS package of a €125M BOF expansion, from planning and vendor negotiation to commissioning.' },
              { ic: 'fa-chart-pie', t: 'Planning & Analytics', d: 'Built rolling 3-month raw-material plans and Excel / Power BI trackers that leadership used for decisions.' },
            ].map((f) => (
              <div key={f.t} className="flex gap-5 group">
                <span className="w-14 h-14 shrink-0 rounded-full border border-forest/20 flex items-center justify-center text-forest text-xl group-hover:bg-lime group-hover:border-lime transition-colors"><i className={`fas ${f.ic}`}></i></span>
                <div><h4 className="font-display font-bold text-lg">{f.t}</h4><p className="mt-1 leading-7">{f.d}</p></div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <div className="flex justify-between font-display font-bold text-head text-sm mb-2"><span>Hands-on industry experience</span><span>35 months</span></div>
            <div className="h-1.5 bg-mint rounded-full overflow-hidden">
              <motion.div className="h-full bg-forest" initial={{ width: 0 }} animate={inView ? { width: '88%' } : {}} transition={{ duration: 1.6 }} />
            </div>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-8">
            <button onClick={() => scrollTo('services')} className="rounded-full px-8 py-4 bg-forest text-white font-display font-semibold text-sm hover:bg-lime hover:text-ink transition-colors">What I Do</button>
            <div className="flex items-center gap-3">
              <img src="/aritra-photo.jpg" alt="" className="w-12 h-12 rounded-full object-cover border-2 border-lime" />
              <div><p className="text-2xl text-head" style={{ fontFamily: 'Caveat, cursive' }}>Aritra Sreemany</p><p className="text-xs text-forest font-semibold">MiM, emlyon '28</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ SERVICES (EXPERTISE) ============
const SERVICES = [
  { n: '01', t: 'Operations & Supply Chain', ic: 'fa-truck-fast', d: 'Production planning, raw-material forecasting and sourcing decisions under supply shifts.', pts: ['Rolling 3-month production plans setting the stainless grade mix', 'Raw-material forecasts 3 months ahead driving procurement', 'Import vs domestic sourcing calls, flagging shortages early', 'Daily output vs plan monitoring with alternate plans'], cv: 'cv-operations-supply-chain.pdf' },
  { n: '02', t: 'Project Management', ic: 'fa-diagram-project', d: 'End-to-end package delivery on a €125M capex project, from POs to commissioning.', pts: ['Led an 18-member team commissioning BOF-1 & 2 and a Twin Ladle Furnace', 'Recovered a year-long RMHS delay, finishing 9+ months ahead of other teams', 'Systematised on-site material tracking with live inventory status', 'Bi-monthly reports to senior leadership'], cv: 'cv-project-management-operations.pdf' },
  { n: '03', t: 'Procurement & Cost', ic: 'fa-handshake', d: 'Vendor negotiation, billing reconciliation and cost optimisation in CAPEX.', pts: ['Negotiated pricing & POs with 13+ vendors and EPC contractors', 'Reconciled €45k–€72k monthly billing in SAP & Excel for audit compliance', 'Plant liaison on an overseas cost-optimisation software rollout'], cv: 'cv-business-development.pdf' },
  { n: '04', t: 'Analytics & Reporting', ic: 'fa-chart-column', d: 'Excel, Power BI and SAP trackers that turn site data into decisions.', pts: ['Power BI & Excel trackers that cut tracking errors 20%+', 'Advanced Excel, financial modelling, Python basics', 'Month-end reconciliations for leadership reviews'], cv: 'cv-general.pdf' },
  { n: '05', t: 'Strategy & Consulting', ic: 'fa-chess-knight', d: 'Structured problem-solving sharpened by case competitions and consulting coursework.', pts: ['Top 99 of 1,344 teams, Global Management Challenge India 2026', 'BCG Strategy Consulting & McKinsey Forward programs', 'emlyon specialisation in Business Analytics & Consulting'], cv: 'cv-strategy-consulting.pdf' },
  { n: '06', t: 'Marketing & Growth', ic: 'fa-bullhorn', d: 'Customer segmentation, pricing and retention, tested in simulation and campus work.', pts: ['7-round brokerage marketing simulation: segments, pricing, discounts', 'Brought brand partners to IIEST tech fests', 'Ran a weekly student newsletter as ASME Co-Secretary'], cv: 'cv-sales-marketing.pdf' },
];

function Services() {
  const [start, setStart] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const per = typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : typeof window !== 'undefined' && window.innerWidth < 1200 ? 2 : 3;
  const visible = Array.from({ length: per }, (_, k) => (start + k) % SERVICES.length);
  const sel = open !== null ? SERVICES[open] : null;
  return (
    <section id="services" className="relative py-24 lg:py-32 bg-paper grid-pattern-light overflow-hidden">
      <div className="absolute right-0 top-0 h-[300px] w-full lg:w-[42%] bg-forest">
        <svg className="absolute right-10 top-6 opacity-20" width="260" height="260" viewBox="0 0 260 260"><circle cx="130" cy="130" r="120" stroke="#c6d936" fill="none" /><circle cx="130" cy="130" r="80" stroke="#c6d936" fill="none" /></svg>
      </div>
      <div className="relative max-w-[1344px] mx-auto px-6 lg:px-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div><Eyebrow>Expertise</Eyebrow><RevealHeading text="What I Bring To Your Team" className="mt-5" /></div>
          <div className="flex gap-3 relative z-10">
            <button onClick={() => setStart((start - 1 + SERVICES.length) % SERVICES.length)} aria-label="Previous" className="w-12 h-12 rounded-full bg-white text-ink hover:bg-lime transition-colors"><i className="fas fa-arrow-left"></i></button>
            <button onClick={() => setStart((start + 1) % SERVICES.length)} aria-label="Next" className="w-12 h-12 rounded-full bg-lime text-ink hover:bg-white transition-colors"><i className="fas fa-arrow-right"></i></button>
          </div>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {visible.map((idx) => {
              const s = SERVICES[idx];
              return (
                <motion.button layout key={s.n} onClick={() => setOpen(idx)} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
                  className="group relative text-left bg-ink grid-pattern min-h-[420px] p-9 flex flex-col overflow-hidden">
                  <span className="absolute inset-0 bg-forest translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>
                  <i className={`relative fas ${s.ic} text-5xl text-lime`}></i>
                  <span className="relative mt-auto font-display font-bold text-lime text-lg">{s.n}</span>
                  <h3 className="relative font-display font-bold text-2xl mt-2" style={{ color: '#fff' }}>{s.t}</h3>
                  <p className="relative text-white/70 mt-3 leading-7 text-[15px]">{s.d}</p>
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-24 rounded-full bg-forest group-hover:bg-lime flex items-center justify-center text-white group-hover:text-ink transition-colors"><i className="fas fa-arrow-up-right-from-square text-sm"></i></span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
        <div className="flex justify-center gap-2 mt-10">
          {SERVICES.map((_, k) => <button key={k} onClick={() => setStart(k)} aria-label={`Go to ${k + 1}`} className={`h-2 rounded-full transition-all ${k === start ? 'w-8 bg-forest' : 'w-2 bg-forest/25'}`} />)}
        </div>
      </div>
      <Modal open={!!sel} onClose={() => setOpen(null)}>
        {sel && (
          <div>
            <div className="bg-ink grid-pattern p-8 pr-16">
              <i className={`fas ${sel.ic} text-4xl text-lime`}></i>
              <p className="text-lime font-display font-bold mt-5">{sel.n}</p>
              <h3 className="font-display font-bold text-3xl" style={{ color: '#fff' }}>{sel.t}</h3>
            </div>
            <div className="p-8">
              <p className="leading-7">{sel.d}</p>
              <ul className="mt-5 space-y-3">{sel.pts.map((p) => <li key={p} className="flex gap-3 text-ink"><i className="fas fa-check text-forest mt-1.5"></i>{p}</li>)}</ul>
              <a href={`/${sel.cv}`} download className="rounded-full inline-flex items-center gap-2 mt-8 px-6 py-3.5 bg-forest text-white font-display font-semibold text-sm hover:bg-lime hover:text-ink transition-colors"><i className="fas fa-download"></i>Download the matching CV</a>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}

// ============ MISSION & VISION (TABS) ============
const TABS = [
  { k: 'About Me', p: 'I like problems where operations, numbers and people meet. At Jindal Stainless that meant chasing EPC contractors, reconciling bills in SAP and rebuilding production plans when supply shifted overnight.', list: ['Cross-functional leadership', 'Stakeholder management', 'Root cause analysis', 'Cost optimisation'] },
  { k: 'What I Bring', p: 'Three years of shop-floor reality plus business-school frameworks. I can build the tracker, run the vendor call and present the result to leadership in the same week.', list: ['Advanced Excel & Power BI', 'SAP & ERP workflows', 'Vendor & EPC negotiation', 'Leadership reporting'] },
  { k: "What I'm Looking For", p: 'A 2027 internship in France or Europe in operations, supply chain, strategy, consulting, business development or project management, where I can own a real deliverable from week one.', list: ['Start: January 2027', 'Location: Lyon, Paris or remote', 'French B1 · English C2', 'Full-time internship'] },
];

function MissionVision() {
  const [t, setT] = useState(0);
  return (
    <section className="py-24 lg:py-32 px-6 lg:px-16 bg-white">
      <div className="max-w-[1344px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <Eyebrow>Mission &amp; Vision</Eyebrow>
          <RevealHeading text="I Handle The Complexity, So Projects Ship On Time." className="mt-5" />
          <div className="mt-10 flex border-b border-black/10">
            {TABS.map((tab, k) => (
              <button key={tab.k} onClick={() => setT(k)} className={`relative flex-1 pb-4 font-display font-semibold text-sm md:text-base transition-colors ${t === k ? 'text-head' : 'text-mute hover:text-forest'}`}>
                {tab.k}
                {t === k && <motion.span layoutId="tabline" className="absolute left-0 right-0 -bottom-px h-0.5 bg-forest" />}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={t} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-7">
              <p className="leading-8">{TABS[t].p}</p>
              <div className="grid sm:grid-cols-2 gap-3 mt-6">
                {TABS[t].list.map((l) => <span key={l} className="flex items-center gap-2.5 font-display font-semibold text-head text-[15px]"><i className="fas fa-check text-forest"></i>{l}</span>)}
              </div>
            </motion.div>
          </AnimatePresence>
          <button onClick={() => scrollTo('contact')} className="rounded-full mt-10 px-8 py-4 bg-forest text-white font-display font-semibold text-sm hover:bg-lime hover:text-ink transition-colors">Let's Talk</button>
        </div>
        <div className="relative">
          <div className="ml-auto w-[80%] aspect-[4/5] bg-forest grid-pattern relative overflow-hidden">
            <div className="absolute top-8 left-8 right-8 grid grid-cols-4 gap-2">
              {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((mo, k) => (
                <motion.span key={mo} initial={{ opacity: 0, scale: 0.6 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: k * 0.05 }}
                  className="rounded-lg bg-lime/15 border border-lime/30 text-lime text-xs font-bold py-3 text-center hover:bg-lime hover:text-ink transition-colors cursor-default">{mo}</motion.span>
              ))}
            </div>
            <div className="absolute bottom-8 right-8 text-right">
              <p className="text-lime font-display font-bold text-sm tracking-widest">AVAILABLE</p>
              <p className="font-display font-bold text-4xl" style={{ color: '#fff' }}>Jan – Dec<br />2027</p>
            </div>
          </div>
          <div className="absolute left-0 bottom-10 bg-lime p-7 w-[60%] min-w-[240px] shadow-2xl">
            {[{ v: 89, label: 'B.Tech CGPA', show: <Counter to={8.93} decimals={2} /> }, { v: 88, label: 'Months in industry', show: <Counter to={35} /> }].map((s, k) => (
              <div key={k} className={`flex items-center gap-5 ${k ? 'pt-5 mt-5 border-t border-ink/15' : ''}`}>
                <Ring pct={s.v} size={64} stroke={5} track="rgba(16,41,48,0.15)" color="#102930"><i className="fas fa-arrow-trend-up text-ink text-sm"></i></Ring>
                <div><p className="font-display font-bold text-3xl text-ink">{s.show}</p><p className="font-display font-semibold text-ink text-sm">{s.label}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ GROWTH STATS BAND ============
function Growth() {
  const stats = [
    { pct: 76, big: <Counter to={13} suffix="+" />, t: 'Vendors & EPCs', d: 'Negotiated pricing, POs and lead times' },
    { pct: 72, big: <Counter to={18} />, t: 'Member team', d: 'Led through BOF-1 & 2 commissioning' },
    { pct: 20, big: <Counter to={20} suffix="%+" />, t: 'Fewer errors', d: 'From Excel & Power BI trackers' },
    { pct: 75, big: <Counter to={9} suffix="+" />, t: 'Months recovered', d: 'On a year-delayed RMHS package' },
  ];
  return (
    <section className="relative bg-ink overflow-hidden">
      <div className="absolute inset-0 grid-pattern"></div>
      <div className="relative max-w-[1344px] mx-auto px-6 lg:px-16 py-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div><Eyebrow>Impact In Numbers</Eyebrow><RevealHeading text="Building Results On The Shop Floor" light className="mt-5" /></div>
          <button onClick={() => scrollTo('experience')} className="rounded-full self-start lg:self-auto px-8 py-4 bg-lime text-ink font-display font-semibold text-sm hover:bg-white transition-colors">See The Work</button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-16">
          {stats.map((s) => (
            <motion.div key={s.t} whileHover={{ y: -6 }} className="flex items-center gap-5">
              <Ring pct={s.pct}><span className="font-display font-bold text-white text-lg">{s.big}</span></Ring>
              <div><h4 className="font-display font-bold text-lg" style={{ color: '#fff' }}>{s.t}</h4><p className="text-white/60 text-sm leading-6 mt-1">{s.d}</p></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ HOW IT WORKS → JOURNEY ============
const JOURNEY = [
  { n: '01', t: 'Engineering', s: 'IIEST Shibpur · 2019–23', d: 'B.Tech Mechanical, CGPA 8.93. Coursework in project & operations management, data science and industrial engineering. Design internship at Primetals Technologies.' },
  { n: '02', t: 'Industry', s: 'Jindal Stainless · 2023–26', d: 'Associate Manager, Operations. RMHS package execution on a €125M BOF expansion, then raw-material planning for stainless steel production.' },
  { n: '03', t: 'Management', s: 'MDI Gurgaon · 2026–28', d: 'PGDM in International Business, the dual-degree partner programme that sends me to emlyon for 2027.' },
  { n: '04', t: 'Europe', s: 'emlyon business school · 2027', d: 'Master in Management, specialising in Business Analytics & Consulting. Looking for an internship in France & Europe.' },
];

function Journey() {
  const [a, setA] = useState(0);
  return (
    <section className="relative py-24 lg:py-32 px-6 lg:px-16 bg-paper overflow-hidden">
      <svg className="absolute -left-24 bottom-0 opacity-40" width="320" height="320"><circle cx="160" cy="160" r="150" stroke="#1a4137" strokeOpacity=".15" fill="none" /><circle cx="160" cy="160" r="110" stroke="#1a4137" strokeOpacity=".15" fill="none" /></svg>
      <div className="relative max-w-[1344px] mx-auto text-center">
        <Eyebrow>How I Got Here</Eyebrow>
        <RevealHeading text="Learn, Build, Lead & Grow Across Two Continents." className="mt-5 max-w-3xl mx-auto" />
        <div className="mt-16 bg-white border border-black/5 grid md:grid-cols-2 lg:grid-cols-4 text-left">
          {JOURNEY.map((j, k) => (
            <button key={j.n} onClick={() => setA(k)} onMouseEnter={() => setA(k)} className={`group p-9 text-left border-black/5 ${k ? 'lg:border-l' : ''} ${k % 2 ? 'md:border-l' : ''} border-t md:border-t-0 transition-colors ${a === k ? 'bg-mint' : 'hover:bg-mint/60'}`}>
              <span className={`font-display font-bold text-6xl outline-num ${a === k ? 'active' : ''}`}>{j.n}</span>
              <h4 className="font-display font-bold text-xl mt-5">{j.t}</h4>
              <p className="text-forest font-semibold text-sm mt-1">{j.s}</p>
              <AnimatePresence initial={false}>
                {a === k && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="text-sm leading-6 mt-3 overflow-hidden">{j.d}</motion.p>}
              </AnimatePresence>
            </button>
          ))}
        </div>
        <p className="mt-12 font-display font-semibold text-head text-lg">Hiring for a 2027 internship in France? <button onClick={() => scrollTo('contact')} className="text-forest underline underline-offset-4 decoration-lime decoration-2 hover:text-ink">Let's connect</button></p>
      </div>
    </section>
  );
}

// ============ EXPERIENCE (ACCORDION) ============
const ROLES = [
  { t: 'Project Execution: RMHS Package, BOF Expansion', pts: ['Led the full RMHS package from planning to commissioning in a €125.19M BOF expansion', 'Negotiated pricing & purchase orders with 13+ vendors & EPC contractors on cost & lead times', 'Led an 18-member team in site commissioning of BOF-1 & 2, Ladle addition & Twin Ladle Furnace', 'Overcame a year-long delay on the RMHS package, recovering 9+ months ahead of other teams', 'Reconciled €45k–€72k monthly vendor billing in SAP & Excel, ensuring audit compliance', 'Engineered Excel & Power BI trackers for package progress & materials, cutting errors 20%+'] },
  { t: 'Planning & Optimisation: Raw Material Planning', pts: ['Formulated rolling 3-month production plans, setting SS grade mix for quality & raw material cost', 'Forecasted raw material needs 3 months ahead, driving procurement & supply chain planning', 'Prioritised import & domestic sourcing as supply shifted, flagging shortages early', 'Presented bi-monthly production reports to senior leadership with month-end reconciliations', 'Plant liaison with the overseas software team on a cost-optimisation tool rollout'] },
  { t: 'Design Internship: Primetals Technologies (2022)', pts: ['Designed & validated a hydraulic ladle tilter in SolidWorks', 'Worked with the design team on load and safety checks for steel-plant equipment'] },
];

function Experience() {
  const [o, setO] = useState(0);
  return (
    <section id="experience" className="bg-mint">
      <div className="grid lg:grid-cols-2">
        <div className="relative bg-forest min-h-[420px] grid-pattern overflow-hidden">
          <svg className="absolute inset-x-0 bottom-0 w-full h-[70%] opacity-40" viewBox="0 0 600 300" preserveAspectRatio="none">
            <motion.path d="M0 260 L60 260 L60 180 L110 180 L110 120 L150 120 L150 200 L210 200 L210 90 L240 90 L240 60 L270 60 L270 200 L330 200 L330 150 L400 150 L400 230 L460 230 L460 110 L500 110 L500 230 L600 230"
              fill="none" stroke="#c6d936" strokeWidth="2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2.5 }} />
            {[[255, 40], [225, 70], [485, 90]].map(([x, y], k) => (
              <motion.circle key={k} cx={x} cy={y} r="6" fill="#c6d936" animate={{ cy: [y, y - 30], opacity: [0.8, 0] }} transition={{ duration: 2.4, delay: k * 0.7, repeat: Infinity }} />
            ))}
          </svg>
          <div className="absolute top-10 left-8 lg:left-16 right-8">
            <p className="text-lime font-display font-bold text-sm tracking-widest">JINDAL STAINLESS LIMITED</p>
            <p className="font-display font-bold text-3xl lg:text-4xl mt-2" style={{ color: '#fff' }}>India's largest stainless steel manufacturer</p>
            <p className="text-white/70 mt-2">Associate Manager, Operations · Jul 2023 – Jun 2026 (35 months)</p>
            <span className="inline-flex items-center gap-2 mt-4 bg-lime/15 border border-lime/40 text-lime text-xs font-bold px-3 py-1.5 rounded-full"><i className="fas fa-circle-check"></i>Responsibilities verified by my reporting manager (AGM)</span>
            <div className="flex flex-wrap gap-3 mt-6">
              {[['11', 'conveyor lines'], ['3.4 km', 'of belt'], ['5,300+', 'idlers']].map(([v, l]) => (
                <span key={l} className="bg-white/10 backdrop-blur rounded-xl px-4 py-2"><b className="font-display text-lime text-lg">{v}</b> <span className="text-white/70 text-xs">{l}</span></span>
              ))}
            </div>
          </div>
          {/* floating chart card like the template */}
          <motion.div whileHover={{ y: -8 }} className="absolute right-8 bottom-10 bg-white p-5 shadow-2xl w-64">
            <div className="flex justify-between items-start"><div><p className="text-xs text-mute">Tracking errors</p><p className="font-display font-bold text-2xl text-head">−20%+</p></div><span className="text-xs bg-lime px-2 py-0.5 font-bold text-ink">Power BI</span></div>
            <div className="flex items-end gap-2 h-20 mt-3">
              {[80, 72, 66, 58, 52, 46, 40].map((h, k) => <motion.span key={k} initial={{ height: 0 }} whileInView={{ height: `${h}%` }} viewport={{ once: true }} transition={{ delay: k * 0.08 }} className={`flex-1 ${k === 6 ? 'bg-lime' : 'bg-forest'}`} />)}
            </div>
          </motion.div>
        </div>
        <div className="px-6 lg:px-16 py-20">
          <Eyebrow>Experience</Eyebrow>
          <RevealHeading text="Driving Results Through Execution & Planning." className="mt-5" />
          <div className="mt-10 space-y-3">
            {ROLES.map((r, k) => (
              <div key={r.t} className={`transition-colors ${o === k ? 'bg-white shadow-lg' : ''}`}>
                <button onClick={() => setO(o === k ? -1 : k)} className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left font-display font-bold text-head">
                  {r.t}<i className={`fas fa-chevron-${o === k ? 'down' : 'right'} text-sm text-forest`}></i>
                </button>
                <AnimatePresence initial={false}>
                  {o === k && (
                    <motion.ul initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden px-6">
                      {r.pts.map((p) => <li key={p} className="flex gap-3 text-[15px] leading-7 pb-2"><i className="fas fa-circle text-[6px] text-forest mt-3"></i>{p}</li>)}
                      <li className="pb-5"></li>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ PROJECTS (CASE STUDY) ============
type Project = { tag: string; t: string; ic: string; d: string; res: string; img?: string; stats?: [string, string][]; link?: { href: string; label: string } };
const PROJECTS: Project[] = [
  { tag: 'Operations', t: 'RMHS Conveyor Package & Material Tracking', ic: 'fa-boxes-stacked', d: 'Mapped specifications, generated material codes and ran live inventory checks for the entire Raw Material Handling System of the BOF expansion: belts, idlers, frames and spares across every conveyor line, from purchase order to erection.', res: 'Erection & commissioning of the full RMHS circuit for BOF-1 & 2, Ladle addition & Twin Ladle Furnace', stats: [['11', 'conveyor lines'], ['3.4 km', 'conveyor belt'], ['5,300+', 'idlers tracked']] },
  { tag: 'Analytics', t: 'Package Progress Dashboards', ic: 'fa-chart-column', d: 'Excel and Power BI trackers for package progress and site materials, used in leadership reviews and month-end reconciliations.', res: 'Tracking errors cut by 20%+' },
  { tag: 'Project Recovery', t: 'Turning Around A Delayed Package', ic: 'fa-rotate', d: 'Took over an RMHS package running almost a year late and pulled it back through daily EPC follow-ups, tighter sequencing and cross-functional coordination.', res: '9+ months recovered, ahead of other teams' },
  { tag: 'Engineering', t: 'EGR-Integrated Catalysed DPF', ic: 'fa-car-side', img: '/certs/techgium-dpf-cad.jpg', d: 'L&T TECHgium 5th Edition proof of concept: raising NO2 concentration through exhaust gas recirculation to drive catalytic passive regeneration of a diesel particulate filter for BS6 engines. Built the CAD model of the DPF assembly and porous cordierite core.', res: 'National Finalist, L&T TECHgium 2022' },
  { tag: 'Research', t: 'Cascade Refrigeration Systems', ic: 'fa-snowflake', img: '/certs/paper-ishrae.jpg', d: 'Thermo-economic analysis of a two-stage cascade refrigeration system using R41/R161, published in the ISHRAE Journal, and a thermodynamic and cost assessment with different refrigerants published as a Springer Nature chapter (INCOM 2024).', res: 'Two peer-reviewed publications', link: { href: 'https://doi.org/10.1007/978-981-97-7308-4_10', label: 'Read on Springer' } },
  { tag: 'Engineering', t: 'Hydraulic Ladle Tilter', ic: 'fa-gears', img: '/certs/primetals-internship.jpg', d: 'Design internship at Primetals Technologies (a Mitsubishi Heavy Industries joint venture), June to July 2022: designed and validated a hydraulic ladle tilter in SolidWorks.', res: 'Internship completed with appreciable performance', link: { href: '/docs/Primetals_Internship_Certificate.pdf', label: 'Internship certificate' } },
  { tag: 'Marketing', t: 'Brokerage Marketing Simulation', ic: 'fa-bullseye', d: 'Seven-round simulation: analysed customer segments, pricing and discounts to grow retention and acquisition.', res: 'Retention & acquisition gains' },
];

function Projects() {
  const [act, setAct] = useState(1);
  const [open, setOpen] = useState<number | null>(null);
  const [filter, setFilter] = useState('All');
  const tags = ['All', ...Array.from(new Set(PROJECTS.map((p) => p.tag)))];
  const list = PROJECTS.map((p, k) => ({ ...p, k })).filter((p) => filter === 'All' || p.tag === filter);
  const sel = open !== null ? PROJECTS[open] : null;
  return (
    <section id="projects" className="relative py-24 lg:py-32 px-6 lg:px-16 bg-white">
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-paper"></div>
      <div className="relative max-w-[1344px] mx-auto">
        <div className="text-center">
          <Eyebrow>Case Studies</Eyebrow>
          <RevealHeading text="Showcasing Projects & Results From Real Work." className="mt-5 max-w-3xl mx-auto" />
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {tags.map((t) => <button key={t} onClick={() => setFilter(t)} className={`px-4 py-2 text-sm font-display font-semibold rounded-full border transition-colors ${filter === t ? 'bg-forest text-white border-forest' : 'border-black/10 text-ink hover:border-forest'}`}>{t}</button>)}
          </div>
        </div>
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <AnimatePresence>
            {list.map((p) => (
              <motion.button layout key={p.t} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                onMouseEnter={() => setAct(p.k)} onClick={() => setOpen(p.k)}
                className={`group relative h-[360px] text-left overflow-hidden rounded-xl ${act === p.k ? 'bg-ink' : 'bg-forest'}`}>
                <div className="absolute inset-0 grid-pattern"></div>
                {p.img && <img src={p.img} alt="" loading="lazy" className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${act === p.k ? 'opacity-45 scale-105' : 'opacity-25'}`} />}
                <i className={`fas ${p.ic} absolute right-6 top-6 text-[120px] text-white/[0.07] group-hover:text-lime/20 transition-colors`}></i>
                <span className={`absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white text-ink flex items-center justify-center transition-all ${act === p.k ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}><i className="fas fa-arrow-right"></i></span>
                <div className={`absolute left-5 right-5 bottom-5 p-6 rounded-lg transition-colors ${act === p.k ? 'bg-forest' : 'bg-white'}`}>
                  <p className={`text-xs font-semibold ${act === p.k ? 'text-lime' : 'text-forest'}`}>{p.tag}</p>
                  <h4 className="font-display font-bold text-xl mt-1" style={act === p.k ? { color: '#fff' } : undefined}>{p.t}</h4>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
      <Modal open={!!sel} onClose={() => setOpen(null)}>
        {sel && (
          <div>
            <div className="bg-forest grid-pattern p-8 pr-16"><p className="text-lime text-sm font-semibold">{sel.tag}</p><h3 className="font-display font-bold text-3xl mt-1" style={{ color: '#fff' }}>{sel.t}</h3></div>
            <div className="p-8">
              {sel.img && <img src={sel.img} alt={sel.t} className="w-full max-h-72 object-contain bg-mint rounded-xl mb-6" />}
              <p className="leading-8">{sel.d}</p>
              {sel.stats && <div className="grid grid-cols-3 gap-3 mt-6">{sel.stats.map(([v, l]) => <div key={l} className="bg-mint rounded-xl p-4 text-center"><p className="font-display font-extrabold text-2xl text-forest">{v}</p><p className="text-xs mt-1">{l}</p></div>)}</div>}
              <p className="mt-6 inline-flex items-center gap-2 bg-lime px-4 py-2 rounded-full font-display font-bold text-ink text-sm"><i className="fas fa-trophy"></i>{sel.res}</p>
              {sel.link && <a href={sel.link.href} target="_blank" rel="noopener noreferrer" className="block mt-5 text-forest font-display font-semibold underline decoration-lime decoration-2 underline-offset-4">{sel.link.label} <i className="fas fa-arrow-right text-xs"></i></a>}
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}

// ============ CREDENTIALS (TEAM CARDS) ============
type Cert = { t: string; by: string; yr: string; ic: string; img?: string; pdf?: string; code?: string; link?: string };
const CERTS: Cert[] = [
  { t: 'Introduction to Strategy Consulting', by: 'BCG · Forage job simulation', yr: '2026', ic: 'fa-chess-knight', img: '/certs/bcg-strategy.jpg', pdf: '/docs/BCG_Strategy_Consulting_Certificate.pdf', code: '6af8c9b836af9db3eb1b7009' },
  { t: 'Project Manager Job Simulation', by: 'Siemens · Forage', yr: '2026', ic: 'fa-industry', img: '/certs/siemens-pm.jpg', pdf: '/docs/Siemens_Project_Manager_Certificate.pdf', code: '6a63eda1e22952070f093c62' },
  { t: 'Forward Program', by: 'McKinsey & Company', yr: '2026', ic: 'fa-forward' },
  { t: 'ESG Fundamentals', by: 'TATA', yr: '2026', ic: 'fa-leaf' },
  { t: 'Learn Python: Basics to Data Structures', by: 'Udemy · 6.5 hours', yr: '2021', ic: 'fa-code', img: '/certs/python-udemy.jpg', pdf: '/docs/Python_Udemy_Certificate.pdf' },
  { t: 'ASME HPVC: Critical Design Review', by: 'Team Ragnar · Global Rank 9, National Rank 3', yr: '2021', ic: 'fa-bicycle', img: '/certs/asme-hpvc.jpg', pdf: '/docs/ASME_HPVC_Certificate.pdf' },
  { t: 'L&T TECHgium 5th Edition', by: 'National Finalist · L&T Technology Services', yr: '2022', ic: 'fa-medal', img: '/certs/techgium-finalist.jpg', pdf: '/docs/TECHgium_Finalist_Certificate.pdf' },
  { t: 'Published Research Chapter', by: 'Springer Nature · Advances in Energy & Sustainability', yr: '2024', ic: 'fa-book-open', img: '/certs/springer-chapter.jpg', link: 'https://doi.org/10.1007/978-981-97-7308-4_10' },
  { t: 'Design Internship Certificate', by: 'Primetals Technologies (Mitsubishi Heavy Industries JV)', yr: '2022', ic: 'fa-gears', img: '/certs/primetals-internship.jpg', pdf: '/docs/Primetals_Internship_Certificate.pdf' },
  { t: 'B.Tech Mechanical Engineering', by: 'IIEST Shibpur · First Class', yr: '2023', ic: 'fa-graduation-cap', img: '/certs/btech-iiest.jpg', pdf: '/docs/BTech_Degree_IIEST.pdf' },
  { t: 'Global Management Challenge India', by: 'Top 99 of 1,344 teams · 1st in group', yr: '2026', ic: 'fa-trophy' },
];

function Credentials() {
  const [open, setOpen] = useState<number | null>(null);
  const [view, setView] = useState<number | null>(null);
  const sel = view !== null ? CERTS[view] : null;
  return (
    <section id="credentials" className="py-24 lg:py-32 px-6 lg:px-16 bg-white">
      <div className="max-w-[1344px] mx-auto">
        <div className="text-center">
          <Eyebrow>Credentials</Eyebrow>
          <RevealHeading text="Certifications & Awards Behind The Work." className="mt-5 max-w-3xl mx-auto" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
          {CERTS.map((c, k) => {
            const on = open === k;
            return (
              <motion.div key={c.t} whileHover={{ y: -6 }} className="rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.07)]">
                <button onClick={() => setView(k)} className={`relative w-full aspect-[4/3] flex items-center justify-center transition-colors ${on ? 'bg-gradient-to-b from-mint to-lime/60' : 'bg-mint'}`}>
                  {c.img
                    ? <img src={c.img} alt={c.t} loading="lazy" className="absolute inset-3 w-[calc(100%-1.5rem)] h-[calc(100%-1.5rem)] object-contain bg-white rounded shadow-sm" />
                    : <i className={`fas ${c.ic} text-6xl ${on ? 'text-ink' : 'text-forest/70'}`}></i>}
                  {c.img && <span className="absolute bottom-3 right-3 text-[10px] font-bold bg-lime text-ink px-2 py-0.5 rounded-full"><i className="fas fa-circle-check mr-1"></i>Verified</span>}
                  <span className="absolute top-3 left-3 z-[1] text-[11px] font-bold bg-forest text-white px-2 py-0.5 rounded-full">{c.yr}</span>
                  <AnimatePresence>
                    {on && (
                      <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="absolute right-3 top-3 z-[1] flex flex-col gap-2">
                        <span onClick={(e) => { e.stopPropagation(); setView(k); }} title="View certificate" className="w-9 h-9 rounded-full bg-white text-forest flex items-center justify-center hover:bg-forest hover:text-white"><i className="fas fa-eye text-xs"></i></span>
                        <a onClick={(e) => e.stopPropagation()} href={c.pdf || c.link || LINKEDIN} target="_blank" rel="noopener noreferrer" title={c.pdf ? 'Open PDF' : c.link ? 'Open publication' : 'See on LinkedIn'} className="w-9 h-9 rounded-full bg-white text-forest flex items-center justify-center hover:bg-forest hover:text-white"><i className={`${c.pdf || c.link ? 'fas fa-file-arrow-down' : 'fab fa-linkedin-in'} text-xs`}></i></a>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
                <div className={`relative p-5 transition-colors ${on ? 'bg-forest' : 'bg-white'}`}>
                  <h4 className="font-display font-bold text-[17px] leading-snug pr-10" style={on ? { color: '#fff' } : undefined}>{c.t}</h4>
                  <p className={`text-sm mt-1 ${on ? 'text-lime' : 'text-mute'}`}>{c.by}</p>
                  <button onClick={() => setOpen(on ? null : k)} aria-label="More" className={`absolute right-4 -top-5 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${on ? 'bg-lime text-ink' : 'bg-forest text-white'}`}><i className={`fas ${on ? 'fa-xmark' : 'fa-plus'}`}></i></button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <Modal open={!!sel} onClose={() => setView(null)}>
        {sel && (
          <div className="p-6 md:p-8">
            {sel.img
              ? <img src={sel.img} alt={sel.t} className="w-full rounded-xl border border-black/5 shadow-sm" />
              : <div className="aspect-[4/3] bg-mint rounded-xl flex flex-col items-center justify-center text-center p-8">
                  <i className={`fas ${sel.ic} text-6xl text-forest`}></i>
                  <p className="mt-4 text-sm text-mute">Certificate available on request</p>
                </div>}
            <h3 className="font-display font-bold text-2xl mt-6">{sel.t}</h3>
            <p className="text-forest font-semibold">{sel.by} · {sel.yr}</p>
            {sel.code && <p className="text-xs text-mute mt-2">Forage enrolment verification code: <span className="font-mono text-ink">{sel.code}</span></p>}
            <div className="flex flex-wrap gap-3 mt-5">
              {sel.pdf && <a href={sel.pdf} target="_blank" rel="noopener noreferrer" className="rounded-full px-6 py-3 bg-forest text-white font-display font-semibold text-sm hover:bg-lime hover:text-ink transition-colors"><i className="fas fa-file-pdf mr-2"></i>Open original PDF</a>}
              {sel.link && <a href={sel.link} target="_blank" rel="noopener noreferrer" className="rounded-full px-6 py-3 bg-forest text-white font-display font-semibold text-sm hover:bg-lime hover:text-ink transition-colors"><i className="fas fa-arrow-up-right-from-square mr-2"></i>View on Springer</a>}
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}

// ============ FAQ ============
const FAQS = [
  { q: 'When are you available for an internship?', a: 'From January to December 2027, during my MiM year at emlyon business school. I can start in January and take a full-length internship.' },
  { q: 'Where are you based?', a: 'In Caluire-et-Cuire, right next to Lyon. Open to roles in Lyon, Paris and elsewhere in Europe, on-site or hybrid.' },
  { q: 'What languages do you work in?', a: 'English at C2 level and French at B1, improving every week. Also Hindi and Bengali.' },
  { q: 'Which roles fit you best?', a: 'Operations & supply chain, project management, strategy & consulting, business development and business analytics. Pick the matching CV from the download menu.' },
  { q: 'What tools do you use day to day?', a: 'Advanced Excel, Power BI, SAP, PowerPoint, Canva, financial modelling and basic Python.' },
];

function FAQ() {
  const [o, setO] = useState(1);
  return (
    <section id="faq" className="grid lg:grid-cols-[0.8fr_1.2fr] bg-deep">
      <div className="relative min-h-[320px] bg-forest overflow-hidden">
        <div className="absolute inset-0 grid-pattern"></div>
        <motion.span className="absolute inset-0 flex items-center justify-center font-display font-extrabold text-[260px] leading-none text-lime/20"
          animate={{ rotate: [0, 6, -6, 0] }} transition={{ duration: 8, repeat: Infinity }}>?</motion.span>
      </div>
      <div className="relative grid-pattern px-6 lg:px-16 py-20 grid xl:grid-cols-[0.9fr_1.1fr] gap-12">
        <div>
          <Eyebrow>FAQ's</Eyebrow>
          <h2 className="font-display font-bold text-4xl md:text-5xl mt-5 leading-tight" style={{ color: '#fff' }}>Recruiter<br />Questions</h2>
          <p className="text-white/70 mt-5 leading-7">Quick answers to what most recruiters ask first. Anything else, send me a message.</p>
          <button onClick={() => scrollTo('contact')} className="rounded-full mt-8 px-7 py-4 bg-white text-ink font-display font-semibold text-sm hover:bg-lime transition-colors">Ask Me Directly</button>
        </div>
        <div className="space-y-3">
          {FAQS.map((f, k) => (
            <div key={f.q} className={`border transition-colors ${o === k ? 'bg-forest border-forest' : 'bg-ink/60 border-white/10'}`}>
              <button onClick={() => setO(o === k ? -1 : k)} className="w-full flex justify-between gap-4 items-center px-5 py-4 text-left font-display font-bold text-white text-[15px]">
                {f.q}<i className={`fas fa-chevron-${o === k ? 'down' : 'right'} text-xs`}></i>
              </button>
              <AnimatePresence initial={false}>
                {o === k && <motion.p initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden px-5 text-white/70 text-sm leading-7"><span className="block pb-5">{f.a}</span></motion.p>}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ TESTIMONIAL → AWARDS SLIDER ============
const AWARDS = [
  { q: 'Cleared the national qualifiers of Global Management Challenge India 2026, ranking 1st in our group and among the top 99 of 1,344 teams.', who: 'Global Management Challenge', role: 'India 2026', ic: 'fa-trophy' },
  { q: 'Achieved Global Rank 9 and National Rank 3 in the Critical Design Review of ASME HPVC 2021 with Team Ragnar, in a cross-functional engineering design team.', who: 'ASME HPVC', role: 'Human Powered Vehicle Challenge 2021', ic: 'fa-bicycle' },
  { q: 'Qualified as National Finalist in L&T TECHgium 5th Edition, competing against the top engineering teams across India.', who: 'L&T TECHgium', role: '5th Edition · National Finalist', ic: 'fa-medal' },
  { q: 'Co-authored a peer-reviewed research chapter on Cascade Refrigeration Systems, published by Springer Nature and the ISHRAE Journal.', who: 'Springer Nature & ISHRAE', role: 'Published Research', ic: 'fa-book-open' },
];

function Awards() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % AWARDS.length), 7000); return () => clearInterval(t); }, []);
  const a = AWARDS[i];
  return (
    <section className="py-24 px-6 lg:px-16 bg-paper">
      <div className="max-w-[1200px] mx-auto bg-white shadow-[0_20px_60px_rgba(0,0,0,0.05)] p-8 md:p-16 grid md:grid-cols-[260px_1fr] gap-12 items-center">
        <div className="text-center">
          <div className="relative w-52 h-52 mx-auto rounded-full bg-forest grid-pattern flex items-center justify-center">
            <AnimatePresence mode="wait"><motion.i key={i} initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} className={`fas ${a.ic} text-7xl text-lime`}></motion.i></AnimatePresence>
            <span className="absolute top-1 right-1 w-14 h-14 rounded-full bg-lime flex items-center justify-center text-ink text-2xl"><i className="fas fa-quote-right"></i></span>
          </div>
          <span className="inline-flex gap-1 mt-6 px-5 py-2 rounded-full border border-black/10 text-[#ffc737]">{[...Array(5)].map((_, k) => <i key={k} className="fas fa-star text-sm"></i>)}</span>
        </div>
        <div>
          <AnimatePresence mode="wait">
            <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <p className="text-xl md:text-2xl leading-relaxed text-ink">{a.q}</p>
              <p className="mt-8 font-display font-bold text-head text-lg">{a.who} <span className="text-mute font-normal text-sm">/ {a.role}</span></p>
            </motion.div>
          </AnimatePresence>
          <div className="flex gap-3 mt-8 justify-end">
            <button onClick={() => setI((i - 1 + AWARDS.length) % AWARDS.length)} aria-label="Previous award" className="w-12 h-12 rounded-full border border-black/10 hover:bg-forest hover:text-white transition-colors"><i className="fas fa-arrow-left"></i></button>
            <button onClick={() => setI((i + 1) % AWARDS.length)} aria-label="Next award" className="w-12 h-12 rounded-full border border-black/10 hover:bg-forest hover:text-white transition-colors"><i className="fas fa-arrow-right"></i></button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ BLOG → BEYOND WORK ============
const BEYOND = [
  { tag: 'Leadership', t: 'Reviving the ISHRAE student chapter', d: 'Led the 2022–23 revival of the ISHRAE chapter at IIEST, raising member participation by 30%.', ic: 'fa-people-group' },
  { tag: 'Leadership', t: 'ASME Co-Secretary, 2020–23', d: 'Ran the weekly newsletter, organised events and coordinated 35+ members across activities.', ic: 'fa-newspaper' },
  { tag: 'Campus', t: 'Newsletter & tech fests at IIEST', d: 'Managed, proofread and wrote newsletter articles, and brought brand partners to the tech fests.', ic: 'fa-handshake-angle' },
  { tag: 'Interests', t: 'Cooking, badminton & running', d: 'Recreating restaurant-style dishes at home, competitive badminton and recreational running.', ic: 'fa-utensils' },
  { tag: 'Interests', t: 'Design & photography', d: 'Validating product concepts for fun and photographing landscapes and architecture.', ic: 'fa-camera' },
];

function Beyond() {
  const [s, setS] = useState(0);
  const per = typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 3;
  const pages = Math.max(1, BEYOND.length - per + 1);
  return (
    <section className="pb-24 lg:pb-32 px-6 lg:px-16 bg-paper">
      <div className="max-w-[1344px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div><Eyebrow>Beyond Work</Eyebrow><RevealHeading text="Leadership & Life Outside The Office" className="mt-5" /></div>
          <button onClick={() => setS((s + 1) % pages)} className="rounded-full self-start md:self-auto px-7 py-4 bg-forest text-white font-display font-semibold text-sm hover:bg-lime hover:text-ink transition-colors">More Stories <i className="fas fa-arrow-right ml-2"></i></button>
        </div>
        <div className="overflow-hidden mt-12">
          <motion.div className="flex gap-6" animate={{ x: `calc(-${s} * (100% / ${per} + ${24 / per}px))` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }}>
            {BEYOND.map((b) => (
              <div key={b.t} className="shrink-0" style={{ width: `calc((100% - ${(per - 1) * 24}px) / ${per})` }}>
                <div className="group">
                  <div className="h-56 bg-forest grid-pattern rounded-t-xl flex items-center justify-center overflow-hidden">
                    <i className={`fas ${b.ic} text-7xl text-lime/80 group-hover:scale-125 transition-transform duration-500`}></i>
                  </div>
                  <div className="bg-white mx-4 -mt-10 relative p-6 rounded-lg shadow-lg">
                    <p className="flex items-center gap-4 text-xs text-mute"><span><i className="far fa-user mr-1"></i>Aritra</span><span><i className="far fa-folder mr-1"></i>{b.tag}</span></p>
                    <h4 className="font-display font-bold text-lg mt-3 leading-snug">{b.t}</h4>
                    <p className="text-sm leading-6 mt-2">{b.d}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pages }).map((_, k) => <button key={k} onClick={() => setS(k)} aria-label={`Page ${k + 1}`} className={`w-2.5 h-2.5 rounded-full ${k === s ? 'bg-forest' : 'bg-forest/25'}`} />)}
        </div>
      </div>
    </section>
  );
}

// ============ CONTACT FORM ============
function Contact() {
  const [f, setF] = useState({ name: '', email: '', company: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const r = await fetch(FORMSPREE, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, _subject: `Website message from ${f.name}${f.company ? ` (${f.company})` : ''}` }) });
      if (r.ok) { setStatus('sent'); setF({ name: '', email: '', company: '', message: '' }); setTimeout(() => setStatus('idle'), 5000); } else setStatus('error');
    } catch { setStatus('error'); }
  };
  const input = 'w-full px-5 py-4 bg-mint border border-transparent focus:border-forest focus:bg-white outline-none transition-colors text-ink placeholder:text-mute/70';
  return (
    <section id="contact" className="py-24 lg:py-32 px-6 lg:px-16 bg-white">
      <div className="max-w-[1344px] mx-auto grid lg:grid-cols-2 gap-16">
        <div>
          <Eyebrow>Contact</Eyebrow>
          <RevealHeading text="Have An Internship In Mind? Let's Talk." className="mt-5" />
          <p className="mt-6 leading-8">Messages from this form land straight in my inbox. I usually reply within a day.</p>
          <div className="mt-10 space-y-5">
            {[
              { ic: 'fa-phone', l: 'Call me', v: `🇫🇷 ${PHONE}`, h: `tel:${PHONE.replace(/\s/g, '')}` },
              { ic: 'fa-envelope', l: 'Email me', v: EMAIL, h: `mailto:${EMAIL}` },
              { ic: 'fa-linkedin-in', l: 'LinkedIn', v: 'aritra-sreemany', h: LINKEDIN, brand: true },
              { ic: 'fa-location-dot', l: 'Based in', v: LOCATION },
            ].map((c) => {
              const inner = (
                <>
                  <span className="w-14 h-14 rounded-full bg-mint group-hover:bg-lime flex items-center justify-center text-forest group-hover:text-ink transition-colors"><i className={`${c.brand ? 'fab' : 'fas'} ${c.ic}`}></i></span>
                  <span><span className="block text-xs text-mute">{c.l}</span><span className="font-display font-bold text-head break-all">{c.v}</span></span>
                </>
              );
              return c.h ? <a key={c.l} href={c.h} target={c.brand ? '_blank' : undefined} rel="noopener noreferrer" className="group flex items-center gap-4">{inner}</a> : <div key={c.l} className="group flex items-center gap-4">{inner}</div>;
            })}
          </div>
          <div className="mt-10"><CVDropdown variant="dark" label="Download My CV" /></div>
        </div>
        <form onSubmit={submit} className="bg-paper p-8 md:p-12 space-y-4">
          <h3 className="font-display font-bold text-2xl mb-2">Send a message</h3>
          <AnimatePresence>
            {status === 'sent' && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 bg-lime text-ink font-semibold text-sm"><i className="fas fa-check-circle mr-2"></i>Message sent. I'll get back to you soon.</motion.p>}
            {status === 'error' && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 bg-red-100 text-red-700 text-sm"><i className="fas fa-triangle-exclamation mr-2"></i>Something went wrong. Please email me at {EMAIL}.</motion.p>}
          </AnimatePresence>
          <div className="grid sm:grid-cols-2 gap-4">
            <input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Your name" className={input} />
            <input required type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="Your email" className={input} />
          </div>
          <input value={f.company} onChange={(e) => setF({ ...f, company: e.target.value })} placeholder="Company (optional)" className={input} />
          <textarea required rows={6} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} placeholder="What's the role or question?" className={`${input} resize-none`} />
          <button disabled={status === 'sending'} className="w-full py-4 rounded-full bg-forest text-white font-display font-semibold hover:bg-lime hover:text-ink transition-colors disabled:opacity-60">{status === 'sending' ? 'Sending…' : 'Send Message'}</button>
        </form>
      </div>
    </section>
  );
}

// ============ FOOTER ============
function Footer() {
  return (
    <footer className="grid lg:grid-cols-[70px_1fr_34%] bg-ink">
      <div className="hidden lg:flex items-center justify-center border-r border-white/10">
        <span className="font-display font-bold text-2xl text-white -rotate-90 whitespace-nowrap">Aritra<span className="text-lime">.</span></span>
      </div>
      <div className="px-6 lg:px-14 py-14 grid-pattern">
        <div className="grid sm:grid-cols-3 gap-6 pb-10 border-b border-white/10">
          {[{ ic: 'fa-phone', l: 'Call Me:', v: PHONE, h: `tel:${PHONE.replace(/\s/g, '')}` }, { ic: 'fa-envelope', l: 'Email Me:', v: EMAIL, h: `mailto:${EMAIL}` }, { ic: 'fa-location-dot', l: 'Based In:', v: 'Lyon, France' }].map((c) => (
            <a key={c.l} href={c.h} className="flex items-center gap-4 group">
              <span className="w-12 h-12 shrink-0 rounded-full bg-white/10 group-hover:bg-lime flex items-center justify-center text-white group-hover:text-ink transition-colors"><i className={`fas ${c.ic}`}></i></span>
              <span><span className="block text-white/60 text-sm">{c.l}</span><span className="text-white font-display font-semibold text-sm break-all">{c.v}</span></span>
            </a>
          ))}
        </div>
        <div className="grid sm:grid-cols-3 gap-8 pt-10">
          <div>
            <h5 className="font-display font-bold" style={{ color: '#fff' }}>Expertise</h5>
            <ul className="mt-4 space-y-2.5">{SERVICES.slice(0, 5).map((s) => <li key={s.t}><button onClick={() => scrollTo('services')} className="text-white/60 hover:text-lime text-sm">{s.t}</button></li>)}</ul>
          </div>
          <div>
            <h5 className="font-display font-bold" style={{ color: '#fff' }}>Pages</h5>
            <ul className="mt-4 space-y-2.5">{NAV.slice(1).map((n) => <li key={n.id}><button onClick={() => scrollTo(n.id)} className="text-white/60 hover:text-lime text-sm">{n.label}</button></li>)}</ul>
          </div>
          <div>
            <h5 className="font-display font-bold" style={{ color: '#fff' }}>Get My CV</h5>
            <p className="text-white/60 text-sm mt-4 mb-5 leading-6">Ten versions, each tailored to a role family.</p>
            <CVDropdown variant="lime" label="Choose CV" up />
          </div>
        </div>
        <p className="text-white/40 text-sm mt-12">© 2026 Aritra Sreemany. MiM, emlyon business school · PGDM-IB, MDI Gurgaon.</p>
      </div>
      <div className="relative bg-lime px-8 py-14 flex flex-col items-center justify-center text-center overflow-hidden">
        <svg className="absolute -right-20 -top-20 opacity-30" width="300" height="300"><circle cx="150" cy="150" r="140" stroke="#102930" fill="none" /><circle cx="150" cy="150" r="100" stroke="#102930" fill="none" /></svg>
        <h3 className="relative font-display font-bold text-3xl md:text-4xl leading-tight">Have an Internship<br />in Mind?</h3>
        <motion.button whileHover={{ scale: 1.06, rotate: -4 }} onClick={() => scrollTo('contact')} className="relative mt-8 w-40 h-40 rounded-full bg-ink text-white font-display font-semibold flex flex-col items-center justify-center gap-2">
          <i className="fas fa-arrow-right -rotate-45 text-lime text-xl"></i>Contact Me
        </motion.button>
        <p className="relative mt-6 font-display font-semibold text-ink">Available Jan – Dec 2027</p>
        <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="relative mt-4 w-11 h-11 rounded-full bg-ink text-lime flex items-center justify-center hover:scale-110 transition-transform"><i className="fab fa-linkedin-in"></i></a>
      </div>
    </footer>
  );
}

// ============ FLOATING ============
function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => { const on = () => setShow(window.scrollY > 600); window.addEventListener('scroll', on); return () => window.removeEventListener('scroll', on); }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} onClick={() => scrollTo('home')} aria-label="Back to top"
          className="fixed right-6 bottom-6 z-40 w-12 h-12 rounded-full bg-lime text-ink shadow-xl hover:bg-forest hover:text-lime transition-colors">
          <i className="fas fa-arrow-up"></i>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return <motion.div id="scroll-progress" style={{ scaleX: scrollYProgress }} />;
}

// ============ APP ============
export default function App() {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) setTimeout(() => scrollTo(id), 300);
  }, []);
  return (
    <div className="min-h-screen bg-white">
      <ScrollProgress />
      <TopBar />
      <Navbar />
      <Hero />
      <Marquee items={['Operations', 'Supply Chain', 'Project Management', 'Strategy', 'Analytics', 'Power BI', 'SAP', 'Vendor Negotiation']} />
      <About />
      <Services />
      <MissionVision />
      <Growth />
      <Marquee dark items={['Open to internships Jan – Dec 2027', 'Lyon · Paris · Europe', 'Français B1 · English C2', 'MiM emlyon business school']} />
      <Journey />
      <Experience />
      <Projects />
      <Credentials />
      <FAQ />
      <Awards />
      <Beyond />
      <Contact />
      <Footer />
      <BackToTop />
    </div>
  );
}
