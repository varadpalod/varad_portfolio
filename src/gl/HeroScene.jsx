import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { Anchor, Cap, Solid, useAnchor } from './primitives.jsx'
import { KEYS } from '../data.js'
import { go, reduceMotion, useUI } from '../store.js'
import { playKey } from '../audio.js'

const ORDER = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

function Keyboard() {
  const group = useRef()
  const anchor = useAnchor()
  const typing = useMemo(() => ({ active: -1, paused: 0 }), [])

  useFrame(({ clock, pointer }, dt) => {
    // the intro and the typing loop start only once the loader has finished
    const { ready, readyAt } = useUI.getState()
    const t = ready ? clock.elapsedTime - readyAt : -1
    if (reduceMotion || typing.paused > 0 || t < 1.2) {
      typing.active = -1
    } else {
      const s = (t - 1.2) / 0.6
      const step = Math.floor(s)
      typing.active = s - step < 0.5 ? ORDER[step % ORDER.length] : -1
    }
    const g = group.current
    if (!g) return
    const tx = -0.2 + pointer.y * 0.1 + anchor.ny * 0.12
    const ty = pointer.x * 0.2
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, tx, 4, dt)
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, ty, 4, dt)
    // intro: keys rise into place
    const intro = THREE.MathUtils.smoothstep(t, 0, 1.1)
    g.position.z = (1 - intro) * -3
    g.scale.setScalar(0.85 + intro * 0.15)
  })

  return (
    <group ref={group}>
      {KEYS.map((k, i) => {
        const w = k.w / 100
        const h = k.h / 100
        return (
          <Cap
            key={i}
            w={w}
            h={h}
            face={k.face}
            base={k.base}
            letter={k.letter}
            label={k.label}
            vertical={k.vertical}
            letterSize={k.vertical ? 0.62 : undefined}
            textOffset={k.vertical ? [0.5, 0] : [0, 0]}
            restZ={k.layer + (i % 2) * 0.035}
            position={[k.x / 100 + w / 2 - 4.5, 1.56 - (k.y / 100 + h / 2), 0]}
            auto={() => (typing.active === i ? 1 : 0)}
            onHoverChange={(v) => {
              typing.paused += v ? 1 : -1
              if (typing.paused < 0) typing.paused = 0
            }}
            onDown={() => playKey(i)}
            onPress={() => go(k.action)}
          />
        )
      })}
    </group>
  )
}

const DECO = [
  { kind: 'sphere', fx: 0.2, fy: 0.16, size: 0.4, color: '#ffb7d5', speed: 1.4 },
  { kind: 'torus', fx: 0.455, fy: 0.1, size: 0.5, color: '#c8b6ff', speed: 1.1 },
  { kind: 'ico', fx: -0.46, fy: -0.28, size: 0.46, color: '#b9f2df', speed: 1.7 },
  { kind: 'cone', fx: 0.46, fy: -0.26, size: 0.46, color: '#ffd98e', speed: 1.3 },
  { kind: 'sphere', fx: 0.34, fy: 0.36, size: 0.24, color: '#a9ddff', speed: 2 },
  { kind: 'ico', fx: -0.47, fy: 0.02, size: 0.26, color: '#ffc3a0', speed: 1.8 }
]

function DecoItem({ d }) {
  const holder = useRef()
  const spin = useRef()
  const box = useAnchor()
  useFrame((_, dt) => {
    if (!holder.current) return
    const scale = THREE.MathUtils.clamp(box.px / 1300, 0.55, 1.1)
    holder.current.visible = box.px > 760
    holder.current.position.set(d.fx * box.w, d.fy * box.h, -0.6)
    holder.current.scale.setScalar(scale)
    if (spin.current && !reduceMotion) {
      spin.current.rotation.x += dt * 0.35
      spin.current.rotation.y += dt * 0.5
    }
  })
  const s = d.size
  return (
    <group ref={holder}>
      <Float speed={d.speed} rotationIntensity={0.4} floatIntensity={1.2}>
        <group ref={spin}>
          {d.kind === 'sphere' && <Solid geo="sphereGeometry" args={[s, 40, 40]} color={d.color} />}
          {d.kind === 'torus' && <Solid geo="torusGeometry" args={[s * 0.8, s * 0.36, 32, 64]} color={d.color} />}
          {d.kind === 'ico' && <Solid geo="icosahedronGeometry" args={[s, 0]} color={d.color} />}
          {d.kind === 'cone' && <Solid geo="coneGeometry" args={[s * 0.8, s * 1.5, 32]} color={d.color} />}
        </group>
      </Float>
    </group>
  )
}

export default function HeroScene() {
  return (
    <>
      <Anchor id="kb-anchor" width={9}>
        <Keyboard />
      </Anchor>
      <Anchor id="hero" fill>
        {DECO.map((d, i) => (
          <DecoItem key={i} d={d} />
        ))}
      </Anchor>
    </>
  )
}
