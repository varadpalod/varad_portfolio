import { useUI } from './store.js'

/* Tiny synthesized "thock" + click, so no audio files are shipped.
 * The AudioContext is created lazily inside a user gesture (browser autoplay rules). */
let ctx = null
let master = null
let noise = null

function ensure() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0.55
    master.connect(ctx.destination)
    const len = Math.floor(ctx.sampleRate * 0.05)
    noise = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = noise.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

/** index varies the pitch so a row of keys sounds like a keyboard, soft is for lighter taps. */
export function playKey(index = 0, soft = false) {
  if (!useUI.getState().sound) return
  const c = ensure()
  if (!c) return
  const t = c.currentTime

  const osc = c.createOscillator()
  const og = c.createGain()
  const f = 170 + (index % 10) * 17
  osc.type = 'sine'
  osc.frequency.setValueAtTime(f * 1.7, t)
  osc.frequency.exponentialRampToValueAtTime(f * 0.55, t + 0.07)
  og.gain.setValueAtTime(0.0001, t)
  og.gain.exponentialRampToValueAtTime(soft ? 0.2 : 0.42, t + 0.004)
  og.gain.exponentialRampToValueAtTime(0.0001, t + 0.12)
  osc.connect(og).connect(master)
  osc.start(t)
  osc.stop(t + 0.14)

  const src = c.createBufferSource()
  src.buffer = noise
  const hp = c.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = 2400
  const ng = c.createGain()
  ng.gain.setValueAtTime(soft ? 0.1 : 0.24, t)
  ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.035)
  src.connect(hp).connect(ng).connect(master)
  src.start(t)

  if (navigator.vibrate) navigator.vibrate(soft ? 6 : 10)
}
