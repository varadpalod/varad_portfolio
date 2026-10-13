import { create } from 'zustand'
import { EMAIL, LINKS } from './data.js'

const read = (k, d) => {
  try {
    const v = localStorage.getItem(k)
    return v === null ? d : v
  } catch {
    return d
  }
}
const write = (k, v) => {
  try {
    localStorage.setItem(k, v)
  } catch {
    /* storage unavailable */
  }
}

const initialTheme = () => {
  const attr = document.documentElement.getAttribute('data-theme')
  if (attr) return attr
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const useUI = create((set) => ({
  hoverProject: null,
  setHoverProject: (i) => set({ hoverProject: i }),
  caseIdx: null,
  openCase: (i) => set({ caseIdx: i }),
  closeCase: () => set({ caseIdx: null }),
  aboutOpen: false,
  setAbout: (v) => set({ aboutOpen: v }),
  hoverProcess: null,
  setHoverProcess: (i) => set({ hoverProcess: i }),

  stackFilter: 'All',
  setStackFilter: (f) => set({ stackFilter: f }),

  // set once the 3D scene has compiled and drawn its first frames
  ready: false,
  readyAt: 0,
  setReady: (t) => set({ ready: true, readyAt: t }),

  theme: initialTheme(),
  setTheme: (t) => {
    const root = document.documentElement
    root.classList.add('theme-fade')
    root.setAttribute('data-theme', t)
    setTimeout(() => root.classList.remove('theme-fade'), 450)
    write('theme', t)
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', t === 'dark' ? '#0f1020' : '#fff7fb')
    set({ theme: t })
  },

  sound: read('sound', '1') !== '0',
  setSound: (v) => {
    write('sound', v ? '1' : '0')
    set({ sound: v })
  }
}))

export const reduceMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const EXTERNAL = { github: LINKS.github, leetcode: LINKS.leetcode, linkedin: LINKS.linkedin }

/** What a keyboard key (or its keyboard-accessible twin) does. */
export function go(id) {
  if (id === 'about') {
    useUI.getState().setAbout(true)
    return
  }
  if (id === 'featured') {
    // the first project is the one to lead with
    useUI.getState().openCase(0)
    return
  }
  if (id === 'email') {
    window.location.href = `mailto:${EMAIL}`
    return
  }
  if (EXTERNAL[id]) {
    window.open(EXTERNAL[id], '_blank', 'noopener,noreferrer')
    return
  }
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
}
