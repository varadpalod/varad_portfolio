import { Component, lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PROJECTS, PROCESS, KEYS, EMAIL, LINKS, STACK, STACK_CATS, stackCols } from './data.js'
import { playKey } from './audio.js'
import { go, reduceMotion, useUI } from './store.js'

gsap.registerPlugin(ScrollTrigger)

const Scene = lazy(() => import('./gl/Scene.jsx'))

const MARQUEE =
  'Scalable architectures. Robust systems. · Backend APIs, data products and applied machine learning. · Explore the keyboard or scroll to see my work. ·'

const Icon = ({ children }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
)

function SoundToggle() {
  const sound = useUI((s) => s.sound)
  const setSound = useUI((s) => s.setSound)
  return (
    <button
      type="button"
      className="icon-btn"
      aria-pressed={sound}
      aria-label={sound ? 'Mute key sounds and haptics' : 'Turn on key sounds and haptics'}
      title={sound ? 'Sound on' : 'Sound off'}
      onClick={() => {
        const next = !sound
        setSound(next)
        if (next) playKey(4)
      }}
    >
      <Icon>
        <path d="M11 5 6 9H3v6h3l5 4V5z" />
        {sound ? (
          <>
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M18.5 5.5a9 9 0 0 1 0 13" />
          </>
        ) : (
          <>
            <path d="m16 9 5 6" />
            <path d="m21 9-5 6" />
          </>
        )}
      </Icon>
    </button>
  )
}

function ThemeToggle() {
  const theme = useUI((s) => s.theme)
  const setTheme = useUI((s) => s.setTheme)
  const dark = theme === 'dark'
  return (
    <button
      type="button"
      className="icon-btn"
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Light theme' : 'Dark theme'}
      onClick={() => {
        setTheme(dark ? 'light' : 'dark')
        playKey(7, true)
      }}
    >
      <Icon>
        {dark ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        ) : (
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        )}
      </Icon>
    </button>
  )
}

function Header() {
  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Varad, home">
        varad<span>.</span>
      </a>
      <nav className="nav" aria-label="Primary">
        <a className="nav-link" href="#work">
          Work
        </a>
        <a className="nav-link" href="#process">
          Process
        </a>
        <a className="pill" href="#contact">
          Let’s talk ↗
        </a>
        <SoundToggle />
        <ThemeToggle />
      </nav>
    </header>
  )
}

function Loader() {
  const ready = useUI((s) => s.ready)
  const [leaving, setLeaving] = useState(false)
  const [gone, setGone] = useState(false)
  const t0 = useRef(performance.now())

  useEffect(() => {
    document.documentElement.classList.add('is-loading')
    // if WebGL never comes up, still let people in
    const failsafe = setTimeout(() => {
      if (!useUI.getState().ready) useUI.getState().setReady(0)
    }, 10000)
    return () => clearTimeout(failsafe)
  }, [])

  useEffect(() => {
    if (!ready) return undefined
    const wait = Math.max(0, 1400 - (performance.now() - t0.current))
    let t2
    const t1 = setTimeout(() => {
      setLeaving(true)
      document.documentElement.classList.remove('is-loading')
      t2 = setTimeout(() => setGone(true), 650)
    }, wait)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [ready])

  if (gone) return null
  return (
    <div className={'loader' + (leaving ? ' leaving' : '')} role="status" aria-live="polite">
      <div className="ld-keys" aria-hidden="true">
        {[
          ['V', '#ffb7d5', '#d94f8a'],
          ['A', '#c8b6ff', '#7153c7'],
          ['R', '#b9f2df', '#2caa85'],
          ['A', '#ffd98e', '#d28a24'],
          ['D', '#a9ddff', '#3886c9']
        ].map(([l, face, base], i) => (
          <span key={i} className="ld-key" style={{ '--face': face, '--base': base, '--d': `${i * 0.16}s` }}>
            {l}
          </span>
        ))}
      </div>
      <p className="ld-text">Loading portfolio…</p>
    </div>
  )
}

class GLBoundary extends Component {
  state = { bad: false }
  static getDerivedStateFromError() {
    return { bad: true }
  }
  componentDidCatch() {
    useUI.getState().setReady(0)
  }
  render() {
    return this.state.bad ? null : this.props.children
  }
}

function Hero() {
  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      <h1 id="hero-title">
        <span>Hi, I’m Varad.</span>
        <span>Building robust backends and</span>
        <span>
          <em>intelligent systems.</em>
        </span>
      </h1>

      <div id="kb-anchor" aria-hidden="true" />

      {/* Real buttons for keyboard and screen-reader users; the 3D keys mirror them. */}
      <div className="kbd-nav" role="group" aria-label="Quick navigation">
        {KEYS.map((k, i) => (
          <button key={i} type="button" onClick={() => go(k.action)}>
            {k.label || 'Let’s talk'}
          </button>
        ))}
      </div>

      <div className="marquee" role="presentation">
        <div className="marquee-track" aria-hidden="true">
          <p>{MARQUEE}</p>
          <p>{MARQUEE}</p>
        </div>
        <span className="sr-only">{MARQUEE}</span>
      </div>
    </section>
  )
}

function Work() {
  const hover = useUI((s) => s.hoverProject)
  const setHover = useUI((s) => s.setHoverProject)
  const openCase = useUI((s) => s.openCase)
  return (
    <section id="work" aria-labelledby="work-title">
      <div className="section-inner">
        <h2 className="section-title reveal" id="work-title">
          Selected work
        </h2>
        <p className="section-sub reveal">Applied machine learning, data products and backend systems, built end to end.</p>

        <div className="work-grid">
          <div className="pills">
            {PROJECTS.map((p, i) => (
              <button
                key={p.num}
                type="button"
                className={'pill-card reveal' + (hover === i ? ' is-active' : '')}
                style={{ '--card': p.card, '--num': p.numColor }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                onClick={() => {
                  playKey(i + 3, true)
                  openCase(i)
                }}
              >
                <span className="num">{p.num}</span>
                <span>
                  <span className="title">{p.pillTitle}</span>
                  <span className="desc">{p.desc}</span>
                </span>
                <span className="arrow" aria-hidden="true">
                  ↗
                </span>
              </button>
            ))}
          </div>
          <div id="box-anchor" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}

const Arrow = () => (
  <div className="p-arrow" aria-hidden="true">
    <svg viewBox="0 0 52 52">
      <path d="M6 34 C 16 8, 34 8, 44 28" />
      <path d="M34 26 L44 28 L42 38" />
    </svg>
  </div>
)

function Process() {
  const setHover = useUI((s) => s.setHoverProcess)
  return (
    <section id="process" aria-labelledby="process-title">
      <div className="section-inner" style={{ paddingTop: 0 }}>
        <h2 className="section-title reveal" id="process-title">
          My engineering process
        </h2>
        <p className="section-sub reveal">Architect the system. Write clean code. Deploy to scale.</p>

        <div className="process-frame">
          {PROCESS.map((p, i) => (
            <FragmentCard key={p.kicker} p={p} i={i} setHover={setHover} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FragmentCard({ p, i, setHover }) {
  return (
    <>
      <article
        className="p-card reveal"
        style={{ '--sc': p.sticky, '--tint': p.tint }}
        onMouseEnter={() => setHover(i)}
        onMouseLeave={() => setHover(null)}
        onFocus={() => setHover(i)}
        onBlur={() => setHover(null)}
        tabIndex={0}
      >
        <div className="p-stage" id={`p3d-${i + 1}`} aria-hidden="true" />
        <div className="p-body">
          <span className="kicker">{p.kicker}</span>
          <h3>{p.title}</h3>
          <p>{p.text}</p>
          <span className="sticker">{p.sticker}</span>
        </div>
      </article>
      {i < PROCESS.length - 1 && <Arrow />}
    </>
  )
}

function Stack() {
  const filter = useUI((s) => s.stackFilter)
  const setFilter = useUI((s) => s.setStackFilter)
  const anchor = useRef(null)

  // keep the 3D grid's height in step with how many chips fit per row
  useEffect(() => {
    const el = anchor.current
    if (!el) return undefined
    const apply = () => {
      const w = el.clientWidth
      const cols = stackCols(w)
      const rows = Math.ceil(STACK.length / cols)
      el.style.height = Math.round((rows * (w / cols)) / 1.3) + 'px'
    }
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const cats = ['All', ...Object.keys(STACK_CATS)]
  return (
    <section id="stack" aria-labelledby="stack-title">
      <div className="section-inner" style={{ paddingTop: 0 }}>
        <h2 className="section-title reveal" id="stack-title">
          The toolkit
        </h2>
        <p className="section-sub reveal">
          Technologies I have used across these projects. Select a category, or any key, to highlight it.
        </p>
        <div className="filters reveal" role="group" aria-label="Filter the toolkit by category">
          {cats.map((c) => (
            <button
              key={c}
              type="button"
              className={'filter' + (filter === c ? ' is-on' : '')}
              style={c !== 'All' ? { '--dot': STACK_CATS[c].face } : undefined}
              aria-pressed={filter === c}
              onClick={() => {
                playKey(5, true)
                setFilter(c)
              }}
            >
              {c !== 'All' && <i aria-hidden="true" />}
              {c}
            </button>
          ))}
        </div>
        <div id="stack-anchor" ref={anchor} aria-hidden="true" />
        <ul className="sr-only">
          {STACK.map((t) => (
            <li key={t.name}>
              {t.name} ({t.cat})
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="section-inner contact-grid">
        <div className="contact-copy">
          <h2 id="contact-title" className="reveal">
            Open to opportunities. Let’s connect.
          </h2>
          <a className="mail reveal" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
          <div className="socials reveal">
            <a href={LINKS.github} target="_blank" rel="noopener noreferrer">
              GitHub ↗
            </a>
            <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn ↗
            </a>
            <a href={LINKS.leetcode} target="_blank" rel="noopener noreferrer">
              LeetCode ↗
            </a>
          </div>
        </div>
        <div id="enter-anchor" aria-hidden="true" />
      </div>
    </section>
  )
}

function AboutDialog() {
  const open = useUI((s) => s.aboutOpen)
  const setAbout = useUI((s) => s.setAbout)
  const ref = useRef(null)
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])
  return (
    <dialog
      ref={ref}
      className="about"
      aria-labelledby="about-title"
      onClose={() => setAbout(false)}
      onClick={(e) => e.target === ref.current && setAbout(false)}
    >
      <div className="dialog-body">
        <button className="dialog-close" type="button" aria-label="Close" onClick={() => setAbout(false)}>
          ✕
        </button>
        <h2 className="sr-only" id="about-title">
          About Varad
        </h2>
        <p>
          Hi, I’m Varad. I’m a Software Development Engineer who builds backend services, data products and applied machine learning
          systems. I care about clean architecture, reliable delivery and shipping software that people can depend on.
        </p>
      </div>
    </dialog>
  )
}

function CaseDialog() {
  const idx = useUI((s) => s.caseIdx)
  const close = useUI((s) => s.closeCase)
  const ref = useRef(null)
  const p = idx !== null ? PROJECTS[idx] : null
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (idx !== null && !d.open) d.showModal()
    if (idx === null && d.open) d.close()
  }, [idx])
  return (
    <dialog ref={ref} className="case" aria-labelledby="cs-title" onClose={close} onClick={(e) => e.target === ref.current && close()}>
      {p && (
        <div className="dialog-body" style={{ '--chip': p.card }}>
          <button className="dialog-close" type="button" aria-label="Close" onClick={close}>
            ✕
          </button>
          <div className="cs-num">Project {p.num}</div>
          <h3 id="cs-title">{p.title}</h3>
          <ul className="stack">
            {p.stack.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <h4>Problem</h4>
          <p>{p.problem}</p>
          <h4>Architecture</h4>
          <p>{p.arch}</p>
          <h4>Outcome</h4>
          <p>{p.solution}</p>
          <div className="links">
            {p.repo && (
              <a href={p.repo} target="_blank" rel="noopener noreferrer">
                GitHub repo ↗
              </a>
            )}
            {p.demo && (
              <a href={p.demo} target="_blank" rel="noopener noreferrer">
                Live demo ↗
              </a>
            )}
          </div>
        </div>
      )}
    </dialog>
  )
}

export default function App() {
  useLayoutEffect(() => {
    if (reduceMotion) return undefined
    let unsub = () => {}
    const ctx = gsap.context(() => {
      // the headline reveals once the loader lifts
      const intro = gsap.from('.hero h1 > span', { yPercent: 45, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', paused: true })
      let played = false
      const play = () => {
        if (played) return
        played = true
        setTimeout(() => intro.play(), 350)
      }
      if (useUI.getState().ready) play()
      unsub = useUI.subscribe((st) => st.ready && play())
      gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.from(el, {
          y: 36,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: el, start: 'top 94%', once: true }
        })
      })
    })
    // Layout shifts (web fonts, the lazy 3D chunk) move trigger points, so re-measure.
    let t
    const refresh = () => {
      clearTimeout(t)
      t = setTimeout(() => ScrollTrigger.refresh(), 120)
    }
    const ro = new ResizeObserver(refresh)
    ro.observe(document.body)
    window.addEventListener('load', refresh)
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh)
    return () => {
      unsub()
      clearTimeout(t)
      ro.disconnect()
      window.removeEventListener('load', refresh)
      ctx.revert()
    }
  }, [])

  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <Work />
        <Process />
        <Stack />
        <Contact />
      </main>
      <AboutDialog />
      <CaseDialog />
      <div className="gl-wrap" aria-hidden="true">
        <GLBoundary>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </GLBoundary>
      </div>
      <Loader />
    </>
  )
}
